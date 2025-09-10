import { Metadata } from 'next';
import { ChevronDown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'FAQ FastForm - Respuestas sobre CSV, Excel y Google Forms | Ayuda',
  description: 'Respuestas a las preguntas más comunes sobre cómo convertir archivos CSV y Excel a Google Forms. Guía completa de uso de FastForm.',
  keywords: [
    'faq csv google forms',
    'preguntas frecuentes excel google forms',
    'ayuda convertir csv google forms',
    'problemas csv google forms',
    'tutorial csv a google forms',
    'guía rápida excel google forms'
  ],
  openGraph: {
    title: 'FAQ - Convertir CSV a Google Forms | FastForm',
    description: 'Resuelve todas tus dudas sobre cómo convertir archivos CSV y Excel a Google Forms automáticamente.',
    type: 'website',
  }
};

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  {
    category: 'Métodos de Creación',
    question: '¿Qué métodos ofrece FastForm para crear Google Forms?',
    answer: 'FastForm ofrece tres métodos principales: 1) Conversión inteligente de CSV/Excel, 2) Creación asistida por IA a través de chat conversacional, y 3) Constructor manual con interfaz intuitiva. Puedes elegir el método que mejor se adapte a tus necesidades.'
  },
  {
    category: 'Métodos de Creación',
    question: '¿Cómo funciona el builder de IA conversacional?',
    answer: 'Simplemente describe en lenguaje natural qué tipo de formulario necesitas, y nuestra IA generará automáticamente un formulario completo. Puedes decir cosas como "Necesito un formulario de registro para un evento corporativo con nombre, email, empresa y preferencias alimenticias" y obtendrás un formulario listo para usar.'
  },
  {
    category: 'Conversión CSV/Excel',
    question: '¿Cómo convierto un archivo CSV o Excel a Google Forms?',
    answer: 'Sube tu archivo en la sección "Desde CSV/Excel", selecciona qué columnas convertir en preguntas, ajusta los tipos de respuesta si es necesario, y FastForm generará tu formulario. También puedes usar la primera fila como títulos de preguntas automáticamente.'
  },
  {
    category: 'Conversión CSV/Excel',
    question: '¿Qué formatos de archivo soporta FastForm?',
    answer: 'Soportamos CSV (.csv), Excel (.xlsx, .xls), y Google Sheets. Cualquier estructura tabular se puede convertir en un formulario funcional con preguntas inteligentemente categorizadas.'
  },
  {
    category: 'Conversión CSV/Excel',
    question: '¿Puedo personalizar después de la conversión automática?',
    answer: 'Sí, la conversión es solo el comienzo. Después de generar el formulario, puedes editar cada pregunta y cambiar tipos de respuesta.'
  },
  {
    category: 'Builder Manual',
    question: '¿Qué ventajas tiene el builder manual de FastForm sobre Google Forms nativo?',
    answer: 'Nuestro builder manual ofrece: interfaz más intuitiva, integración directa con tus datos existentes, y la capacidad de guardar y reutilizar configuraciones de formularios.'
  },
  {
    category: 'Precios',
    question: '¿Es gratis usar FastForm?',
    answer: 'Sí, FastForm es completamente gratuito para empezar. Todos los usuarios nuevos reciben créditos gratuitos para crear sus primeros formularios. Funcionamos con un sistema de créditos: cada formulario que creas consume créditos. Puedes comprar créditos adicionales cuando los necesites, sin suscripciones ni compromisos mensuales.'
  },
  {
    category: 'Créditos',
    question: '¿Cuánto cuestan los créditos y cómo los compro?',
    answer: 'Cada crédito cuesta $500 ARS y te permite crear un formulario completo sin importar cuántas preguntas tenga. Puedes comprar créditos individualmente o aprovechar nuestros packs con descuentos. La compra se realiza directamente desde tu dashboard con tarjeta de crédito o débito a través de MercadoPago. Los créditos nunca expiran y los puedes usar cuando los necesites.'
  },
  {
    category: 'Créditos',
    question: '¿Qué obtengo con los créditos gratuitos?',
    answer: 'Todos los usuarios nuevos reciben créditos gratuitos para crear sus primeros formularios. Los créditos se utilizan para crear formularios, sin importar cuántas preguntas tengan. Tienes acceso completo a los tres métodos de creación (plantillas CSV, IA, y editor manual) y todas las funciones básicas desde el principio.'
  },
  {
    category: 'Funcionalidades Avanzadas',
    question: '¿Los formularios se integran con mis herramientas existentes?',
    answer: 'Absolutamente. Los formularios se crean directamente en tu cuenta de Google Forms, por lo que se integran perfectamente con Google Workspace, Google Sheets para respuestas, y cualquier otra herramienta que uses.'
  },
  {
    category: 'Funcionalidades Avanzadas',
    question: '¿Puedo colaborar con mi equipo en la creación de formularios?',
    answer: 'Sí, como los formularios se crean en Google Forms, puedes aprovechar todas las características de colaboración de Google, incluyendo comentarios, permisos de edición, y control de versiones.'
  }
];

const categories = [...new Set(faqData.map(item => item.category))];

export default function FAQPage() {
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
                <span className="text-gray-900 font-medium">FAQ</span>
              </li>
            </ol>
          </nav>
          <h1 className="text-3xl font-bold text-gray-900">Preguntas Frecuentes</h1>
          <p className="text-gray-600 mt-2">
            Todo lo que necesitas saber sobre FastForm
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
                "name": "FAQ",
                "item": "https://fastform.pro/faq"
              }
            ]
          })
        }}
      />

      {/* FAQ Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Search Box */}
          <div className="mb-8">
            <input
              type="text"
              placeholder="Buscar en preguntas frecuentes..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* FAQ Sections */}
          {categories.map(category => (
            <section key={category} className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                {category}
              </h2>
              <div className="space-y-4">
                {faqData
                  .filter(item => item.category === category)
                  .map((item, index) => (
                    <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg text-gray-900">
                          {item.question}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-base text-gray-700 leading-relaxed">
                          {item.answer}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  ))
                }
              </div>
            </section>
          ))}

          {/* Contact Support */}
          <div className="mt-12 text-center">
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-xl text-blue-900">
                  ¿No encontraste lo que buscabas?
                </CardTitle>
                <CardDescription className="text-blue-700">
                  Estamos aquí para ayudarte
                </CardDescription>
              </CardHeader>
              <CardContent>
                <a
                  href="mailto:luis.espinoza.nav@outlook.com"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Contactar Soporte
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* FAQ Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqData.map(item => ({
              "@type": "Question",
              "name": item.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": item.answer
              }
            }))
          })
        }}
      />
    </div>
  );
}