'use client';

import React, { useState } from 'react';
import { SlidersHorizontal, Grid3x3, LayoutGrid, List, X, Sparkles } from 'lucide-react';
import { Saree, FilterState } from '@/types';
import ProductCard from './ProductCard';

interface ProductGridProps {
  sarees: Saree[];
  selectedCurrency: string;
  wishlistIds: string[];
  onToggleWishlist: (sareeId: string) => void;
  onQuickView: (saree: Saree) => void;
  onAddToCart: (saree: Saree) => void;
  onOpenFilterDrawer: () => void;
  filterState: FilterState;
  onUpdateFilter: (newFilters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  currentCategoryTitle: string;
}

export default function ProductGrid({
  sarees,
  selectedCurrency,
  wishlistIds,
  onToggleWishlist,
  onQuickView,
  onAddToCart,
  onOpenFilterDrawer,
  filterState,
  onUpdateFilter,
  onResetFilters,
  currentCategoryTitle
}: ProductGridProps) {
  const [gridCols, setGridCols] = useState<'3' | '4' | 'list'>('4');

  const activeFilterCount =
    filterState.crafts.length +
    filterState.occasions.length +
    filterState.colors.length +
    (filterState.onlyBestsellers ? 1 : 0) +
    (filterState.searchQuery ? 1 : 0);

  return (
    <section id="catalogue-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 scroll-mt-24">
      
      {/* Category Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#E5E5E5] pb-6 mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold text-[#641F96] uppercase tracking-[0.25em]">
              Handloom Collection
            </span>
            <div className="h-[1px] w-12 bg-[#E6C268]"></div>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl italic font-light text-[#1A1A1A]">
            {currentCategoryTitle}
          </h2>
          <p className="text-xs text-[#666] mt-1 font-normal">
            Showing <strong className="text-[#1A1A1A] font-semibold">{sarees.length}</strong> certified handloom weaves
          </p>
        </div>

        {/* Filter and View Controls Bar */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          {/* Filter Drawer Trigger */}
          <button
            onClick={onOpenFilterDrawer}
            className="px-4 py-2.5 rounded-md bg-[#FAF9F6] border border-[#641F96] text-[#641F96] hover:bg-[#E6C268] hover:border-[#E6C268] hover:text-[#3B0B5C] text-[11px] font-semibold uppercase tracking-widest flex items-center gap-2 transition-colors cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#641F96]" />
            <span>Filter Weaves</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#641F96] text-white text-[9px] font-bold flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Sort Dropdown */}
          <select
            value={filterState.sortBy}
            onChange={(e) => onUpdateFilter({ sortBy: e.target.value as any })}
            className="px-3 py-2.5 rounded-md bg-[#FAF9F6] border border-[#E5E5E5] text-[#1A1A1A] text-xs font-medium focus:outline-none focus:border-[#641F96] cursor-pointer"
          >
            <option value="featured">Sort by: Featured Weaves</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">Newest Arrivals</option>
          </select>

          {/* View Mode Toggle (Desktop) */}
          <div className="hidden lg:flex items-center gap-1 bg-[#F5F1E9] p-1 rounded-md border border-[#E5E5E5]">
            <button
              onClick={() => setGridCols('3')}
              className={`p-1.5 rounded transition-colors ${
                gridCols === '3' ? 'bg-[#FAF9F6] shadow-xs text-[#1A1A1A]' : 'text-stone-400 hover:text-stone-700'
              }`}
              title="3 Columns"
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setGridCols('4')}
              className={`p-1.5 rounded transition-colors ${
                gridCols === '4' ? 'bg-[#FAF9F6] shadow-xs text-[#1A1A1A]' : 'text-stone-400 hover:text-stone-700'
              }`}
              title="4 Columns"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Active Filters Chip Row */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-6 text-xs">
          <span className="text-stone-500 font-medium">Active Filters:</span>
          {filterState.crafts.map((c) => (
            <span key={c} className="px-2.5 py-1 bg-amber-100 text-[#581825] rounded-full font-medium flex items-center gap-1.5">
              {c}
              <button 
                onClick={() => onUpdateFilter({ crafts: filterState.crafts.filter((item) => item !== c) })}
                className="hover:text-red-700 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {filterState.occasions.map((o) => (
            <span key={o} className="px-2.5 py-1 bg-amber-100 text-[#581825] rounded-full font-medium flex items-center gap-1.5">
              {o}
              <button 
                onClick={() => onUpdateFilter({ occasions: filterState.occasions.filter((item) => item !== o) })}
                className="hover:text-red-700 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {filterState.searchQuery && (
            <span className="px-2.5 py-1 bg-amber-100 text-[#581825] rounded-full font-medium flex items-center gap-1.5">
              &quot;{filterState.searchQuery}&quot;
              <button 
                onClick={() => onUpdateFilter({ searchQuery: '' })}
                className="hover:text-red-700 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          <button
            onClick={onResetFilters}
            className="text-xs font-semibold text-red-800 hover:underline cursor-pointer ml-2"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Product Grid Render */}
      {sarees.length > 0 ? (
        <div
          className={`grid gap-6 ${
            gridCols === '3'
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
              : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
          }`}
        >
          {sarees.map((saree) => (
            <ProductCard
              key={saree.id}
              saree={saree}
              selectedCurrency={selectedCurrency}
              isWishlisted={wishlistIds.includes(saree.id)}
              onToggleWishlist={onToggleWishlist}
              onQuickView={onQuickView}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center max-w-lg mx-auto space-y-4 my-8">
          <div className="w-12 h-12 rounded-full bg-amber-100 text-[#581825] flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl font-bold text-stone-900">No Sarees Found Matching Your Filter</h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            Try resetting your active filters or explore our complete collection of certified handloom weaves.
          </p>
          <button
            onClick={onResetFilters}
            className="px-6 py-2.5 rounded-full bg-[#581825] text-amber-100 text-xs font-semibold hover:bg-amber-900 transition-colors cursor-pointer"
          >
            Reset Filters & View All
          </button>
        </div>
      )}
    </section>
  );
}
