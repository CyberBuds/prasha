'use client';

import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Tag, Gift, LoaderCircle } from 'lucide-react';
import { CartItem } from '@/types';
import { formatPrice } from './Navbar';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  onToggleFallPicot: (index: number) => void;
  onOpenCheckout: (discountAmount: number, giftWrap: boolean) => void;
  selectedCurrency: string;
  pendingItemIndex?: number | null;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onToggleFallPicot,
  onOpenCheckout,
  selectedCurrency,
  pendingItemIndex = null
}: CartDrawerProps) {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; percent: number } | null>(null);
  const [couponError, setCouponError] = useState('');
  const [giftWrap, setGiftWrap] = useState(false);

  if (!isOpen) return null;

  // Calculation
  const itemsSubtotal = cartItems.reduce((sum, item) => {
    const blouseFee = item.blouseCustomization.stitchType === 'stitched' ? 1200 : 0;
    const fallFee = item.fallAndPicot ? 250 : 0;
    return sum + (item.saree.price + blouseFee + fallFee) * item.quantity;
  }, 0);

  const giftWrapFee = giftWrap ? 150 : 0;
  const discountPercent = appliedCoupon ? appliedCoupon.percent : 0;
  const discountAmount = Math.round((itemsSubtotal * discountPercent) / 100);
  const freeShippingThreshold = 5000;
  const shippingFee = itemsSubtotal >= freeShippingThreshold || itemsSubtotal === 0 ? 0 : 350;
  const totalAmount = itemsSubtotal - discountAmount + shippingFee + giftWrapFee;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = couponCode.trim().toUpperCase();
    if (clean === 'PRASHA10') {
      setAppliedCoupon({ code: 'PRASHA10', percent: 10 });
      setCouponError('');
    } else if (clean === 'HERITAGE15') {
      setAppliedCoupon({ code: 'HERITAGE15', percent: 15 });
      setCouponError('');
    } else {
      setCouponError('Invalid coupon. Try PRASHA10 or HERITAGE15');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end animate-fadeIn">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between p-4 sm:p-6 animate-slideLeft overflow-hidden">
        
        {/* Header */}
        <div>
          <div className="flex items-center justify-between border-b border-stone-200 pb-4">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#581825]" />
              <h3 className="font-serif text-xl font-bold text-stone-900">Your Prasha Bag</h3>
              <span className="text-xs bg-amber-100 text-[#581825] font-bold px-2 py-0.5 rounded-full">
                {cartItems.length} items
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-500 hover:text-stone-900 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Express Shipping Goal Bar */}
          <div className="mt-3 p-3 bg-[#FAF8F5] rounded-xl border border-amber-200 text-xs">
            {itemsSubtotal >= freeShippingThreshold ? (
              <p className="font-semibold text-emerald-800 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Congratulations! You unlocked FREE Express Shipping
              </p>
            ) : (
              <div>
                <p className="text-stone-700 font-medium">
                  Add <strong className="text-[#581825]">{formatPrice(freeShippingThreshold - itemsSubtotal, selectedCurrency)}</strong> more for FREE Express Shipping
                </p>
                <div className="w-full h-1.5 bg-stone-200 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className="h-full bg-[#581825] transition-all duration-500"
                    style={{ width: `${Math.min(100, (itemsSubtotal / freeShippingThreshold) * 100)}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto my-4 space-y-4 pr-1">
          {cartItems.length > 0 ? (
            cartItems.map((item, idx) => {
              const blouseFee = item.blouseCustomization.stitchType === 'stitched' ? 1200 : 0;
              const fallFee = item.fallAndPicot ? 250 : 0;
              const unitTotal = item.saree.price + blouseFee + fallFee;

              return (
                <div
                  key={`${item.saree.id}-${idx}`}
                  className="p-3 bg-[#FAF8F5] rounded-xl border border-stone-200 flex gap-3 relative group"
                >
                  <img
                    src={item.saree.primaryImage}
                    alt={item.saree.title}
                    className="w-20 h-24 object-cover rounded-lg border border-stone-200"
                    referrerPolicy="no-referrer"
                  />

                  <div className="flex-1 flex flex-col justify-between text-xs min-w-0">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-serif font-bold text-stone-900 line-clamp-1">
                          {item.saree.title}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(idx)}
                          disabled={pendingItemIndex === idx}
                          className="text-stone-400 hover:text-red-700 disabled:cursor-wait disabled:opacity-60 cursor-pointer"
                          title="Remove item"
                        >
                          {pendingItemIndex === idx ? <LoaderCircle className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      <p className="text-[11px] text-stone-500">
                        Craft: {item.saree.craft}
                      </p>

                      <p className="text-[10px] text-amber-900 mt-0.5">
                        {item.blouseCustomization.stitchType === 'stitched'
                          ? `Custom Stitched Blouse (${item.blouseCustomization.bustSize}" Bust) +₹1,200`
                          : 'Unstitched Blouse Piece'}
                      </p>
                    </div>

                    {/* Fall & Picot Toggle & Stepper */}
                    <div className="flex items-center justify-between pt-2 border-t border-stone-200/60 mt-1">
                      <label className="flex items-center gap-1.5 cursor-pointer text-[10px] text-stone-700 font-medium">
                        <input
                          type="checkbox"
                          checked={item.fallAndPicot}
                          onChange={() => onToggleFallPicot(idx)}
                          className="accent-[#581825] w-3.5 h-3.5"
                        />
                        <span>Fall & Picot (+₹250)</span>
                      </label>

                      {/* Quantity Stepper */}
                      <div className="flex items-center gap-1 bg-white border border-stone-300 rounded px-1.5 py-0.5">
                        <button
                          onClick={() => onUpdateQuantity(idx, item.quantity - 1)}
                          disabled={pendingItemIndex === idx}
                          className="px-1 text-stone-600 hover:text-black disabled:cursor-wait disabled:opacity-50 font-bold cursor-pointer"
                        >
                          -
                        </button>
                        <span className="font-bold px-1 text-stone-900 text-xs">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(idx, item.quantity + 1)}
                          disabled={pendingItemIndex === idx}
                          className="px-1 text-stone-600 hover:text-black disabled:cursor-wait disabled:opacity-50 font-bold cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="text-right font-bold text-[#581825] mt-1">
                      {formatPrice(unitTotal * item.quantity, selectedCurrency)}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 space-y-3">
              <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto" />
              <p className="font-serif text-lg font-bold text-stone-800">Your Bag is Empty</p>
              <p className="text-xs text-stone-500">Explore our Banarasi, Kanjivaram, and Heritage handloom weaves.</p>
            </div>
          )}
        </div>

        {/* Footer Summary & Checkout CTA */}
        {cartItems.length > 0 && (
          <div className="border-t border-stone-200 pt-4 space-y-3 text-xs">
            {/* Promo Code Entry */}
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-stone-400" />
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Promo code (e.g. PRASHA10)"
                  className="w-full pl-8 pr-3 py-1.5 bg-[#FAF8F5] border border-stone-300 rounded text-xs uppercase focus:outline-none focus:border-[#581825]"
                />
              </div>
              <button
                type="submit"
                className="px-3 py-1.5 bg-stone-900 text-amber-100 font-semibold rounded hover:bg-[#581825] cursor-pointer"
              >
                Apply
              </button>
            </form>
            {couponError && <p className="text-[10px] text-red-600">{couponError}</p>}
            {appliedCoupon && (
              <p className="text-[10px] text-emerald-700 font-bold">
                Coupon {appliedCoupon.code} Applied ({appliedCoupon.percent}% Off)!
              </p>
            )}

            {/* Gift Wrap Toggle */}
            <label className="flex items-center justify-between p-2 rounded bg-amber-50/50 border border-amber-200 cursor-pointer">
              <span className="flex items-center gap-1.5 font-medium text-stone-800 text-[11px]">
                <Gift className="w-3.5 h-3.5 text-amber-700" />
                Add Heritage Velvet Gift Box & Parchment Note (+₹150)
              </span>
              <input
                type="checkbox"
                checked={giftWrap}
                onChange={(e) => setGiftWrap(e.target.checked)}
                className="accent-[#581825] w-3.5 h-3.5"
              />
            </label>

            {/* Price Calculations */}
            <div className="space-y-1 text-stone-600 pt-1">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(itemsSubtotal, selectedCurrency)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Promo Discount ({discountPercent}%)</span>
                  <span>-{formatPrice(discountAmount, selectedCurrency)}</span>
                </div>
              )}
              {giftWrap && (
                <div className="flex justify-between text-stone-700">
                  <span>Gift Box & Parchment</span>
                  <span>+{formatPrice(150, selectedCurrency)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Express Shipping</span>
                <span>{shippingFee === 0 ? 'FREE' : formatPrice(shippingFee, selectedCurrency)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-200">
                <span>Total Amount</span>
                <span className="text-[#581825]">{formatPrice(totalAmount, selectedCurrency)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => onOpenCheckout(discountAmount, giftWrap)}
              className="w-full py-3.5 rounded-xl bg-[#581825] hover:bg-[#722031] text-amber-100 font-bold tracking-wide transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer border border-amber-500/30"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
