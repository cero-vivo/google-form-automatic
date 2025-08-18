import { FileParserServiceImpl } from './application/services/file-parser-service';
import * as XLSX from 'xlsx';
import * as fs from 'fs';

async function debugParser() {
  console.log('🔍 Iniciando debug del parser...');
  
  const filePath = '/Users/luisespinoza/Desktop/Me/projects/google-form-saas/public/form-example.xlsx';
  
  try {
    // Leer el archivo directamente
    const fileBuffer = fs.readFileSync(filePath);
    console.log('📁 Archivo leído exitosamente');
    
    // Parsear con XLSX
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    console.log('📊 Workbook creado:', workbook.SheetNames);
    
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convertir a JSON con headers
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    console.log('📋 Datos JSON:', JSON.stringify(jsonData, null, 2));
    console.log('📊 Total filas:', jsonData.length);
    
    // Crear File object simulado
    const mockFile = new File([fileBuffer], 'form-example.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    
    const parser = new FileParserServiceImpl();
    
    // Validar formato
    const validation = await parser.validateFileFormat(mockFile);
    console.log('✅ Validación:', validation);
    
    // Parsear preguntas
    const questions = await parser.parseFile(mockFile);
    console.log('✅ Preguntas encontradas:', questions.length);
    console.log('📝 Preguntas:', JSON.stringify(questions, null, 2));
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

debugParser();