import Link from 'next/link';

export default function ReturnRefundPolicyPage() {
  return (
    <main className="min-h-screen bg-[#FAF8F5] px-4 py-12 text-stone-800 sm:px-8">
      <article className="mx-auto max-w-3xl space-y-6 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-10">
        <Link href="/" className="text-xs font-semibold uppercase tracking-widest text-[#641F96]">Back to Prasha</Link>
        <h1 className="font-serif text-3xl font-bold text-[#3B0B5C]">Return &amp; Refund Policy</h1>
        <p className="text-sm leading-7">Eligible handloom purchases may be requested for return within 7 days of delivery. Items must be unused, unwashed, and returned with their original packaging and tags.</p>
        <h2 className="font-serif text-xl font-bold">Refunds</h2>
        <p className="text-sm leading-7">After inspection and approval, refunds are issued to the original payment method. Customised or altered items may not be eligible for return.</p>
        <h2 className="font-serif text-xl font-bold">Request Help</h2>
        <p className="text-sm leading-7">Contact concierge@prashahandloom.com with your order number and return reason to begin a request.</p>
      </article>
    </main>
  );
}
