'use client';

import { Logo } from "@/components/ui/logo";

export const Footer = () => {
  return (
    <footer className="py-12 sm:py-16 px-4 sm:px-6 bg-primary/5 border-t border-primary/10">
      <div className="container mx-auto text-center px-2">
        <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-6 sm:mb-8">
          <Logo className="w-10 h-10 sm:w-12 sm:h-12" />
          <span className="text-2xl sm:text-3xl font-black text-velocity">FastForm</span>
        </div>

        <p className="text-muted-foreground mb-6 sm:mb-8 text-sm sm:text-lg max-w-2xl mx-auto px-2">
          La forma más inteligente y rápida de crear formularios profesionales con <span className="text-[#673ab7]">Google Forms</span>.
        </p>

        <div className="pt-6 sm:pt-8 border-t border-primary/10 text-muted-foreground">
          <p className="font-medium text-sm sm:text-base">© {new Date().getFullYear()} FastForm.</p>
        </div>
      </div>
    </footer>
  );
};