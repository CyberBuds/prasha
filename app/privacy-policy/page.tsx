import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#FAF8F5] px-4 py-12 text-stone-800 sm:px-8">
      <article className="mx-auto max-w-3xl space-y-6 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-10">
        <Link href="/" className="text-xs font-semibold uppercase tracking-widest text-[#641F96]">Back to Prasha</Link>
        <h1 className="font-serif text-3xl font-bold text-[#3B0B5C]">Privacy Policy</h1>
        <p className="text-sm leading-7">Prasha collects only the information needed to process orders, provide customer support, manage accounts, and improve the shopping experience.</p>
        <h2 className="font-serif text-xl font-bold">Information We Use</h2>
        <p className="text-sm leading-7">This may include your name, contact details, delivery address, order history, and messages you send to our support team.</p>
        <h2 className="font-serif text-xl font-bold">Your Choices</h2>
        <p className="text-sm leading-7">You may request access to, correction of, or deletion of your account information by contacting concierge@prashahandloom.com.</p>
      </article>
    </main>
  );
}
