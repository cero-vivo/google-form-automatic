'use client';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export const BlogSection = () => {
  return (
    <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 bg-light-gray">
      <div className="container mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <Badge className="mb-3 sm:mb-4 bg-velocity/10 text-velocity border-velocity/30 px-3 sm:px-4 py-1.5 sm:py-2 font-semibold text-sm sm:text-base">
            Recursos y Guías
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-3 sm:mb-4 text-primary px-2">
            Aprende a crear formularios como un experto
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
            Descubre los mejores métodos y consejos para crear formularios profesionales en minutos
          </p>
        </div>

        <div className="max-w-4xl mx-auto px-2">
          <Card className="border border-gray-200 hover:shadow-lg transition-shadow duration-300 overflow-hidden">
            <div className="md:flex flex-col md:flex-row">
              <div className="md:w-2/5 bg-gradient-to-br from-blue-500 to-purple-600 p-6 sm:p-8 flex items-center justify-center">
                <div className="text-center text-white">
                  <Sparkles className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-3 sm:mb-4" />
                  <h3 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">Guía Completa</h3>
                  <p className="text-blue-100 text-sm sm:text-base">3 métodos probados</p>
                </div>
              </div>
              <div className="md:w-3/5 p-6 sm:p-8">
                <h3 className="text-xl sm:text-2xl font-bold text-primary mb-2 sm:mb-3">
                  Los 3 métodos definitivos para crear <span className="text-[#673ab7]">Google Forms</span> en {new Date().getFullYear()}
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">
                  Descubre cómo FastForm revoluciona la creación de formularios con conversión CSV/Excel,
                  IA conversacional y builder manual avanzado. Guía práctica para todos los niveles.
                </p>
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                  <Badge variant="secondary" className="text-xs sm:text-sm">CSV/Excel</Badge>
                  <Badge variant="secondary" className="text-xs sm:text-sm">IA</Badge>
                  <Badge variant="secondary" className="text-xs sm:text-sm">Constructor Manual</Badge>
                </div>
                <Button asChild className="w-full sm:w-auto">
                  <Link href="/blog/3-metodos-crear-google-forms" className="flex items-center justify-center">
                    Leer artículo completo
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};