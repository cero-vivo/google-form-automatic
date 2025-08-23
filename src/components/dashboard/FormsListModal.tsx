'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { UserForm } from '@/infrastructure/google/google-forms-service';

interface GoogleForm {
  title: string;
  description?: string;
  responseCount?: number;
  createdAt?: string;
  modifiedAt?: string;
  googleFormUrl?: string;
  editUrl?: string;
}

interface FormsListModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  forms: UserForm[];
}

export function FormsListModal({ isOpen, onClose, isLoading, forms }: FormsListModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-white rounded-lg shadow-lg w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Mis Formularios</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>
          
          <div className="max-h-[60vh] overflow-y-auto">
            {isLoading ? (
              <div className="text-center py-12 text-gray-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <h3 className="text-lg font-medium mb-2">Cargando formularios...</h3>
                <p className="text-sm">Obteniendo tus formularios de Google Forms</p>
              </div>
            ) : forms.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No tienes formularios creados aún</h3>
                <p className="text-sm">Crea tu primer formulario subiendo un archivo Excel o CSV</p>
                <button
                  onClick={onClose}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Crear mi primer formulario
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {forms.map((form, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900 mb-1">
                          {form.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">
                          {form.description || 'Sin descripción'}
                        </p>
                        <div className="flex items-center gap-6 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            📅 Creado {form.createdAt ? new Date(form.createdAt).toLocaleDateString() : 'hace poco'}
                          </span>
                          <span className="flex items-center gap-1">
                            ✏️ Modificado {form.modifiedAt ? new Date(form.modifiedAt).toLocaleDateString() : 'hace poco'}
                          </span>
                        </div>
                      </div>
                    </div>
                    {form.googleFormUrl && (
                      <div className="flex gap-3">
                        <a
                          href={form.googleFormUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                          Ver formulario
                        </a>
                        {form.editUrl && (
                          <a
                            href={form.editUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 text-sm border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                          >
                            Editar en Google Forms
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}