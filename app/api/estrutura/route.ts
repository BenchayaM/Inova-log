import { NextResponse } from "next/server"
import mysql from "mysql2/promise"

export async function GET() {
  try {
    // Configuração da conexão
    const dbConfig = {
      host: process.env.DB_HOST || "187.109.36.173",
      port: Number.parseInt(process.env.DB_PORT || "3306"),
      user: process.env.DB_USER || "inovalog_gb",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "inovalog_db",
    }

    // Conectar ao banco de dados
    const connection = await mysql.createConnection(dbConfig)

    // Obter a estrutura da tabela clientes
    const [clientesStructure] = await connection.execute("DESCRIBE clientes")

    // Obter alguns registros de exemplo
    const [clientesSample] = await connection.execute("SELECT * FROM clientes LIMIT 5")

    // Fechar a conexão
    await connection.end()

    // Retornar os resultados
    return NextResponse.json({
      success: true,
      structure: clientesStructure,
      sample: clientesSample,
    })
  } catch (error) {
    console.error("Erro ao obter estrutura da tabela:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Erro ao obter estrutura da tabela",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
