import type { Metadata } from 'next';
import { Familjen_Grotesk, Source_Serif_4 } from 'next/font/google';
import "flag-icons/css/flag-icons.min.css";
import '@/styles/globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Analytics } from "@vercel/analytics/react";
import { DEFAULT_TITLE, PERSON_NAME, SITE_DESCRIPTION, SITE_NAME, SITE_URL, SOCIAL_PROFILES } from '@/lib/site';

const familjenGrotesk = Familjen_Grotesk({
  subsets: ['latin'],
  variable: '--font-familjen-grotesk',
  display: 'swap',
});

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-source-serif',
  style: ['normal', 'italic'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: `${PERSON_NAME} | %s`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: PERSON_NAME, url: '/sobre' }],
  creator: PERSON_NAME,
  publisher: PERSON_NAME,
  keywords: [
    'Enzo Thome',
    'El Trovador Errante',
    'blog personal',
    'viajes',
    'historia',
    'libros',
    'cultura',
    'Mediterráneo',
    'Uruguay',
  ],
  alternates: { canonical: '/' },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png', sizes: '32x32' },
    ],
    shortcut: '/favicon.ico',
    apple: [{ url: '/apple-icon.png', type: 'image/png', sizes: '180x180' }],
  },
  manifest: '/manifest.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'es_UY',
    url: '/',
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: '/images/Villefranche-sur-mer/vsco_073026%20(3).jpg',
        width: 1535,
        height: 2048,
        alt: `${SITE_NAME} por ${PERSON_NAME}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: DEFAULT_TITLE,
    description: SITE_DESCRIPTION,
    images: ['/images/Villefranche-sur-mer/vsco_073026%20(3).jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
};

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': `${SITE_URL}/#person`,
      name: PERSON_NAME,
      alternateName: SITE_NAME,
      url: SITE_URL,
      image: `${SITE_URL}/brand/logotransp.png`,
      sameAs: SOCIAL_PROFILES,
      knowsAbout: ['Historia', 'Viajes', 'Literatura', 'Cultura', 'Tecnología'],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      alternateName: PERSON_NAME,
      description: SITE_DESCRIPTION,
      inLanguage: 'es-UY',
      publisher: { '@id': `${SITE_URL}/#person` },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es-UY" className={`${familjenGrotesk.variable} ${sourceSerif.variable}`}>
      <body className="flex min-h-screen flex-col bg-white text-ink font-body">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }}
        />
        <a href="#contenido" className="skip-link">Saltar al contenido</a>
        <Navbar />
        <main id="contenido" className="flex-grow pt-[62px]">
          {children}
        </main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
