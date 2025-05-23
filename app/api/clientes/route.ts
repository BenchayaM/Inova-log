import { type NextRequest, NextResponse } from "next/server"
import { listarClientes, adicionarCliente, buscarClientes } from "@/lib/clients"
import type { Cliente } from "@/lib/clients"

// Configuração de CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  })
}

// GET - Listar todos os clientes ou buscar por termo
export async function GET(request: NextRequest) {
  // Adicionar headers CORS
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  }

  try {
    console.log("GET /api/clientes - Iniciando processamento")

    const searchParams = request.nextUrl.searchParams
    const termo = searchParams.get("termo")
    console.log("Termo de busca:", termo || "nenhum")

    let result
    if (termo) {
      result = await buscarClientes(termo)
    } else {
      result = await listarClientes()
    }

    console.log("Resultado da consulta:", result)

    if (result.success) {
      console.log(`Retornando ${(result.data as any[]).length} clientes`)
      return NextResponse.json({ success: true, clientes: result.data }, { headers })
    } else {
      console.error("Erro na consulta:", result.message)
      return NextResponse.json({ success: false, message: result.message }, { status: 400, headers })
    }
  } catch (error) {
    console.error("Erro ao processar requisição GET:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Erro interno do servidor",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500, headers: headers },
    )
  }
}

// POST - Adicionar novo cliente
export async function POST(request: NextRequest) {
  // Adicionar headers CORS
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  }

  try {
    console.log("POST /api/clientes - Iniciando processamento")

    // Log da requisição completa
    console.log("Requisição POST recebida:", {
      url: request.url,
      method: request.method,
      headers: Object.fromEntries(request.headers.entries()),
    })

    // Tentar obter o corpo da requisição como texto
    let text = ""
    try {
      text = await request.text()
      console.log("Corpo da requisição (texto):", text)
    } catch (textError) {
      console.error("Erro ao ler o corpo da requisição como texto:", textError)
      return NextResponse.json(
        { success: false, message: "Erro ao ler o corpo da requisição" },
        { status: 400, headers },
      )
    }

    // Verificar se o corpo está vazio
    if (!text || text.trim() === "") {
      console.error("Corpo da requisição vazio")
      return NextResponse.json({ success: false, message: "Corpo da requisição vazio" }, { status: 400, headers })
    }

    // Tentar fazer parse do JSON
    let body
    try {
      body = JSON.parse(text)
      console.log("Corpo da requisição (JSON):", body)
    } catch (parseError) {
      console.error("Erro ao fazer parse do JSON:", parseError)
      return NextResponse.json(
        { success: false, message: "Formato JSON inválido", error: String(parseError) },
        { status: 400, headers },
      )
    }

    // Validar campos obrigatórios
    if (!body.nome || !body.email) {
      console.log("Campos obrigatórios não preenchidos:", {
        nome: body.nome,
        email: body.email,
      })

      return NextResponse.json(
        { success: false, message: "Campos obrigatórios não preenchidos (nome e email)" },
        { status: 400, headers },
      )
    }

    // Criar objeto cliente com campos mínimos
    const cliente: Cliente = {
      nome: body.nome,
      email: body.email,
    }

    // Adicionar campos opcionais se fornecidos
    if (body.telefone) cliente.telefone = body.telefone
    if (body.endereco) cliente.endereco = body.endereco
    if (body.cidade) cliente.cidade = body.cidade
    if (body.estado) cliente.estado = body.estado
    if (body.pais) cliente.pais = body.pais
    if (body.cep) cliente.cep = body.cep
    if (body.contato) cliente.contato = body.contato
    if (body.status) cliente.status = body.status
    if (body.cnpj_cpf) cliente.cnpj_cpf = body.cnpj_cpf
    if (body.inscricao_estadual) cliente.inscricao_estadual = body.inscricao_estadual
    if (body.cargo_contato) cliente.cargo_contato = body.cargo_contato
    if (body.segmento) cliente.segmento = body.segmento
    if (body.observacoes) cliente.observacoes = body.observacoes

    console.log("Cliente a ser adicionado:", cliente)

    // Chamar a função para adicionar o cliente
    const result = await adicionarCliente(cliente)
    console.log("Resultado da operação:", result)

    if (result.success) {
      return NextResponse.json({ success: true, message: result.message, id: result.id }, { headers })
    } else {
      return NextResponse.json({ success: false, message: result.message }, { status: 400, headers })
    }
  } catch (error) {
    console.error("Erro ao processar requisição POST:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Erro interno do servidor",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500, headers },
    )
  }
}
