'use client';

import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Saree } from '@/types';
import { formatPrice } from './Navbar';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistSarees: Saree[];
  onRemoveWishlist: (sareeId: string) => void;
  onMoveToCart: (saree: Saree) => void;
  selectedCurrency: string;
}

export default function WishlistDrawer({
  isOpen,
  onClose,
  wishlistSarees,
  onRemoveWishlist,
  onMoveToCart,
  selectedCurrency
}: WishlistDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end animate-fadeIn">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between p-4 sm:p-6 animate-slideLeft overflow-hidden">
        
        {/* Header */}
        <div>
          <div className="flex items-center justify-between border-b border-stone-200 pb-4">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-[#581825] fill-[#581825]" />
              <h3 className="font-serif text-xl font-bold text-stone-900">Saved Handlooms</h3>
              <span className="text-xs bg-amber-100 text-[#581825] font-bold px-2 py-0.5 rounded-full">
                {wishlistSarees.length}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-500 hover:text-stone-900 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Wishlist Items List */}
        <div className="flex-1 overflow-y-auto my-4 space-y-4 pr-1">
          {wishlistSarees.length > 0 ? (
            wishlistSarees.map((saree) => (
              <div
                key={saree.id}
                className="p-3 bg-[#FAF8F5] rounded-xl border border-stone-200 flex gap-3 relative group"
              >
                <img
                  src={saree.primaryImage}
                  alt={saree.title}
                  className="w-20 h-24 object-cover rounded-lg border border-stone-200"
                  referrerPolicy="no-referrer"
                />

                <div className="flex-1 flex flex-col justify-between text-xs min-w-0">
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="font-serif font-bold text-stone-900 line-clamp-1">
                        {saree.title}
                      </h4>
                      <button
                        onClick={() => onRemoveWishlist(saree.id)}
                        className="text-stone-400 hover:text-red-700 cursor-pointer"
                        title="Remove from Wishlist"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-[11px] text-stone-500">
                      Craft: {saree.craft} • {saree.color}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-stone-200/60 mt-1">
                    <span className="font-bold text-[#581825]">
                      {formatPrice(saree.price, selectedCurrency)}
                    </span>

                    <button
                      onClick={() => {
                        onMoveToCart(saree);
                        onRemoveWishlist(saree.id);
                      }}
                      className="px-3 py-1.5 bg-[#581825] text-amber-100 rounded-lg text-xs font-semibold hover:bg-amber-900 flex items-center gap-1 cursor-pointer"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      <span>Move to Cart</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 space-y-3">
              <Heart className="w-12 h-12 text-stone-300 mx-auto" />
              <p className="font-serif text-lg font-bold text-stone-800">Your Wishlist is Empty</p>
              <p className="text-xs text-stone-500">Tap the heart icon on any saree to save your favorite handloom weaves.</p>
            </div>
          )}
        </div>

        <div className="border-t border-stone-200 pt-4">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl border border-stone-300 text-stone-800 text-xs font-semibold hover:bg-stone-50 cursor-pointer"
          >
            Continue Browsing
          </button>
        </div>
      </div>
    </div>
  );
}
