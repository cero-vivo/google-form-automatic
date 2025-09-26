import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Cómo convertir CSV a Google Forms: Guía completa 2025 | FastForm',
  description: 'Aprende paso a paso cómo convertir tus archivos CSV o Excel en formularios de Google Forms completos usando FastForm. Ahorra horas de trabajo manual.',
  keywords: [
    'convertir csv google forms',
    'csv a google forms',
    'excel a google forms',
    'importar datos google forms',
    'formulario desde csv',
    'FastForm csv'
  ],
  openGraph: {
    title: 'Cómo convertir CSV a Google Forms: Guía completa 2025',
    description: 'Aprende paso a paso cómo convertir tus archivos CSV o Excel en formularios de Google Forms completos usando FastForm.',
    type: 'article',
    publishedTime: '2025-01-14T00:00:00.000Z',
    authors: ['FastForm Team'],
  }
};

export default function ArticlePage() {
  const currentYear = new Date().getFullYear();
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
                <span className="text-gray-900 font-medium">CSV a Google Forms</span>
              </li>
            </ol>
          </nav>
          <h1 className="text-3xl font-bold text-gray-900">Cómo convertir CSV a Google Forms: Guía completa 2025</h1>
          <p className="text-gray-600 mt-2">Convierte tus datos en formularios funcionales en minutos</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <article className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-700 mb-8">
              ¿Tienes un archivo CSV o Excel con preguntas que necesitas convertir en un Google Form? 
              Esta guía te mostrará exactamente cómo hacerlo en minutos usando FastForm, ahorrándote 
              horas de trabajo manual.
            </p>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">¿Por qué convertir CSV a Google Forms?</h2>
              
              <Card className="border-0 shadow-sm bg-blue-50 mb-6">
                <CardHeader>
                  <CardTitle className="text-lg text-blue-900">Problema común</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-blue-800">
                    Manualmente copiar 50+ preguntas de un Excel a Google Forms puede tomar 2-3 horas y es propenso a errores.
                    Con FastForm, este proceso se reduce a 2-3 minutos.
                  </p>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-red-600">Método tradicional</h3>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>Copiar cada pregunta manualmente</li>
                    <li>Seleccionar tipo de respuesta uno por uno</li>
                    <li>Configurar validaciones manualmente</li>
                    <li>2-3 horas para 50 preguntas</li>
                    <li>Alta probabilidad de errores</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-green-600">Con FastForm</h3>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>Conversión automática completa</li>
                    <li>Detección inteligente de tipos</li>
                    <li>Validaciones configuradas automáticamente</li>
                    <li>2-3 minutos para 50 preguntas</li>
                    <li>100% precisión garantizada</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Preparando tu archivo CSV</h2>
              
              <h3 className="text-xl font-semibold mb-4">Formato CSV óptimo</h3>
              <p className="text-gray-700 mb-4">
                Para obtener los mejores resultados, estructura tu CSV así:
              </p>
              
              <Card className="border-0 shadow-sm bg-gray-50 mb-6">
                <CardContent className="pt-6">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-3 font-semibold">Columna</th>
                          <th className="text-left py-2 px-3 font-semibold">Descripción</th>
                          <th className="text-left py-2 px-3 font-semibold">Ejemplo</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-2 px-3 font-medium">question</td>
                          <td className="py-2 px-3">Texto de la pregunta</td>
                          <td className="py-2 px-3">"¿Cuál es tu nombre?"</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 px-3 font-medium">type</td>
                          <td className="py-2 px-3">Tipo de respuesta</td>
                          <td className="py-2 px-3">"short_answer", "multiple_choice", "checkbox"</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 px-3 font-medium">options</td>
                          <td className="py-2 px-3">Opciones (separadas por |)</td>
                          <td className="py-2 px-3">"Sí|No|Tal vez"</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-3 font-medium">required</td>
                          <td className="py-2 px-3">¿Es obligatoria?</td>
                          <td className="py-2 px-3">"true" o "false"</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              <h3 className="text-xl font-semibold mb-4">Ejemplo de archivo CSV</h3>
              <Card className="border-0 shadow-sm">
                <CardContent className="pt-6">
                  <pre className="text-sm bg-gray-100 p-4 rounded overflow-x-auto">
{`question,type,options,required,validation
"¿Cuál es tu nombre?",short_answer,,true,
"¿Cuál es tu edad?",short_answer,,true,numeric
"¿En qué país vives?",multiple_choice,"México|Estados Unidos|Canadá|Otro",true,
"¿Qué idiomas hablas?",checkbox,"Español|Inglés|Francés|Alemán",false,
"¿Qué tan satisfecho estás?",scale,,true,1-5`}
                  </pre>
                </CardContent>
              </Card>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Guía paso a paso</h2>
              
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Preparar tu archivo</h3>
                    <p className="text-gray-700">
                      Asegúrate de que tu CSV tenga las columnas correctas: <code className="bg-gray-100 px-2 py-1 rounded">question</code>, 
                      <code className="bg-gray-100 px-2 py-1 rounded">type</code>, <code className="bg-gray-100 px-2 py-1 rounded">options</code>, 
                      y <code className="bg-gray-100 px-2 py-1 rounded">required</code>.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Subir a FastForm</h3>
                    <p className="text-gray-700">
                      Ve a FastForm y selecciona "Convertir CSV/Excel". Arrastra tu archivo o haz clic para seleccionarlo.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Revisar y ajustar</h3>
                    <p className="text-gray-700">
                      FastForm mostrará una vista previa de tu formulario. Revisa que todo esté correcto y haz ajustes si es necesario.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">4</div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Crear formulario</h3>
                    <p className="text-gray-700">
                      Haz clic en "Crear formulario" y FastForm generará automáticamente tu Google Form completo en tu cuenta.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Tipos de preguntas soportados</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-base">Tipos básicos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm space-y-2">
                      <li><strong>short_answer:</strong> Respuesta corta</li>
                      <li><strong>paragraph:</strong> Párrafo largo</li>
                      <li><strong>multiple_choice:</strong> Opción múltiple</li>
                      <li><strong>checkbox:</strong> Casillas de verificación</li>
                      <li><strong>dropdown:</strong> Lista desplegable</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-base">Tipos avanzados</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm space-y-2">
                      <li><strong>linear_scale:</strong> Escala lineal (1-5, 1-10)</li>
                      <li><strong>multiple_choice_grid:</strong> Cuadrícula de opción múltiple</li>
                      <li><strong>checkbox_grid:</strong> Cuadrícula de casillas</li>
                      <li><strong>date:</strong> Selector de fecha</li>
                      <li><strong>time:</strong> Selector de hora</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Casos de uso comunes</h2>
              
              <div className="space-y-6">
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Encuestas de satisfacción</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">
                      Convierte matrices de evaluación de Excel en formularios de satisfacción del cliente 
                      con escalas de 1-10 y campos de comentarios.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Registros de eventos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">
                      Transforma listas de asistentes en formularios de registro con campos 
                      personalizados según el tipo de evento.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Evaluaciones educativas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">
                      Convierte bancos de preguntas educativas en formularios de evaluación 
                      con diferentes tipos de respuesta y validaciones.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Conclusión</h2>
              <p className="text-lg text-gray-700">
                Convertir CSV a Google Forms nunca ha sido tan fácil. FastForm elimina el trabajo manual y 
                los errores, permitiéndote crear formularios profesionales en minutos en lugar de horas.
              </p>
              <p className="text-lg text-gray-700 mt-4">
                ¿Listo para probarlo? Sube tu primer archivo CSV y experimenta la magia de la conversión 
                automática.
              </p>
            </section>
          </article>

          <div className="mt-12 text-center">
            <a
              href="/create/file"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Convertir mi CSV ahora
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
            "@type": "BlogPosting",
            "headline": "Cómo convertir CSV a Google Forms: Guía completa 2025",
            "description": "Aprende paso a paso cómo convertir tus archivos CSV o Excel en formularios de Google Forms completos usando FastForm.",
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
            "datePublished": "2025-01-14T00:00:00.000Z",
            "image": "https://fastform.pro/images/heroimage1.png"
          })
        }}
      />
    </div>
  );
}