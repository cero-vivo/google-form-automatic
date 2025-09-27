'use client';

import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import Link from "next/link";

export const CTASection = () => {
  return (
    <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 bg-velocity-light">
      <div className="container mx-auto text-center px-2">
        <h2 className="text-3xl sm:text-4xl md:text-6xl font-black mb-4 sm:mb-6 text-primary px-2">
          ¿Listo para empezar?
        </h2>
        <p className="text-lg sm:text-xl mb-6 sm:mb-8 text-muted-foreground max-w-2xl mx-auto px-2">
          Crea tu primer formulario ahora mismo. Es gratis y toma segundos.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
          <Button size="lg" className="bg-velocity text-white hover:opacity-90 text-base sm:text-lg px-6 sm:px-10 py-3 sm:py-5 font-bold w-full sm:w-auto">
            <Link href="/dashboard" className="flex items-center justify-center">
              <Upload className="mr-2 sm:mr-3 h-5 sm:h-6 w-5 sm:w-6" />
              Comenzar Gratis
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="border-2 border-velocity text-velocity hover:bg-velocity hover:text-white text-base sm:text-lg px-6 sm:px-10 py-3 sm:py-5 font-bold w-full sm:w-auto">
            <Link href="/docs" className="flex items-center justify-center">
              Ver Documentación
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};