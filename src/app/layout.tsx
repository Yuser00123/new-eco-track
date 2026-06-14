import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'EcoTrack — Carbon Footprint Awareness Platform',
  description:
    'Track, understand, and reduce your carbon footprint with AI-powered personalized insights and gamified eco-actions.',
  keywords: ['carbon footprint', 'sustainability', 'eco', 'climate', 'environment', 'CO2'],
  authors: [{ name: 'EcoTrack Team' }],
  openGraph: {
    title: 'EcoTrack — Carbon Footprint Awareness Platform',
    description: 'AI-powered carbon tracking and sustainability coaching',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0F1923',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
