'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download } from 'lucide-react';
import * as XLSX from 'xlsx';

export default function FormInstructions() {
  const generateExampleExcel = () => {
    // Datos de ejemplo con todos los tipos de preguntas soportados
    const exampleData = [
      // Header
      ['Pregunta', 'Tipo', 'Opciones', 'Requerido', 'Descripción'],
      
      // Ejemplos para tipos básicos
      ['¿Cuál es tu nombre completo?', 'short_text', '', 'Sí', 'Ingresa tu nombre y apellidos'],
      ['¿Podrías contarnos tu experiencia?', 'long_text', '', 'No', 'Describe tu experiencia en detalle'],
      ['¿Cuál es tu color favorito?', 'multiple_choice', 'Rojo,Azul,Verde,Amarillo,Otro', 'No', 'Selecciona una opción'],
      ['¿Qué deportes practicas?', 'checkboxes', 'Fútbol,Básquet,Tenis,Natación,Ciclismo', 'No', 'Puedes seleccionar múltiples opciones'],
      ['¿Cuál es tu país de residencia?', 'dropdown', 'México,España,Colombia,Argentina,Chile,Perú', 'Sí', 'Selecciona de la lista'],
      ['¿Cómo calificarías nuestro servicio?', 'linear_scale', '1-5', 'No', 'Escala del 1 (malo) al 5 (excelente)'],
      ['¿Cuál es tu fecha de nacimiento?', 'date', '', 'No', 'Formato: DD/MM/AAAA'],
      ['¿A qué hora prefieres ser contactado?', 'time', '', 'No', 'Formato: HH:MM'],
      ['¿Cuál es tu correo electrónico?', 'email', '', 'Sí', 'Ingresa un email válido'],
      ['¿Cuántos años tienes?', 'number', '', 'No', 'Solo números'],
      ['¿Cuál es tu número de teléfono?', 'phone', '', 'No', 'Incluye código de país si es necesario'],
      
      // Ejemplos para tipos avanzados
      ['¿Qué tan satisfecho estás?', 'rating', '1-10', 'No', 'Escala de satisfacción del 1 al 10'],
      ['¿Cuál es tu sitio web?', 'website', '', 'No', 'Ingresa una URL válida'],
      ['¿Cuál es tu código postal?', 'text', '', 'No', 'Código postal de tu domicilio'],
      ['¿Aceptas los términos?', 'yes_no', '', 'Sí', 'Respuesta sí o no']
    ];

    // Crear hoja de cálculo
    const worksheet = XLSX.utils.aoa_to_sheet(exampleData);
    
    // Configurar ancho de columnas
    const columnWidths = [
      { wch: 35 }, // Pregunta
      { wch: 15 }, // Tipo
      { wch: 40 }, // Opciones
      { wch: 10 }, // Requerido
      { wch: 35 }  // Descripción
    ];
    worksheet['!cols'] = columnWidths;

    // Crear libro de trabajo
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Ejemplo Formulario');
    
    // Descargar archivo
    XLSX.writeFile(workbook, 'ejemplo_formulario_completo.xlsx');
  };

  return (
    <Card className="max-w-4xl mx-auto w-full">
      <CardHeader>
        <CardTitle>Cómo crear tu formulario</CardTitle>
        <CardDescription>
          Sigue estos pasos para crear tu formulario profesional en Google Forms
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Step 1 */}
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
            1
          </div>
          <div>
            <h4 className="font-medium mb-2">Prepara tu archivo</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Organiza tus preguntas en Excel (.xlsx, .xls) o CSV con estas columnas:
            </p>
            <div className="bg-muted/30 p-3 rounded-lg">
              <div className="text-xs space-y-1">
                <div><strong>Pregunta:</strong> El texto de la pregunta</div>
                <div><strong>Tipo:</strong> El tipo de pregunta (ver tipos soportados abajo)</div>
                <div><strong>Opciones:</strong> Para preguntas de selección (separadas por comas)</div>
                <div><strong>Requerido:</strong> Sí/No o true/false</div>
                <div><strong>Descripción:</strong> Texto adicional (opcional)</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Step 2 */}
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">
            2
          </div>
          <div>
            <h4 className="font-medium mb-2">Tipos de preguntas soportados</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="space-y-2">
                <h5 className="font-semibold text-xs mb-2">Tipos Básicos</h5>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">short_text</Badge>
                  <span>Respuesta corta</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">long_text</Badge>
                  <span>Respuesta larga</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">multiple_choice</Badge>
                  <span>Opción múltiple</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">checkboxes</Badge>
                  <span>Casillas múltiples</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">dropdown</Badge>
                  <span>Lista desplegable</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">linear_scale</Badge>
                  <span>Escala lineal</span>
                </div>
              </div>
              <div className="space-y-2">
                <h5 className="font-semibold text-xs mb-2">Tipos Avanzados</h5>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">rating</Badge>
                  <span>Escala de calificación</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">date</Badge>
                  <span>Fecha</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">time</Badge>
                  <span>Hora</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">email</Badge>
                  <span>Correo electrónico</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">number</Badge>
                  <span>Número</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">phone</Badge>
                  <span>Teléfono</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Step 3 */}
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-bold">
            3
          </div>
          <div>
            <h4 className="font-medium mb-2">Formatos de archivo soportados</h4>
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge variant="secondary">.xlsx</Badge>
              <Badge variant="secondary">.xls</Badge>
              <Badge variant="secondary">.csv</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Tamaño máximo: 10MB. El sistema detecta automáticamente si tu archivo tiene cabeceras.
            </p>
          </div>
        </div>

        {/* Step 4 */}
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold">
            4
          </div>
          <div>
            <h4 className="font-medium mb-2">Revisa y publica</h4>
            <p className="text-sm text-muted-foreground">
              Sube tu archivo, revisa la vista previa, personaliza título y descripción, y créalo directamente en Google Forms. 
              Obtendrás enlaces para ver y editar el formulario.
            </p>
          </div>
        </div>

        {/* Example and Download */}
        <div className="mt-6 space-y-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h5 className="text-sm font-medium mb-3">💡 Ejemplo de estructura CSV:</h5>
            <code className="text-xs block bg-white dark:bg-slate-800 p-3 rounded border font-mono">
              Pregunta,Tipo,Opciones,Requerido<br/>
            ¿Cuál es tu nombre?,short_text,,Sí<br/>
            ¿Cuál es tu color favorito?,multiple_choice,"Rojo,Azul,Verde,Amarillo",No<br/>
            Comentarios adicionales,long_text,,No
            </code>
          </div>
          
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="text-sm font-medium mb-1">🚀 ¿Quieres un ejemplo completo?</h5>
                <p className="text-xs text-muted-foreground">
                  Descarga un archivo Excel con ejemplos de todos los tipos de preguntas
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={generateExampleExcel}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Descargar Ejemplo
              </Button>
            </div>
          </div>
        </div>

        {/* Additional Tips */}
        <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <h5 className="text-sm font-medium mb-2">💡 Consejos adicionales:</h5>
          <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
            <li>Asegúrate de que la primera fila contenga los nombres de las columnas</li>
            <li>Para escalas lineales, usa el formato "min-max" (ej: 1-5, 1-10)</li>
            <li>Las opciones múltiples deben separarse con comas</li>
            <li>Puedes dejar celdas vacías en columnas opcionales como "Descripción"</li>
            <li>El sistema validará automáticamente el formato de tu archivo</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}