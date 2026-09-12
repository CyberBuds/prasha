'use client';

import React, { useState } from 'react';
import { 
  X, 
  Heart, 
  ShieldCheck, 
  Award, 
  Truck, 
  Scissors, 
  Star, 
  Check, 
  ChevronRight,
  ChevronLeft,
  Info
} from 'lucide-react';
import { Saree, BlouseCustomization } from '@/types';
import { formatPrice } from './Navbar';

interface QuickViewModalProps {
  saree: Saree | null;
  isOpen: boolean;
  onClose: () => void;
  selectedCurrency: string;
  isWishlisted: boolean;
  onToggleWishlist: (sareeId: string) => void;
  onAddToCart: (saree: Saree, fallAndPicot: boolean, blouseOptions: BlouseCustomization) => void;
  onBuyNow: (saree: Saree, fallAndPicot: boolean, blouseOptions: BlouseCustomization) => void;
}

export default function QuickViewModal({
  saree,
  isOpen,
  onClose,
  selectedCurrency,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onBuyNow
}: QuickViewModalProps) {
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [fallAndPicot, setFallAndPicot] = useState<boolean>(true);
  const [blouseType, setBlouseType] = useState<'unstitched' | 'stitched'>('unstitched');
  const [bustSize, setBustSize] = useState<number>(36);
  const [pincode, setPincode] = useState<string>('');
  const [pincodeStatus, setPincodeStatus] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'weaver' | 'reviews'>('details');

  if (!isOpen || !saree) return null;

  const images = [saree.primaryImage, saree.secondaryImage, ...(saree.detailImages || [])].filter(Boolean);
  const currentImage = selectedImage || saree.primaryImage;
  const currentImgIndex = images.indexOf(currentImage);

  const handlePrevImage = () => {
    const validIdx = currentImgIndex >= 0 ? currentImgIndex : 0;
    const prevIdx = (validIdx - 1 + images.length) % images.length;
    setSelectedImage(images[prevIdx]);
  };

  const handleNextImage = () => {
    const validIdx = currentImgIndex >= 0 ? currentImgIndex : 0;
    const nextIdx = (validIdx + 1) % images.length;
    setSelectedImage(images[nextIdx]);
  };
  const blousePrice = blouseType === 'stitched' ? 1200 : 0;
  const fallPrice = fallAndPicot ? 250 : 0;
  const totalPrice = saree.price + blousePrice + fallPrice;

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.trim().length === 6) {
      setPincodeStatus(`Eligible for Free Express Delivery by Thursday, ${new Date(Date.now() + 4 * 86400000).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}.`);
    } else {
      setPincodeStatus('Please enter a valid 6-digit Indian Pincode.');
    }
  };

  const getBlouseConfig = (): BlouseCustomization => ({
    stitchType: blouseType,
    bustSize: blouseType === 'stitched' ? bustSize : undefined,
    neckStyle: 'classic_u',
    sleeveStyle: 'elbow_length',
    isPadded: true
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[92vh] my-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-30 p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* LEFT COLUMN: IMAGE GALLERY */}
        <div className="w-full md:w-1/2 bg-[#FAF8F5] p-4 sm:p-6 flex flex-col justify-between border-r border-stone-200 overflow-y-auto">
          <div className="space-y-4">
            {/* Main Image Stage */}
            <div className="relative aspect-[3/4] w-full bg-white rounded-xl overflow-hidden shadow-inner border border-stone-200/80">
              <img
                src={currentImage}
                alt={saree.title}
                className="w-full h-full object-cover object-center transition-all duration-500"
                referrerPolicy="no-referrer"
              />

              {/* Left / Right Arrow Navigation Buttons */}
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevImage();
                    }}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/40 hover:bg-[#641F96] text-white flex items-center justify-center backdrop-blur-md transition-all duration-200 opacity-80 hover:opacity-100 hover:scale-110 shadow-md cursor-pointer"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextImage();
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/40 hover:bg-[#641F96] text-white flex items-center justify-center backdrop-blur-md transition-all duration-200 opacity-80 hover:opacity-100 hover:scale-110 shadow-md cursor-pointer"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
                <span className="px-2.5 py-1 rounded bg-[#581825] text-amber-100 text-[10px] font-bold uppercase tracking-wider shadow-sm">
                  {saree.craft}
                </span>
                <span className="px-2.5 py-1 rounded bg-amber-900/80 text-amber-200 text-[10px] font-medium backdrop-blur-md">
                  {saree.authenticityCert}
                </span>
              </div>

              {/* Wishlist Toggle */}
              <button
                onClick={() => onToggleWishlist(saree.id)}
                className={`absolute top-3 right-3 p-2.5 rounded-full shadow-md backdrop-blur-md transition-all z-10 cursor-pointer ${
                  isWishlisted ? 'bg-[#581825] text-amber-300' : 'bg-white/80 text-stone-700 hover:bg-white'
                }`}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-amber-300' : ''}`} />
              </button>
            </div>

            {/* Thumbnail Strip */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {saree.detailImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-16 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all cursor-pointer ${
                    currentImage === img ? 'border-[#581825] scale-105 shadow-sm' : 'border-stone-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Weaver Spotlight Footer */}
          <div className="mt-4 p-3 bg-white rounded-xl border border-amber-200/80 flex items-center gap-3">
            <div className="p-2 rounded-full bg-amber-100 text-[#581825]">
              <Award className="w-4 h-4" />
            </div>
            <div className="text-xs">
              <p className="font-bold text-stone-900">{saree.weaverName}</p>
              <p className="text-stone-500 text-[11px]">{saree.weaverLocation} • {saree.weaverExperience}</p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: PRODUCT SPECIFICATIONS & CUSTOMIZATION */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 overflow-y-auto flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 uppercase tracking-widest mb-1">
                <span>da handloom by prasha</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-amber-600">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {saree.rating} ({saree.reviewsCount} reviews)
                </span>
              </div>

              <h1 className="font-serif text-2xl font-bold text-stone-900 leading-snug">
                {saree.title}
              </h1>

              <p className="text-xs text-stone-500 mt-1">
                {saree.subtitle}
              </p>
            </div>

            {/* Price Box */}
            <div className="p-3 bg-[#FAF8F5] rounded-xl border border-stone-200 flex items-baseline justify-between">
              <div>
                <span className="text-2xl font-bold text-[#581825]">
                  {formatPrice(totalPrice, selectedCurrency)}
                </span>
                {saree.originalPrice > saree.price && (
                  <span className="ml-2 text-sm text-stone-400 line-through">
                    {formatPrice(saree.originalPrice, selectedCurrency)}
                  </span>
                )}
                <p className="text-[10px] text-stone-500 mt-0.5">
                  Includes all taxes & duty • Or 3 interest-free payments of {formatPrice(Math.round(totalPrice / 3), selectedCurrency)}
                </p>
              </div>

              {saree.discountPercentage > 0 && (
                <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded">
                  {saree.discountPercentage}% OFF
                </span>
              )}
            </div>

            {/* Tabs for Information */}
            <div className="border-b border-stone-200 flex gap-4 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('details')}
                className={`pb-2 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'details' ? 'border-[#581825] text-[#581825]' : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                Saree Details & Customization
              </button>
              <button
                onClick={() => setActiveTab('weaver')}
                className={`pb-2 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'weaver' ? 'border-[#581825] text-[#581825]' : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                Weaver Story
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`pb-2 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'reviews' ? 'border-[#581825] text-[#581825]' : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                Customer Reviews ({saree.reviews.length})
              </button>
            </div>

            {/* TAB CONTENT: DETAILS & CUSTOMIZATION */}
            {activeTab === 'details' && (
              <div className="space-y-4 text-xs">
                {/* Fall & Picot Add-on */}
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Scissors className="w-4 h-4 text-amber-800" />
                    <div>
                      <p className="font-semibold text-stone-900">Fall & Picot Finishing (+₹250)</p>
                      <p className="text-[10px] text-stone-500">Includes cotton fall stitch & border edge picot</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={fallAndPicot}
                    onChange={(e) => setFallAndPicot(e.target.checked)}
                    className="accent-[#581825] w-4 h-4 cursor-pointer"
                  />
                </div>

                {/* Custom Blouse Options */}
                <div className="space-y-2">
                  <span className="font-bold text-stone-900 block">Blouse Customization Service</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setBlouseType('unstitched')}
                      className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                        blouseType === 'unstitched'
                          ? 'border-[#581825] bg-amber-50 text-[#581825] font-semibold'
                          : 'border-stone-200 bg-white text-stone-700'
                      }`}
                    >
                      <p className="font-medium">Unstitched Fabric</p>
                      <p className="text-[10px] text-stone-500">Included (80cm fabric)</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setBlouseType('stitched')}
                      className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                        blouseType === 'stitched'
                          ? 'border-[#581825] bg-amber-50 text-[#581825] font-semibold'
                          : 'border-stone-200 bg-white text-stone-700'
                      }`}
                    >
                      <p className="font-medium">Custom Tailored (+₹1,200)</p>
                      <p className="text-[10px] text-stone-500">Padded, lined & stitched</p>
                    </button>
                  </div>

                  {blouseType === 'stitched' && (
                    <div className="p-3 bg-amber-50/60 rounded-lg border border-amber-200 space-y-2 mt-2">
                      <label className="font-medium text-stone-800 block">Select Bust Size (Inches):</label>
                      <div className="flex flex-wrap gap-1.5">
                        {[32, 34, 36, 38, 40, 42, 44].map((sz) => (
                          <button
                            key={sz}
                            type="button"
                            onClick={() => setBustSize(sz)}
                            className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer border ${
                              bustSize === sz ? 'bg-[#581825] text-amber-100 border-[#581825]' : 'bg-white text-stone-700 border-stone-300'
                            }`}
                          >
                            {sz}&quot;
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Delivery Checker */}
                <form onSubmit={handleCheckPincode} className="pt-2 border-t border-stone-100 space-y-1.5">
                  <label className="font-semibold text-stone-900 flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-amber-800" />
                    Check Estimated Delivery
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="Enter 6-digit Pincode (e.g. 110001)"
                      maxLength={6}
                      className="flex-1 px-3 py-1.5 bg-[#FAF8F5] border border-stone-300 rounded text-xs focus:outline-none focus:border-[#581825]"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-stone-900 text-white font-medium rounded hover:bg-[#581825] cursor-pointer"
                    >
                      Check
                    </button>
                  </div>
                  {pincodeStatus && (
                    <p className="text-[11px] text-amber-900 font-medium">{pincodeStatus}</p>
                  )}
                </form>

                {/* Technical Specs List */}
                <div className="pt-2 border-t border-stone-100 grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] text-stone-600">
                  <p><strong className="text-stone-900">Length:</strong> {saree.length}</p>
                  <p><strong className="text-stone-900">Weight:</strong> {saree.weight}</p>
                  <p><strong className="text-stone-900">Fabric:</strong> {saree.fabric}</p>
                  <p><strong className="text-stone-900">Care:</strong> {saree.careInstructions}</p>
                </div>
              </div>
            )}

            {/* TAB CONTENT: WEAVER */}
            {activeTab === 'weaver' && (
              <div className="space-y-3 text-xs text-stone-700 leading-relaxed">
                <p className="italic text-amber-900 font-serif text-sm">
                  &quot;{saree.description}&quot;
                </p>
                <div className="p-3 bg-[#FAF8F5] rounded-xl border border-stone-200">
                  <h5 className="font-bold text-stone-900 text-xs">Handloom GI Guarantee</h5>
                  <p className="text-[11px] text-stone-600 mt-1">
                    This weave is certified by the Silk Mark Organisation of India. Every saree includes an official holographic seal and unique QR code verifying origin and pure mulberry silk warp count.
                  </p>
                </div>
              </div>
            )}

            {/* TAB CONTENT: REVIEWS */}
            {activeTab === 'reviews' && (
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {saree.reviews.length > 0 ? (
                  saree.reviews.map((rev) => (
                    <div key={rev.id} className="p-3 bg-[#FAF8F5] rounded-lg border border-stone-200 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-stone-900">{rev.userName} ({rev.userCity})</span>
                        <span className="text-amber-600 flex items-center gap-0.5">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          {rev.rating}.0
                        </span>
                      </div>
                      <p className="text-stone-600 text-[11px]">&quot;{rev.comment}&quot;</p>
                      <p className="text-[10px] text-stone-400">{rev.date} • Verified Buyer</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-stone-500 italic">No reviews yet for this limited loom edition.</p>
                )}
              </div>
            )}
          </div>

          {/* Bottom Action Bar */}
          <div className="pt-4 border-t border-stone-200 flex items-center gap-3">
            <button
              onClick={() => {
                onAddToCart(saree, fallAndPicot, getBlouseConfig());
                onClose();
              }}
              className="flex-1 py-3 rounded-xl bg-stone-900 hover:bg-[#581825] text-amber-100 text-xs font-bold tracking-wide transition-colors cursor-pointer shadow-md"
            >
              Add to Cart ({formatPrice(totalPrice, selectedCurrency)})
            </button>

            <button
              onClick={() => {
                onBuyNow(saree, fallAndPicot, getBlouseConfig());
                onClose();
              }}
              className="flex-1 py-3 rounded-xl bg-[#581825] hover:bg-[#722031] text-amber-100 text-xs font-bold tracking-wide transition-colors cursor-pointer shadow-md border border-amber-500/30"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
