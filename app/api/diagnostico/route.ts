import { NextResponse } from "next/server"
import { testConnection } from "@/lib/db"
import mysql from "mysql2/promise"

// Rota de diagnóstico avançado para verificar a conexão com o banco de dados
export async function GET() {
  try {
    // Testar a conexão usando o pool configurado
    console.log("Testando conexão usando o pool configurado...")
    const poolConnected = await testConnection()

    // Configuração para teste direto
    const dbConfig = {
      host: process.env.DB_HOST || "187.109.36.173",
      port: Number.parseInt(process.env.DB_PORT || "3306"),
      user: process.env.DB_USER || "inovalog_gb",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "inovalog_db",
    }

    console.log("Tentando conexão direta com as configurações:", {
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      database: dbConfig.database,
      password: dbConfig.password ? "[SENHA CONFIGURADA]" : "[SENHA NÃO CONFIGURADA]",
    })

    // Tentar uma conexão direta (sem pool)
    let directConnection = null
    let directConnected = false
    let errorMessage = null

    try {
      directConnection = await mysql.createConnection(dbConfig)
      console.log("Conexão direta estabelecida com sucesso!")

      // Testar com uma consulta simples
      const [rows] = await directConnection.execute("SELECT 1 as test")
      console.log("Consulta de teste executada com sucesso:", rows)

      directConnected = true
    } catch (dbError) {
      console.error("Erro na conexão direta:", dbError)
      errorMessage = dbError instanceof Error ? dbError.message : String(dbError)
    } finally {
      if (directConnection) {
        try {
          await directConnection.end()
          console.log("Conexão direta encerrada")
        } catch (endError) {
          console.error("Erro ao encerrar conexão direta:", endError)
        }
      }
    }

    // Tentar listar as tabelas se a conexão for bem-sucedida
    let tables = []
    if (directConnected) {
      try {
        const conn = await mysql.createConnection(dbConfig)
        const [rows] = await conn.execute("SHOW TABLES")
        tables = rows
        console.log("Tabelas encontradas:", tables)
        await conn.end()
      } catch (tablesError) {
        console.error("Erro ao listar tabelas:", tablesError)
      }
    }

    // Retornar resultados detalhados
    return NextResponse.json({
      success: true,
      poolConnection: {
        connected: poolConnected,
        message: poolConnected ? "Conexão com pool estabelecida com sucesso" : "Falha na conexão com pool",
      },
      directConnection: {
        connected: directConnected,
        message: directConnected ? "Conexão direta estabelecida com sucesso" : "Falha na conexão direta",
        error: errorMessage,
      },
      tables: tables,
      env: {
        host: process.env.DB_HOST || "187.109.36.173",
        port: process.env.DB_PORT || "3306",
        user: process.env.DB_USER || "inovalog_gb",
        database: process.env.DB_NAME || "inovalog_db",
        password: process.env.DB_PASSWORD ? "definido" : "não definido",
      },
      tips: [
        "Verifique se o servidor MySQL permite conexões remotas",
        "Confirme se o usuário tem permissão para acessar de hosts remotos",
        "Verifique se a porta 3306 está aberta no firewall",
        "Certifique-se de que a senha está correta",
      ],
    })
  } catch (error) {
    console.error("Erro na rota de diagnóstico:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Erro ao executar diagnóstico",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
