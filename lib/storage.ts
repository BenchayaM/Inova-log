// lib/storage.ts
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import { v4 as uuidv4 } from 'uuid';

// Função para salvar um arquivo temporariamente
async function saveTempFile(buffer: Buffer, extension: string): Promise<string> {
  const tempDir = os.tmpdir();
  const filename = `${uuidv4()}.${extension}`;
  const filepath = path.join(tempDir, filename);
  
  await fs.writeFile(filepath, buffer);
  return filepath;
}

// Função para enviar arquivo para a Braslink via API
export async function uploadToBraslink(buffer: Buffer, filename: string, documentType: string): Promise<string> {
  try {
    // 1. Salvar o arquivo temporariamente
    const tempFilePath = await saveTempFile(buffer, 'pdf');
    
    // 2. Criar o caminho no servidor da Braslink
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    
    // Caminho onde o arquivo será armazenado na Braslink
    const storagePath = `/documentos/${documentType}/${year}/${month}`;
    
    // 3. Nome do arquivo final
    const finalFilename = `${filename}_${Date.now()}.pdf`;
    
    // 4. URL completa do arquivo (para acesso público)
    const fileUrl = `https://www.inova-log.com${storagePath}/${finalFilename}`;
    
    // 5. Criar FormData para envio
    const formData = new FormData();
    formData.append('file', new Blob([buffer]), finalFilename);
    formData.append('path', storagePath);
    
    // 6. Enviar para o servidor da Braslink via API
    const response = await fetch('https://www.inova-log.com/api/upload-file.php', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${process.env.UPLOAD_API_KEY}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Erro ao fazer upload: ${response.statusText}`);
    }
    
    // 7. Limpar o arquivo temporário
    await fs.unlink(tempFilePath);
    
    return fileUrl;
  } catch (error) {
    console.error('Erro ao fazer upload para a Braslink:', error);
    throw error;
  }
}
