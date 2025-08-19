'use client';

import { useState, useCallback } from 'react';
import { Question } from '@/domain/entities/question';
import { FileParserServiceImpl, FileValidationResult } from '@/application/services/file-parser-service';

export interface UseFileUploadReturn {
  // Estado
  file: File | null;
  questions: Question[];
  loading: boolean;
  progress: number;
  error: string | null;
  validation: FileValidationResult | null;
  
  // Acciones
  handleFileSelect: (file: File) => Promise<void>;
  handleFileDrop: (event: React.DragEvent<HTMLDivElement>) => Promise<void>;
  clearFile: () => void;
  clearError: () => void;
  retryParsing: () => Promise<void>;
}

export const useFileUpload = (): UseFileUploadReturn => {
  const [file, setFile] = useState<File | null>(null);
  console.log("🚀 ~ useFileUpload ~ file:", file)
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [validation, setValidation] = useState<FileValidationResult | null>(null);

  // Instancia del servicio parser
  const fileParserService = new FileParserServiceImpl();

  const processFile = useCallback(async (selectedFile: File) => {
    try {
      setLoading(true);
      setError(null);
      setProgress(0);

      // Validar formato del archivo
      setProgress(20);
      const validationResult = await fileParserService.validateFileFormat(selectedFile);
      setValidation(validationResult);

      if (!validationResult.isValid) {
        throw new Error(`Archivo inválido: ${validationResult.errors.join(', ')}`);
      }

      // Simular progreso
      setProgress(40);

      // Parsear el archivo
      setProgress(60);
      const parsedQuestions = await fileParserService.parseFile(selectedFile);

      // Validar que se encontraron preguntas
      if (parsedQuestions.length === 0) {
        throw new Error('No se encontraron preguntas válidas en el archivo');
      }

      // Actualizar estado con los resultados
      setProgress(80);
      setQuestions(parsedQuestions);
      setFile(selectedFile);
      
      // Completar progreso
      setProgress(100);

      // Log para debugging
      console.log(`✅ Archivo procesado exitosamente: ${parsedQuestions.length} preguntas encontradas`);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al procesar el archivo';
      setError(errorMessage);
      console.error('❌ Error al procesar archivo:', errorMessage);
      
      // Limpiar estado en caso de error
      setFile(null);
      setQuestions([]);
      setValidation(null);
    } finally {
      setLoading(false);
      // Reset progress después de un delay
      setTimeout(() => setProgress(0), 1000);
    }
  }, [fileParserService]);

  const handleFileSelect = useCallback(async (selectedFile: File) => {
    await processFile(selectedFile);
  }, [processFile]);

  const handleFileDrop = useCallback(async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    
    const droppedFiles = Array.from(event.dataTransfer.files);
    
    if (droppedFiles.length === 0) {
      setError('No se detectaron archivos');
      return;
    }

    if (droppedFiles.length > 1) {
      setError('Solo se puede procesar un archivo a la vez');
      return;
    }

    const droppedFile = droppedFiles[0];
    await processFile(droppedFile);
  }, [processFile]);

  const clearFile = useCallback(() => {
    setFile(null);
    setQuestions([]);
    setError(null);
    setValidation(null);
    setProgress(0);
    console.log('🧹 Archivo y datos limpiados');
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const retryParsing = useCallback(async () => {
    if (file) {
      console.log('🔄 Reintentando parsear archivo:', file.name);
      await processFile(file);
    }
  }, [file, processFile]);

  return {
    // Estado
    file,
    questions,
    loading,
    progress,
    error,
    validation,
    
    // Acciones
    handleFileSelect,
    handleFileDrop,
    clearFile,
    clearError,
    retryParsing
  };
}; 