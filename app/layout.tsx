import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Prasha — da handloom by prasha | Premium Indian Handlooms & Sarees',
  description: 'Exquisite Banarasi, Kanjivaram, Chanderi, Tussar Silk & Handloom Sarees. Authentic GI certified weaves handcrafted by master weavers across India.',
  keywords: 'Prasha sarees, handloom sarees, Banarasi silk saree, Kanjivaram zari, Chanderi cotton silk, bridal sarees, Indian luxury ethnic fashion',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body suppressHydrationWarning className="bg-[#FAF8F5] text-stone-900 antialiased selection:bg-[#581825] selection:text-amber-100">
        {children}
      </body>
    </html>
  );
}
