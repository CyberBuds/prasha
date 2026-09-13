'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  ShoppingBag, 
  Heart, 
  User, 
  Menu, 
  X, 
  Sparkles, 
  ChevronDown, 
  MapPin, 
  Truck, 
  Phone, 
  ShieldCheck,
  Check
} from 'lucide-react';
import { Saree, CartItem } from '@/types';

interface NavbarProps {
  cartItems: CartItem[];
  wishlistIds: string[];
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenAiStylist: () => void;
  onOpenTrackOrder: () => void;
  onOpenAuth: () => void;
  onSelectCategory: (category: string) => void;
  onSearchQuery: (query: string) => void;
  selectedCurrency: string;
  onChangeCurrency: (curr: string) => void;
  allSarees: Saree[];
  onSelectSaree: (saree: Saree) => void;
}

export const CURRENCIES: Record<string, { symbol: string; rate: number; label: string }> = {
  INR: { symbol: '₹', rate: 1, label: 'INR (₹)' },
  USD: { symbol: '$', rate: 0.012, label: 'USD ($)' },
  GBP: { symbol: '£', rate: 0.0094, label: 'GBP (£)' },
  EUR: { symbol: '€', rate: 0.011, label: 'EUR (€)' },
  AED: { symbol: 'AED ', rate: 0.044, label: 'AED' },
};

export function formatPrice(priceInINR: number, currencyCode: string = 'INR'): string {
  const curr = CURRENCIES[currencyCode] || CURRENCIES.INR;
  const converted = Math.round(priceInINR * curr.rate);
  return `${curr.symbol}${converted.toLocaleString('en-IN')}`;
}

export default function Navbar({
  cartItems,
  wishlistIds,
  onOpenCart,
  onOpenWishlist,
  onOpenAiStylist,
  onOpenTrackOrder,
  onOpenAuth,
  onSelectCategory,
  onSearchQuery,
  selectedCurrency,
  onChangeCurrency,
  allSarees,
  onSelectSaree
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [currencyDropdown, setCurrencyDropdown] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState<string | null>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleOpenMenu = (menuKey: string) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setMegaMenuOpen(menuKey);
  };

  const handleCloseMenu = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    closeTimeoutRef.current = setTimeout(() => {
      setMegaMenuOpen(null);
    }, 250);
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearchQuery(searchInput);
      setSearchOpen(false);
    }
  };

  const searchResults = searchInput.trim()
    ? allSarees.filter(
        s =>
          s.title.toLowerCase().includes(searchInput.toLowerCase()) ||
          s.craft.toLowerCase().includes(searchInput.toLowerCase()) ||
          s.fabric.toLowerCase().includes(searchInput.toLowerCase()) ||
          s.color.toLowerCase().includes(searchInput.toLowerCase())
      )
    : [];

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* 1. Top Announcement Bar */}
      <div className="bg-[#641F96] text-[#FFFFFF] text-[10px] uppercase tracking-[0.2em] py-2 px-4 text-center font-bold flex items-center justify-between border-b border-[#3B0B5C]">
        <div className="hidden md:flex items-center gap-4 text-[10px] text-stone-100">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#E6C268]" />
            100% Handloom & Silk Mark Certified
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-[#E6C268]" />
            Complimentary Artisanal Packaging on Domestic Orders
          </span>
        </div>

        <div className="mx-auto md:mx-0 text-center flex items-center gap-2">
          <span>Complimentary Artisanal Packaging on all Domestic Orders | Shop the Heritage Collection</span>
        </div>

        <div className="hidden md:flex items-center gap-4 text-[10px]">
          <button 
            onClick={onOpenTrackOrder} 
            className="hover:text-[#E6C268] transition-colors flex items-center gap-1 cursor-pointer"
          >
            <MapPin className="w-3 h-3 text-[#E6C268]" /> Track Order
          </button>
          
          {/* Fixed Currency Badge (INR Only) */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-black/25 border border-[#E6C268]/40 text-[#E6C268] text-[10px] font-bold tracking-wider">
            <span>₹ INR</span>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <nav className={`w-full bg-[#FAF9F6]/95 backdrop-blur-md border-b border-[#E5E5E5] transition-shadow relative ${
        isScrolled ? 'shadow-sm py-2.5' : 'py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          
          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-3 lg:hidden">
            <button 
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-1.5 text-[#1A1A1A] hover:text-[#641F96] focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* BRAND LOGO IMAGE */}
          <div className="flex-1 lg:flex-initial text-center lg:text-left">
            <button 
              onClick={() => onSelectCategory('ALL')} 
              className="inline-block text-center lg:text-left group cursor-pointer"
            >
              <img 
                src="/prashalogot.png" 
                alt="PRASHA - da handloom by prasha" 
                className="h-12 sm:h-16 md:h-20 max-h-20 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </button>
          </div>

            {/* DESKTOP NAV LINKS */}
            <div className="hidden lg:flex items-center gap-8 text-[11px] uppercase tracking-widest font-medium text-[#1A1A1A]">
              
              {/* 1. Sarees Mega Dropdown */}
              <div 
                className="py-2"
                onMouseEnter={() => handleOpenMenu('sarees')}
                onMouseLeave={handleCloseMenu}
              >
                <button 
                  onClick={() => onSelectCategory('ALL')}
                  className="hover:text-[#641F96] flex items-center gap-1 transition-colors cursor-pointer py-1 font-semibold"
                >
                  SAREES
                  <ChevronDown className="w-3 h-3 text-[#641F96]" />
                </button>

                {megaMenuOpen === 'sarees' && (
                  <div 
                    onMouseEnter={() => handleOpenMenu('sarees')}
                    onMouseLeave={handleCloseMenu}
                    className="absolute top-full left-0 right-0 w-full bg-[#FAF9F6] border-b-2 border-[#641F96] shadow-2xl p-8 z-50 animate-fadeIn text-xs text-[#1A1A1A]"
                  >
                    <div className="max-w-7xl mx-auto grid grid-cols-4 gap-8">
                      <div>
                        <h4 className="font-serif text-xs font-bold text-[#641F96] border-b border-[#E5E5E5] pb-2 mb-3 uppercase tracking-wider">
                          BY HERITAGE WEAVE
                        </h4>
                        <ul className="space-y-2">
                          {['Banarasi Silk', 'Kanjivaram Zari', 'Chanderi Silk Cotton', 'Tussar Handblock'].map(craft => (
                            <li key={craft}>
                              <button 
                                onClick={() => {
                                  onSelectCategory(craft);
                                  setMegaMenuOpen(null);
                                }}
                                className="hover:text-[#641F96] hover:translate-x-1 transition-all flex items-center gap-2 cursor-pointer text-left font-normal"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-[#E6C268]"></span>
                                {craft}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-serif text-xs font-bold text-[#641F96] border-b border-[#E5E5E5] pb-2 mb-3 uppercase tracking-wider">
                          BY SPECIALTY FABRIC
                        </h4>
                        <ul className="space-y-2">
                          {['Organza Zardozi', 'Linen Handloom', 'Bandhani & Patola', 'Jamdani Handwoven'].map(craft => (
                            <li key={craft}>
                              <button 
                                onClick={() => {
                                  onSelectCategory(craft);
                                  setMegaMenuOpen(null);
                                }}
                                className="hover:text-[#641F96] hover:translate-x-1 transition-all flex items-center gap-2 cursor-pointer text-left font-normal"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-[#E6C268]"></span>
                                {craft}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-serif text-xs font-bold text-[#641F96] border-b border-[#E5E5E5] pb-2 mb-3 uppercase tracking-wider">
                          EXCLUSIVE CURATIONS
                        </h4>
                        <ul className="space-y-2">
                          {['Pure Gold Zari Kadwa', 'Real Silver Zari Vintage', 'Sankalp Bridal Trousseau', 'Royal Court Heritage'].map(craft => (
                            <li key={craft}>
                              <button 
                                onClick={() => {
                                  onSelectCategory(craft);
                                  setMegaMenuOpen(null);
                                }}
                                className="hover:text-[#641F96] hover:translate-x-1 transition-all flex items-center gap-2 cursor-pointer text-left font-normal"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-[#641F96]"></span>
                                {craft}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-[#F7F5F0] p-5 rounded-xl border border-[#E5E5E5] flex flex-col justify-between shadow-xs">
                        <div>
                          <span className="text-[10px] font-bold text-[#641F96] uppercase tracking-widest block mb-1">Featured Artisanal Weave</span>
                          <h5 className="font-serif font-bold text-[#1A1A1A] text-sm mb-1">Kadwa Banarasi Collection</h5>
                          <p className="text-[11px] text-[#666] leading-relaxed">Handwoven with zero float threads on reverse. Pure 24k gold electroplated silver zari.</p>
                        </div>
                        <button 
                          onClick={() => {
                            onSelectCategory('Banarasi Silk');
                            setMegaMenuOpen(null);
                          }}
                          className="mt-4 text-[11px] uppercase tracking-wider text-[#641F96] font-bold underline underline-offset-4 hover:text-[#3B0B5C]"
                        >
                          Explore Banarasi Sarees →
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 2. POPUP SHOP Mega Dropdown (Exact Match to User Screenshot) */}
              <div 
                className="py-2"
                onMouseEnter={() => handleOpenMenu('popupshop')}
                onMouseLeave={handleCloseMenu}
              >
                <button 
                  onClick={() => onSelectCategory('POPUP_SHOP')}
                  className="hover:text-[#641F96] flex items-center gap-1 transition-colors cursor-pointer py-1 font-semibold text-[#641F96]"
                >
                  POPUP SHOP
                  <ChevronDown className="w-3 h-3 text-[#E6C268]" />
                </button>

                {megaMenuOpen === 'popupshop' && (
                  <div 
                    onMouseEnter={() => handleOpenMenu('popupshop')}
                    onMouseLeave={handleCloseMenu}
                    className="absolute top-full left-0 right-0 w-full bg-[#F4EFEA] border-b-2 border-[#5C3A21] shadow-2xl z-50 animate-fadeIn pt-8 pb-10 px-6 sm:px-12 text-[#3B2219]"
                  >
                    <div className="max-w-7xl mx-auto space-y-8">
                      
                      {/* 6 Circular Portraits with Ornamental Mandala Frames */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 items-center justify-center">
                        {[
                          {
                            name: 'SUNITA SHETTY',
                            sareeQuery: 'Banarasi',
                            img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=500&auto=format&fit=crop'
                          },
                          {
                            name: 'PALAK BHAGVATI',
                            sareeQuery: 'Patola',
                            img: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=500&auto=format&fit=crop'
                          },
                          {
                            name: 'JHANVI CHAUHAN',
                            sareeQuery: 'Organza',
                            img: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=500&auto=format&fit=crop'
                          },
                          {
                            name: 'SHIVANI PANDYA',
                            sareeQuery: 'Bandhani',
                            img: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?q=80&w=500&auto=format&fit=crop'
                          },
                          {
                            name: 'DRASHTI GHANVA',
                            sareeQuery: 'Kanjivaram',
                            img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=500&auto=format&fit=crop'
                          },
                          {
                            name: 'SUNITHA SHARMA',
                            sareeQuery: 'Jamdani',
                            img: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=500&auto=format&fit=crop'
                          }
                        ].map((model) => (
                          <div 
                            key={model.name}
                            onClick={() => {
                              onSelectCategory(model.sareeQuery);
                              setMegaMenuOpen(null);
                            }}
                            className="flex flex-col items-center group cursor-pointer"
                          >
                            <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center mb-3">
                              {/* Outer Mandala Decorative SVG Ring */}
                              <svg
                                className="absolute inset-0 w-full h-full text-[#8B5A2B] opacity-85 group-hover:rotate-45 group-hover:scale-105 transition-all duration-700 pointer-events-none"
                                viewBox="0 0 200 200"
                                fill="none"
                                stroke="currentColor"
                              >
                                <circle cx="100" cy="100" r="95" strokeWidth="1.2" strokeDasharray="3 3" />
                                <circle cx="100" cy="100" r="88" strokeWidth="1" />
                                <circle cx="100" cy="100" r="80" strokeWidth="1.5" />
                                {Array.from({ length: 16 }).map((_, i) => {
                                  const angle = (i * 360) / 16;
                                  return (
                                    <g key={i} transform={`rotate(${angle} 100 100)`}>
                                      <path d="M100,5 L104,16 L100,20 L96,16 Z" fill="#8B5A2B" opacity="0.8" />
                                      <circle cx="100" cy="18" r="1.5" fill="#E6C268" />
                                    </g>
                                  );
                                })}
                              </svg>

                              {/* Circular Portrait */}
                              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-[#8B5A2B] shadow-md z-10 transition-transform duration-300 group-hover:scale-105">
                                <img
                                  src={model.img}
                                  alt={model.name}
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                            </div>

                            <span className="text-[10px] sm:text-[11px] font-bold tracking-wider text-[#4A2E12] uppercase text-center group-hover:text-[#641F96] transition-colors">
                              {model.name}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* POPUP SHOP Center Header & Sub-links Bar */}
                      <div className="text-center space-y-3 pt-2">
                        <h4 className="text-[11px] font-extrabold uppercase tracking-[0.35em] text-[#5C3A21] border-t border-[#D9CFC4] pt-4 max-w-xl mx-auto">
                          POPUP SHOP
                        </h4>

                        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs font-serif text-[#4A2E12]">
                          {['Sunita Shetty', 'Palak Bhagvati', 'Jhanvi Chauhan', 'Drashti Ghanva', 'Shivani Pandya', 'Sunitha Sharma'].map((modelName) => (
                            <button
                              key={modelName}
                              onClick={() => {
                                onSelectCategory(modelName.split(' ')[0]);
                                setMegaMenuOpen(null);
                              }}
                              className="hover:text-[#641F96] hover:underline underline-offset-4 transition-colors font-medium cursor-pointer"
                            >
                              {modelName}
                            </button>
                          ))}
                          <button
                            onClick={() => {
                              onSelectCategory('ALL');
                              setMegaMenuOpen(null);
                            }}
                            className="hover:text-[#641F96] font-bold underline underline-offset-4 transition-colors cursor-pointer text-[#641F96]"
                          >
                            View All
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                )}
              </div>

              {/* 3. By Occasion Dropdown */}
              <div 
                className="py-2"
                onMouseEnter={() => handleOpenMenu('occasion')}
                onMouseLeave={handleCloseMenu}
              >
                <button className="hover:text-[#641F96] flex items-center gap-1 transition-colors cursor-pointer py-1 font-semibold">
                  BY OCCASION
                  <ChevronDown className="w-3 h-3 text-[#641F96]" />
                </button>

                {megaMenuOpen === 'occasion' && (
                  <div 
                    onMouseEnter={() => handleOpenMenu('occasion')}
                    onMouseLeave={handleCloseMenu}
                    className="absolute top-full left-0 right-0 w-full bg-[#FAF9F6] border-b-2 border-[#641F96] shadow-2xl p-8 z-50 animate-fadeIn text-xs text-[#1A1A1A]"
                  >
                    <div className="max-w-5xl mx-auto">
                      <h4 className="font-serif text-xs font-bold text-[#641F96] border-b border-[#E5E5E5] pb-2 mb-4 uppercase tracking-wider text-center">
                        SHOP BY OCCASION & CELEBRATION
                      </h4>
                      <div className="grid grid-cols-5 gap-4">
                        {[
                          { name: 'Bridal & Wedding', sub: 'Royal Banarasi & Kanjivaram' },
                          { name: 'Festive & Puja', sub: 'Bandhani, Chanderi & Vibrant Zari' },
                          { name: 'Cocktails & Soirées', sub: 'Organza & Zardozi Handwork' },
                          { name: 'Casual Elegance', sub: 'Tussar Silk & Handblock Prints' },
                          { name: 'Office & Daily', sub: 'Breathable Handspun Linen' }
                        ].map(occ => (
                          <button 
                            key={occ.name}
                            onClick={() => {
                              onSelectCategory(`OCCASION:${occ.name}`);
                              setMegaMenuOpen(null);
                            }}
                            className="p-4 rounded-xl border border-[#E5E5E5] bg-[#F7F5F0] hover:border-[#641F96] hover:bg-white transition-all text-left flex flex-col justify-between group cursor-pointer shadow-xs"
                          >
                            <div>
                              <span className="font-bold text-[#1A1A1A] group-hover:text-[#641F96] block text-xs mb-1">{occ.name}</span>
                              <span className="text-[10px] text-[#888] block">{occ.sub}</span>
                            </div>
                            <span className="text-[#641F96] text-[10px] font-bold uppercase tracking-wider mt-3 block">Explore →</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button 
                onClick={() => onSelectCategory('BESTSELLERS')}
                className="hover:text-[#641F96] transition-colors cursor-pointer font-semibold py-1"
              >
                BESTSELLERS
              </button>

              <button 
                onClick={() => onSelectCategory('WEAVER_STORIES')}
                className="hover:text-[#641F96] transition-colors cursor-pointer font-semibold py-1"
              >
                WEAVER HERITAGE
              </button>
            </div>

          {/* RIGHT ACTION BUTTONS */}
          <div className="flex items-center gap-4">
            {/* Search Trigger */}
            <button 
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-1.5 text-[#1A1A1A] hover:text-[#641F96] transition-colors cursor-pointer relative"
              aria-label="Search Sarees"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Login / Account */}
            <button 
              onClick={onOpenAuth}
              className="p-1.5 text-[#1A1A1A] hover:text-[#641F96] transition-colors cursor-pointer"
              title="Login or View Account"
            >
              <User className="w-5 h-5" />
            </button>

            {/* Wishlist Button */}
            <button 
              onClick={onOpenWishlist}
              className="p-1.5 text-[#1A1A1A] hover:text-[#641F96] transition-colors cursor-pointer relative"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistIds.length > 0 && (
                <span className="absolute -top-1 -right-1.5 bg-[#641F96] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {wishlistIds.length}
                </span>
              )}
            </button>

            {/* Cart Drawer Trigger (Primary Button: #641F96, Hover: #3B0B5C) */}
            <button 
              onClick={onOpenCart}
              className="p-2 bg-[#641F96] text-white hover:bg-[#3B0B5C] transition-all cursor-pointer flex items-center gap-2 rounded-lg shadow-sm relative"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="text-xs font-bold">{totalCartCount}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* 3. Search Bar Overlay Modal */}
      {searchOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-b border-stone-200 shadow-2xl p-4 sm:p-6 z-50 animate-fadeIn">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-stone-400" />
              <input 
                type="text" 
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search Banarasi Silk, Kanjivaram Zari, Organza, Crimson Red, Wedding..."
                className="w-full pl-12 pr-24 py-3 bg-[#FAF8F5] border border-stone-300 rounded-lg text-sm text-stone-900 focus:outline-none focus:border-[#581825] focus:ring-1 focus:ring-[#581825]"
                autoFocus
              />
              <div className="absolute right-3 flex items-center gap-2">
                <button 
                  type="submit"
                  className="px-3 py-1.5 bg-[#581825] text-white text-xs font-medium rounded hover:bg-amber-900 cursor-pointer"
                >
                  Search
                </button>
                <button 
                  type="button" 
                  onClick={() => setSearchOpen(false)}
                  className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </form>

            {/* Search Suggestions or Auto-complete Results */}
            {searchInput.trim() !== '' ? (
              <div className="mt-4 max-h-72 overflow-y-auto divide-y divide-stone-100">
                {searchResults.length > 0 ? (
                  searchResults.map(saree => (
                    <div 
                      key={saree.id}
                      onClick={() => {
                        onSelectSaree(saree);
                        setSearchOpen(false);
                      }}
                      className="py-2.5 flex items-center gap-3 hover:bg-[#FAF8F5] px-2 rounded cursor-pointer transition-colors"
                    >
                      <img 
                        src={saree.primaryImage} 
                        alt={saree.title} 
                        className="w-10 h-12 object-cover rounded"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 min-w-0">
                        <h5 className="text-xs font-semibold text-stone-900 truncate">{saree.title}</h5>
                        <p className="text-[11px] text-stone-500">{saree.craft} • {saree.color}</p>
                      </div>
                      <div className="text-right text-xs font-bold text-[#581825]">
                        {formatPrice(saree.price, selectedCurrency)}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-xs text-stone-500 py-4">No matching sarees found for &quot;{searchInput}&quot;.</p>
                )}
              </div>
            ) : (
              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-stone-500 font-medium">Popular Searches:</span>
                {['Banarasi Silk', 'Bridal Kanjivaram', 'Chanderi Tissue', 'Organza Zardozi', 'Indigoflax Linen'].map(tag => (
                  <button 
                    key={tag}
                    onClick={() => {
                      setSearchInput(tag);
                      onSearchQuery(tag);
                      setSearchOpen(false);
                    }}
                    className="px-2.5 py-1 bg-[#FAF8F5] border border-stone-200 rounded-full text-stone-700 hover:border-[#581825] hover:text-[#581825] cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. Mobile Menu Drawer */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-50 bg-black/50 lg:hidden flex">
          <div className="w-4/5 max-w-xs bg-white h-full shadow-2xl flex flex-col justify-between p-6 animate-slideRight">
            <div>
              <div className="flex items-center justify-between border-b border-stone-200 pb-4 mb-4">
                <button 
                  onClick={() => {
                    onSelectCategory('ALL');
                    setShowMobileMenu(false);
                  }}
                  className="cursor-pointer"
                >
                  <img 
                    src="/prashalogot.png" 
                    alt="PRASHA - da handloom by prasha" 
                    className="h-12 sm:h-14 w-auto object-contain"
                    referrerPolicy="no-referrer"
                  />
                </button>
                <button 
                  onClick={() => setShowMobileMenu(false)}
                  className="p-1 text-stone-500 hover:text-stone-900"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4 text-sm font-medium text-stone-800">
                <button 
                  onClick={() => {
                    onSelectCategory('ALL');
                    setShowMobileMenu(false);
                  }}
                  className="w-full text-left py-2 hover:text-[#581825] cursor-pointer border-b border-stone-100"
                >
                  All Handloom Sarees
                </button>

                <div>
                  <span className="text-xs font-serif font-bold text-amber-900 uppercase block mb-2">Heritage Weaves</span>
                  <div className="pl-2 space-y-2 text-xs text-stone-600">
                    {['Banarasi Silk', 'Kanjivaram Zari', 'Chanderi Silk Cotton', 'Organza Zardozi', 'Linen Handloom'].map(craft => (
                      <button 
                        key={craft}
                        onClick={() => {
                          onSelectCategory(craft);
                          setShowMobileMenu(false);
                        }}
                        className="block text-left w-full hover:text-[#581825] py-1 cursor-pointer"
                      >
                        {craft}
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => {
                    onOpenAiStylist();
                    setShowMobileMenu(false);
                  }}
                  className="w-full py-2.5 px-3 rounded-lg bg-amber-100 text-[#581825] flex items-center justify-between text-xs font-bold"
                >
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    PRASHA AI Silk Stylist
                  </span>
                  <span>→</span>
                </button>

                <button 
                  onClick={() => {
                    onOpenTrackOrder();
                    setShowMobileMenu(false);
                  }}
                  className="w-full text-left py-2 hover:text-[#581825] cursor-pointer"
                >
                  Track Order Status
                </button>
              </div>
            </div>

            <div className="border-t border-stone-200 pt-4 text-xs text-stone-500">
              <p className="font-semibold text-stone-800">Customer Concierge</p>
              <p className="mt-1">Call / WhatsApp: +91 98765 43210</p>
              <p>Email: concierge@prashahandloom.com</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
