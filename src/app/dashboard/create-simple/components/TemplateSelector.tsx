'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  emoji: string;
  description: string;
  questions: number;
  category: string;
  preview: {
    title: string;
    description: string;
    questions: Array<{
      type: string;
      title: string;
      required: boolean;
    }>;
  };
}

const templates: Template[] = [
  {
    id: 'satisfaction',
    name: 'Encuesta de Satisfacción',
    emoji: '😊',
    description: 'Mide la satisfacción de tus clientes o usuarios',
    questions: 5,
    category: 'Feedback',
    preview: {
      title: '¿Qué tan satisfecho estás con nuestro servicio?',
      description: 'Tu opinión nos ayuda a mejorar',
      questions: [
        { type: 'scale', title: '¿Qué tan satisfecho estás?', required: true },
        { type: 'multiple_choice', title: '¿Qué aspectos valoras más?', required: false },
        { type: 'long_text', title: '¿Algún comentario adicional?', required: false }
      ]
    }
  },
  {
    id: 'event',
    name: 'Registro de Evento',
    emoji: '🎪',
    description: 'Registro rápido para eventos y talleres',
    questions: 8,
    category: 'Eventos',
    preview: {
      title: 'Registro - Taller de Innovación 2024',
      description: 'Completa tu registro para el evento',
      questions: [
        { type: 'short_text', title: 'Nombre completo', required: true },
        { type: 'email', title: 'Correo electrónico', required: true },
        { type: 'multiple_choice', title: '¿Cómo te enteraste?', required: false },
        { type: 'checkboxes', title: 'Requisitos dietéticos', required: false }
      ]
    }
  },
  {
    id: 'feedback',
    name: 'Feedback de Producto',
    emoji: '💬',
    description: 'Recopila opiniones sobre tu producto',
    questions: 6,
    category: 'Producto',
    preview: {
      title: '¿Qué opinas de nuestro nuevo producto?',
      description: 'Ayúdanos a mejorar con tu feedback',
      questions: [
        { type: 'multiple_choice', title: '¿Con qué frecuencia lo usas?', required: true },
        { type: 'scale', title: '¿Qué tan útil es?', required: true },
        { type: 'long_text', title: '¿Qué mejorarías?', required: false }
      ]
    }
  },
  {
    id: 'contact',
    name: 'Formulario de Contacto',
    emoji: '📞',
    description: 'Formulario básico de contacto',
    questions: 4,
    category: 'Contacto',
    preview: {
      title: 'Contáctanos',
      description: 'Estamos aquí para ayudarte',
      questions: [
        { type: 'short_text', title: 'Nombre', required: true },
        { type: 'email', title: 'Email', required: true },
        { type: 'short_text', title: 'Asunto', required: true },
        { type: 'long_text', title: 'Mensaje', required: true }
      ]
    }
  },
  {
    id: 'survey',
    name: 'Encuesta General',
    emoji: '📊',
    description: 'Encuesta versátil para cualquier propósito',
    questions: 5,
    category: 'General',
    preview: {
      title: 'Encuesta de opinión',
      description: 'Comparte tus pensamientos',
      questions: [
        { type: 'multiple_choice', title: '¿Cuál es tu rango de edad?', required: false },
        { type: 'multiple_choice', title: '¿Tu ocupación?', required: false },
        { type: 'scale', title: '¿Qué tan probable es que recomiendes?', required: true }
      ]
    }
  },
  {
    id: 'registration',
    name: 'Registro de Usuario',
    emoji: '👤',
    description: 'Registro simple para nuevos usuarios',
    questions: 5,
    category: 'Registro',
    preview: {
      title: 'Crea tu cuenta',
      description: 'Únete a nuestra comunidad',
      questions: [
        { type: 'short_text', title: 'Nombre de usuario', required: true },
        { type: 'email', title: 'Correo electrónico', required: true },
        { type: 'short_text', title: 'Contraseña', required: true },
        { type: 'checkboxes', title: 'Acepto términos y condiciones', required: true }
      ]
    }
  }
];

interface TemplateSelectorProps {
  onTemplateSelect: (template: string) => void;
  onStartEmpty: () => void;
}

export default function TemplateSelector({ onTemplateSelect, onStartEmpty }: TemplateSelectorProps) {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ¿Cómo quieres empezar?
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Elige una plantilla predefinida o comienza desde cero. Crea formularios profesionales en segundos.
          </p>
        </motion.div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {templates.map((template, index) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card
              className="cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-500 group"
              onClick={() => onTemplateSelect(template.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl flex items-center">
                    <span className="text-2xl mr-3">{template.emoji}</span>
                    {template.name}
                  </CardTitle>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {template.category}
                  </span>
                </div>
                <CardDescription className="text-sm mt-2">
                  {template.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm">
                    <span className="font-medium">{template.questions}</span> preguntas predefinidas
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Vista previa: "{template.preview.title}"
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Start Empty Option */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="text-center"
      >
        <Card className="border-dashed border-2 border-slate-300 dark:border-slate-600 hover:border-blue-500 transition-colors cursor-pointer">
          <CardContent className="py-8">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                <PlusCircle className="h-8 w-8 text-slate-600 dark:text-slate-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Comenzar desde cero</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  Crea un formulario personalizado desde una hoja en blanco
                </p>
                <Button
                  variant="outline"
                  onClick={onStartEmpty}
                  className="border-2 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                >
                  Empezar formulario vacío
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}