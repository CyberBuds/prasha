import Link from 'next/link';

export default function TermsOfServicesPage() {
  return (
    <main className="min-h-screen bg-[#FAF8F5] px-4 py-12 text-stone-800 sm:px-8">
      <article className="mx-auto max-w-3xl space-y-6 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-10">
        <Link href="/" className="text-xs font-semibold uppercase tracking-widest text-[#641F96]">Back to Prasha</Link>
        <h1 className="font-serif text-3xl font-bold text-[#3B0B5C]">Terms of Services</h1>
        <p className="text-sm leading-7">By using the Prasha storefront, you agree to provide accurate account and delivery information and to use the service lawfully.</p>
        <h2 className="font-serif text-xl font-bold">Orders</h2>
        <p className="text-sm leading-7">Orders are subject to product availability, payment confirmation, and delivery-area serviceability. We may contact you to verify order details.</p>
        <h2 className="font-serif text-xl font-bold">Product Information</h2>
        <p className="text-sm leading-7">Handloom products are individually made, so minor variations in weave, colour, and texture are part of their character.</p>
      </article>
    </main>
  );
}
