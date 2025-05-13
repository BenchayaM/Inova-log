import { NextRequest, NextResponse } from "next/server";
import { buscarClientePorId, atualizarCliente, excluirCliente } from "@/lib/clients";

// GET - Buscar cliente por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number.parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, message: "ID inválido" },
        { status: 400 }
      );
    }

    const result = await buscarClientePorId(id);

    if (result.success) {
      return NextResponse.json({ success: true, cliente: result.data });
    } else {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Erro ao processar requisição:", error);
    return NextResponse.json(
      { success: false, message: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// PUT - Atualizar cliente
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number.parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, message: "ID inválido" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const result = await atualizarCliente(id, body);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
        affectedRows: result.affectedRows,
      });
    } else {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Erro ao processar requisição:", error);
    return NextResponse.json(
      { success: false, message: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// DELETE - Excluir cliente
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number.parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, message: "ID inválido" },
        { status: 400 }
      );
    }

    const result = await excluirCliente(id);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
      });
    } else {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Erro ao processar requisição:", error);
    return NextResponse.json(
      { success: false, message: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
