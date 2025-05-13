import { NextRequest, NextResponse } from "next/server";
import { listarClientes, adicionarCliente, buscarClientes } from "@/lib/clients";

// GET - Listar todos os clientes ou buscar por termo
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const termo = searchParams.get("termo");

    let result;
    if (termo) {
      result = await buscarClientes(termo);
    } else {
      result = await listarClientes();
    }

    if (result.success) {
      return NextResponse.json({ success: true, clientes: result.data });
    } else {
      return NextResponse.json({ success: false, message: result.message }, { status: 400 });
    }
  } catch (error) {
    console.error("Erro ao processar requisição:", error);
    return NextResponse.json({ success: false, message: "Erro interno do servidor" }, { status: 500 });
  }
}

// POST - Adicionar novo cliente
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validar apenas campos realmente obrigatórios
    if (!body.nome || !body.email || !body.telefone) {
      return NextResponse.json({ 
        success: false, 
        message: "Campos obrigatórios não preenchidos (Nome, Email e Telefone são obrigatórios)" 
      }, { status: 400 });
    }

    // Definir status como "Ativo" por padrão se não for fornecido
    if (!body.status) {
      body.status = "Ativo";
    }

    const result = await adicionarCliente(body);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
        id: result.id,
      });
    } else {
      return NextResponse.json({ success: false, message: result.message }, { status: 400 });
    }
  } catch (error) {
    console.error("Erro ao processar requisição:", error);
    return NextResponse.json({ success: false, message: "Erro interno do servidor" }, { status: 500 });
  }
}
