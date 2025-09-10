import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: "Sobre FastForm - Equipo, Misión y Visión para Google Forms",
  description: "Conoce al equipo de FastForm detrás de la herramienta líder para convertir CSV y Excel a Google Forms. Nuestra misión es simplificar la creación de formularios.",
  keywords: [
    "sobre fastform",
    "equipo fastform",
    "misión fastform",
    "historia fastform",
    "empresa conversión csv google forms",
    "quiénes somos fastform"
  ],
  openGraph: {
    title: "Sobre FastForm - Equipo y Misión",
    description: "Conoce la historia detrás de FastForm, la herramienta líder para convertir CSV y Excel a Google Forms automáticamente.",
    type: "website",
  }
};

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Luis Espinoza",
      role: "Fundador & CEO",
      bio: "Apasionado por la automatización y la productividad. Con más de 8 años de experiencia en desarrollo web y SaaS.",
      expertise: "Google Forms API, Automatización, Product Development"
    },
    {
      name: "FastForm Team",
      role: "Equipo de Desarrollo",
      bio: "Un equipo diverso de desarrolladores, diseñadores y expertos en productividad comprometidos con simplificar la creación de formularios.",
      expertise: "Next.js, Google Workspace, UX/UI, Data Processing"
    }
  ];

  const milestones = [
      {
        year: "2024",
        title: "Lanzamiento de FastForm",
        description: "Nacimiento de la idea para simplificar la conversión de CSV a Google Forms"
      },
      {
        year: "2024",
        title: "Primera versión Beta",
        description: "Lanzamiento de la versión beta con soporte básico de CSV y Excel"
      },
      {
        year: "2024",
        title: "Lanzamiento oficial",
        description: "FastForm se vuelve público con características avanzadas y planes de pago"
      },
      {
        year: new Date().getFullYear(),
        title: "+1000 usuarios",
        description: "Alcanzamos nuestro primer milestone de usuarios activos"
      }
    ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <nav className="mb-4">
            <ol className="flex items-center space-x-2 text-sm text-gray-600">
              <li><a href="/" className="hover:text-blue-600 transition-colors">Inicio</a></li>
              <li className="flex items-center">
                <svg className="h-4 w-4 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-900 font-medium">Sobre Nosotros</span>
              </li>
            </ol>
          </nav>
          <h1 className="text-3xl font-bold text-gray-900">Sobre Nosotros</h1>
          <p className="text-gray-600 mt-2">
            Conoce la historia detrás de FastForm
          </p>
        </div>
      </header>
      
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
                "name": "Sobre Nosotros",
                "item": "https://fastform.pro/about"
              }
            ]
          })
        }}
      />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <section className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
            La forma más inteligente de crear Google Forms
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            FastForm es tu intermediario inteligente para crear Google Forms de manera rápida y eficiente. 
            Ya sea que necesites convertir datos, crear desde cero con IA, o usar nuestro builder manual avanzado, 
            eliminamos las barreras técnicas y te damos el control total sobre tus formularios.
          </p>
          </section>

          {/* Mission & Vision */}
          <section className="grid md:grid-cols-2 gap-8 mb-16">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-blue-600">Nuestra Misión</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-lg text-gray-700 leading-relaxed">
                  Democratizar la creación de formularios profesionales al proporcionar múltiples vías 
                  de creación: conversión inteligente de datos, asistencia por IA, y construcción manual avanzada. 
                  Cualquier persona, independientemente de sus habilidades técnicas, puede crear formularios 
                  funcionales en minutos, no horas.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-green-600">Nuestra Visión</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-lg text-gray-700 leading-relaxed">
                  Ser la herramienta preferida globalmente para la conversión de datos a formularios, 
                  integrándonos perfectamente con el ecosistema de Google Workspace y más allá.
                </CardDescription>
              </CardContent>
            </Card>
          </section>

          {/* Team Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">El Equipo</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {teamMembers.map((member, index) => (
                <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-xl">{member.name}</CardTitle>
                    <CardDescription className="text-blue-600 font-medium">{member.role}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">{member.bio}</p>
                    <p className="text-sm text-gray-600">
                      <strong>Especialidad:</strong> {member.expertise}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Values */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Nuestros Valores</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-0 shadow-sm text-center">
                <CardHeader>
                  <CardTitle className="text-lg">Simplicidad</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Interfaces intuitivas que cualquier persona puede usar sin formación técnica.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm text-center">
                <CardHeader>
                  <CardTitle className="text-lg">Eficiencia</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Convertir horas de trabajo manual en minutos de automatización.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm text-center">
                <CardHeader>
                  <CardTitle className="text-lg">Accesibilidad</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Herramientas potentes al alcance de todos, con planes gratuitos y pagos flexibles.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Contact */}
          <section className="text-center">
            <Card className="border-0 shadow-sm bg-gradient-to-r from-blue-50 to-green-50">
              <CardHeader>
                <CardTitle className="text-2xl">¿Listo para simplificar tu flujo de trabajo?</CardTitle>
                <CardDescription className="text-lg">
                  Únete a miles de usuarios que ya están ahorrando tiempo con FastForm
                </CardDescription>
              </CardHeader>
              <CardContent>
                <a
                  href="/dashboard"
                  className="inline-flex items-center px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium"
                >
                  Comenzar Ahora
                </a>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>

      {/* About Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "FastForm",
            "description": "Herramienta líder para convertir CSV y Excel a Google Forms automáticamente",
            "url": "https://fastform.pro",
            "logo": "https://fastform.pro/logo.svg",
            "founder": {
              "@type": "Person",
              "name": "Luis Espinoza",
              "jobTitle": "Founder & CEO"
            },
            "foundingDate": new Date().getFullYear(),
            "sameAs": [
              "https://fastform.pro",
              "https://twitter.com/fastform_app"
            ],
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "ES"
            },
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "customer support",
              "email": "hola@fastform.pro"
            }
          })
        }}
      />
    </div>
  );
}