'use client';

import React, { useState } from 'react';
import { X, Search, CheckCircle2, Clock, Truck, Package, ShieldCheck } from 'lucide-react';
import { OrderDetails } from '@/types';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  ordersList: OrderDetails[];
  selectedOrder?: OrderDetails | null;
}

export default function OrderTrackingModal({
  isOpen,
  onClose,
  ordersList,
  selectedOrder = null
}: OrderTrackingModalProps) {
  const [searchId, setSearchId] = useState('');
  const [trackingEmail, setTrackingEmail] = useState('');
  const [foundOrder, setFoundOrder] = useState<OrderDetails | null>(
    ordersList.length > 0 ? ordersList[0] : null
  );
  const [errorMsg, setErrorMsg] = useState('');

  React.useEffect(() => {
    if (isOpen && selectedOrder) {
      setFoundOrder(selectedOrder);
      setErrorMsg('');
    }
  }, [isOpen, selectedOrder]);

  if (!isOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = searchId.trim().toUpperCase();
    const match = ordersList.find((o) => o.orderId.toUpperCase() === clean);
    if (match) {
      setFoundOrder(match);
      setErrorMsg('');
    } else if (trackingEmail.trim()) {
      try {
        const response = await fetch(`/api/storefront/orders/track?orderNumber=${encodeURIComponent(clean)}&email=${encodeURIComponent(trackingEmail.trim())}`);
        if (!response.ok) throw new Error('Order not found');
        const payload = await response.json();
        const order = payload.data;
        setFoundOrder({
          orderId: order.orderNumber,
          customerName: trackingEmail.trim(),
          email: trackingEmail.trim(),
          phone: '',
          address: '',
          city: '',
          state: '',
          pincode: '',
          items: [],
          subtotal: Number(order.subtotal || 0),
          discountAmount: Number(order.discountAmount || 0),
          shippingFee: Number(order.shippingCharge || 0),
          totalAmount: Number(order.grandTotal || 0),
          paymentMethod: 'COD',
          status: order.orderStatus === 'DELIVERED' ? 'Delivered' : order.orderStatus === 'SHIPPED' ? 'Handloom Dispatched' : 'Order Placed',
          createdAt: new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN'),
          estimatedDelivery: 'To be confirmed'
        });
        setErrorMsg('');
      } catch {
        setErrorMsg('Order not found. Check the order number and email address.');
      }
    } else {
      setErrorMsg('Enter the email used during checkout to track this order.');
    }
  };

  const TRACKING_STEPS = [
    { title: 'Order Placed', desc: 'Verified & assigned to weaver studio', icon: Package },
    { title: 'Quality Check & Fall/Picot', desc: 'Handloom inspected & fall border stitched', icon: ShieldCheck },
    { title: 'Handloom Dispatched', desc: 'Handed over to Air Courier partner', icon: Truck },
    { title: 'Out for Delivery', desc: 'Courier agent en route to your address', icon: Clock },
    { title: 'Delivered', desc: 'Delivered with tamper-proof seal', icon: CheckCircle2 }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden my-auto p-6 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 pb-4">
          <div>
            <span className="text-[10px] uppercase font-serif tracking-widest text-amber-800">da handloom by prasha</span>
            <h2 className="font-serif text-2xl font-bold text-stone-900">Track Order Status</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-900 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Guests can manually track an order; authenticated users arrive with their selected order. */}
        {!selectedOrder && <form onSubmit={handleSearch} className="space-y-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Enter Order ID (e.g. PR-89412)"
              className="w-full pl-9 pr-3 py-2.5 bg-[#FAF8F5] border border-stone-300 rounded-lg text-xs font-medium text-stone-900 focus:outline-none focus:border-[#581825]"
            />
          </div>
          <input
            type="email"
            value={trackingEmail}
            onChange={(e) => setTrackingEmail(e.target.value)}
            placeholder="Email used during checkout"
            className="w-full px-3 py-2.5 bg-[#FAF8F5] border border-stone-300 rounded-lg text-xs font-medium text-stone-900 focus:outline-none focus:border-[#581825]"
            required
          />
          <button type="submit" className="w-full px-5 py-2.5 bg-[#581825] text-amber-100 font-bold rounded-lg text-xs hover:bg-[#722031] cursor-pointer">
            Track Order
          </button>
        </form>}

        {errorMsg && <p className="text-xs text-red-600">{errorMsg}</p>}

        {/* Order Result Details */}
        {foundOrder ? (
          <div className="space-y-6 pt-2">
            <div className="p-4 bg-[#FAF8F5] rounded-xl border border-stone-200 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div>
                <p className="font-serif text-base font-bold text-[#581825]">
                  Order #{foundOrder.orderId}
                </p>
                <p className="text-stone-500 text-[11px]">Placed on {foundOrder.createdAt}</p>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded">
                  Status: {foundOrder.status}
                </span>
                <p className="text-stone-600 text-[11px] mt-1 font-semibold">
                  Estimated Delivery: {foundOrder.estimatedDelivery}
                </p>
              </div>
            </div>

            {/* Timeline Progress */}
            <div>
              <h4 className="font-serif text-sm font-bold text-stone-900 mb-4 uppercase tracking-wider">
                Live Handloom Journey
              </h4>
              <div className="relative pl-6 space-y-6 border-l-2 border-amber-800/20">
                {TRACKING_STEPS.map((step, idx) => {
                  const Icon = step.icon;
                  const isDone = idx <= 1; // Simulated stage
                  return (
                    <div key={idx} className="relative">
                      <div
                        className={`absolute -left-[31px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs ${
                          isDone ? 'bg-[#581825]' : 'bg-stone-300 text-stone-600'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <h5 className={`text-xs font-bold ${isDone ? 'text-stone-900' : 'text-stone-400'}`}>
                          {step.title}
                        </h5>
                        <p className="text-[11px] text-stone-500 mt-0.5">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-stone-500 text-xs bg-[#FAF8F5] rounded-xl">
            Enter your 7-digit Prasha Order ID to see live weaving, finishing, and air dispatch tracking.
          </div>
        )}
      </div>
    </div>
  );
}
