import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getTranslations, getMessages } from 'next-intl/server';
import { notFound } from "next/navigation";
import { routing } from '@/i18n/routing';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return {
    metadataBase: new URL('https://www.salamconsultingedu.com'),
    title: t('title'),
    description: t('description'),
    icons: {
      icon: '/logo/salamconsulting-logo-original.svg', // Assuming this can serve as a basic favicon for now
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: 'https://www.salamconsultingedu.com',
      siteName: 'Salam Consulting',
      images: [
        {
          url: '/logo/salamconsulting-logo-original.svg',
          width: 800,
          height: 600,
          alt: 'Salam Consulting Logo',
        },
      ],
      locale: locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      images: ['/logo/salamconsulting-logo-original.svg'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    keywords: ['study abroad', 'education consulting', 'Salam Consulting', 'Tajikistan', 'universities', 'scholarships', 'таҳсил дар хориҷа', 'донишгоҳҳо'],
  };
}

export default async function RootLayout(
  props: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
  }
) {
  const params = await props.params;
  const { locale } = params;

  const isValidLocale = routing.locales.some((cur) => cur === locale);
  if (!isValidLocale) {
    notFound();
  }
  
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-slate-900 font-sans selection:bg-blue-600/30 selection:text-slate-900">
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          <div className="flex-grow">
            {props.children}
          </div>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
