import React from 'react';
import StorefrontPageLayout from '@/components/StorefrontPageLayout';

interface StorefrontPageLoadingProps {
  eyebrow: string;
  title: string;
  description: string;
  page: 'account' | 'orders';
}

const shimmer = 'animate-pulse rounded bg-[#E8E0D4]';

export default function StorefrontPageLoading({
  eyebrow,
  title,
  description,
  page
}: StorefrontPageLoadingProps) {
  return (
    <StorefrontPageLayout eyebrow={eyebrow} title={title} description={description}>
      <section className="px-4 py-8 sm:px-6 sm:py-12" aria-busy="true" aria-label="Loading page content">
        <div className={`mx-auto grid w-full max-w-4xl gap-5 ${page === 'account' ? 'md:grid-cols-[1fr_1.2fr]' : ''}`}>
          {page === 'account' ? (
            <>
              <div className="space-y-5 rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className={`${shimmer} h-12 w-12 rounded-full`} />
                  <div className="flex-1 space-y-2">
                    <div className={`${shimmer} h-4 w-2/3`} />
                    <div className={`${shimmer} h-3 w-1/2`} />
                  </div>
                </div>
                <div className={`${shimmer} h-10 w-full`} />
                <div className={`${shimmer} h-10 w-full`} />
                <div className={`${shimmer} h-10 w-full`} />
              </div>
              <div className="space-y-5 rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
                <div className={`${shimmer} h-5 w-1/3`} />
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className={`${shimmer} h-20`} />
                  <div className={`${shimmer} h-20`} />
                  <div className={`${shimmer} h-20 sm:col-span-2`} />
                </div>
                <div className={`${shimmer} h-10 w-1/2`} />
              </div>
            </>
          ) : (
            <div className="space-y-6 rounded-lg border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-center justify-between border-b border-stone-200 pb-5">
                <div className="space-y-2">
                  <div className={`${shimmer} h-3 w-32`} />
                  <div className={`${shimmer} h-6 w-52`} />
                </div>
                <div className={`${shimmer} h-9 w-9 rounded-full`} />
              </div>
              <div className="space-y-3">
                <div className={`${shimmer} h-11 w-full`} />
                <div className={`${shimmer} h-11 w-full`} />
                <div className={`${shimmer} h-11 w-full`} />
              </div>
              <div className={`${shimmer} h-24 w-full`} />
            </div>
          )}
        </div>
        <p className="mx-auto mt-5 max-w-4xl text-center text-xs text-stone-500">Preparing your Prasha page…</p>
      </section>
    </StorefrontPageLayout>
  );
}