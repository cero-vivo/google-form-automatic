import { Metadata } from 'next';

const currentYear = 2024;

export const metadata: Metadata = {
  title: `Los 3 métodos definitivos para crear Google Forms en ${currentYear} - FastForm`,
  description: "Descubre cómo FastForm revoluciona la creación de formularios con conversión CSV/Excel, IA conversacional y builder manual avanzado. Guía completa.",
  keywords: [
    "crear google forms",
    "convertir csv google forms",
    "formularios con ia",
    "builder google forms",
    "fastform tutorial",
    "métodos creación formularios"
  ],
  openGraph: {
    title: `Los 3 métodos definitivos para crear Google Forms en ${currentYear}`,
    description: "Aprende a crear formularios profesionales con FastForm usando conversión CSV/Excel, IA conversacional o builder manual avanzado.",
    type: "article",
    publishedTime: new Date().toISOString(),
    authors: ["FastForm Team"]
  }
};

export default function ArticlePage() {
  const currentYear = 2024;
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
                <a href="/blog" className="hover:text-blue-600 transition-colors">Blog</a>
              </li>
              <li className="flex items-center">
                <svg className="h-4 w-4 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-900 font-medium">3 Métodos para Google Forms</span>
              </li>
            </ol>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Los 3 métodos definitivos para crear Google Forms en {currentYear}
          </h1>
          <p className="text-gray-600 mt-2">
            Descubre cómo FastForm revoluciona la creación de formularios
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <article className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              En {currentYear}, crear Google Forms no tiene que ser una tarea tediosa. FastForm ha transformado este proceso
              en una experiencia rápida, intuitiva y poderosa. Conoce los tres métodos que hacen posible crear
              formularios profesionales en minutos, no horas.
            </p>

            {/* Método 1: Plantillas CSV/Excel para creación rápida */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                1. Creación Ultra-Rápida con Plantillas CSV
              </h2>
              <p className="mb-4">
                ¿Necesitas crear un formulario con 20, 50 o 100 preguntas? Con nuestras plantillas CSV puedes crear formularios masivos en segundos en lugar de horas. Es como copiar y pegar, pero para formularios completos.
              </p>

              <h3 className="text-xl font-semibold mb-3">Proceso súper simple:</h3>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li><strong>1. Descarga:</strong> Nuestra plantilla CSV lista para usar</li>
                <li><strong>2. Escribe:</strong> Agrega tus preguntas en columnas simples</li>
                <li><strong>3. Sube:</strong> FastForm crea todo el formulario automáticamente</li>
                <li><strong>4. Listo:</strong> Tu formulario con todas las preguntas está creado</li>
              </ul>

              <div className="bg-purple-50 p-4 rounded-lg mb-4">
                <h4 className="font-semibold text-purple-900 mb-2">¿Por qué es mejor que crear manualmente?</h4>
                <ul className="text-sm text-purple-800 space-y-1">
                  <li>✅ 100 preguntas en 5 segundos vs 3 horas manuales</li>
                  <li>✅ Evitas errores de copiar/pegar repetitivo</li>
                  <li>✅ Mismo formato consistente en todas las preguntas</li>
                  <li>✅ Puedes reutilizar y editar fácilmente</li>
                </ul>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">Ejemplo práctico:</h4>
                <p className="text-sm text-green-800 mb-2">
                  <strong>Escenario:</strong> Necesitas crear una encuesta de satisfacción de 50 preguntas
                </p>
                <p className="text-sm text-green-800">
                  <strong>Google Forms manual:</strong> 1.5 horas clickeando cada pregunta<br />
                  <strong>FastForm con CSV:</strong> 5 segundos y tu café aún está caliente
                </p>
              </div>
            </section>

            {/* Método 2: IA Conversacional */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                2. Creación Asistida por IA
              </h2>
              <p className="mb-4">
                Describe en lenguaje natural lo que necesitas y nuestra IA generará un formulario completo.
                Es como tener un experto en formularios que entiende exactamente lo que quieres.
              </p>

              <h3 className="text-xl font-semibold mb-3">Ejemplos de prompts:</h3>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="text-sm mb-2"><strong>Ejemplo 1:</strong></p>
                <p className="text-sm italic mb-3">
                  "Necesito un formulario de registro para un evento corporativo con nombre completo,
                  email corporativo, empresa, cargo, y preferencias alimenticias"
                </p>

                <p className="text-sm mb-2"><strong>Ejemplo 2:</strong></p>
                <p className="text-sm italic mb-3">
                  "Crea una encuesta de satisfacción post-compra con escala de 1-5,
                  preguntas sobre calidad del producto, servicio al cliente, y espacio para comentarios"
                </p>

                <p className="text-sm mb-2"><strong>Ejemplo 3:</strong></p>
                <p className="text-sm italic">
                  "Crea una formulario tipo quizz con 20 preguntas sobre historia Argentina"
                </p>
              </div>

              <h4 className="font-semibold mb-2">Características:</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Entiende contexto y crea preguntas relevantes</li>
                <li>Sugiere tipos de respuesta óptimos</li>
                <li>Genera formularios completos en segundos</li>
              </ul>
            </section>

            {/* Método 3: Builder Manual */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                3. Builder Manual Avanzado
              </h2>
              <p className="mb-4">
                Para quienes prefieren control total, nuestro builder manual ofrece una interfaz
                más intuitiva que Google Forms nativo.
              </p>

              <h3 className="text-xl font-semibold mb-3">Ventajas sobre Google Forms nativo:</h3>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li><strong>Guardado de plantillas personalizadas:</strong> Reutiliza configuraciones</li>
                <li><strong>Interfaz más intuitiva:</strong> Menos clics, más resultados</li>
              </ul>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">Perfecto para:</h4>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Usuarios que necesitan control total</li>
                  <li>• Formularios con requisitos específicos</li>
                  <li>• Creación de plantillas para reutilizar</li>
                  <li>• Usuarios nuevos en Google Forms</li>
                </ul>
              </div>
            </section>

            {/* Comparación */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                ¿Qué método elegir?
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Método</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ideal para</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tiempo</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nivel</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium">Conversión CSV/Excel</td>
                      <td className="px-6 py-4 text-sm">Tener datos existentes</td>
                      <td className="px-6 py-4 text-sm">10 segundos</td>
                      <td className="px-6 py-4 text-sm">Principiante</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium">IA Conversacional</td>
                      <td className="px-6 py-4 text-sm">Idea clara, sin datos</td>
                      <td className="px-6 py-4 text-sm">30 segundos</td>
                      <td className="px-6 py-4 text-sm">Todos</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium">Builder Manual</td>
                      <td className="px-6 py-4 text-sm">Control total</td>
                      <td className="px-6 py-4 text-sm">5-10 minutos</td>
                      <td className="px-6 py-4 text-sm">Intermedio</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Conclusión */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Comenzar hoy mismo
              </h2>
              <p className="mb-4">
                No importa tu nivel de experiencia o necesidades específicas, FastForm tiene el método perfecto
                para ti. Todos los formularios se crean directamente en tu cuenta de Google Forms,
                manteniendo la familiaridad y potencia de Google mientras agregamos capas de inteligencia y eficiencia.
              </p>
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Prueba gratis hoy:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• 5 formularios gratuitos al mes</li>
                  <li>• Acceso a los 3 métodos de creación</li>
                  <li>• Soporte completo y guías paso a paso</li>
                </ul>
              </div>
            </section>
          </article>

          <div className="mt-12 text-center">
            <a
              href="/"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Comenzar a crear formularios
              <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </main>

      {/* Article Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": `Los 3 métodos definitivos para crear Google Forms en ${currentYear}`,
            "description": "Descubre cómo FastForm revoluciona la creación de formularios con conversión CSV/Excel, IA conversacional y builder manual avanzado.",
            "author": {
              "@type": "Organization",
              "name": "FastForm"
            },
            "publisher": {
              "@type": "Organization",
              "name": "FastForm",
              "logo": {
                "@type": "ImageObject",
                "url": "https://fastform.pro/logo.svg"
              }
            },
            "datePublished": new Date().toISOString(),
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": "https://fastform.pro/blog/3-metodos-crear-google-forms"
            }
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
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "3 Métodos para Google Forms",
                "item": "https://fastform.pro/blog/3-metodos-crear-google-forms"
              }
            ]
          })
        }}
      />
    </div>
  );
}