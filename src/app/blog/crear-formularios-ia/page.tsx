import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Crear formularios con IA: Guía definitiva 2025 | FastForm',
  description: 'Aprende a crear formularios profesionales con inteligencia artificial. Desde prompts básicos hasta formularios complejos con lógica condicional.',
  keywords: [
    'crear formularios IA',
    'inteligencia artificial formularios',
    'formularios con AI',
    'prompts formularios',
    'FastForm IA',
    'formularios inteligentes'
  ],
  openGraph: {
    title: 'Crear formularios con IA: Guía definitiva 2025',
    description: 'Aprende a crear formularios profesionales con inteligencia artificial. Desde prompts básicos hasta formularios complejos.',
    type: 'article',
    publishedTime: '2025-01-13T00:00:00.000Z',
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
                <span className="text-gray-900 font-medium">Crear formularios con IA</span>
              </li>
            </ol>
          </nav>
          <h1 className="text-3xl font-bold text-gray-900">Crear formularios con IA: Guía definitiva 2025</h1>
          <p className="text-gray-600 mt-2">Desde prompts básicos hasta formularios complejos con inteligencia artificial</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <article className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-700 mb-8">
              La inteligencia artificial ha transformado la forma en que creamos formularios. Con FastForm, 
              puedes describir en lenguaje natural qué necesitas y obtener un formulario profesional en segundos. 
              Esta guía te enseñará todo lo que necesitas saber.
            </p>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">¿Cómo funciona la IA de FastForm?</h2>
              
              <Card className="border-0 shadow-sm bg-purple-50 mb-6">
                <CardHeader>
                  <CardTitle className="text-lg text-purple-900">Tecnología detrás</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-purple-800">
                    FastForm utiliza modelos de lenguaje avanzados entrenados específicamente en la creación 
                    de formularios. Entiende contexto, intención y genera estructuras óptimas automáticamente.
                  </p>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-3 gap-6">
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-base">Comprensión contextual</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      La IA entiende el propósito de tu formulario y genera preguntas relevantes.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-base">Detección de tipos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      Identifica automáticamente qué tipo de respuesta necesita cada pregunta.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-base">Lógica inteligente</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      Añade lógica condicional y validaciones sin configuración manual.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Prompts efectivos por industria</h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-blue-600">Educación</h3>
                  <Card className="border-0 shadow-sm bg-blue-50 mb-4">
                    <CardHeader>
                      <CardTitle className="text-base">Ejemplo de prompt</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-blue-800 font-mono mb-2">
                        "Necesito un formulario de evaluación docente para estudiantes de secundaria. 
                        Debe incluir: nombre del estudiante, grado, materia, calificación del 1-10 
                        para conocimientos, presentación, participación, y un campo de comentarios. 
                        Todos los campos son obligatorios excepto comentarios."
                      </p>
                    </CardContent>
                  </Card>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Incluye validaciones automáticas</li>
                    <li>Optimizado para dispositivos móviles</li>
                    <li>Formato claro y profesional</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4 text-green-600">Recursos Humanos</h3>
                  <Card className="border-0 shadow-sm bg-green-50 mb-4">
                    <CardHeader>
                      <CardTitle className="text-base">Ejemplo de prompt</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-green-800 font-mono mb-2">
                        "Formulario de evaluación de desempeño para empleados. Información personal: 
                        nombre, departamento, cargo, fecha de ingreso. Evaluación: 7 competencias clave 
                        con escala 1-5, metas para el próximo año, fortalezas y áreas de mejora. 
                        Incluir firma digital."
                      </p>
                    </CardContent>
                  </Card>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Estructura jerárquica clara</li>
                    <li>Campos condicionales por departamento</li>
                    <li>Validación de fechas</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4 text-purple-600">Marketing</h3>
                  <Card className="border-0 shadow-sm bg-purple-50 mb-4">
                    <CardHeader>
                      <CardTitle className="text-base">Ejemplo de prompt</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-purple-800 font-mono mb-2">
                        "Formulario de registro para webinar sobre marketing digital. Datos: nombre, 
                        email, empresa, cargo, nivel de experiencia (principiante/intermedio/avanzado), 
                        expectativas del webinar. Incluir checkbox para recibir actualizaciones."
                      </p>
                    </CardContent>
                  </Card>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Validación de email automática</li>
                    <li>Lógica condicional por nivel</li>
                    <li>Integración con CRM</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Técnicas avanzadas de prompting</h2>
              
              <h3 className="text-xl font-semibold mb-4">Elementos clave de un buen prompt</h3>
              
              <Card className="border-0 shadow-sm bg-gray-50 mb-6">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">1. Propósito claro</h4>
                      <p className="text-sm text-gray-600">"Formulario de registro para...", "Encuesta de...", "Evaluación de..."</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">2. Audiencia específica</h4>
                      <p className="text-sm text-gray-600">"para estudiantes universitarios", "para clientes B2B", "para empleados de retail"</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">3. Campos requeridos</h4>
                      <p className="text-sm text-gray-600">"debe incluir nombre, email, teléfono y empresa"</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">4. Validaciones</h4>
                      <p className="text-sm text-gray-600">"todos los campos son obligatorios excepto comentarios", "email debe ser válido"</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">5. Formato deseado</h4>
                      <p className="text-sm text-gray-600">"con escala del 1-10", "con opción 'otro'", "con firma digital"</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <h3 className="text-xl font-semibold mb-4">Ejemplos de prompts avanzados</h3>
              
              <div className="space-y-4">
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-base">Formulario con lógica condicional</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm font-mono text-gray-700">
                      "Formulario de solicitud de vacaciones. Campos: nombre, departamento, días solicitados, 
                      fechas. Si días {'>'} 5, mostrar campo adicional 'razón extendida'. Si departamento = 'ventas', 
                      agregar campo 'reemplazo asignado'. Todos los campos obligatorios."
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-base">Formulario multi-etapa</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm font-mono text-gray-700">
                      "Formulario de onboarding de nuevo empleado en 3 secciones: 1) Información personal 
                      (nombre, dirección, contacto de emergencia), 2) Información laboral (puesto, salario, 
                      fecha de inicio), 3) Documentación (cargar CV, firma digital, aceptación de políticas)."
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Optimización y mejores prácticas</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-green-600">Haz</h3>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>Sé específico con los tipos de datos</li>
                    <li>Incluye ejemplos cuando sea necesario</li>
                    <li>Menciona validaciones importantes</li>
                    <li>Especifica campos obligatorios/opcionales</li>
                    <li>Describe el flujo lógico deseado</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-red-600">No hagas</h3>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>Usar lenguaje vago o ambiguo</li>
                    <li>Omitir el propósito del formulario</li>
                    <li>Solicitar demasiados campos sin contexto</li>
                    <li>Ignorar la audiencia objetivo</li>
                    <li>Asumir que la IA entiende implícitamente</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Casos de uso reales</h2>
              
              <div className="space-y-6">
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Startup de tecnología</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-2">Prompt usado:</p>
                    <p className="text-sm font-mono text-gray-700 mb-3">
                      "Formulario de aplicación para programa de aceleración. Campos: startup name, 
                      founders (nombre y email de cada uno), problema que resuelven, solución, mercado 
                      objetivo, tracción actual, monto buscado. Validar que haya al menos 2 founders."
                    </p>
                    <p className="text-sm text-gray-600">
                      Resultado: 25 preguntas bien estructuradas con validaciones específicas para startups.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-base">Restaurante</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-2">Prompt usado:</p>
                    <p className="text-sm font-mono text-gray-700 mb-3">
                      "Formulario de reserva para restaurante con: fecha, hora, número de personas, 
                      preferencias alimenticias (vegetariano, vegano, sin gluten), ocasión especial, 
                      número de contacto. Si más de 6 personas, pedir depósito de garantía."
                    </p>
                    <p className="text-sm text-gray-600">
                      Resultado: Formulario optimizado con lógica condicional para grupos grandes.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Conclusión</h2>
              <p className="text-lg text-gray-700">
                Crear formularios con IA no es solo más rápido, es más inteligente. FastForm te permite 
                crear formularios que realmente funcionan para tu audiencia específica, con validaciones 
                y lógica que normalmente tomarían horas de configuración manual.
              </p>
              <p className="text-lg text-gray-700 mt-4">
                ¿Listo para experimentar el futuro de la creación de formularios? Comienza con un prompt 
                simple y verás cómo la IA transforma tus ideas en formularios profesionales.
              </p>
            </section>
          </article>

          <div className="mt-12 text-center">
            <a
              href="/create/ai"
              className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              Crear mi primer formulario con IA
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
            "headline": "Crear formularios con IA: Guía definitiva 2025",
            "description": "Aprende a crear formularios profesionales con inteligencia artificial. Desde prompts básicos hasta formularios complejos.",
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
            "datePublished": "2025-01-13T00:00:00.000Z",
            "image": "https://fastform.pro/images/heroimage1.png"
          })
        }}
      />
    </div>
  );
}