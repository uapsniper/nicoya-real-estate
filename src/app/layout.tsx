import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Nicoya Coast Real Estate - Paradise Properties in Costa Rica",
    template: "%s | Nicoya Coast Real Estate"
  },
  description: "Discover luxury real estate in Costa Rica's Peninsula de Nicoya. Beachfront homes, oceanview lots, and investment properties in Cabuya, Montezuma, and Mal País.",
  keywords: ["Costa Rica real estate", "Peninsula de Nicoya", "Cabuya properties", "Montezuma homes", "Mal País real estate", "beachfront properties", "Costa Rica investment"],
  authors: [{ name: "Nicoya Coast Real Estate" }],
  creator: "Nicoya Coast Real Estate",
  publisher: "Nicoya Coast Real Estate",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Nicoya Coast Real Estate - Paradise Properties in Costa Rica",
    description: "Discover luxury real estate in Costa Rica's Peninsula de Nicoya. Beachfront homes, oceanview lots, and investment properties.",
    url: '/',
    siteName: 'Nicoya Coast Real Estate',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Nicoya Coast Real Estate - Costa Rica Properties',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Nicoya Coast Real Estate - Paradise Properties in Costa Rica",
    description: "Discover luxury real estate in Costa Rica's Peninsula de Nicoya.",
    images: ['/images/og-image.jpg'],
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen bg-gray-50 flex flex-col">
        <Navigation />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
