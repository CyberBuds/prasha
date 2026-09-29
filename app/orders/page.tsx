'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import OrderTrackingModal from '@/components/OrderTrackingModal';
import StorefrontPageLayout from '@/components/StorefrontPageLayout';
import StorefrontPageLoading from '@/components/StorefrontPageLoading';
import { OrderDetails, UserProfile } from '@/types';
import { authenticatedFetch, getValidatedSession } from '@/lib/session';

function toUserProfile(customer: any): UserProfile {
  return {
    id: `usr_${customer.id}`,
    name: [customer.firstName, customer.lastName].filter(Boolean).join(' ') || customer.email || 'Silk Patron',
    email: customer.email || '',
    phone: customer.mobile || '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    joinedDate: 'Logged in via API',
    tier: 'Silver Patron'
  };
}

function toOrderDetails(order: any, user: UserProfile): OrderDetails {
  return {
    orderId: order.orderNumber,
    customerName: user.name,
    email: user.email,
    phone: user.phone,
    address: order.shippingAddress?.addressLine1 || user.address,
    city: order.shippingAddress?.city || user.city,
    state: order.shippingAddress?.state || user.state,
    pincode: order.shippingAddress?.pincode || user.pincode,
    items: [],
    subtotal: Number(order.subtotal || 0),
    discountAmount: Number(order.discountAmount || 0) + Number(order.couponDiscount || 0),
    shippingFee: Number(order.shippingCharge || 0),
    totalAmount: Number(order.grandTotal || 0),
    paymentMethod: 'COD',
    status: order.orderStatus === 'DELIVERED' ? 'Delivered' : order.orderStatus === 'SHIPPED' ? 'Handloom Dispatched' : 'Order Placed',
    createdAt: new Date(order.orderDate || order.createdAt).toLocaleDateString('en-IN'),
    estimatedDelivery: 'To be confirmed'
  };
}

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderDetails[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadingTimeout = window.setTimeout(() => {
      if (isMounted) setIsLoading(false);
    }, 7000);

    void getValidatedSession<any>()
      .then(async (customer) => {
        if (!customer) return [];
        const user = toUserProfile(customer);
        const response = await authenticatedFetch('/api/storefront/orders');
        const payload = await response.json();
        if (!response.ok) throw new Error(payload?.message || 'Unable to load orders');
        return (payload.data || []).map((order: any) => toOrderDetails(order, user));
      })
      .then((data) => {
        if (!isMounted) return;
        window.clearTimeout(loadingTimeout);
        setOrders(data);
        const orderNumber = new URLSearchParams(window.location.search).get('order');
        if (orderNumber) {
          setSelectedOrder(data.find((order: OrderDetails) => order.orderId === orderNumber) || null);
        } else {
          setSelectedOrder(data[0] || null);
        }
        setIsLoading(false);
      })
      .catch(() => {
        if (isMounted) {
          window.clearTimeout(loadingTimeout);
          setOrders([]);
          setIsLoading(false);
        }
      });
    return () => {
      isMounted = false;
      window.clearTimeout(loadingTimeout);
    };
  }, []);

  if (isLoading) {
    return (
      <StorefrontPageLoading
        page="orders"
        eyebrow="Order concierge"
        title="Your handloom journey, clearly followed."
        description="Look up an order with its number and checkout email, or review the latest order linked to your Prasha account."
      />
    );
  }

  return (
    <StorefrontPageLayout
      eyebrow="Order concierge"
      title="Your handloom journey, clearly followed."
      description="Look up an order with its number and checkout email, or review the latest order linked to your Prasha account."
    >
      <OrderTrackingModal
        isOpen
        fullPage
        onClose={() => router.push('/')}
        ordersList={orders}
        selectedOrder={selectedOrder}
      />
    </StorefrontPageLayout>
  );
}