'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, CheckCircle, FileSpreadsheet, FormInput, Sparkles, Upload } from "lucide-react";

type MethodTheme = 'ai' | 'upload' | 'manual';

type MethodCard = {
  id: 'upload' | 'manual' | 'ai';
  order: string;
  symbol: string;
  tagline: string;
  title: string;
  description: string;
  insight: string;
  href: string;
  ctaLabel: string;
  icon: LucideIcon;
  ctaIcon: LucideIcon;
  theme: MethodTheme;
};

const methodThemes: Record<MethodTheme, {
  iconBg: string;
  iconColor: string;
  tagColor: string;
  borderHover: string;
  bulletColor: string;
  insightBorder: string;
  insightText: string;
  button: string;
}> = {
  ai: {
    iconBg: 'bg-velocity-50',
    iconColor: 'text-velocity-600',
    tagColor: 'text-velocity-600',
    borderHover: 'hover:border-velocity-300',
    bulletColor: 'text-velocity-500',
    insightBorder: 'border-velocity-200 text-velocity-700',
    insightText: 'text-velocity-600',
    button: 'border-velocity-200 text-velocity-600 hover:bg-velocity-600 hover:text-white',
  },
  upload: {
    iconBg: 'bg-excel/10',
    iconColor: 'text-excel',
    tagColor: 'text-excel',
    borderHover: 'hover:border-excel/40',
    bulletColor: 'text-excel',
    insightBorder: 'border-excel/30 text-excel',
    insightText: 'text-excel/90',
    button: 'border-excel/40 text-excel hover:bg-excel hover:text-white',
  },
  manual: {
    iconBg: 'bg-forms/10',
    iconColor: 'text-forms',
    tagColor: 'text-forms',
    borderHover: 'hover:border-forms/40',
    bulletColor: 'text-forms',
    insightBorder: 'border-forms/30 text-forms',
    insightText: 'text-forms/90',
    button: 'border-forms/40 text-forms hover:bg-forms hover:text-white',
  },
};

const methodCards: MethodCard[] = [
  {
    id: 'ai',
    order: '01',
    symbol: 'CHAT IA',
    tagline: 'Asistente inteligente',
    title: 'Describe tu idea y deja que la IA la produzca',
    description: 'Conversaciones naturales que generan formularios completos con secciones, lógica condicional y validaciones en cuestión de segundos.',
    insight: 'Perfecto para lanzar campañas rápidas o validar nuevas encuestas sin bloquear al equipo técnico.',
    href: '/create/ai',
    ctaLabel: 'Probar asistente IA',
    icon: Sparkles,
    ctaIcon: Sparkles,
    theme: 'ai',
  },
  {
    id: 'upload',
    order: '02',
    symbol: 'Excel',
    tagline: 'Importar archivos',
    title: 'Conecta tu CSV/Excel y obtén un formulario espejo',
    description: 'Crea tu archivo excel o CSV con todas las preguntas, opciones, lógica, y súbelo para generar un formulario en segundos.',
    insight: 'Ideal cuando tus equipos trabajan con bases vivas y necesitan formularios consistentes en minutos.',
    href: '/create/file',
    ctaLabel: 'Probar importación',
    icon: FileSpreadsheet,
    ctaIcon: Upload,
    theme: 'upload',
  },
  {
    id: 'manual',
    order: '03',
    symbol: 'Manual',
    tagline: 'Constructor manual',
    title: 'Diseña cada detalle con componentes FastForm',
    description: 'Editor manual con componentes avanzados para crear o editar formularios.',
    insight: 'Cuando necesitas personalización total y control visual para experiencias únicas.',
    href: '/create/manual',
    ctaLabel: 'Abrir constructor',
    icon: FormInput,
    ctaIcon: FormInput,
    theme: 'manual',
  },
];

export const FeaturesSection = () => {
  return (
    <section id="features" className="bg-white px-6 py-24">
      <div className="container mx-auto">
        <div className="mb-12 text-center">
          <Badge className="mb-4 border border-excel/30 bg-excel/10 px-4 py-2 font-semibold text-excel">
            Tres caminos, un mismo resultado
          </Badge>
          <h2 className="mb-4 text-4xl font-black text-primary md:text-5xl">
            Selecciona tu flujo y lanza en minutos
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Conversación inteligente, importación automática o control total: tú decides cómo crear formularios que realmente funcionen.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {methodCards.map((method) => {
            const theme = methodThemes[method.theme];
            const Icon = method.icon;
            const CtaIcon = method.ctaIcon;

            return (
              <Card
                key={method.id}
                className={`h-full border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${theme.borderHover}`}
              >
                <CardContent className="flex h-full flex-col gap-5 p-6">
                  <div className="flex items-start gap-4">
                    <span className={`flex p-2 items-center justify-center rounded-full ${theme.iconBg}`}>
                      <Icon className={`h-6 w-6 ${theme.iconColor}`} />
                    </span>
                    <div>
                      <p className={`text-xs font-semibold uppercase tracking-wide ${theme.tagColor}`}>
                        Método {method.order} · {method.symbol}
                      </p>
                      <h3 className="mt-1 text-xl font-bold text-foreground">
                        {method.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {method.description}
                      </p>
                    </div>
                  </div>

                  <div className={`rounded-lg border px-4 py-3 ${theme.insightBorder}`}>
                    <p className={`text-sm font-medium leading-snug ${theme.insightText}`}>
                      {method.insight}
                    </p>
                  </div>

                  <Button
                    asChild
                    variant="outline"
                    className={`group mt-auto justify-center gap-2 text-sm font-semibold ${theme.button}`}
                  >
                    <Link href={method.href} className="flex items-center gap-2">
                      <CtaIcon className="h-4 w-4" />
                      {method.ctaLabel}
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
