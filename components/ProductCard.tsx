'use client';

import React, { useState } from 'react';
import { Heart, Eye, ShoppingBag, Star, ShieldCheck, LoaderCircle } from 'lucide-react';
import { Saree } from '@/types';
import { formatPrice } from './Navbar';

interface ProductCardProps {
  saree: Saree;
  selectedCurrency: string;
  isWishlisted: boolean;
  onToggleWishlist: (sareeId: string) => void;
  onQuickView: (saree: Saree) => void;
  onAddToCart: (saree: Saree) => void;
  isAddingToCart?: boolean;
}

export default function ProductCard({
  saree,
  selectedCurrency,
  isWishlisted,
  onToggleWishlist,
  onQuickView,
  onAddToCart,
  isAddingToCart = false
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAddingToCart) return;
    onAddToCart(saree);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  return (
    <div 
      className="group relative bg-[#FAF9F6] border border-[#E5E5E5] rounded-lg overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Container */}
      <div 
        onClick={() => onQuickView(saree)}
        className="relative aspect-[3/4] w-full bg-[#F5F1E9] overflow-hidden cursor-pointer"
      >
        {!imageLoaded && <div className="absolute inset-0 animate-pulse bg-[#E8E0D4]" aria-label="Loading product image" />}
        <img
          src={isHovered ? saree.secondaryImage : saree.primaryImage}
          alt={saree.title}
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          referrerPolicy="no-referrer"
        />

        {/* Lightning Flash Effect on Hover */}
        <div className="lightning-beam z-20 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {saree.isBestseller && (
            <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest bg-[#641F96] text-white shadow-sm">
              Bestseller
            </span>
          )}
          {saree.isNew && (
            <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest bg-[#F7F5F0] text-[#641F96] border border-[#641F96]/30 shadow-sm">
              New Weave
            </span>
          )}
          <span className="px-2.5 py-0.5 rounded-full text-[9px] font-semibold bg-white/90 text-[#1A1A1A] backdrop-blur-md shadow-xs border border-[#E5E5E5]">
            {saree.craft}
          </span>
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(saree.id);
          }}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full shadow-md backdrop-blur-md transition-all z-10 cursor-pointer ${
            isWishlisted 
              ? 'bg-[#641F96] text-[#E6C268] scale-105' 
              : 'bg-white/90 text-[#1A1A1A] hover:bg-[#641F96] hover:text-[#E6C268]'
          }`}
          aria-label="Save to Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#E6C268]' : ''}`} />
        </button>

        {/* Quick View Button on Hover */}
        <div className="absolute inset-x-3 bottom-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(saree);
            }}
            className="flex-1 py-2.5 bg-[#FAF9F6]/95 hover:bg-[#3B0B5C] hover:text-white text-[#1A1A1A] text-[10px] uppercase tracking-widest font-semibold rounded-md shadow-md backdrop-blur-md flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>

          <button
            onClick={handleQuickAdd}
            disabled={isAddingToCart}
            className={`p-2.5 rounded-md text-xs font-bold text-white shadow-md flex items-center justify-center transition-all cursor-pointer disabled:cursor-wait disabled:opacity-80 ${
              addedAnimation ? 'bg-emerald-700' : 'bg-[#641F96] hover:bg-[#3B0B5C]'
            }`}
            title="Quick Add to Cart"
          >
            {isAddingToCart ? <LoaderCircle className="w-4 h-4 animate-spin" /> : <ShoppingBag className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
        <div>
          <div className="flex items-center justify-between text-[10px] text-[#888] mb-1 uppercase tracking-wider">
            <span className="flex items-center gap-1 font-semibold text-[#641F96]">
              <ShieldCheck className="w-3 h-3 text-[#641F96]" />
              {saree.authenticityCert.includes('Silk Mark') ? 'Silk Mark' : 'Handloom'}
            </span>
            <span className="flex items-center gap-1 text-[#E6C268] font-bold">
              <Star className="w-3 h-3 fill-[#E6C268] text-[#E6C268]" />
              {saree.rating} ({saree.reviewsCount})
            </span>
          </div>

          <h3 
            onClick={() => onQuickView(saree)}
            className="font-serif text-sm font-semibold text-[#1A1A1A] line-clamp-2 hover:text-[#641F96] transition-colors cursor-pointer leading-snug"
          >
            {saree.title}
          </h3>

          <p className="text-[11px] text-[#666] line-clamp-1 mt-0.5">
            {saree.color} • {saree.zariType}
          </p>
        </div>

        {/* Price and Action */}
        <div className="pt-2 border-t border-[#E5E5E5] flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-bold text-[#641F96]">
              {formatPrice(saree.price, selectedCurrency)}
            </span>
            {saree.originalPrice > saree.price && (
              <span className="text-xs text-stone-400 line-through font-light">
                {formatPrice(saree.originalPrice, selectedCurrency)}
              </span>
            )}
            {saree.discountPercentage > 0 && (
              <span className="text-[9px] font-bold text-[#3B0B5C] bg-[#F7F5F0] px-1.5 py-0.5 rounded uppercase tracking-widest border border-[#641F96]/20">
                {saree.discountPercentage}% OFF
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
