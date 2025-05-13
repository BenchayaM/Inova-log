import { type NextRequest, NextResponse } from "next/server"
import { buscarClientePorId, atualizarCliente, excluirCliente } from "@/lib/clients"

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

// Headers CORS comuns
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

// GET - Buscar cliente por ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log("GET request para cliente ID:", params.id)
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ success: false, message: "ID inválido" }, { status: 400, headers: corsHeaders })
    }

    const result = await buscarClientePorId(id)

    if (result.success) {
      return NextResponse.json({ success: true, cliente: result.data }, { headers: corsHeaders })
    } else {
      return NextResponse.json({ success: false, message: result.message }, { status: 404, headers: corsHeaders })
    }
  } catch (error) {
    console.error("Erro ao processar requisição GET por ID:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Erro interno do servidor",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500, headers: corsHeaders },
    )
  }
}

// PUT - Atualizar cliente
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log("PUT request para cliente ID:", params.id)
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ success: false, message: "ID inválido" }, { status: 400, headers: corsHeaders })
    }

    let body
    try {
      const text = await request.text()
      console.log("Corpo da requisição PUT (texto):", text)

      if (!text) {
        return NextResponse.json(
          { success: false, message: "Corpo da requisição vazio" },
          { status: 400, headers: corsHeaders },
        )
      }

      try {
        body = JSON.parse(text)
        console.log("Corpo da requisição PUT (JSON):", body)
      } catch (parseError) {
        console.error("Erro ao fazer parse do JSON:", parseError)
        return NextResponse.json(
          { success: false, message: "Formato JSON inválido", error: String(parseError) },
          { status: 400, headers: corsHeaders },
        )
      }
    } catch (bodyError) {
      console.error("Erro ao ler o corpo da requisição PUT:", bodyError)
      return NextResponse.json(
        { success: false, message: "Erro ao ler o corpo da requisição", error: String(bodyError) },
        { status: 400, headers: corsHeaders },
      )
    }

    const result = await atualizarCliente(id, body)

    if (result.success) {
      return NextResponse.json(
        {
          success: true,
          message: result.message,
          affectedRows: result.affectedRows,
        },
        { headers: corsHeaders },
      )
    } else {
      return NextResponse.json({ success: false, message: result.message }, { status: 400, headers: corsHeaders })
    }
  } catch (error) {
    console.error("Erro ao processar requisição PUT:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Erro interno do servidor",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500, headers: corsHeaders },
    )
  }
}

// DELETE - Excluir cliente
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log("DELETE request para cliente ID:", params.id)
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ success: false, message: "ID inválido" }, { status: 400, headers: corsHeaders })
    }

    const result = await excluirCliente(id)

    if (result.success) {
      return NextResponse.json(
        {
          success: true,
          message: result.message,
        },
        { headers: corsHeaders },
      )
    } else {
      return NextResponse.json({ success: false, message: result.message }, { status: 404, headers: corsHeaders })
    }
  } catch (error) {
    console.error("Erro ao processar requisição DELETE:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Erro interno do servidor",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500, headers: corsHeaders },
    )
  }
}
