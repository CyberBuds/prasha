'use client';

import React, { useState } from 'react';
import { Mail, ShieldCheck, MapPin, Phone, Heart, Check } from 'lucide-react';

interface FooterProps {
  onSelectCategory: (category: string) => void;
  onOpenTrackOrder: () => void;
  onOpenAiStylist: () => void;
}

export default function Footer({
  onSelectCategory,
  onOpenTrackOrder,
  onOpenAiStylist
}: FooterProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#3B0B5C] text-[#FAF9F6] pt-16 pb-8 border-t border-[#641F96]/40 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top Newsletter & Brand Promise Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 border-b border-[#641F96]/40 pb-12 items-center">
          <div className="lg:col-span-6 space-y-3">
            <span className="text-[10px] uppercase font-sans tracking-[0.3em] text-[#E6C268] font-bold block">
              da handloom by prasha
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-light italic text-[#FAF9F6]">
              Join the Prasha Heritage Circle
            </h3>
            <p className="text-stone-300 font-normal max-w-lg leading-relaxed">
              Subscribe for private invitation access to rare single-saree loom drops, master weaver trunk shows, and festival styling guides.
            </p>
          </div>

          <div className="lg:col-span-6">
            {subscribed ? (
              <div className="p-4 bg-[#641F96] border border-[#E6C268]/50 rounded-lg text-[#E6C268] flex items-center gap-2 font-semibold text-xs">
                <Check className="w-4 h-4 text-[#E6C268]" />
                <span>Welcome to the Prasha Circle. Your welcome gift voucher has been dispatched to your email.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-purple-300" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full pl-10 pr-4 py-3 bg-[#2A0743] border border-[#641F96] rounded-md text-white placeholder-purple-300/60 focus:outline-none focus:border-[#E6C268]"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#E6C268] hover:bg-[#641F96] hover:text-white text-[#3B0B5C] font-bold text-[11px] uppercase tracking-widest transition-all cursor-pointer whitespace-nowrap shadow-md rounded-xs"
                >
                  Join Circle
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Navigation Directory Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Info Column */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <span className="font-samarkan text-3xl font-semibold text-[#FAF9F6] tracking-wide uppercase block">
                PRASHA
              </span>
              <span className="text-[10px] font-samarkan uppercase tracking-[0.3em] text-[#E6C268] block mt-0.5 font-bold">
                da handloom by prasha
              </span>
            </div>

            <p className="text-stone-300 font-normal leading-relaxed pr-4">
              Prasha is a luxury Indian handloom maison dedicated to preserving heritage saree weaving crafts—from Banarasi Katan Silk to Kanchipuram Korvai and Chanderi Tissue.
            </p>

            <div className="space-y-1.5 text-stone-200 font-medium pt-2">
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#E6C268]" />
                <span>Concierge & WhatsApp: +91 98765 43210</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#E6C268]" />
                <span>Email: concierge@prashahandloom.com</span>
              </p>
            </div>
          </div>

          {/* Craft Collections Column */}
          <div>
            <h4 className="font-serif text-xs font-bold text-[#E6C268] uppercase tracking-wider mb-3 border-b border-[#641F96]/50 pb-2">
              Heritage Weaves
            </h4>
            <ul className="space-y-2 text-stone-200 font-normal">
              {['Banarasi Silk', 'Kanjivaram Zari', 'Chanderi Silk Cotton', 'Organza Zardozi', 'Linen Handloom', 'Bandhani & Patola'].map((c) => (
                <li key={c}>
                  <button
                    onClick={() => onSelectCategory(c)}
                    className="hover:text-[#E6C268] transition-colors cursor-pointer text-left"
                  >
                    {c}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care Column */}
          <div>
            <h4 className="font-serif text-xs font-bold text-[#E6C268] uppercase tracking-wider mb-3 border-b border-[#641F96]/50 pb-2">
              Customer Services
            </h4>
            <ul className="space-y-2 text-stone-200 font-normal">
              <li>
                <button onClick={onOpenTrackOrder} className="hover:text-[#E6C268] transition-colors cursor-pointer text-left">
                  Track Order Status
                </button>
              </li>
              <li>
                <button onClick={onOpenAiStylist} className="hover:text-[#E6C268] transition-colors cursor-pointer text-left">
                  Prasha AI Silk Stylist
                </button>
              </li>
              <li><span>Complimentary Fall & Picot</span></li>
              <li><span>Custom Blouse Tailoring</span></li>
              <li><span>Silk Mark Certificate Lookup</span></li>
              <li><span>7-Day Easy Handloom Return</span></li>
            </ul>
          </div>

          {/* Flagship Showrooms */}
          <div>
            <h4 className="font-serif text-xs font-bold text-[#E6C268] uppercase tracking-wider mb-3 border-b border-[#641F96]/50 pb-2">
              Loom Showrooms
            </h4>
            <ul className="space-y-2 text-stone-200 font-normal">
              <li className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#E6C268] shrink-0 mt-0.5" />
                <span>Varanasi: Madanpura Quarter, UP</span>
              </li>
              <li className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#E6C268] shrink-0 mt-0.5" />
                <span>Kanchipuram: Temple St, TN</span>
              </li>
              <li className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#E6C268] shrink-0 mt-0.5" />
                <span>New Delhi: Defense Colony</span>
              </li>
              <li className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#E6C268] shrink-0 mt-0.5" />
                <span>Mumbai: Kala Ghoda District</span>
              </li>
              <li className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#E6C268] shrink-0 mt-0.5" />
                <span>Bengaluru: Indiranagar 100ft</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright & Payment Methods */}
        <div className="border-t border-[#641F96]/50 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-300 text-[11px]">
          <p>
            © {new Date().getFullYear()} <strong className="text-[#FAF9F6] font-serif">Prasha — da handloom by prasha</strong>. All rights reserved. Handcrafted across India.
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2 py-0.5 bg-[#2A0743] border border-[#641F96] rounded text-[#E6C268] font-bold">UPI</span>
            <span className="px-2 py-0.5 bg-[#2A0743] border border-[#641F96] rounded text-[#E6C268] font-bold">VISA</span>
            <span className="px-2 py-0.5 bg-[#2A0743] border border-[#641F96] rounded text-[#E6C268] font-bold">Mastercard</span>
            <span className="px-2 py-0.5 bg-[#2A0743] border border-[#641F96] rounded text-[#E6C268] font-bold">RuPay</span>
            <span className="px-2 py-0.5 bg-[#2A0743] border border-[#641F96] rounded text-[#E6C268] font-bold">NetBanking</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
