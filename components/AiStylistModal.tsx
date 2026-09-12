'use client';

import React, { useState } from 'react';
import { X, Sparkles, Send, Loader2, Award, Star } from 'lucide-react';
import { Saree } from '@/types';
import { formatPrice } from './Navbar';

interface AiStylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  allSarees: Saree[];
  selectedCurrency: string;
  onSelectSaree: (saree: Saree) => void;
}

export default function AiStylistModal({
  isOpen,
  onClose,
  allSarees,
  selectedCurrency,
  onSelectSaree
}: AiStylistModalProps) {
  const [occasion, setOccasion] = useState('Bridal & Wedding');
  const [colorPreference, setColorPreference] = useState('Royal Crimson / Gold');
  const [budget, setBudget] = useState('25000');
  const [weather, setWeather] = useState('AC Hall / Indoor Wedding');
  const [notes, setNotes] = useState('Looking for a regal Banarasi or Kanjivaram with pure zari that flatters an evening reception.');
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    greeting?: string;
    advice?: string;
    drapeTip?: string;
    recommendedSareeIds?: string[];
  } | null>(null);

  if (!isOpen) return null;

  const handleConsult = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/stylist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          occasion,
          colorPreference,
          budget,
          weather,
          additionalNotes: notes
        })
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setResult({
        greeting: 'Welcome to Prasha Couture',
        advice: 'Our chief stylist recommends our classic Katan Silk Banarasi or Korvai Kanjivaram for a memorable, majestic look.',
        drapeTip: 'Drape with structured single pleats to emphasize the heavy zari pallu motifs.',
        recommendedSareeIds: ['prasha-banarasi-01', 'prasha-kanjivaram-02']
      });
    } finally {
      setLoading(false);
    }
  };

  const recommendedSarees = result?.recommendedSareeIds
    ? allSarees.filter((s) => result.recommendedSareeIds?.includes(s.id))
    : [];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#3B0E17] via-[#581825] to-[#42101B] text-amber-100 p-5 sm:p-6 flex items-center justify-between border-b border-amber-800/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
              <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-serif tracking-widest text-amber-300 block">da handloom by prasha</span>
              <h2 className="font-serif text-2xl font-bold">PRASHA AI Silk Stylist</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-amber-200 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Consultation Form */}
          <form onSubmit={handleConsult} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-stone-800 block mb-1">Occasion / Celebration</label>
              <select
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                className="w-full p-2.5 bg-[#FAF8F5] border border-stone-300 rounded text-stone-900 focus:outline-none focus:border-[#581825]"
              >
                <option value="Bridal & Wedding">Bridal & Wedding Trousseau</option>
                <option value="Festive & Puja">Festive & Puja Celebrations</option>
                <option value="Cocktails & Soirées">Cocktails & Soirée Evening</option>
                <option value="Casual Elegance">Casual Day Elegance</option>
                <option value="Office & Daily">Office & Professional Wear</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-stone-800 block mb-1">Color Palette Preference</label>
              <input
                type="text"
                value={colorPreference}
                onChange={(e) => setColorPreference(e.target.value)}
                placeholder="e.g. Crimson, Pastel Pink, Emerald, Ivory Gold"
                className="w-full p-2.5 bg-[#FAF8F5] border border-stone-300 rounded text-stone-900 focus:outline-none focus:border-[#581825]"
              />
            </div>

            <div>
              <label className="font-semibold text-stone-800 block mb-1">Approximate Budget (₹ INR)</label>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="e.g. 25000"
                className="w-full p-2.5 bg-[#FAF8F5] border border-stone-300 rounded text-stone-900 focus:outline-none focus:border-[#581825]"
              />
            </div>

            <div>
              <label className="font-semibold text-stone-800 block mb-1">Season / Climate</label>
              <input
                type="text"
                value={weather}
                onChange={(e) => setWeather(e.target.value)}
                placeholder="e.g. Summer Day, AC Banquet Hall, Destination Wedding"
                className="w-full p-2.5 bg-[#FAF8F5] border border-stone-300 rounded text-stone-900 focus:outline-none focus:border-[#581825]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-semibold text-stone-800 block mb-1">Additional Preferences or Drape Style</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Tell us about the drape style, body fit preference, or zari weight you like..."
                className="w-full p-2.5 bg-[#FAF8F5] border border-stone-300 rounded text-stone-900 focus:outline-none focus:border-[#581825]"
              ></textarea>
            </div>

            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#581825] hover:bg-[#722031] text-amber-100 font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all border border-amber-500/30"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                    <span>Consulting Prasha AI Stylist Engine...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Get Personalized Saree Advice</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* AI Result Box */}
          {result && (
            <div className="p-5 bg-amber-50/70 border border-amber-300 rounded-2xl space-y-4 text-xs animate-fadeIn">
              <div>
                <span className="text-[10px] font-bold text-amber-900 uppercase tracking-widest block mb-1">
                  Stylist Recommendation
                </span>
                <p className="font-serif text-lg font-bold text-stone-900">{result.greeting}</p>
                <p className="text-stone-700 leading-relaxed mt-2 whitespace-pre-line">{result.advice}</p>
              </div>

              {result.drapeTip && (
                <div className="p-3 bg-white rounded-xl border border-amber-200/80 flex items-start gap-2 text-[#581825]">
                  <Award className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-xs text-stone-900">Drape & Blouse Styling Tip:</strong>
                    <span className="text-stone-600 text-[11px]">{result.drapeTip}</span>
                  </div>
                </div>
              )}

              {/* Recommended Sarees List */}
              {recommendedSarees.length > 0 && (
                <div>
                  <h4 className="font-serif font-bold text-stone-900 text-sm mb-3">
                    Curated Weaves For You
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {recommendedSarees.map((saree) => (
                      <div
                        key={saree.id}
                        onClick={() => {
                          onSelectSaree(saree);
                          onClose();
                        }}
                        className="p-3 bg-white rounded-xl border border-stone-200 flex gap-3 hover:border-[#581825] cursor-pointer transition-all shadow-xs"
                      >
                        <img
                          src={saree.primaryImage}
                          alt={saree.title}
                          className="w-16 h-20 object-cover rounded-lg"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <h5 className="font-serif font-bold text-stone-900 text-xs line-clamp-1">
                              {saree.title}
                            </h5>
                            <p className="text-[10px] text-stone-500">{saree.craft}</p>
                          </div>
                          <div className="text-right font-bold text-[#581825]">
                            {formatPrice(saree.price, selectedCurrency)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
