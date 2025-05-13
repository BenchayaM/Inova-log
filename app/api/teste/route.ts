import { NextResponse } from "next/server"
import { testConnection } from "@/lib/db"

// Rota de teste simples para verificar a conexão com o banco de dados
export async function GET() {
  try {
    // Testar a conexão com o banco de dados
    const connected = await testConnection()

    // Retornar o resultado do teste
    return NextResponse.json({
      success: true,
      connected: connected,
      message: connected
        ? "Conexão com o banco de dados estabelecida com sucesso!"
        : "Falha ao conectar ao banco de dados",
      env: {
        host: process.env.DB_HOST || "não definido",
        port: process.env.DB_PORT || "não definido",
        user: process.env.DB_USER || "não definido",
        database: process.env.DB_NAME || "não definido",
        // Não exibir a senha por segurança
        password: process.env.DB_PASSWORD ? "definido" : "não definido",
      },
    })
  } catch (error) {
    console.error("Erro na rota de teste:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Erro ao testar conexão",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
