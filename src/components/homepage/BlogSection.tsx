'use client';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export const BlogSection = () => {
  const blogHighlights = [
    {
      title: 'Los 3 métodos definitivos para crear Google Forms en minutos',
      href: '/blog/3-metodos-crear-google-forms',
      tag: 'Guía práctica'
    },
    {
      title: 'IA conversacional: cómo FastForm redacta preguntas inteligentes',
      href: '/blog/crear-formularios-ia',
      tag: 'IA aplicada'
    }
  ];

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
            Inspírate con tácticas reales, tutoriales rápidos y novedades del equipo FastForm
          </p>
        </div>

        <div className="max-w-5xl mx-auto px-2">
          <Card className="rounded-3xl border border-slate-100 bg-white shadow-[0_24px_70px_-48px_rgba(15,23,42,0.35)]">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between p-6 sm:p-10">
              <div className="max-w-xl space-y-5">
                <div className="inline-flex items-center gap-2 rounded-full border border-velocity/30 bg-velocity/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-velocity">
                  <Sparkles className="h-4 w-4" />
                  Blog FastForm
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl sm:text-3xl font-bold text-primary leading-snug">
                    Ideas rápidas para llevar tus formularios al siguiente nivel
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Tómate 5 minutos y descubre cómo equipos reales automatizan, personalizan y lanzan formularios sin fricción.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-velocity/10 text-velocity border border-velocity/20">Guías prácticas</Badge>
                  <Badge className="bg-excel/10 text-excel border border-excel/20">Automatización</Badge>
                  <Badge className="bg-forms/10 text-forms border border-forms/20">Casos reales</Badge>
                </div>
              </div>

              <div className="w-full max-w-md space-y-4">
                <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 sm:p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 mb-3">
                    Últimos artículos
                  </p>
                  <ul className="space-y-3">
                    {blogHighlights.map((post) => (
                      <li key={post.href}>
                        <Link
                          href={post.href}
                          className="group flex items-center justify-between gap-3 rounded-xl border border-transparent bg-white px-4 py-3 text-left shadow-sm transition-colors duration-200 hover:border-velocity/40 hover:bg-velocity/5"
                        >
                          <div className="space-y-1">
                            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400 group-hover:text-velocity">
                              {post.tag}
                            </span>
                            <p className="text-sm font-medium text-slate-800 group-hover:text-primary">
                              {post.title}
                            </p>
                          </div>
                          <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-velocity" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <Button asChild className="w-full sm:w-auto">
                    <Link href="/blog" className="flex items-center justify-center">
                      Visitar blog
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full sm:w-auto border border-slate-200 text-slate-600 hover:border-velocity hover:text-velocity"
                  >
                    <Link href="/blog/3-metodos-crear-google-forms" className="flex items-center justify-center">
                      Leer guía destacada
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};
