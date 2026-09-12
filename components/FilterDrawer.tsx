'use client';

import React from 'react';
import { X, Check } from 'lucide-react';
import { CraftType, FilterState, OccasionType } from '@/types';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filterState: FilterState;
  onUpdateFilter: (newFilters: Partial<FilterState>) => void;
  onResetFilters: () => void;
}

const ALL_CRAFTS: CraftType[] = [
  'Banarasi Silk',
  'Kanjivaram Zari',
  'Chanderi Silk Cotton',
  'Tussar Handblock',
  'Organza Zardozi',
  'Linen Handloom',
  'Bandhani & Patola',
  'Jamdani Handwoven'
];

const ALL_OCCASIONS: OccasionType[] = [
  'Bridal & Wedding',
  'Festive & Puja',
  'Cocktails & Soirées',
  'Casual Elegance',
  'Office & Daily'
];

const COLOR_SWATCHES = [
  { name: 'Red', hex: '#8B0000' },
  { name: 'Emerald', hex: '#004B23' },
  { name: 'Gold', hex: '#DAA520' },
  { name: 'Peach', hex: '#FFDAB9' },
  { name: 'Indigo', hex: '#1A2B4C' },
  { name: 'Ivory', hex: '#FFFFF0' },
  { name: 'Mustard', hex: '#C72C3B' }
];

export default function FilterDrawer({
  isOpen,
  onClose,
  filterState,
  onUpdateFilter,
  onResetFilters
}: FilterDrawerProps) {
  if (!isOpen) return null;

  const toggleCraft = (craft: CraftType) => {
    const exists = filterState.crafts.includes(craft);
    const updated = exists
      ? filterState.crafts.filter((item) => item !== craft)
      : [...filterState.crafts, craft];
    onUpdateFilter({ crafts: updated });
  };

  const toggleOccasion = (occ: OccasionType) => {
    const exists = filterState.occasions.includes(occ);
    const updated = exists
      ? filterState.occasions.filter((item) => item !== occ)
      : [...filterState.occasions, occ];
    onUpdateFilter({ occasions: updated });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex justify-end animate-fadeIn">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between p-6 animate-slideLeft overflow-y-auto">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-stone-200 pb-4 mb-6">
            <div>
              <h3 className="font-serif text-xl font-bold text-[#581825]">Filter Weaves</h3>
              <p className="text-xs text-stone-500">Refine by craft, occasion, and fabric</p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-500 hover:text-stone-900 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6 text-xs">
            {/* 1. Craft Type */}
            <div>
              <h4 className="font-serif text-sm font-bold text-stone-900 uppercase tracking-wider mb-3">
                Heritage Craft
              </h4>
              <div className="space-y-2">
                {ALL_CRAFTS.map((craft) => {
                  const isChecked = filterState.crafts.includes(craft);
                  return (
                    <label
                      key={craft}
                      onClick={() => toggleCraft(craft)}
                      className="flex items-center justify-between p-2 rounded hover:bg-[#FAF8F5] cursor-pointer transition-colors"
                    >
                      <span className={isChecked ? 'font-semibold text-[#581825]' : 'text-stone-700'}>
                        {craft}
                      </span>
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center ${
                          isChecked ? 'bg-[#581825] border-[#581825] text-white' : 'border-stone-300'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3" />}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* 2. Occasion */}
            <div className="border-t border-stone-200 pt-5">
              <h4 className="font-serif text-sm font-bold text-stone-900 uppercase tracking-wider mb-3">
                Occasion
              </h4>
              <div className="space-y-2">
                {ALL_OCCASIONS.map((occ) => {
                  const isChecked = filterState.occasions.includes(occ);
                  return (
                    <label
                      key={occ}
                      onClick={() => toggleOccasion(occ)}
                      className="flex items-center justify-between p-2 rounded hover:bg-[#FAF8F5] cursor-pointer transition-colors"
                    >
                      <span className={isChecked ? 'font-semibold text-[#581825]' : 'text-stone-700'}>
                        {occ}
                      </span>
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center ${
                          isChecked ? 'bg-[#581825] border-[#581825] text-white' : 'border-stone-300'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3" />}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* 3. Bestsellers & In Stock Toggle */}
            <div className="border-t border-stone-200 pt-5 space-y-3">
              <label
                onClick={() => onUpdateFilter({ onlyBestsellers: !filterState.onlyBestsellers })}
                className="flex items-center justify-between p-2 rounded hover:bg-[#FAF8F5] cursor-pointer"
              >
                <span className="font-semibold text-stone-900">Bestsellers Only</span>
                <input
                  type="checkbox"
                  checked={filterState.onlyBestsellers}
                  onChange={() => {}}
                  className="accent-[#581825] w-4 h-4"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-stone-200 pt-4 flex gap-3 mt-6">
          <button
            onClick={() => {
              onResetFilters();
              onClose();
            }}
            className="flex-1 py-3 rounded-lg border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50 cursor-pointer"
          >
            Reset Filters
          </button>

          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-lg bg-[#581825] text-amber-100 text-xs font-semibold hover:bg-amber-900 cursor-pointer"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
