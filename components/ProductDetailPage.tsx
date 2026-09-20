'use client';

import React, { useEffect, useState } from 'react';
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  ShieldCheck, 
  Star, 
  Sparkles, 
  Check, 
  Truck, 
  RefreshCw, 
  Scissors, 
  MapPin, 
  ShoppingBag, 
  MessageCircle, 
  ChevronRight,
  ChevronLeft,
  Info,
  Award,
  LoaderCircle
} from 'lucide-react';
import { Saree, BlouseCustomization } from '@/types';
import { formatPrice } from '@/components/Navbar';

interface ProductDetailPageProps {
  saree: Saree;
  selectedCurrency: string;
  isWishlisted: boolean;
  onToggleWishlist: (id: string) => void;
  onAddToCart: (saree: Saree, fallAndPicot: boolean, blouseOptions?: BlouseCustomization) => void;
  isAddingToCart?: boolean;
  onBuyNow: (saree: Saree, fallAndPicot: boolean, blouseOptions?: BlouseCustomization) => void;
  onBack: () => void;
  allSarees: Saree[];
  onSelectSaree: (saree: Saree) => void;
  onOpenAiStylistWithPrompt?: (prompt: string) => void;
}

export default function ProductDetailPage({
  saree,
  selectedCurrency,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  isAddingToCart = false,
  onBuyNow,
  onBack,
  allSarees,
  onSelectSaree,
  onOpenAiStylistWithPrompt
}: ProductDetailPageProps) {
  const galleryImages = [
    saree.primaryImage,
    saree.secondaryImage,
    ...(saree.detailImages || [])
  ];

  const [selectedImage, setSelectedImage] = useState<string>(galleryImages[0]);

  useEffect(() => {
    setSelectedImage(galleryImages[0]);
  }, [saree.id, saree.primaryImage]);

  const currentImgIndex = galleryImages.indexOf(selectedImage);
  const handlePrevImage = () => {
    const validIndex = currentImgIndex >= 0 ? currentImgIndex : 0;
    const prevIndex = (validIndex - 1 + galleryImages.length) % galleryImages.length;
    setSelectedImage(galleryImages[prevIndex]);
  };
  const handleNextImage = () => {
    const validIndex = currentImgIndex >= 0 ? currentImgIndex : 0;
    const nextIndex = (validIndex + 1) % galleryImages.length;
    setSelectedImage(galleryImages[nextIndex]);
  };
  const [fallAndPicot] = useState(false);
  const [blouseType, setBlouseType] = useState<'unstitched' | 'stitched_standard' | 'stitched_custom'>('unstitched');
  const [blouseSize, setBlouseSize] = useState<string>('36');
  const [blouseStyle, setBlouseStyle] = useState<string>('Regal Sweetheart Neck with Zari Sleeve Border');
  const [pincode, setPincode] = useState('');
  const [pincodeChecked, setPincodeChecked] = useState(false);
  const [activeTab, setActiveTab] = useState<'specs' | 'weaver' | 'care' | 'reviews'>('specs');
  const [addedToCartSuccess, setAddedToCartSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [shareMenuOpen, setShareMenuOpen] = useState(false);

  const relatedSarees = allSarees
    .filter(s => s.id !== saree.id && (s.craft === saree.craft || s.fabric === saree.fabric))
    .slice(0, 4);

  const stitchingFee = blouseType === 'stitched_standard' ? 1200 : blouseType === 'stitched_custom' ? 2200 : 0;
  const displayedPrice = saree.price + stitchingFee;

  const handleAddToCart = () => {
    if (isAddingToCart) return;
    const blouseOptions: BlouseCustomization = {
      stitchType: blouseType === 'unstitched' ? 'unstitched' : 'stitched',
      stitchingFee,
      bustSize: blouseType !== 'unstitched' ? parseInt(blouseSize, 10) : undefined,
      neckStyle: 'sweetheart',
      sleeveStyle: 'elbow_length'
    };
    onAddToCart(saree, fallAndPicot, blouseOptions);
    setAddedToCartSuccess(true);
    setTimeout(() => setAddedToCartSuccess(false), 2500);
  };

  const handleBuyNow = () => {
    const blouseOptions: BlouseCustomization = {
      stitchType: blouseType === 'unstitched' ? 'unstitched' : 'stitched',
      bustSize: blouseType !== 'unstitched' ? parseInt(blouseSize, 10) : undefined,
      neckStyle: 'sweetheart',
      sleeveStyle: 'elbow_length'
    };
    onBuyNow(saree, fallAndPicot, blouseOptions);
  };

  const handleShare = () => {
    setShareMenuOpen((open) => !open);
  };

  const copyShareLink = async () => {
    await navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setShareMenuOpen(false);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const shareToWhatsApp = () => {
    const message = encodeURIComponent(`Take a look at ${saree.title}: ${window.location.href}`);
    window.open(`https://wa.me/?text=${message}`, '_blank', 'noopener,noreferrer');
    setShareMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1A1A1A] pt-4 pb-20 animate-fadeIn">
      
      {/* 1. Top Breadcrumb & Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-b border-[#E5E5E5]">
          
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#641F96] hover:text-[#3B0B5C] transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Heritage Collection</span>
          </button>

          <div className="flex items-center gap-2 text-[11px] text-[#777] overflow-x-auto">
            <span>Home</span>
            <ChevronRight className="w-3 h-3 text-stone-400" />
            <span className="capitalize">{saree.craft}</span>
            <ChevronRight className="w-3 h-3 text-stone-400" />
            <span className="text-[#1A1A1A] font-semibold truncate max-w-[200px]">{saree.title}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={handleShare}
                className="p-2 rounded-full bg-[#F7F5F0] border border-[#E5E5E5] text-[#555] hover:text-[#641F96] transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
                title="Share Product"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{copiedLink ? 'Link Copied!' : 'Share'}</span>
              </button>
              {shareMenuOpen && (
                <div className="absolute right-0 top-11 z-20 w-40 rounded-lg border border-stone-200 bg-white p-1.5 shadow-lg">
                  <button onClick={shareToWhatsApp} className="w-full rounded px-3 py-2 text-left text-xs hover:bg-stone-100">Share on WhatsApp</button>
                  <button onClick={copyShareLink} className="w-full rounded px-3 py-2 text-left text-xs hover:bg-stone-100">Copy product link</button>
                </div>
              )}
            </div>

            <button
              onClick={() => onToggleWishlist(saree.id)}
              className={`p-2 rounded-full border transition-all cursor-pointer ${
                isWishlisted
                  ? 'bg-[#641F96] border-[#641F96] text-[#E6C268]'
                  : 'bg-[#F7F5F0] border-[#E5E5E5] text-[#555] hover:text-[#641F96]'
              }`}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#E6C268]' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Product Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* LEFT: Multi-image Gallery Column (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Main Featured Display Image */}
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[#F7F5F0] border border-[#E5E5E5] shadow-md group">
              <img
                src={selectedImage}
                alt={saree.title}
                className="w-full h-full object-cover zoom-image"
                referrerPolicy="no-referrer"
              />

              {/* Left / Right Arrow Navigation Buttons */}
              {galleryImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevImage();
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-[#641F96] text-white flex items-center justify-center backdrop-blur-md transition-all duration-200 opacity-80 hover:opacity-100 hover:scale-110 shadow-lg cursor-pointer"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextImage();
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-[#641F96] text-white flex items-center justify-center backdrop-blur-md transition-all duration-200 opacity-80 hover:opacity-100 hover:scale-110 shadow-lg cursor-pointer"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-[#641F96] text-[#E6C268] border border-[#E6C268]/40 shadow-md">
                  {saree.authenticityCert}
                </span>
                {saree.isBestseller && (
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-[#3B0B5C] text-white shadow-md">
                    Handloom Bestseller
                  </span>
                )}
              </div>

              <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md text-white p-3 rounded-lg border border-white/10 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-4 h-4 text-[#E6C268]" />
                  Verified Pure Silk Mark India Hologram Included
                </span>
                <span className="text-[10px] uppercase text-[#E6C268] font-bold tracking-wider">
                  100% Genuine Handloom
                </span>
              </div>
            </div>

            {/* Thumbnail Selector Row */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
              {galleryImages.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(imgUrl)}
                  className={`relative w-20 h-24 rounded-lg overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                    selectedImage === imgUrl
                      ? 'border-[#641F96] shadow-md scale-105'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </button>
              ))}
            </div>

            {/* Weaver Banner */}
            <div className="p-4 rounded-xl bg-[#F7F5F0] border border-[#641F96]/20 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-[#641F96] text-[#E6C268] flex items-center justify-center font-serif text-lg font-bold shrink-0 shadow-xs">
                {saree.weaverName.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] uppercase font-bold tracking-widest text-[#641F96]">
                  Woven By Master Craftsman
                </p>
                <h4 className="font-serif font-semibold text-sm text-[#1A1A1A]">{saree.weaverName}</h4>
                <p className="text-xs text-stone-600 line-clamp-1">{saree.description}</p>
              </div>
            </div>

          </div>

          {/* RIGHT: Product Details & Purchase Controls (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Header Info */}
            <div className="space-y-2 border-b border-[#E5E5E5] pb-5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-[#641F96] uppercase tracking-[0.25em]">
                  {saree.craft}
                </span>
                <span className="text-stone-300">•</span>
                <span className="text-[10px] font-semibold text-stone-500 uppercase tracking-widest">
                  {saree.fabric}
                </span>
              </div>

              <h1 className="font-serif text-2xl sm:text-3xl font-light italic text-[#1A1A1A] leading-tight">
                {saree.title}
              </h1>

              {/* Rating & Location */}
              <div className="flex items-center gap-4 text-xs pt-1">
                <div className="flex items-center gap-1 text-[#E6C268] bg-[#3B0B5C] px-2.5 py-0.5 rounded-full font-bold">
                  <Star className="w-3.5 h-3.5 fill-[#E6C268]" />
                  <span>{saree.rating} ({saree.reviewsCount} Patron Reviews)</span>
                </div>
                <div className="flex items-center gap-1 text-stone-600">
                  <MapPin className="w-3.5 h-3.5 text-[#641F96]" />
                  <span>Woven in {saree.weaverLocation}</span>
                </div>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="p-4 rounded-xl bg-[#F7F5F0] border border-[#E5E5E5] space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-[#641F96]">
                  {formatPrice(displayedPrice, selectedCurrency)}
                </span>
                {saree.originalPrice > saree.price && (
                  <span className="text-base text-stone-400 line-through">
                    {formatPrice(saree.originalPrice, selectedCurrency)}
                  </span>
                )}
                {saree.discountPercentage > 0 && (
                  <span className="px-2.5 py-1 rounded bg-[#3B0B5C] text-[#E6C268] text-[10px] font-bold uppercase tracking-wider">
                    Save {saree.discountPercentage}%
                  </span>
                )}
              </div>
              <p className="text-[11px] text-stone-500 font-medium">
                Inclusive of all taxes & complimentary insured air shipping across India.
              </p>
            </div>

            {/* Delivery Pincode Checker */}
            <div className="p-3.5 rounded-lg border border-[#E5E5E5] bg-white space-y-2">
              <label className="text-xs uppercase font-bold tracking-wider text-stone-700 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#641F96]" />
                Delivery Availability & Express Transit
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter Pincode (e.g. 110001)"
                  value={pincode}
                  onChange={(e) => {
                    setPincode(e.target.value.replace(/\D/g, '').slice(0, 6));
                    setPincodeChecked(false);
                  }}
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  className="flex-1 px-3 py-2 border border-stone-300 rounded text-xs focus:outline-none focus:border-[#641F96]"
                />
                <button
                  onClick={() => setPincodeChecked(true)}
                  className="px-4 py-2 bg-[#641F96] text-white text-xs font-bold uppercase rounded cursor-pointer hover:bg-[#3B0B5C]"
                >
                  Check
                </button>
              </div>
              {pincodeChecked && (
                <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 pt-1">
                  <Check className="w-3.5 h-3.5" />
                  Express Air Delivery Available to {pincode || 'your pin'} within 3–5 Business Days.
                </p>
              )}
            </div>

            {/* CTA ACTION BUTTONS */}
            <div className="space-y-3 pt-2">
              
              {addedToCartSuccess && (
                <div className="p-3 rounded bg-emerald-800 text-white text-xs font-bold text-center animate-fadeIn flex items-center justify-center gap-2">
                  <Check className="w-4 h-4" /> Added to your Bag Successfully!
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                  className="w-full py-4 bg-[#641F96] hover:bg-[#3B0B5C] text-white text-xs uppercase tracking-[0.2em] font-bold rounded-md shadow-md transition-all disabled:cursor-wait disabled:opacity-70 cursor-pointer flex items-center justify-center gap-2"
                >
                  {isAddingToCart ? <LoaderCircle className="w-4 h-4 animate-spin" /> : <ShoppingBag className="w-4 h-4 text-[#E6C268]" />}
                  <span>{isAddingToCart ? 'Adding...' : 'Add to Bag'}</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  className="w-full py-4 bg-[#E6C268] hover:bg-[#3B0B5C] text-[#3B0B5C] hover:text-[#E6C268] text-xs uppercase tracking-[0.2em] font-bold rounded-md shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Buy Now (Express)</span>
                </button>
              </div>

              {/* AI Stylist Prompt Button */}
              {onOpenAiStylistWithPrompt && (
                <button
                  onClick={() => onOpenAiStylistWithPrompt(`How should I style this ${saree.title} for a wedding reception? What jewelry and blouse colors match best?`)}
                  className="w-full py-3 bg-[#F7F5F0] hover:bg-[#E6C268]/20 border border-[#641F96]/40 text-[#641F96] text-xs uppercase tracking-widest font-semibold rounded-md transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-[#641F96]" />
                  <span>Ask AI Stylist: &quot;How to style this weave?&quot;</span>
                </button>
              )}
            </div>

            {/* TABBED DETAILS (Specs, Weaver, Care, Reviews) */}
            <div className="pt-6 border-t border-[#E5E5E5] space-y-4">
              <div className="flex border-b border-[#E5E5E5]">
                {[
                  { id: 'specs', label: 'Specifications' },
                  { id: 'weaver', label: 'Weaver Story' },
                  { id: 'care', label: 'Silk Care' },
                  { id: 'reviews', label: `Reviews (${saree.reviewsCount})` }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`pb-2 px-3 text-xs uppercase font-bold tracking-wider cursor-pointer border-b-2 transition-all ${
                      activeTab === tab.id
                        ? 'border-[#641F96] text-[#641F96]'
                        : 'border-transparent text-stone-500 hover:text-[#1A1A1A]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* TAB CONTENTS */}
              {activeTab === 'specs' && (
                <div className="space-y-2 text-xs text-stone-700 animate-fadeIn">
                  <div className="grid grid-cols-2 gap-2 p-3 bg-[#F7F5F0] rounded-lg">
                    {saree.attributes?.length ? saree.attributes.map((attribute) => (
                      <div key={attribute.attributeKey}>
                        <span className="font-bold text-stone-900">{attribute.attributeKey}:</span> {attribute.attributeValue}
                      </div>
                    )) : (
                      <p className="col-span-2 text-stone-500">No product specifications available.</p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'weaver' && (
                <div className="space-y-2 text-xs text-stone-700 animate-fadeIn p-3 bg-[#F7F5F0] rounded-lg">
                  <h5 className="font-serif font-bold text-sm text-[#641F96]">{saree.weaverName} ({saree.weaverExperience})</h5>
                  <p className="leading-relaxed">{saree.description}</p>
                </div>
              )}

              {activeTab === 'care' && (
                <div className="space-y-2 text-xs text-stone-700 animate-fadeIn p-3 bg-[#F7F5F0] rounded-lg">
                  <p>• {saree.careInstructions}</p>
                  <p>• Dry Clean Only. Never wash handloom silk in water.</p>
                  <p>• Store folded in pristine cotton/muslin bags provided by Prasha.</p>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-3 text-xs text-stone-700 animate-fadeIn">
                  {saree.reviews && saree.reviews.length > 0 ? (
                    saree.reviews.map(rev => (
                      <div key={rev.id} className="p-3 bg-[#F7F5F0] rounded-lg space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#1A1A1A]">{rev.userName}, {rev.userCity}</span>
                          <span className="text-[#E6C268] font-bold">{'★'.repeat(rev.rating)}</span>
                        </div>
                        <p className="text-stone-600 italic">&quot;{rev.comment}&quot;</p>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 bg-[#F7F5F0] rounded-lg space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#1A1A1A]">Priya M., Mumbai</span>
                        <span className="text-[#E6C268] font-bold">★★★★★</span>
                      </div>
                      <p className="text-stone-600 italic">&quot;Absolute masterpiece. The silk feel and zari sheen are even better in real life than photos!&quot;</p>
                    </div>
                  )}
                </div>
              )}

            </div>

          </div>

        </div>

        {/* 3. RELATED HERITAGE SAREES CAROUSEL */}
        {relatedSarees.length > 0 && (
          <div className="mt-20 border-t border-[#E5E5E5] pt-12 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#641F96] uppercase tracking-[0.25em]">
                  You May Also Admire
                </span>
                <h3 className="font-serif text-2xl italic font-light text-[#1A1A1A]">
                  Related {saree.craft} Weaves
                </h3>
              </div>
              <button
                onClick={onBack}
                className="text-xs font-semibold text-[#641F96] hover:underline cursor-pointer"
              >
                View Full Catalogue →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedSarees.map((relSaree) => (
                <div
                  key={relSaree.id}
                  onClick={() => onSelectSaree(relSaree)}
                  className="group bg-white rounded-lg border border-[#E5E5E5] overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-[#F7F5F0]">
                    <img
                      src={relSaree.primaryImage}
                      alt={relSaree.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="p-3 space-y-1">
                    <span className="text-[9px] uppercase font-bold text-[#641F96]">{relSaree.craft}</span>
                    <h4 className="font-serif text-xs font-medium text-[#1A1A1A] line-clamp-1 group-hover:text-[#641F96] transition-colors">
                      {relSaree.title}
                    </h4>
                    <p className="text-xs font-bold text-[#641F96]">₹{relSaree.price.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
