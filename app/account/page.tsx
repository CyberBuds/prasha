'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthModal from '@/components/AuthModal';
import StorefrontPageLayout from '@/components/StorefrontPageLayout';
import StorefrontPageLoading from '@/components/StorefrontPageLoading';
import { OrderDetails, UserProfile } from '@/types';
import { authenticatedFetch, clearSession, getValidatedSession } from '@/lib/session';

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

export default function AccountPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<OrderDetails[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;
    void getValidatedSession<any>().then((customer) => {
      if (!isMounted) return;
      const user = customer ? toUserProfile(customer) : null;
      setCurrentUser(user);
      if (user) window.localStorage.setItem('prasha-user', JSON.stringify(user));
      setIsReady(true);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    let isMounted = true;
    void authenticatedFetch('/api/storefront/orders')
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) throw new Error(payload?.message || 'Unable to load orders');
        return payload.data || [];
      })
      .then((data) => {
        if (isMounted) setOrders(data.map((order: any) => toOrderDetails(order, currentUser)));
      })
      .catch(() => {
        if (isMounted) setOrders([]);
      });
    return () => {
      isMounted = false;
    };
  }, [currentUser]);

  if (!isReady) {
    return (
      <StorefrontPageLoading
        page="account"
        eyebrow="Your Prasha"
        title="A personal place for every order and detail."
        description="Manage your profile, keep delivery details close, and follow each handwoven piece from order to arrival."
      />
    );
  }

  return (
    <StorefrontPageLayout
      eyebrow="Your Prasha"
      title="A personal place for every order and detail."
      description="Manage your profile, keep delivery details close, and follow each handwoven piece from order to arrival."
    >
      <AuthModal
        isOpen
        fullPage
        onClose={() => router.push('/')}
        currentUser={currentUser}
        onLogin={(user) => {
          setCurrentUser(user);
          window.localStorage.setItem('prasha-user', JSON.stringify(user));
        }}
        onLogout={() => {
          setCurrentUser(null);
          setOrders([]);
          clearSession();
        }}
        onUpdateUser={(user) => {
          setCurrentUser(user);
          window.localStorage.setItem('prasha-user', JSON.stringify(user));
        }}
        ordersList={orders}
        onOpenOrderTracking={(order) => {
          const query = order ? `?order=${encodeURIComponent(order.orderId)}` : '';
          router.push(`/orders${query}`);
        }}
        selectedCurrency="INR"
      />
    </StorefrontPageLayout>
  );
}