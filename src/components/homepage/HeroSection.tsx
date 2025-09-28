'use client';

import { Badge } from "@/components/ui/badge";
import { FileSpreadsheet, FormInput, Sparkles } from "lucide-react";
import { useState } from "react";
import { MethodSelector, Method } from "./MethodSelector";
import { DemoShowcase } from "./DemoShowcase";

export const HeroSection = () => {
  const [selectedMethod, setSelectedMethod] = useState<'ai' | 'upload' | 'visual'>('ai');

  // Configuración de métodos con sus GIFs correspondientes
  const methods: Record<'ai' | 'upload' | 'visual', Method> = {
    ai: {
      id: 'ai',
      title: '',
      subtitle: 'Inteligencia Artificial',
      description: 'Crea formularios con IA conversacional',
      desktopGif: '/images/demoIA.gif',
      mobileGif: '/images/demoIAMobile.gif',
      icon: Sparkles,
      color: 'blue',
      symbol: 'CHAT AI'
    },
    upload: {
      id: 'upload', 
      title: '',
      subtitle: 'Importar Archivos',
      description: 'Sube CSV/Excel y convierte a formulario',
      desktopGif: '/images/demoCSV.gif',
      mobileGif: '/images/demoCSVMobile.gif',
      icon: FileSpreadsheet,
      color: 'green',
      symbol: 'Excel'
    },
    visual: {
      id: 'visual',
      title: '', 
      subtitle: 'Constructor Manual',
      description: 'Crea desde cero o trabaja facilmente sobre tus borradores',
      desktopGif: '/images/demoManual.gif',
      mobileGif: '/images/demoManualMobile.gif',
      icon: FormInput,
      color: 'purple',
      symbol: 'Manual'
    }
  };

  const currentMethod = methods[selectedMethod];

  return (
    <section className="relative py-8 sm:py-12 md:py-16 px-4 sm:px-6 bg-light-gray overflow-hidden">
      <div className="container mx-auto grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Left: Copy + CTAs + Social Proof */}
        <div className="order-1 lg:order-1">
          <Badge className="mb-4 sm:mb-6 bg-velocity/10 text-velocity border-velocity/30 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold">
            FastForm - Crea Google Forms en segundos
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 sm:mb-6 leading-tight text-primary">
            La forma más rápida de crear <span className="text-[#673ab7]">Google Forms</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-xl leading-relaxed">
            FastForm es la plataforma todo-en-uno para crear formularios profesionales. Con IA avanzada, constructor visual, plantillas premium y automatización completa. La herramienta definitiva para formularios inteligentes.
          </p>
          
          <MethodSelector 
            methods={methods}
            selectedMethod={selectedMethod}
            setSelectedMethod={setSelectedMethod}
            currentMethod={currentMethod}
          />
        </div>

        <DemoShowcase 
          currentMethod={currentMethod}
          selectedMethod={selectedMethod}
        />
      </div>
    </section>
  );
};

