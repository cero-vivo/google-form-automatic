'use client';

import React, { useState } from "react";
import { 
  Header, 
  HeroSection, 
  FeaturesSection, 
  BlogSection, 
  CTASection, 
  Footer 
} from "@/components/homepage";

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <HeroSection />
      <FeaturesSection />
      <BlogSection />
      <CTASection />
      <Footer />
    </div>
  );
}