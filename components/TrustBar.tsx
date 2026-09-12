'use client';

import React from 'react';
import { ShieldCheck, HeartHandshake, Scissors, Truck } from 'lucide-react';

export default function TrustBar() {
  const TRUST_ITEMS = [
    {
      icon: ShieldCheck,
      title: 'Silk Mark Certified',
      subtitle: '100% Pure Mulberry & Tussar Silk with QR authenticity tag'
    },
    {
      icon: HeartHandshake,
      title: 'Weaver Preservation',
      subtitle: '80%+ proceeds go directly to artisan weaving families'
    },
    {
      icon: Scissors,
      title: 'Custom Stitching',
      subtitle: 'Complimentary Fall & Picot + Tailored Blouse options'
    },
    {
      icon: Truck,
      title: 'Express Worldwide',
      subtitle: 'Free delivery across India & global DHL shipping'
    }
  ];

  return (
    <section className="bg-[#F7F5F0] text-[#1A1A1A] border-y border-[#E5E5E5] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 text-center lg:text-left">
        {TRUST_ITEMS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex flex-col lg:flex-row items-center gap-3.5 p-2">
              <div className="w-10 h-10 rounded-full border border-[#641F96]/30 bg-[#641F96] text-[#E6C268] flex items-center justify-center shrink-0 shadow-xs">
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-[#641F96] text-xs uppercase tracking-wider">{item.title}</h4>
                <p className="text-[#555] text-[11px] mt-0.5 leading-snug font-normal">{item.subtitle}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
