import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { NewsletterSubscription } from '@/components/molecules/NewsletterSubscription';

const currentYear = 2024;

export const metadata: Metadata = {
  title: "Blog FastForm - Expertos en Google Forms, CSV y Excel | Recursos",
  description: "Descubre cómo crear Google Forms más eficientemente con FastForm. Guías sobre conversión CSV/Excel, IA conversacional y mejores prácticas.",
  keywords: [
    "blog fastform",
    "google forms tutorial",
    "consejos google forms",
    "crear formularios google",
    "csv a google forms",
    "ia para formularios"
  ],
  openGraph: {
    title: "Blog FastForm - Tu fuente de conocimiento sobre Google Forms",
    description: "Artículos expertos sobre cómo maximizar tu productividad con Google Forms usando FastForm.",
    type: "website",
  }
};

export default function BlogPage() {
  const articles = [
    {
      title: `Los 3 métodos definitivos para crear Google Forms en ${currentYear}`,
      excerpt: "Descubre cómo FastForm revoluciona la creación de formularios con conversión CSV/Excel, IA conversacional y builder manual avanzado.",
      date: "2025",
      readTime: "5 min",
      category: "Productividad",
      slug: "3-metodos-crear-google-forms"
    },
    {
      title: "De CSV a Google Forms: Guía completa sin errores",
      excerpt: "Aprende a convertir cualquier archivo CSV o Excel en un formulario de Google Forms funcional en menos de 2 minutos.",
      date: "2025",
      readTime: "7 min",
      category: "Tutorial",
      slug: "csv-a-google-forms-guia"
    },
    {
      title: "Crear formularios con IA: El futuro está aquí",
      excerpt: "Explora cómo nuestra IA conversacional puede crear formularios completos solo describiendo lo que necesitas.",
      date: "2025",
      readTime: "4 min",
      category: "Innovación",
      slug: "crear-formularios-ia"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <nav className="mb-4">
            <ol className="flex items-center space-x-2 text-sm text-gray-600">
              <li><a href="/" className="hover:text-blue-600 transition-colors">Inicio</a></li>
              <li className="flex items-center">
                <svg className="h-4 w-4 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-900 font-medium">Blog</span>
              </li>
            </ol>
          </nav>
          <h1 className="text-3xl font-bold text-gray-900">Blog FastForm</h1>
          <p className="text-gray-600 mt-2">
            Consejos y guías expertas sobre Google Forms y productividad
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Article */}
          <section className="mb-16">
            <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-green-50">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-full">Artículo Destacado</span>
                  <span className="text-sm text-gray-500">5 min de lectura</span>
                </div>
                <CardTitle className="text-2xl md:text-3xl mb-3">
                  Los 3 métodos definitivos para crear Google Forms en {currentYear}
                </CardTitle>
                <CardDescription className="text-lg text-gray-700">
                  Descubre cómo FastForm revoluciona la creación de formularios con conversión CSV/Excel, IA conversacional y builder manual avanzado.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <a 
                  href="/blog/3-metodos-crear-google-forms"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Leer artículo completo
                </a>
              </CardContent>
            </Card>
          </section>

          {/* Articles Grid */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Últimos artículos</h2>
            <div className="grid gap-8">
              {articles.map((article, index) => (
                <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-3">
                      <span className="text-sm font-medium text-green-600 bg-green-100 px-3 py-1 rounded-full">
                        {article.category}
                      </span>
                      <span className="text-sm text-gray-500">{article.date}</span>
                      <span className="text-sm text-gray-500">{article.readTime}</span>
                    </div>
                    <CardTitle className="text-xl mb-2">
                      <a href={`/blog/${article.slug}`} className="hover:text-blue-600 transition-colors">
                        {article.title}
                      </a>
                    </CardTitle>
                    <CardDescription className="text-gray-700">
                      {article.excerpt}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </section>

          {/* Newsletter */}
          <section className="text-center">
            <Card className="border-0 shadow-sm bg-gray-50">
              <CardHeader>
                <CardTitle className="text-xl">Mantente actualizado</CardTitle>
                <CardDescription>
                  Suscríbete para recibir las últimas guías sobre Google Forms y productividad
                </CardDescription>
              </CardHeader>
              <CardContent>
                <NewsletterSubscription />
              </CardContent>
            </Card>
          </section>
        </div>
      </main>

      {/* Blog Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "Blog FastForm",
            "description": "Consejos y guías expertas sobre Google Forms y productividad",
            "url": "https://fastform.pro/blog",
            "publisher": {
              "@type": "Organization",
              "name": "FastForm",
              "logo": {
                "@type": "ImageObject",
                "url": "https://fastform.pro/logo.svg"
              }
            },
            "blogPost": [
              {
                "@type": "BlogPosting",
                "headline": `Los 3 métodos definitivos para crear Google Forms en ${new Date().getFullYear()}`,
                "description": "Descubre cómo FastForm revoluciona la creación de formularios con conversión CSV/Excel, IA conversacional y builder manual avanzado.",
                "url": "https://fastform.pro/blog/3-metodos-crear-google-forms"
              },
              {
                "@type": "BlogPosting",
                "headline": "De CSV a Google Forms: Guía completa sin errores",
                "description": "Aprende a convertir cualquier archivo CSV o Excel en un formulario de Google Forms funcional en menos de 2 minutos.",
                "url": "https://fastform.pro/blog/csv-a-google-forms-guia"
              },
              {
                "@type": "BlogPosting",
                "headline": "Crear formularios con IA: El futuro está aquí",
                "description": "Explora cómo nuestra IA conversacional puede crear formularios completos solo describiendo lo que necesitas.",
                "url": "https://fastform.pro/blog/crear-formularios-ia"
              }
            ]
          })
        }}
      />

      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Inicio",
                "item": "https://fastform.pro"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Blog",
                "item": "https://fastform.pro/blog"
              }
            ]
          })
        }}
      />
    </div>
  );
}