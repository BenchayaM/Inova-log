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
    console.log("Dados recebidos na API:", body) // Log para depuração

    // Validar apenas campos obrigatórios
    if (!body.nome || !body.email || !body.telefone) {
      console.log("Campos obrigatórios não preenchidos") // Log para depuração
      return NextResponse.json({ success: false, message: "Campos obrigatórios não preenchidos" }, { status: 400 })
    }

    // Simplificar o objeto cliente para incluir apenas os campos básicos
    const cliente: Cliente = {
      nome: body.nome,
      email: body.email,
      telefone: body.telefone,
      status: body.status || "Ativo",
    }

    // Adicionar campos opcionais apenas se estiverem presentes
    if (body.endereco) cliente.endereco = body.endereco
    if (body.cidade) cliente.cidade = body.cidade
    if (body.estado) cliente.estado = body.estado
    if (body.pais) cliente.pais = body.pais
    if (body.cep) cliente.cep = body.cep
    if (body.contato) cliente.contato = body.contato
    if (body.observacoes) cliente.observacoes = body.observacoes
    if (body.telefone_secundario) cliente.telefone_secundario = body.telefone_secundario
    if (body.website) cliente.website = body.website
    if (body.cargo_contato) cliente.cargo_contato = body.cargo_contato
    if (body.cnpj_cpf) cliente.cnpj_cpf = body.cnpj_cpf
    if (body.inscricao_estadual) cliente.inscricao_estadual = body.inscricao_estadual
    if (body.regime_tributario) cliente.regime_tributario = body.regime_tributario
    if (body.segmento) cliente.segmento = body.segmento
    if (body.condicoes_pagamento) cliente.condicoes_pagamento = body.condicoes_pagamento
    if (body.classificacao) cliente.classificacao = body.classificacao
    if (body.origem) cliente.origem = body.origem

    console.log("Enviando para o banco de dados:", cliente) // Log para depuração
    const result = await adicionarCliente(cliente)
    console.log("Resultado da operação:", result) // Log para depuração

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
    return NextResponse.json(
      {
        success: false,
        message: "Erro interno do servidor: " + (error instanceof Error ? error.message : String(error)),
      },
      { status: 500 },
    )
  }
}
