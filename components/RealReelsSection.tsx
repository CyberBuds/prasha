'use client';

import React, { useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Heart, Share2, Sparkles, ShoppingBag, Eye, ShieldCheck, Star } from 'lucide-react';
import { Saree } from '@/types';

interface RealReel {
  id: string;
  title: string;
  customerName: string;
  handle: string;
  location: string;
  occasion: string;
  category: 'drapes' | 'loom' | 'bride';
  videoThumbnail: string;
  videoUrl?: string;
  likes: number;
  sareeId: string;
  quote: string;
  sareeName: string;
  price: number;
}

const REAL_REELS: RealReel[] = [
  {
    id: 'reel-1',
    title: 'Ananya in Regal Kanjivaram Korvai Silk',
    customerName: 'Ananya Sharma',
    handle: '@ananya_drapes',
    location: 'New Delhi',
    occasion: 'Sister’s Sangeet Ceremony',
    category: 'drapes',
    videoThumbnail: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop',
    likes: 2430,
    sareeId: 'kanjivaram-royal-purple',
    quote: 'The drape and weight of pure zari is unmatched! It turned heads all evening at my sister’s sangeet.',
    sareeName: 'Kanjivaram Korvai Silk Saree',
    price: 38500
  },
  {
    id: 'reel-2',
    title: 'Behind the Pit Loom: Pure Banarasi Katan Weaving',
    customerName: 'Master Weaver Ustad Kabir',
    handle: '@varanasi_heritage_looms',
    location: 'Madanpura, Varanasi',
    occasion: 'Artisanal Craftsmanship',
    category: 'loom',
    videoThumbnail: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=800&auto=format&fit=crop',
    likes: 4120,
    sareeId: 'banarasi-katan-red',
    quote: 'Each kadwa motif takes 14 days of synchronized hand weaving on traditional wooden pit looms.',
    sareeName: 'Banarasi Katan Silk Saree in Crimson',
    price: 42000
  },
  {
    id: 'reel-3',
    title: 'Dr. Meera in Pure Organza Zardozi for Reception',
    customerName: 'Dr. Meera Iyer',
    handle: '@dr.meera_iyer',
    location: 'Mumbai',
    occasion: 'Grand Reception',
    category: 'bride',
    videoThumbnail: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop',
    likes: 1890,
    sareeId: 'organza-zardozi-emerald',
    quote: 'Light as air yet so royal. Got endless compliments on the handcrafted handloom zardozi border!',
    sareeName: 'Handloom Organza Zardozi Saree',
    price: 29500
  },
  {
    id: 'reel-4',
    title: 'Siddhika Unboxing Her Silk Mark Certified Chanderi',
    customerName: 'Siddhika Rao',
    handle: '@siddhika_handloom',
    location: 'Bengaluru',
    occasion: 'Festive Pooja & Unboxing',
    category: 'drapes',
    videoThumbnail: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?q=80&w=800&auto=format&fit=crop',
    likes: 3200,
    sareeId: 'chanderi-tissue-gold',
    quote: 'The unboxing experience with the scented box & holographic Silk Mark card felt like true luxury.',
    sareeName: 'Chanderi Tissue Silk Saree',
    price: 24000
  }
];

interface RealReelsSectionProps {
  allSarees: Saree[];
  onSelectSaree: (saree: Saree) => void;
}

export default function RealReelsSection({ allSarees, onSelectSaree }: RealReelsSectionProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'drapes' | 'loom' | 'bride'>('all');
  const [playingId, setPlayingId] = useState<string | null>('reel-1');
  const [isMuted, setIsMuted] = useState(true);
  const [likedReels, setLikedReels] = useState<Record<string, boolean>>({ 'reel-1': true });

  const filteredReels = activeTab === 'all' 
    ? REAL_REELS 
    : REAL_REELS.filter(r => r.category === activeTab);

  const handleToggleLike = (reelId: string) => {
    setLikedReels(prev => ({ ...prev, [reelId]: !prev[reelId] }));
  };

  const handleShopReel = (sareeId: string) => {
    const found = allSarees.find(s => s.id === sareeId || sareeId.includes(s.craft.toLowerCase().replace(/\s+/g, '-')));
    if (found) {
      onSelectSaree(found);
    } else if (allSarees.length > 0) {
      onSelectSaree(allSarees[0]);
    }
  };

  return (
    <section className="py-16 bg-[#FAF8F5] border-t border-[#E5E5E5] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <div className="flex items-center justify-center gap-3">
            <div className="h-[1px] w-12 bg-[#E6C268]"></div>
            <span className="text-[10px] font-bold tracking-[0.3em] text-[#641F96] uppercase font-samarkan">
              da handloom in real life
            </span>
            <div className="h-[1px] w-12 bg-[#E6C268]"></div>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl italic font-light text-[#1A1A1A]">
            Real Women. Real Drapes.
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm font-normal max-w-lg mx-auto">
            Experience our heritage handlooms in authentic motion—captured by real patrons, brides, and master weavers across India.
          </p>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {[
              { id: 'all', label: 'All Real Stories' },
              { id: 'drapes', label: 'Customer Drapes' },
              { id: 'loom', label: 'Live Loom Videos' },
              { id: 'bride', label: 'Bride Spotlight' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 text-[11px] uppercase tracking-wider font-semibold rounded-full transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#641F96] text-[#E6C268] shadow-md border border-[#E6C268]/40'
                    : 'bg-[#F7F5F0] text-[#555] hover:text-[#641F96] border border-[#E5E5E5]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Vertical Reel Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredReels.map((reel) => {
            const isPlaying = playingId === reel.id;
            const isLiked = !!likedReels[reel.id];

            return (
              <div
                key={reel.id}
                className="group relative rounded-xl overflow-hidden bg-[#1A1A1A] shadow-lg border border-[#641F96]/30 flex flex-col justify-between aspect-[9/16] transition-transform duration-300 hover:-translate-y-1"
              >
                {/* Video / Photo Background */}
                <img
                  src={reel.videoThumbnail}
                  alt={reel.title}
                  className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ${
                    isPlaying ? 'scale-105' : 'group-hover:scale-105'
                  }`}
                  referrerPolicy="no-referrer"
                />

                {/* Subtle Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-[#1A1A1A]/30 to-black/40 pointer-events-none" />

                {/* Top Badge & Sound Toggle */}
                <div className="relative z-10 p-3.5 flex items-center justify-between text-white">
                  <span className="px-2.5 py-1 rounded-full text-[9px] uppercase tracking-wider font-bold bg-[#3B0B5C]/90 text-[#E6C268] border border-[#E6C268]/30 backdrop-blur-md flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#E6C268]" />
                    {reel.occasion}
                  </span>

                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2 rounded-full bg-black/40 text-white hover:bg-black/70 backdrop-blur-md transition-colors cursor-pointer"
                  >
                    {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-[#E6C268]" />}
                  </button>
                </div>

                {/* Center Play Overlay Trigger */}
                <div className="relative z-10 flex-1 flex items-center justify-center p-4">
                  <button
                    onClick={() => setPlayingId(isPlaying ? null : reel.id)}
                    className={`p-4 rounded-full bg-[#641F96]/80 text-[#E6C268] border border-[#E6C268]/50 shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-110 cursor-pointer ${
                      isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-90'
                    }`}
                  >
                    {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
                  </button>
                </div>

                {/* Bottom Story & Product Card Overlay */}
                <div className="relative z-10 p-4 space-y-3 text-white">
                  
                  {/* User Handle & Location */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-xs text-white">{reel.customerName}</h4>
                      <p className="text-[10px] text-stone-300">{reel.handle} • {reel.location}</p>
                    </div>

                    {/* Like Action */}
                    <button
                      onClick={() => handleToggleLike(reel.id)}
                      className="flex flex-col items-center gap-0.5 text-xs text-stone-200 cursor-pointer"
                    >
                      <Heart className={`w-5 h-5 transition-transform active:scale-125 ${isLiked ? 'fill-rose-500 text-rose-500' : 'text-white'}`} />
                      <span className="text-[9px] font-bold">{reel.likes + (isLiked ? 1 : 0)}</span>
                    </button>
                  </div>

                  {/* Customer Review Quote */}
                  <p className="text-[11px] text-stone-200 italic leading-snug line-clamp-2 bg-black/30 p-2 rounded border border-white/10 backdrop-blur-xs">
                    &quot;{reel.quote}&quot;
                  </p>

                  {/* Product Tag & Shop Action Button */}
                  <div className="pt-1 flex items-center justify-between gap-2 border-t border-white/15">
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase font-bold text-[#E6C268] tracking-wider truncate">
                        {reel.sareeName}
                      </p>
                      <p className="text-xs font-semibold text-white">₹{reel.price.toLocaleString('en-IN')}</p>
                    </div>

                    <button
                      onClick={() => handleShopReel(reel.sareeId)}
                      className="px-3 py-2 rounded bg-[#E6C268] hover:bg-[#641F96] text-[#3B0B5C] hover:text-white text-[10px] font-bold uppercase tracking-widest transition-colors shrink-0 flex items-center gap-1 shadow-md cursor-pointer"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      <span>Shop Reel</span>
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Real Section Footer Banner */}
        <div className="mt-12 bg-[#3B0B5C] text-white rounded-xl p-6 sm:p-8 border border-[#E6C268]/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-serif text-xl sm:text-2xl italic text-[#E6C268]">
              Draped in Prasha? Share Your Handloom Moment
            </h3>
            <p className="text-xs text-stone-300 font-normal">
              Tag <strong className="text-white">@prashahandloom</strong> or hashtag <strong className="text-white">#RealPrashaDrapes</strong> on Instagram to be featured on our official maison feed & receive an exclusive ₹2,500 craft voucher.
            </p>
          </div>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-[#E6C268] hover:bg-[#641F96] text-[#3B0B5C] hover:text-white text-[11px] font-bold uppercase tracking-widest rounded transition-all shrink-0 cursor-pointer shadow-md"
          >
            Tag #RealPrashaDrapes →
          </a>
        </div>

      </div>
    </section>
  );
}
