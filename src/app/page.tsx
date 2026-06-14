'use client';

import { useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { CTASection } from '@/components/landing/CTASection';
import { useEcoStore } from '@/store/ecoStore';

function Footer() {
  return (
    <footer className="border-t border-white/10 py-10 px-4 text-center">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#1A4D2E] to-[#4F8A8B] flex items-center justify-center">
            🌿
          </div>
          <span className="font-bold text-white text-lg">
            Eco<span className="text-[#4F8A8B]">Track</span>
          </span>
        </div>
        <p className="text-white/40 text-sm max-w-md mx-auto mb-4">
          Empowering individuals to understand, track, and reduce their carbon footprint
          through AI-powered insights and gamified action.
        </p>
        <div className="flex justify-center gap-6 text-sm text-white/40">
          <span>🌱 Carbon Neutral Platform</span>
          <span>🔒 Privacy First</span>
          <span>⚡ Offline Ready</span>
        </div>
        <p className="text-white/20 text-xs mt-6">
          © 2025 EcoTrack · Built for a sustainable future
        </p>
      </div>
    </footer>
  );
}

export default function HomePage() {
  const { initializeStore } = useEcoStore();

  useEffect(() => {
    initializeStore();
  }, [initializeStore]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <CTASection />
      <Footer />
    </div>
  );
}
