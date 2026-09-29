'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface StorefrontPageLayoutProps {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}

export default function StorefrontPageLayout({
  eyebrow,
  title,
  description,
  children
}: StorefrontPageLayoutProps) {
  const router = useRouter();
  const goHome = () => router.push('/');

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <Navbar
        cartItems={[]}
        wishlistIds={[]}
        onOpenCart={goHome}
        onOpenWishlist={() => router.push('/account')}
        onOpenAiStylist={goHome}
        onOpenTrackOrder={() => router.push('/orders')}
        onOpenAuth={() => router.push('/account')}
        onSelectCategory={goHome}
        onSearchQuery={goHome}
        selectedCurrency="INR"
        onChangeCurrency={() => undefined}
        allSarees={[]}
        onSelectSaree={goHome}
      />
      <main className="flex-1">
        <section className="border-b border-[#E8E1D8] bg-[linear-gradient(110deg,#F5F0E8_0%,#FAF8F5_58%,#F0E9DD_100%)]">
          <div className="mx-auto max-w-7xl px-4 py-9 sm:px-6 sm:py-12 lg:px-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#8A6630]">{eyebrow}</p>
            <h1 className="mt-2 max-w-3xl font-serif text-3xl font-semibold leading-tight text-[#3B0B5C] sm:text-4xl">
              {title}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">{description}</p>
            <div className="mt-6 h-px max-w-24 bg-[#C9A85D]" />
          </div>
        </section>
        {children}
      </main>
      <Footer
        onSelectCategory={goHome}
        onOpenTrackOrder={() => router.push('/orders')}
        onOpenAiStylist={goHome}
      />
    </div>
  );
}