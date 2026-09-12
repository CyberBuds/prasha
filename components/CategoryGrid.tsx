'use client';

import React from 'react';
import { CraftType } from '@/types';
import { OCCASIONS_LIST } from '@/data/sarees';
import { CatalogCategory } from '@/lib/catalog';

interface CategoryGridProps {
  onSelectCategory: (category: string) => void;
  categories?: CatalogCategory[];
}

const CRAFT_CATEGORIES: { craft: CraftType; name: string; tag: string; image: string }[] = [
  {
    craft: 'Banarasi Silk',
    name: 'Kadhwa Banarasi',
    tag: 'Royal Katan Silk from Varanasi',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'
  },
  {
    craft: 'Kanjivaram Zari',
    name: 'Kanchipuram Korvai',
    tag: 'Double-Warp Pure Zari Temple Weaves',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80'
  },
  {
    craft: 'Chanderi Silk Cotton',
    name: 'Gossamer Chanderi',
    tag: 'Feather-Light Sheer Tissue Silk',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'
  },
  {
    craft: 'Organza Zardozi',
    name: 'Sheer Organza',
    tag: 'Hand-Embroidered Zardozi Scallops',
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80'
  },
  {
    craft: 'Bandhani & Patola',
    name: 'Rai Bandhej & Patola',
    tag: '10,000+ Micro Knot Tie-Dye Art',
    image: 'https://images.unsplash.com/photo-1534126511673-b6899657816a?auto=format&fit=crop&w=800&q=80'
  },
  {
    craft: 'Linen Handloom',
    name: 'Indigo Flax Linen',
    tag: 'Breathable Organic Linen Handblock',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80'
  }
];

export default function CategoryGrid({ onSelectCategory, categories = [] }: CategoryGridProps) {
  const displayCategories = categories.length > 0
    ? categories.map((category) => ({
        craft: category.name,
        name: category.name,
        tag: category.description || 'Explore the latest handloom collection',
        image: category.image || CRAFT_CATEGORIES[0].image
      }))
    : CRAFT_CATEGORIES;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-20">
      
      {/* 1. SHOP BY CRAFT */}
      <div>
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="flex items-center justify-center gap-3">
            <div className="h-[1px] w-12 bg-[#E6C268]"></div>
            <span className="text-[10px] font-bold tracking-[0.3em] text-[#641F96] uppercase font-sans">
              da handloom by prasha
            </span>
            <div className="h-[1px] w-12 bg-[#E6C268]"></div>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl italic font-light text-[#1A1A1A]">
            Discover Heritage Handloom Crafts
          </h2>
          <p className="text-stone-600 text-sm font-normal pt-1 max-w-xl mx-auto leading-relaxed">
            Each drape represents hundreds of hours of patient artisan labor, woven on traditional wooden looms across India&apos;s weaving clusters.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {displayCategories.map((item) => (
            <div
              key={item.craft}
              onClick={() => onSelectCategory(item.craft)}
              className="group cursor-pointer rounded-lg bg-[#FAF9F6] border border-[#E5E5E5] overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-[#F7F5F0]">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover zoom-image group-hover:scale-108 transition-transform duration-700 opacity-90"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#3B0B5C]/90 via-transparent to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="font-serif text-sm font-semibold group-hover:text-[#E6C268] transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-[10px] text-stone-200 line-clamp-1 font-normal mt-0.5">
                    {item.tag}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. SHOP BY OCCASION */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 border-b border-[#E5E5E5] pb-4">
          <div>
            <span className="text-[10px] font-bold text-[#641F96] uppercase tracking-[0.25em] block mb-1">
              Curated Wardrobe
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl italic font-light text-[#1A1A1A]">
              Shop by Celebratory Occasion
            </h2>
          </div>
          <button
            onClick={() => onSelectCategory('ALL')}
            className="mt-2 sm:mt-0 text-[11px] uppercase tracking-widest font-semibold text-[#641F96] hover:text-[#3B0B5C] underline underline-offset-4 cursor-pointer"
          >
            Explore Complete Catalogue →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {OCCASIONS_LIST.map((occ) => (
            <div
              key={occ.title}
              onClick={() => onSelectCategory(`OCCASION:${occ.title}`)}
              className="group relative h-80 rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer border border-[#E5E5E5]"
            >
              <img
                src={occ.image}
                alt={occ.title}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 opacity-90"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#3B0B5C] via-[#3B0B5C]/40 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-1.5">
                <span className="text-[9px] uppercase font-bold tracking-widest text-[#E6C268] bg-[#3B0B5C]/90 px-2.5 py-0.5 rounded border border-[#E6C268]/30 inline-block">
                  {occ.count}
                </span>
                <h3 className="font-serif text-xl font-light italic group-hover:text-[#E6C268] transition-colors">
                  {occ.title}
                </h3>
                <p className="text-xs text-stone-300 font-normal line-clamp-2">
                  {occ.tagline}
                </p>
                <span className="inline-block pt-1 text-xs text-[#E6C268] font-semibold group-hover:translate-x-1 transition-transform">
                  Browse Collection →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
