// app/api/generate-document/route.ts
import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";
import { uploadToBraslink } from "@/lib/storage";
// Importe a biblioteca para geração de PDF (você precisará instalá-la)
// import PDFDocument from 'pdfkit';

export async function POST(request: Request) {
  try {
    const { documentType, clienteId, data } = await request.json();
    console.log(`Iniciando geração de documento ${documentType} para cliente ${clienteId}`);

    // Buscar dados do cliente do banco de dados
    const cliente = await executeQuery<any>(
      'SELECT * FROM clientes WHERE id = ?',
      [clienteId]
    );

    if (!cliente || cliente.length === 0) {
      console.log(`Cliente não encontrado: ${clienteId}`);
      return NextResponse.json(
        { success: false, message: "Cliente não encontrado" },
        { status: 404 }
      );
    }

    // Buscar dados adicionais necessários para o documento
    let documentData;
    if (documentType === 'proforma') {
      documentData = await executeQuery<any>(
        'SELECT * FROM orcamentos WHERE cliente_id = ? ORDER BY data DESC LIMIT 1',
        [clienteId]
      );
      console.log(`Dados do orçamento recuperados: ${JSON.stringify(documentData)}`);
    }

    // Gerar PDF real (descomente e implemente conforme necessário)
    // const pdfBuffer = await generatePDF(documentType, cliente[0], documentData);
    
    // Por enquanto, continuamos com a simulação
    console.log(`Gerando documento ${documentType} para cliente ${cliente[0].nome}`);
    const pdfBuffer = Buffer.from('Conteúdo simulado do PDF');
    
    // Nome do arquivo mais detalhado
    const timestamp = new Date().getTime();
    const filename = `${documentType}_${cliente[0].id}_${timestamp}.pdf`;
    
    console.log(`Iniciando upload para Braslink: ${filename}`);
    // Upload para a Braslink
    const fileUrl = await uploadToBraslink(pdfBuffer, filename, documentType);
    console.log(`Upload concluído. URL: ${fileUrl}`);
    
    // Registrar o documento no banco de dados (opcional)
    // await executeQuery(
    //   'INSERT INTO documentos (cliente_id, tipo, url, data_criacao) VALUES (?, ?, ?, NOW())',
    //   [clienteId, documentType, fileUrl]
    // );
    
    return NextResponse.json({
      success: true,
      message: `${documentType} gerado com sucesso!`,
      document: {
        cliente: cliente[0].nome,
        createdAt: new Date().toISOString(),
        documentUrl: fileUrl,
        filename: filename,
        status: "generated"
      },
    });
  } catch (error) {
    console.error("Erro ao gerar documento:", error);
    return NextResponse.json(
      { success: false, message: "Erro ao gerar documento", error: (error as Error).message },
      { status: 500 }
    );
  }
}

// Função para gerar PDF (implemente conforme necessário)
// async function generatePDF(documentType, cliente, documentData) {
//   // Implementação da geração de PDF
// }
