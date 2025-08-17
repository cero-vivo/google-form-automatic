import { Question } from '@/domain/entities/question';
import { QuestionType, ValidationRuleType } from '@/domain/types';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

export interface FileParserService {
  parseFile(file: File): Promise<Question[]>;
  validateFileFormat(file: File): Promise<FileValidationResult>;
  parseExcel(file: File): Promise<Question[]>;
  parseCSV(file: File): Promise<Question[]>;
}

export interface FileValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  rowCount: number;
  columnCount: number;
}

export interface ParsedRow {
  question: string;
  type: string;
  options?: string;
  required?: string | boolean;
  description?: string;
  validation?: string;
}

export class FileParserServiceImpl implements FileParserService {
  private readonly supportedTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'application/vnd.ms-excel', // .xls
    'text/csv', // .csv
    'application/csv' // .csv variant
  ];

  async parseFile(file: File): Promise<Question[]> {
    // Validar formato del archivo
    const validation = await this.validateFileFormat(file);
    if (!validation.isValid) {
      throw new Error(`Archivo inválido: ${validation.errors.join(', ')}`);
    }

    // Determinar el tipo de archivo y parsear
    if (this.isExcelFile(file)) {
      return this.parseExcel(file);
    } else if (this.isCSVFile(file)) {
      return this.parseCSV(file);
    } else {
      throw new Error('Formato de archivo no soportado');
    }
  }

  async validateFileFormat(file: File): Promise<FileValidationResult> {
    const result: FileValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      rowCount: 0,
      columnCount: 0
    };

    // Validar tipo de archivo
    if (!this.supportedTypes.includes(file.type)) {
      result.isValid = false;
      result.errors.push('Tipo de archivo no soportado. Use .xlsx, .xls o .csv');
    }

    // Validar tamaño (máximo 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      result.isValid = false;
      result.errors.push('El archivo es demasiado grande. Máximo 10MB permitido');
    }

    // Validar que no esté vacío
    if (file.size === 0) {
      result.isValid = false;
      result.errors.push('El archivo está vacío');
    }

    return result;
  }

  async parseExcel(file: File): Promise<Question[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          
          // Usar la primera hoja
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          
          // Convertir a JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          // Parsear los datos
          const questions = this.parseRowData(jsonData as any[][]);
          resolve(questions);
        } catch (error) {
          reject(new Error(`Error al procesar Excel: ${error}`));
        }
      };

      reader.onerror = () => {
        reject(new Error('Error al leer el archivo'));
      };

      reader.readAsArrayBuffer(file);
    });
  }

  async parseCSV(file: File): Promise<Question[]> {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: false,
        skipEmptyLines: true,
        complete: (results) => {
          try {
            const questions = this.parseRowData(results.data as string[][]);
            resolve(questions);
          } catch (error) {
            reject(new Error(`Error al procesar CSV: ${error}`));
          }
        },
        error: (error) => {
          reject(new Error(`Error al leer CSV: ${error.message}`));
        }
      });
    });
  }

  private parseRowData(data: any[][]): Question[] {
    if (data.length === 0) {
      throw new Error('El archivo está vacío');
    }

    // Detectar si la primera fila son headers
    const hasHeaders = this.detectHeaders(data[0]);
    const startRow = hasHeaders ? 1 : 0;
    const headers = hasHeaders ? this.normalizeHeaders(data[0]) : this.getDefaultHeaders();

    if (data.length <= startRow) {
      throw new Error('No hay datos de preguntas en el archivo');
    }

    const questions: Question[] = [];

    for (let i = startRow; i < data.length; i++) {
      const row = data[i];
      
      // Saltar filas vacías
      if (!row || row.every(cell => !cell || cell.toString().trim() === '')) {
        continue;
      }

      try {
        const question = this.parseRow(row, headers, i + 1);
        if (question) {
          questions.push(question);
        }
      } catch (error) {
        console.warn(`Error en fila ${i + 1}: ${error}`);
        // Continuar con las demás filas en lugar de fallar completamente
      }
    }

    if (questions.length === 0) {
      throw new Error('No se encontraron preguntas válidas en el archivo');
    }

    return questions;
  }

  private detectHeaders(firstRow: any[]): boolean {
    if (!firstRow || firstRow.length === 0) return false;

    const possibleHeaders = [
      'pregunta', 'question', 'titulo', 'title',
      'tipo', 'type', 'kind',
      'opciones', 'options', 'choices',
      'requerido', 'required', 'mandatory'
    ];

    return firstRow.some(cell => 
      cell && possibleHeaders.includes(cell.toString().toLowerCase().trim())
    );
  }

  private normalizeHeaders(headerRow: any[]): string[] {
    return headerRow.map((header: any) => {
      if (!header) return '';
      
      const normalized = header.toString().toLowerCase().trim();
      
      // Mapear headers comunes
      const headerMap: Record<string, string> = {
        'pregunta': 'question',
        'question': 'question',
        'titulo': 'question',
        'title': 'question',
        'tipo': 'type',
        'type': 'type',
        'kind': 'type',
        'opciones': 'options',
        'options': 'options',
        'choices': 'options',
        'requerido': 'required',
        'required': 'required',
        'mandatory': 'required',
        'descripcion': 'description',
        'description': 'description',
        'validacion': 'validation',
        'validation': 'validation'
      };

      return headerMap[normalized] || normalized;
    });
  }

  private getDefaultHeaders(): string[] {
    return ['question', 'type', 'options', 'required', 'description'];
  }

  private detectQuestionTypeFromText(questionText: string, typeHint?: string): QuestionType {
    const text = questionText.toLowerCase();
    
    // FILE_UPLOAD ya no es soportado - usar texto corto como fallback
      if (text.includes('sube') || text.includes('adjunta') || text.includes('carga') || 
          text.includes('pdf') || text.includes('cv') || text.includes('documento') || 
          text.includes('archivo') || text.includes('foto') || text.includes('imagen')) {
        return QuestionType.SHORT_TEXT; // Fallback seguro
      }
    
    // Detectar email
    if (text.includes('email') || text.includes('correo') || text.includes('@')) {
      return QuestionType.EMAIL;
    }
    
    // Detectar número
    if (text.includes('número') || text.includes('teléfono') || text.includes('edad') || 
        text.includes('cuántos') || text.includes('cuántas')) {
      return QuestionType.NUMBER;
    }
    
    // Detectar fecha
    if (text.includes('fecha') || text.includes('cumpleaños') || text.includes('nacimiento')) {
      return QuestionType.DATE;
    }
    
    // Detectar evaluación por palabras clave
    if (text.includes('calificar') || text.includes('rate') || text.includes('evaluar')) {
      return QuestionType.LINEAR_SCALE; // Usar escala como fallback
    }
    
    // Si hay un hint de tipo, usarlo
    if (typeHint) {
      return this.parseQuestionType(typeHint);
    }
    
    return QuestionType.SHORT_TEXT;
  }

  private parseRow(row: any[], headers: string[], rowNumber: number): Question | null {
    const rowData: Record<string, any> = {};
    
    // Mapear datos de la fila con headers
    headers.forEach((header, index) => {
      if (header && row[index] !== undefined) {
        rowData[header] = row[index];
      }
    });

    // Detectar formato específico de Google Forms
    if (this.isGoogleFormsFormat(headers)) {
      return this.parseGoogleFormsRow(row, rowNumber);
    }

    // Validar que tenga pregunta
    const questionText = rowData.question?.toString().trim();
    if (!questionText) {
      throw new Error(`Fila ${rowNumber}: La pregunta es requerida`);
    }

    // Determinar el tipo de pregunta - usar detección inteligente si no hay tipo especificado
    let questionType = this.parseQuestionType(rowData.type?.toString().trim());
    if (questionType === QuestionType.SHORT_TEXT && !rowData.type) {
      questionType = this.detectQuestionTypeFromText(questionText);
    }

    // Parsear opciones si es necesario
    let multipleChoiceConfig;
    if (this.requiresOptions(questionType)) {
      const optionsText = rowData.options?.toString().trim();
      if (!optionsText) {
        throw new Error(`Fila ${rowNumber}: La pregunta "${questionText}" es de tipo ${questionType} y requiere opciones. Por favor, proporciona opciones separadas por comas en la columna 'options'.`);
      }
      
      const options = this.parseOptions(optionsText);
      if (options.length === 0) {
        throw new Error(`Fila ${rowNumber}: La pregunta "${questionText}" es de tipo ${questionType} pero no tiene opciones válidas. Por favor, proporciona al menos una opción.`);
      }
      
      multipleChoiceConfig = {
        options: options,
        allowOther: false
      };
    }

    // Parsear si es requerido
    const required = this.parseRequired(rowData.required);

    // Crear la pregunta
    const question: Question = {
      id: `q_${rowNumber}_${Date.now()}`,
      type: questionType,
      title: questionText,
      description: rowData.description?.toString().trim() || undefined,
      required,
      order: rowNumber - 1,
      multipleChoiceConfig,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Agregar validaciones si están especificadas
    if (rowData.validation) {
      question.validation = this.parseValidations(rowData.validation.toString());
    }

    return question;
  }

  private isGoogleFormsFormat(headers: string[]): boolean {
    // Detectar si el formato es compatible con tu CSV específico
    const headerLower = headers.map(h => h.toLowerCase().trim());
    return headerLower.includes('pregunta') && 
           headerLower.includes('tipo') && 
           headerLower.includes('requerida');
  }

  private parseGoogleFormsRow(row: any[], rowNumber: number): Question | null {
    const [pregunta, tipo, requerida, ...opciones] = row;

    // Saltar filas que son headers de sección o descripciones
    const tipoLower = (tipo || '').toLowerCase().trim();
    if (tipoLower.includes('encabezado') || 
        tipoLower.includes('descripción') || 
        tipoLower.includes('section') ||
        !pregunta || !pregunta.toString().trim()) {
      console.log(`⏭️ Saltando fila ${rowNumber}: tipo "${tipo}"`);
      return null;
    }

    try {
      const questionId = `q_${Date.now()}_${rowNumber}`;
      const isRequired = (requerida || '').toString().toLowerCase().trim() === 'sí' || 
                        (requerida || '').toString().toLowerCase().trim() === 'si' ||
                        (requerida || '').toString().toLowerCase().trim() === 'yes';

      // Mapear tipos de Google Forms a nuestros tipos
      let questionType = this.mapGoogleFormsType(tipoLower);
      
      // Si no se pudo mapear claramente, usar detección inteligente
      if (questionType === QuestionType.SHORT_TEXT && (!tipo || tipo.trim() === '')) {
        questionType = this.detectQuestionTypeFromText(pregunta.toString().trim());
      }
      
      // Filtrar opciones válidas (solo para tipos que las necesitan)
      const validOptions = opciones
        .filter(opt => opt && opt.toString().trim().length > 0)
        .map(opt => opt.toString().trim());

      const question: Question = {
        id: questionId,
        type: questionType,
        title: pregunta.toString().trim(),
        description: undefined,
        required: isRequired,
        order: rowNumber,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Agregar configuración específica según el tipo
      if (questionType === QuestionType.MULTIPLE_CHOICE || 
          questionType === QuestionType.CHECKBOXES || 
          questionType === QuestionType.DROPDOWN) {
        if (validOptions.length === 0) {
          throw new Error(`Fila ${rowNumber}: La pregunta "${pregunta}" es de tipo ${questionType} y requiere opciones. Por favor, proporciona al menos una opción en las columnas de opciones.`);
        }
        
        question.multipleChoiceConfig = {
          options: validOptions,
          allowOther: false
        };
      }

      console.log(`✓ Pregunta parseada: "${question.title}" (${question.type}) - Requerida: ${question.required}`);
      return question;

    } catch (error) {
      console.error(`Error parseando fila ${rowNumber}:`, error);
      return null;
    }
  }

  private mapGoogleFormsType(tipo: string): QuestionType {
    tipo = tipo.toLowerCase().trim();
    
    if (tipo.includes('respuesta corta') || tipo.includes('short')) {
      return QuestionType.SHORT_TEXT;
    }
    if (tipo.includes('respuesta larga') || tipo.includes('long') || tipo.includes('paragraph')) {
      return QuestionType.LONG_TEXT;
    }
    if (tipo.includes('selección múltiple') || tipo.includes('checkbox') || tipo.includes('múltiple')) {
      return QuestionType.CHECKBOXES;
    }
    if (tipo.includes('opción múltiple') || tipo.includes('radio') || tipo.includes('choice')) {
      return QuestionType.MULTIPLE_CHOICE;
    }
    if (tipo.includes('dropdown') || tipo.includes('lista') || tipo.includes('desplegable')) {
      return QuestionType.DROPDOWN;
    }
    if (tipo.includes('escala') || tipo.includes('scale')) {
      return QuestionType.LINEAR_SCALE;
    }
    if (tipo.includes('fecha') || tipo.includes('date')) {
      if (tipo.includes('hora') || tipo.includes('time')) {
        return QuestionType.DATE; // DATETIME eliminado, usar DATE como fallback
      }
      return QuestionType.DATE;
    }
    if (tipo.includes('hora') || tipo.includes('time')) {
      return QuestionType.TIME;
    }
    if (tipo.includes('email') || tipo.includes('correo')) {
      return QuestionType.EMAIL;
    }
    if (tipo.includes('número') || tipo.includes('number')) {
      return QuestionType.NUMBER;
    }
    if (tipo.includes('teléfono') || tipo.includes('phone')) {
      return QuestionType.PHONE;
    }

    // Por defecto, usar texto corto
    return QuestionType.SHORT_TEXT;
  }

  private parseQuestionType(typeText?: string): QuestionType {
    if (!typeText) return QuestionType.SHORT_TEXT;

    const normalizedType = typeText.toLowerCase().trim();
    
    const typeMap: Record<string, QuestionType> = {
      // Texto
      'texto': QuestionType.SHORT_TEXT,
      'text': QuestionType.SHORT_TEXT,
      'texto_corto': QuestionType.SHORT_TEXT,
      'short_text': QuestionType.SHORT_TEXT,
      'texto_largo': QuestionType.LONG_TEXT,
      'long_text': QuestionType.LONG_TEXT,
      'textarea': QuestionType.LONG_TEXT,
      'parrafo': QuestionType.LONG_TEXT,
      'paragraph': QuestionType.LONG_TEXT,
      
      // Opciones múltiples
      'opcion_multiple': QuestionType.MULTIPLE_CHOICE,
      'multiple_choice': QuestionType.MULTIPLE_CHOICE,
      'radio': QuestionType.MULTIPLE_CHOICE,
      'seleccion': QuestionType.MULTIPLE_CHOICE,
      'choice': QuestionType.MULTIPLE_CHOICE,
      
      // Checkboxes
      'checkbox': QuestionType.CHECKBOXES,
      'checkboxes': QuestionType.CHECKBOXES,
      'multiple_select': QuestionType.CHECKBOXES,
      'seleccion_multiple': QuestionType.CHECKBOXES,
      
      // Dropdown
      'dropdown': QuestionType.DROPDOWN,
      'select': QuestionType.DROPDOWN,
      'lista': QuestionType.DROPDOWN,
      'desplegable': QuestionType.DROPDOWN,
      
      // Escala
      'escala': QuestionType.LINEAR_SCALE,
      'scale': QuestionType.LINEAR_SCALE,
      'linear_scale': QuestionType.LINEAR_SCALE,
      'rating': QuestionType.LINEAR_SCALE,
      'calificacion': QuestionType.LINEAR_SCALE,
      
      // Fecha y hora
      'fecha': QuestionType.DATE,
      'date': QuestionType.DATE,
      'hora': QuestionType.TIME,
      'time': QuestionType.TIME,
      
      // FILE_UPLOAD ya no es soportado - se elimina
      
      // Otros
      'email': QuestionType.EMAIL,
      'correo': QuestionType.EMAIL,
      'numero': QuestionType.NUMBER,
      'number': QuestionType.NUMBER,
      'telefono': QuestionType.PHONE,
      'phone': QuestionType.PHONE
    };

    return typeMap[normalizedType] || QuestionType.SHORT_TEXT;
  }

  private requiresOptions(type: QuestionType): boolean {
    return [
      QuestionType.MULTIPLE_CHOICE,
      QuestionType.CHECKBOXES,
      QuestionType.DROPDOWN
    ].includes(type);
  }

  private parseOptions(optionsText: string): string[] {
    // Separar por comas, punto y coma, o líneas nuevas
    const separators = /[,;|\n]/;
    return optionsText
      .split(separators)
      .map(option => option.trim())
      .filter(option => option.length > 0);
  }

  private parseRequired(requiredValue: any): boolean {
    if (typeof requiredValue === 'boolean') {
      return requiredValue;
    }
    
    if (typeof requiredValue === 'string') {
      const normalized = requiredValue.toLowerCase().trim();
      return ['true', 'sí', 'si', 'yes', '1', 'requerido', 'obligatorio'].includes(normalized);
    }
    
    if (typeof requiredValue === 'number') {
      return requiredValue === 1;
    }
    
    return false;
  }

  private parseValidations(validationText: string): any[] {
    const validations: any[] = [];
    
    // Parsear validaciones simples por ahora
    const lowerText = validationText.toLowerCase();
    
    if (lowerText.includes('email')) {
      validations.push({
        type: ValidationRuleType.EMAIL_FORMAT,
        message: 'Debe ser un email válido'
      });
    }
    
    // Buscar longitud mínima
    const minLengthMatch = lowerText.match(/min(?:imo)?[:\s]*(\d+)/);
    if (minLengthMatch) {
      validations.push({
        type: ValidationRuleType.MIN_LENGTH,
        value: parseInt(minLengthMatch[1]),
        message: `Mínimo ${minLengthMatch[1]} caracteres`
      });
    }
    
    // Buscar longitud máxima
    const maxLengthMatch = lowerText.match(/max(?:imo)?[:\s]*(\d+)/);
    if (maxLengthMatch) {
      validations.push({
        type: ValidationRuleType.MAX_LENGTH,
        value: parseInt(maxLengthMatch[1]),
        message: `Máximo ${maxLengthMatch[1]} caracteres`
      });
    }
    
    return validations;
  }

  private isExcelFile(file: File): boolean {
    return [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ].includes(file.type);
  }

  private isCSVFile(file: File): boolean {
    return ['text/csv', 'application/csv'].includes(file.type);
  }
}