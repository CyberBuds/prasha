import Link from 'next/link';

export default function DeliveryPolicyPage() {
  return (
    <main className="min-h-screen bg-[#FAF8F5] px-4 py-12 text-stone-800 sm:px-8">
      <article className="mx-auto max-w-3xl space-y-6 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-10">
        <Link href="/" className="text-xs font-semibold uppercase tracking-widest text-[#641F96]">Back to Prasha</Link>
        <h1 className="font-serif text-3xl font-bold text-[#3B0B5C]">Delivery Policy</h1>
        <p className="text-sm leading-7">Orders are carefully packed and dispatched after payment and address verification. Delivery estimates are shown during checkout and may vary by location.</p>
        <h2 className="font-serif text-xl font-bold">Delivery Updates</h2>
        <p className="text-sm leading-7">Use Track Order Status in the storefront for available order updates. We may contact you by phone or email if a courier needs additional information.</p>
        <h2 className="font-serif text-xl font-bold">Address Changes</h2>
        <p className="text-sm leading-7">Please confirm your saved address before placing an order. Address changes after dispatch may not be possible.</p>
      </article>
    </main>
  );
}
