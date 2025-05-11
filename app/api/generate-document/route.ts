// app/api/generate-document/route.ts
import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";
import { uploadToBraslink } from "@/lib/storage";

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
    }

    // Simular geração de PDF (sem usar pdfkit)
    console.log(`Gerando documento ${documentType} para cliente ${cliente[0].nome}`);
    
    // Simular buffer de PDF
    const pdfBuffer = Buffer.from('Conteúdo simulado do PDF');
    
    // Nome do arquivo
    const filename = `${documentType}_${cliente[0].nome.replace(/\s+/g, '_')}`;
    
    // Simular upload para a Braslink
    const fileUrl = await uploadToBraslink(pdfBuffer, filename, documentType);
    
    return NextResponse.json({
      success: true,
      message: `${documentType} gerado com sucesso! (simulação)`,
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
