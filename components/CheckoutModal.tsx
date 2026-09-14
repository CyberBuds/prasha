'use client';

import React, { useState } from 'react';
import { 
  X, 
  Check, 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  QrCode, 
  Printer, 
  ShoppingBag,
  Sparkles
} from 'lucide-react';
import { CartItem, OrderDetails, UserProfile } from '@/types';
import { formatPrice } from './Navbar';
import { authenticatedFetch } from '@/lib/session';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  discountAmount: number;
  giftWrap: boolean;
  selectedCurrency: string;
  cartSessionId: string | null;
  currentUser: UserProfile | null;
  onOrderSuccess: (order: OrderDetails) => void;
  onAuthenticationRequired: () => void;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  discountAmount,
  giftWrap,
  selectedCurrency,
  cartSessionId,
  currentUser,
  onOrderSuccess,
  onAuthenticationRequired
}: CheckoutModalProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'NetBanking' | 'COD'>('COD');
  const [upiId, setUpiId] = useState('ananya@okaxis');
  const [orderConfirmed, setOrderConfirmed] = useState<OrderDetails | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  React.useEffect(() => {
    if (!isOpen || !currentUser) return;

    setName(currentUser.name || '');
    setEmail(currentUser.email || '');
    setPhone(currentUser.phone || '');
    setAddress(currentUser.address || '');
    setCity(currentUser.city || '');
    setState(currentUser.state || '');
    setPincode(currentUser.pincode || '');
    setStep(1);
    setErrorMsg('');
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const itemsSubtotal = cartItems.reduce((sum, item) => {
    const blouseFee = item.blouseCustomization.stitchType === 'stitched' ? 1200 : 0;
    const fallFee = item.fallAndPicot ? 250 : 0;
    return sum + (item.saree.price + blouseFee + fallFee) * item.quantity;
  }, 0);

  const giftWrapFee = giftWrap ? 150 : 0;
  const shippingFee = itemsSubtotal >= 5000 || itemsSubtotal === 0 ? 0 : 350;
  const codFee = paymentMethod === 'COD' ? 100 : 0;
  const totalAmount = itemsSubtotal - discountAmount + shippingFee + giftWrapFee + codFee;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    if (!cartSessionId || !cartItems.every((item) => Number.isInteger(Number(item.saree.id)))) {
      setErrorMsg('Your cart cannot be checked out. Please refresh and try again.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await authenticatedFetch('/api/storefront/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: cartSessionId, name, email, phone, address, city, state, pincode, paymentMethod: 'COD' })
      });
      const payload = await response.json();
      if (response.status === 401) {
        onAuthenticationRequired();
        return;
      }
      if (!response.ok) {
        throw new Error(payload?.message || 'Unable to place your order.');
      }

      const remoteOrderNumber = payload.data?.orderNumber;
      if (!remoteOrderNumber) {
        throw new Error('Order confirmation was not received. Please try again.');
      }

      const newOrder: OrderDetails = {
        orderId: remoteOrderNumber,
        customerName: name,
        email,
        phone,
        address,
        city,
        state,
        pincode,
        items: [...cartItems],
        subtotal: itemsSubtotal,
        discountAmount,
        shippingFee,
        totalAmount,
        paymentMethod,
        status: 'Order Placed',
        createdAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        estimatedDelivery: new Date(Date.now() + 4 * 86400000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
      };

      setOrderConfirmed(newOrder);
      onOrderSuccess(newOrder);
      setStep(4);
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : 'Unable to place your order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-[#581825] text-amber-100 p-4 sm:p-6 flex items-center justify-between border-b border-amber-800">
          <div>
            <span className="text-[10px] uppercase font-serif tracking-widest text-amber-300 block">da handloom by prasha</span>
            <h2 className="font-serif text-2xl font-bold">Secure Checkout</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-amber-200 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Step Indicator */}
        {step < 4 && (
          <div className="bg-[#FAF8F5] border-b border-stone-200 px-6 py-3 flex items-center justify-between text-xs font-semibold text-stone-600">
            <span className={step >= 1 ? 'text-[#581825] font-bold' : ''}>1. Shipping Address</span>
            <span>→</span>
            <span className={step >= 2 ? 'text-[#581825] font-bold' : ''}>2. Delivery Option</span>
            <span>→</span>
            <span className={step >= 3 ? 'text-[#581825] font-bold' : ''}>3. Payment Method</span>
          </div>
        )}

        <div className="p-6 overflow-y-auto flex-1">
          {errorMsg && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
              {errorMsg}
            </div>
          )}

          {/* STEP 1: SHIPPING ADDRESS */}
          {step === 1 && (
            <form onSubmit={() => setStep(2)} className="space-y-4 text-xs">
              <h3 className="font-serif text-base font-bold text-stone-900 border-b pb-2">Delivery & Contact Details</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-stone-700 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-stone-300 rounded text-stone-900 focus:outline-none focus:border-[#581825]"
                  />
                </div>

                <div>
                  <label className="font-medium text-stone-700 block mb-1">Mobile Number (For WhatsApp tracking) *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-stone-300 rounded text-stone-900 focus:outline-none focus:border-[#581825]"
                  />
                </div>
              </div>

              <div>
                <label className="font-medium text-stone-700 block mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  readOnly
                  className="w-full p-2.5 bg-stone-100 border border-stone-300 rounded text-stone-600 cursor-not-allowed"
                />
                <p className="mt-1 text-[10px] text-stone-500">Your account email is used for this order.</p>
              </div>

              <div>
                <label className="font-medium text-stone-700 block mb-1">Flat / House No., Street, Colony *</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-2.5 bg-[#FAF8F5] border border-stone-300 rounded text-stone-900 focus:outline-none focus:border-[#581825]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-medium text-stone-700 block mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-stone-300 rounded text-stone-900 focus:outline-none focus:border-[#581825]"
                  />
                </div>

                <div>
                  <label className="font-medium text-stone-700 block mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-stone-300 rounded text-stone-900 focus:outline-none focus:border-[#581825]"
                  />
                </div>

                <div>
                  <label className="font-medium text-stone-700 block mb-1">Pincode *</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-stone-300 rounded text-stone-900 focus:outline-none focus:border-[#581825]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 mt-4 bg-[#581825] text-amber-100 font-bold rounded-xl hover:bg-[#722031] transition-colors cursor-pointer"
              >
                Continue to Delivery Options →
              </button>
            </form>
          )}

          {/* STEP 2: DELIVERY OPTIONS */}
          {step === 2 && (
            <div className="space-y-4 text-xs">
              <h3 className="font-serif text-base font-bold text-stone-900 border-b pb-2">Select Delivery Service</h3>
              
              <div className="space-y-3">
                <div className="p-4 rounded-xl border-2 border-[#581825] bg-amber-50/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Truck className="w-5 h-5 text-[#581825]" />
                    <div>
                      <p className="font-bold text-stone-900">Complimentary Express Handloom Air Delivery</p>
                      <p className="text-[11px] text-stone-600">Delivered in 3-5 business days with insured tamper-proof box</p>
                    </div>
                  </div>
                  <span className="font-bold text-emerald-800">FREE</span>
                </div>

                <div className="p-4 rounded-xl border border-stone-200 opacity-60 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Truck className="w-5 h-5 text-stone-400" />
                    <div>
                      <p className="font-semibold text-stone-800">Same-Day Metro City Courier (Delhi / Mumbai / Bengaluru)</p>
                      <p className="text-[11px] text-stone-500">Only available for unstitched orders placed before 12 PM</p>
                    </div>
                  </div>
                  <span className="text-stone-500">Not Applicable</span>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 border border-stone-300 text-stone-700 font-semibold rounded-xl hover:bg-stone-50 cursor-pointer"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex-1 py-3 bg-[#581825] text-amber-100 font-bold rounded-xl hover:bg-[#722031] transition-colors cursor-pointer"
                >
                  Continue to Payment →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PAYMENT METHOD */}
          {step === 3 && (
            <form onSubmit={handlePlaceOrder} className="space-y-4 text-xs">
              <h3 className="font-serif text-base font-bold text-stone-900 border-b pb-2">Payment Options</h3>

              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'UPI', title: 'PhonePe Payment (Coming Soon)', icon: QrCode, disabled: true },
                  { id: 'Card', title: 'Credit / Debit Card (Coming Soon)', icon: CreditCard, disabled: true },
                  { id: 'NetBanking', title: 'Net Banking (Coming Soon)', icon: ShieldCheck, disabled: true },
                  { id: 'COD', title: 'Cash on Delivery (+₹100)', icon: Truck, disabled: false }
                ].map((pm) => {
                  const Icon = pm.icon;
                  const isSelected = paymentMethod === pm.id;
                  return (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setPaymentMethod(pm.id as any)}
                      disabled={pm.disabled}
                      className={`p-3 rounded-xl border text-left flex items-center gap-2 transition-all ${
                        pm.disabled ? 'border-stone-200 bg-stone-50 text-stone-400 cursor-not-allowed' : 'cursor-pointer'
                      } ${
                        isSelected && !pm.disabled ? 'border-[#581825] bg-amber-50 text-[#581825] font-bold' : 'border-stone-200 bg-white text-stone-700'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{pm.title}</span>
                    </button>
                  );
                })}
              </div>

              {paymentMethod === 'UPI' && (
                <div className="p-4 bg-amber-50/80 rounded-xl border border-amber-300 space-y-2">
                  <p className="font-bold text-stone-900">Instant UPI Payment</p>
                  <p className="text-[11px] text-stone-600">Enter your UPI VPA handle below or scan the generated QR after order placement.</p>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="e.g. mobile@upi or username@okicici"
                    className="w-full p-2.5 bg-white border border-stone-300 rounded focus:outline-none focus:border-[#581825]"
                  />
                </div>
              )}

              {/* Final Order Summary Box */}
              <div className="p-4 bg-[#FAF8F5] rounded-xl border border-stone-200 space-y-1 text-stone-700">
                <div className="flex justify-between">
                  <span>Cash on Delivery Fee</span>
                  <span>{formatPrice(codFee, selectedCurrency)}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Total Payable Amount</span>
                  <span className="font-bold text-base text-[#581825]">
                    {formatPrice(totalAmount, selectedCurrency)}
                  </span>
                </div>
                <p className="text-[10px] text-stone-500">
                  By clicking Place Order, you agree to Prasha&apos;s Terms of Service and Handloom Return Guarantee.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 py-3 border border-stone-300 text-stone-700 font-semibold rounded-xl hover:bg-stone-50 cursor-pointer"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-[#581825] text-amber-100 font-bold rounded-xl hover:bg-[#722031] transition-colors cursor-pointer shadow-lg disabled:opacity-60"
                >
                  {isSubmitting ? 'Processing Order...' : 'Pay & Confirm Order →'}
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: ORDER SUCCESS CONFIRMATION */}
          {step === 4 && orderConfirmed && (
            <div className="text-center py-6 space-y-4 animate-fadeIn">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <Check className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs font-serif italic text-amber-800">da handloom by prasha</span>
                <h2 className="font-serif text-3xl font-bold text-stone-900 mt-1">Thank You for Choosing Prasha</h2>
                <p className="text-xs text-stone-600 mt-1">
                  Your order <strong className="text-[#581825] font-bold">{orderConfirmed.orderId}</strong> has been confirmed! We have dispatched a confirmation SMS & WhatsApp invoice to {phone}.
                </p>
              </div>

              {/* Order Receipt Box */}
              <div className="p-4 bg-[#FAF8F5] rounded-xl border border-stone-200 text-left text-xs space-y-2 max-w-lg mx-auto">
                <div className="flex justify-between border-b pb-2 font-semibold text-stone-800">
                  <span>Order Reference</span>
                  <span>{orderConfirmed.orderId}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Estimated Delivery</span>
                  <span className="font-bold text-stone-900">{orderConfirmed.estimatedDelivery}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Delivery Address</span>
                  <span className="text-stone-900 font-medium text-right max-w-xs">{address}, {city}, {pincode}</span>
                </div>
                <div className="flex justify-between text-stone-600 pt-2 border-t">
                  <span>Total Amount Paid</span>
                  <span className="font-bold text-[#581825] text-sm">{formatPrice(orderConfirmed.totalAmount, selectedCurrency)}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={handlePrintReceipt}
                  className="px-5 py-2.5 rounded-lg border border-stone-300 text-stone-800 text-xs font-semibold hover:bg-stone-50 cursor-pointer flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Receipt / Download Invoice</span>
                </button>

                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-lg bg-[#581825] text-amber-100 text-xs font-bold hover:bg-[#722031] cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
