'use client';

import React from 'react';
import { WEAVER_STORIES } from '@/data/sarees';
import { Award, ShieldCheck, Heart } from 'lucide-react';

export default function WeaverStorySection() {
  return (
    <section id="weaver-heritage" className="bg-[#FAF9F6] border-y border-[#E5E5E5] py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-14">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="flex items-center justify-center gap-3">
            <div className="h-[1px] w-12 bg-[#E6C268]"></div>
            <span className="text-[10px] font-bold tracking-[0.3em] text-[#641F96] uppercase font-sans">
              Guarding Sacred Traditions
            </span>
            <div className="h-[1px] w-12 bg-[#E6C268]"></div>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl italic font-light text-[#1A1A1A]">
            From Pit-Loom to Heirloom
          </h2>
          <p className="text-stone-600 text-sm font-normal max-w-xl mx-auto pt-1 leading-relaxed">
            Prasha is a tribute to India&apos;s master weaving families. Every saree you drape honors centuries of hereditary artisan craft and preserves sacred weaving techniques.
          </p>
        </div>

        {/* Weaver Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {WEAVER_STORIES.map((weaver) => (
            <div
              key={weaver.id}
              className="bg-[#F7F5F0] rounded-lg border border-[#E5E5E5] overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative h-64 overflow-hidden bg-[#FAF9F6]">
                <img
                  src={weaver.image}
                  alt={weaver.name}
                  className="w-full h-full object-cover object-top zoom-image hover:scale-105 transition-transform duration-700 opacity-90"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#3B0B5C]/90 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <span className="text-[9px] uppercase tracking-widest font-bold text-[#E6C268] bg-[#3B0B5C]/90 px-2.5 py-0.5 rounded border border-[#E6C268]/40">
                    {weaver.experienceYears} Years Mastercraft
                  </span>
                  <h3 className="font-serif text-lg font-light italic mt-1 text-white">{weaver.name}</h3>
                  <p className="text-xs text-stone-200 font-normal">{weaver.region}</p>
                </div>
              </div>

              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between text-xs">
                <blockquote className="italic font-serif text-[#1A1A1A] text-sm leading-relaxed border-l-2 border-[#641F96] pl-3">
                  &quot;{weaver.quote}&quot;
                </blockquote>

                <div className="pt-3 border-t border-[#E5E5E5] text-[11px] text-[#666] flex items-center justify-between">
                  <span className="font-semibold text-[#1A1A1A]">{weaver.specialty}</span>
                  <span className="text-[#641F96] font-bold uppercase text-[10px] tracking-wider">{weaver.loomType}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Authenticity Pledge Banner */}
        <div className="bg-[#3B0B5C] text-[#FAF9F6] rounded-xl p-8 sm:p-12 border border-[#641F96]/40 shadow-lg flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#641F96] border border-[#E6C268]/40 text-[#E6C268] text-[10px] uppercase tracking-widest font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-[#E6C268]" />
              <span>100% GI Tag & Silk Mark Guarantee</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-4xl italic font-light text-white">
              No Powerlooms. No Synthetic Imitations.
            </h3>
            <p className="text-stone-300 text-xs sm:text-sm font-normal leading-relaxed">
              Every Prasha weave comes tagged with an official Silk Mark India holographic certificate & QR code tracing the exact master weaver, warp thread count, and village loom location.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="p-5 rounded-lg bg-[#641F96] border border-[#E6C268]/30 text-center min-w-[130px]">
              <span className="font-serif text-3xl font-light italic text-[#E6C268] block">80%+</span>
              <span className="text-[10px] text-stone-200 uppercase tracking-widest font-semibold">Direct Fair Value</span>
            </div>
            <div className="p-5 rounded-lg bg-[#641F96] border border-[#E6C268]/30 text-center min-w-[130px]">
              <span className="font-serif text-3xl font-light italic text-[#E6C268] block">100%</span>
              <span className="text-[10px] text-stone-200 uppercase tracking-widest font-semibold">Pure Silk & Zari</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
