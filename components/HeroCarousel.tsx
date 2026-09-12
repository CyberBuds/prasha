'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, Award } from 'lucide-react';

interface HeroCarouselProps {
  onExplore: (category?: string) => void;
  onOpenAiStylist: () => void;
}

const HERO_SLIDES = [
  {
    id: 1,
    title: 'The Royal Kadhwa Banarasi Edit',
    tagline: 'da handloom by prasha',
    subtitle: 'Woven over 40 loom days in Varanasi using pure 24K gold zari & mulberry silk Katan threads.',
    category: 'Banarasi Silk',
    badge: 'Heritage Masterpiece',
    bgImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1800&q=85',
    buttonText: 'Explore Banarasi Sarees'
  },
  {
    id: 2,
    title: 'Kanchipuram Korvai Grandeur',
    tagline: 'da handloom by prasha',
    subtitle: 'Interwoven double-shuttle temple borders with pure zari heavy pallus for the regal bride.',
    category: 'Kanjivaram Zari',
    badge: 'GI Tagged Authentic',
    bgImage: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1800&q=85',
    buttonText: 'Shop Bridal Trousseau'
  },
  {
    id: 3,
    title: 'Airy Chanderi & Organza Zardozi',
    tagline: 'da handloom by prasha',
    subtitle: 'Gossamer light tissue silk adorned with delicate hand-embroidered dabka & cutdana scalloped borders.',
    category: 'Organza Zardozi',
    badge: 'Ethereal Pastels',
    bgImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1800&q=85',
    buttonText: 'View Cocktail Weaves'
  }
];

export default function HeroCarousel({ onExplore, onOpenAiStylist }: HeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);

  const slide = HERO_SLIDES[currentSlide];

  return (
    <section className="relative w-full h-[540px] sm:h-[620px] lg:h-[680px] bg-[#FAF9F6] border-b border-[#E5E5E5] overflow-hidden">
      {/* Slide Image Backgrounds */}
      {HERO_SLIDES.map((s, idx) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <img
            src={s.bgImage}
            alt={s.title}
            className="w-full h-full object-cover object-center scale-105 transition-transform duration-[8000ms] ease-out opacity-25"
            referrerPolicy="no-referrer"
          />
          {/* Warm Sand Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAF9F6] via-[#FAF9F6]/90 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAF9F6] via-transparent to-[#FAF9F6]/30" />
        </div>
      ))}

      {/* Decorative Large Background Watermark Text */}
      <span className="absolute -bottom-10 left-6 text-[160px] sm:text-[240px] font-serif font-bold text-[#1A1A1A]/[0.03] pointer-events-none select-none z-10">
        PRASHA
      </span>

      {/* Content Container */}
      <div className="relative z-20 max-w-7xl mx-auto h-full px-6 sm:px-12 lg:px-16 flex flex-col justify-center">
        <div className="max-w-2xl text-[#1A1A1A] space-y-6 animate-fadeIn">
          
          <div className="flex items-center gap-3">
            <span className="bg-[#F7F5F0] border border-[#641F96]/30 text-[#641F96] text-[10px] px-3.5 py-1 rounded-full uppercase tracking-widest font-bold">
              {slide.badge}
            </span>
            <div className="h-[1px] w-20 bg-[#E6C268] hidden sm:block"></div>
          </div>

          <div>
            <span className="text-[11px] uppercase tracking-[0.3em] font-bold text-[#E6C268] block mb-2">
              {slide.tagline}
            </span>
            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl italic font-light text-[#1A1A1A] leading-[0.95] tracking-tight">
              {slide.title}
            </h1>
          </div>

          <p className="text-[#4A4A4A] text-sm sm:text-base leading-relaxed font-normal max-w-lg">
            {slide.subtitle}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            {/* Primary Button */}
            <button
              onClick={() => onExplore(slide.category)}
              className="px-8 py-4 bg-[#641F96] text-white text-[11px] uppercase tracking-[0.2em] font-semibold hover:bg-[#3B0B5C] transition-colors cursor-pointer shadow-sm rounded-xs"
            >
              {slide.buttonText}
            </button>

            {/* Secondary Button */}
            <button
              onClick={onOpenAiStylist}
              className="px-8 py-4 bg-transparent border border-[#641F96] text-[#641F96] text-[11px] uppercase tracking-[0.2em] font-semibold hover:bg-[#E6C268] hover:border-[#E6C268] hover:text-[#3B0B5C] transition-colors cursor-pointer flex items-center gap-2 rounded-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#641F96] group-hover:text-[#3B0B5C]" />
              <span>Ask AI Stylist</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-[#FAF9F6]/80 hover:bg-[#1A1A1A] hover:text-white text-[#1A1A1A] backdrop-blur-md transition-all cursor-pointer border border-[#E5E5E5] shadow-xs"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-[#FAF9F6]/80 hover:bg-[#1A1A1A] hover:text-white text-[#1A1A1A] backdrop-blur-md transition-all cursor-pointer border border-[#E5E5E5] shadow-xs"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {HERO_SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
              idx === currentSlide ? 'w-8 bg-[#C19A6B]' : 'w-2 bg-[#1A1A1A]/30 hover:bg-[#1A1A1A]/60'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
