'use client';

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type FeatureTheme = {
  gradient: string;
  badge: string;
  chip: string;
  button: string;
};

type Feature = {
  id: 'upload' | 'manual' | 'ai';
  label: string;
  title: string;
  description: string;
  highlights: string[];
  imageSrc: string;
  imageAlt: string;
  href: string;
  cta: string;
  theme: FeatureTheme;
};

const features: Feature[] = [
    {
    id: 'ai',
    label: 'Asistente IA',
    title: 'Describe tu idea y la IA arma el formulario',
    description: 'Conversaciones naturales que generan secciones, lógica y tono adaptado en cuestión de segundos.',
    highlights: ['Habla en tu idioma', 'Genera flujos completos', 'Perfecto para lanzar hoy'],
    imageSrc: '/images/featureIA.png',
    imageAlt: 'Asistente de inteligencia artificial creando un formulario en FastForm',
    href: '/create/ai',
    cta: 'Probar asistente IA',
    theme: {
      gradient: 'from-white via-white to-velocity/10',
      badge: 'border border-velocity/30 bg-velocity/10 text-velocity-600',
      chip: 'border border-velocity/30 bg-white/90 text-velocity-600',
      button: 'bg-velocity-500 text-white hover:bg-velocity-600',
    },
  },
  {
    id: 'upload',
    label: 'CSV · Excel',
    title: 'Importa tu base y publícala sin copiar y pegar',
    description: 'Sube tu archivo y FastForm crea un formulario espejo listo para compartir con tu equipo o clientes.',
    highlights: ['Detecta preguntas automáticamente', 'Actualiza cuando cambie tu archivo', 'Ideal para bases vivas'],
    imageSrc: '/images/featureCSV.png',
    imageAlt: 'Proceso de importación de CSV o Excel a formulario FastForm',
    href: '/create/file',
    cta: 'Probar importación',
    theme: {
      gradient: 'from-white via-white to-excel/10',
      badge: 'border border-excel/30 bg-excel/10 text-excel',
      chip: 'border border-excel/30 bg-white/90 text-excel',
      button: 'bg-excel text-white hover:bg-excel/90',
    },
  },
  {
    id: 'manual',
    label: 'Editor manual',
    title: 'Diseña cada bloque con control total',
    description: 'Construye formularios pixel perfect con componentes drag & drop, temas y vistas previas en vivo.',
    highlights: ['Componentes personalizados', 'Organiza preguntas al instante', 'Ideal para lanzamientos premium'],
    imageSrc: '/images/featureManual.png',
    imageAlt: 'Editor manual de FastForm con herramientas visuales',
    href: '/create/manual',
    cta: 'Abrir editor manual',
    theme: {
      gradient: 'from-white via-white to-forms/10',
      badge: 'border border-forms/30 bg-forms/10 text-forms',
      chip: 'border border-forms/30 bg-white/90 text-forms',
      button: 'bg-forms text-white hover:bg-forms/90',
    },
  },
];

export const FeaturesSection = () => {
  return (
    <section id="features" className="bg-white px-6 py-24">
      <div className="mx-auto max-w-6xl space-y-16">
        <div className="text-center">
          <Badge className="mb-4 border border-velocity/30 bg-velocity/10 px-4 py-2 text-sm font-semibold text-velocity">
            Tres caminos, una experiencia fluida
          </Badge>
          <h2 className="text-4xl font-black text-excel md:text-5xl">
            Crea formularios con la energía que tengas hoy
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            IA conversacional, importación automática o edición manual pensadas para equipos que quieren lanzar sin tanta fricción.
          </p>
        </div>

        <div className="space-y-16">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className={`flex flex-col gap-10 rounded-3xl border border-slate-100 bg-gradient-to-br p-8 shadow-sm transition-shadow duration-300 hover:shadow-lg sm:p-12 lg:flex-row ${feature.theme.gradient} ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}
            >
              <div className="relative flex-1">
                <div className="relative aspect-[3/2] w-full overflow-hidden rounded-2xl border border-slate-100 bg-white/70 shadow-sm">
                  <Image
                    src={feature.imageSrc}
                    alt={feature.imageAlt}
                    fill
                    className="object-contain"
                    sizes="(min-width: 1280px) 540px, (min-width: 768px) 50vw, 100vw"
                    priority={index === 0}
                  />
                </div>
              </div>

              <div className="flex flex-1 flex-col justify-center gap-6">
                <div>
                  <Badge className={`mb-4 inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wide ${feature.theme.badge}`}>
                    {feature.label}
                  </Badge>
                  <h3 className="text-3xl font-bold text-slate-900">
                    {feature.title}
                  </h3>
                  <p className="mt-4 max-w-xl text-lg text-muted-foreground">
                    {feature.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  {feature.highlights.map((highlight) => (
                    <span
                      key={highlight}
                      className={`rounded-full px-4 py-2 text-sm font-medium shadow-sm backdrop-blur ${feature.theme.chip}`}
                    >
                      {highlight}
                    </span>
                  ))}
                </div>

                <div>
                  <Button
                    asChild
                    className={`group w-fit gap-2 px-6 text-sm font-semibold ${feature.theme.button}`}
                  >
                    <Link href={feature.href}>
                      {feature.cta}
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
