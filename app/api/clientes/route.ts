import { type NextRequest, NextResponse } from "next/server"
import { listarClientes, adicionarCliente, buscarClientes } from "@/lib/clients"
import type { Cliente } from "@/lib/clients"

// GET - Listar todos os clientes ou buscar por termo
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const termo = searchParams.get("termo")

    let result
    if (termo) {
      result = await buscarClientes(termo)
    } else {
      result = await listarClientes()
    }

    if (result.success) {
      return NextResponse.json({ success: true, clientes: result.data })
    } else {
      return NextResponse.json({ success: false, message: result.message }, { status: 400 })
    }
  } catch (error) {
    console.error("Erro ao processar requisição:", error)
    return NextResponse.json({ success: false, message: "Erro interno do servidor" }, { status: 500 })
  }
}

// POST - Adicionar novo cliente
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validar apenas campos obrigatórios
    if (!body.nome || !body.email || !body.telefone) {
      return NextResponse.json({ success: false, message: "Campos obrigatórios não preenchidos" }, { status: 400 })
    }

    const cliente: Cliente = {
      nome: body.nome,
      email: body.email,
      telefone: body.telefone,
      endereco: body.endereco || null,
      cidade: body.cidade || null,
      estado: body.estado || null,
      pais: body.pais || "Brasil",
      cep: body.cep || null,
      contato: body.contato || null,
      status: body.status || "Ativo",
      observacoes: body.observacoes || null,
      // Novos campos
      telefone_secundario: body.telefone_secundario || null,
      website: body.website || null,
      cargo_contato: body.cargo_contato || null,
      cnpj_cpf: body.cnpj_cpf || null,
      inscricao_estadual: body.inscricao_estadual || null,
      regime_tributario: body.regime_tributario || null,
      segmento: body.segmento || null,
      condicoes_pagamento: body.condicoes_pagamento || null,
      classificacao: body.classificacao || null,
      origem: body.origem || null,
    }

    const result = await adicionarCliente(cliente)

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
        id: result.id,
      })
    } else {
      return NextResponse.json({ success: false, message: result.message }, { status: 400 })
    }
  } catch (error) {
    console.error("Erro ao processar requisição:", error)
    return NextResponse.json({ success: false, message: "Erro interno do servidor" }, { status: 500 })
  }
}
