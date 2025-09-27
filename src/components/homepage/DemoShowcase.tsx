'use client';

import Image from "next/image";
import { Method } from "./MethodSelector";

interface DemoShowcaseProps {
  currentMethod: Method;
  selectedMethod: 'ai' | 'upload' | 'visual';
}

export const DemoShowcase = ({ currentMethod, selectedMethod }: DemoShowcaseProps) => {
  return (
    <div className="order-1 lg:order-2 relative max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-4xl w-full mx-auto">
      <div className="relative">
        {/* Method Indicator */}
        <div className="absolute -top-4 left-4 z-10">
          <div 
            className="px-3 py-1 rounded-full text-xs font-bold text-white"
            style={{
              backgroundColor: currentMethod.color === 'blue' ? '#3b82f6' : currentMethod.color === 'purple' ? '#a855f7' : '#10b981'
            }}
          >
            {currentMethod.subtitle} Demo
          </div>
        </div>

        {/* Mobile Image - Dynamic based on selection */}
        <Image
          key={`mobile-${selectedMethod}`} // Key para forzar re-render
          src={currentMethod.mobileGif}
          alt={`FastForm ${currentMethod.subtitle} - Demo en móvil`}
          width={400}
          height={300}
          className="block sm:hidden rounded-xl bg-white w-full h-auto transition-all duration-500"
          style={{
            borderWidth: '3px',
            borderStyle: 'solid',
            borderColor: currentMethod.color === 'blue' ? '#3b82f6' : currentMethod.color === 'purple' ? '#a855f7' : '#10b981'
          }}
          priority
          onError={(e) => {
            // Fallback a demoIA si el GIF específico no existe
            e.currentTarget.src = '/images/demoIAMobile.gif';
          }}
        />
        
        {/* Desktop Image - Dynamic based on selection */}
        <Image
          key={`desktop-${selectedMethod}`} // Key para forzar re-render
          src={currentMethod.desktopGif}
          alt={`FastForm ${currentMethod.subtitle} - Demo completo`}
          width={1000}
          height={700}
          className="hidden sm:block rounded-xl sm:rounded-2xl bg-white w-full h-auto transition-all duration-500"
          style={{
            borderWidth: '4px',
            borderStyle: 'solid',
            borderColor: currentMethod.color === 'blue' ? '#3b82f6' : currentMethod.color === 'purple' ? '#a855f7' : '#10b981'
          }}
          priority
          onError={(e) => {
            // Fallback a demoIA si el GIF específico no existe
            e.currentTarget.src = '/images/demoIA.gif';
          }}
        />

        {/* Loading Overlay */}
        <div className="absolute inset-0 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl opacity-0 transition-opacity duration-300 pointer-events-none" />
      </div>
    </div>
  );
};