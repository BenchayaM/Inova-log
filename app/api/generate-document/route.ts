// app/api/generate-document/route.ts
import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";
import { uploadToBraslink } from "@/lib/storage";
import PDFDocument from "pdfkit";

export async function POST(request: Request) {
  try {
    const { documentType, clienteId, data } = await request.json();

    // Buscar dados do cliente do banco de dados
    const cliente = await executeQuery<any>(
      'SELECT * FROM clientes WHERE id = ?',
      [clienteId]
    );

    if (!cliente || cliente.length === 0) {
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
    } else if (documentType === 'invoice') {
      documentData = await executeQuery<any>(
        'SELECT * FROM pedidos WHERE cliente_id = ? ORDER BY data DESC LIMIT 1',
        [clienteId]
      );
    }

    // Gerar o PDF
    const doc = new PDFDocument();
    const chunks: Buffer[] = [];
    
    doc.on('data', (chunk) => chunks.push(chunk));
    
    // Adicionar conteúdo ao PDF
    doc.fontSize(25).text(`${documentType.toUpperCase()}`, 100, 80);
    doc.fontSize(15).text(`Cliente: ${cliente[0].nome}`, 100, 160);
    doc.fontSize(12).text(`Data: ${new Date().toLocaleDateString()}`, 100, 190);
    
    // Adicionar mais conteúdo com base no tipo de documento e dados
    if (documentData && documentData.length > 0) {
      doc.text(`Valor: $${documentData[0].valor}`, 100, 220);
      // Adicione mais campos conforme necessário
    }
    
    doc.end();
    
    // Aguardar a finalização do PDF
    await new Promise<void>((resolve) => {
      doc.on('end', () => resolve());
    });
    
    // Converter chunks para buffer
    const pdfBuffer = Buffer.concat(chunks);
    
    // Nome do arquivo
    const filename = `${documentType}_${cliente[0].nome.replace(/\s+/g, '_')}`;
    
    // Fazer upload para a Braslink
    const fileUrl = await uploadToBraslink(pdfBuffer, filename, documentType);
    
    return NextResponse.json({
      success: true,
      message: `${documentType} gerado com sucesso!`,
      document: {
        cliente: cliente[0].nome,
        createdAt: new Date().toISOString(),
        documentUrl: fileUrl,
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

