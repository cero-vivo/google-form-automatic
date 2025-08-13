'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';

interface QuestionType {
  type: string;
  icon: string;
  label: string;
  description: string;
  color: string;
}

const questionTypes: QuestionType[] = [
  {
    type: 'short_text',
    icon: '📝',
    label: 'Texto corto',
    description: 'Respuesta corta de una línea',
    color: 'from-blue-500 to-blue-600'
  },
  {
    type: 'long_text',
    icon: '📄',
    label: 'Texto largo',
    description: 'Respuesta larga de párrafo',
    color: 'from-indigo-500 to-indigo-600'
  },
  {
    type: 'multiple_choice',
    icon: '🔘',
    label: 'Opción múltiple',
    description: 'Selecciona una opción',
    color: 'from-green-500 to-green-600'
  },
  {
    type: 'checkboxes',
    icon: '☑️',
    label: 'Casillas',
    description: 'Selecciona varias opciones',
    color: 'from-purple-500 to-purple-600'
  },
  {
    type: 'dropdown',
    icon: '📋',
    label: 'Desplegable',
    description: 'Lista desplegable',
    color: 'from-orange-500 to-orange-600'
  },
  {
    type: 'scale',
    icon: '📊',
    label: 'Escala',
    description: 'Escala del 1 al 5, 1 al 10',
    color: 'from-pink-500 to-pink-600'
  },
  {
    type: 'date',
    icon: '📅',
    label: 'Fecha',
    description: 'Selector de fecha',
    color: 'from-yellow-500 to-yellow-600'
  },
  {
    type: 'email',
    icon: '📧',
    label: 'Email',
    description: 'Dirección de correo',
    color: 'from-red-500 to-red-600'
  },
  {
    type: 'number',
    icon: '🔢',
    label: 'Número',
    description: 'Solo números',
    color: 'from-teal-500 to-teal-600'
  }
];

interface QuestionTypePaletteProps {
  onSelectType: (type: string) => void;
}

export default function QuestionTypePalette({ onSelectType }: QuestionTypePaletteProps) {
  return (
    <Card className="p-4 mb-4">
      <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
        {questionTypes.map((type, index) => (
          <motion.button
            key={type.type}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectType(type.type)}
            className="group relative p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200 text-center"
          >
            <div className="text-2xl mb-1">{type.icon}</div>
            <div className="text-xs font-medium text-slate-700 dark:text-slate-300">
              {type.label}
            </div>
            
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <div className="bg-slate-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                {type.description}
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </Card>
  );
}