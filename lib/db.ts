// lib/db.ts - Versão simplificada para diagnóstico
import mysql from "mysql2/promise"

// Configuração da conexão com o banco de dados
const dbConfig = {
  host: process.env.DB_HOST || "187.109.36.173",
  port: Number.parseInt(process.env.DB_PORT || "3306"),
  user: process.env.DB_USER || "inovalog_gb",
  password: process.env.DB_PASSWORD || "", // Será substituído pela variável de ambiente
  database: process.env.DB_NAME || "inovalog_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
}

// Log das configurações (sem a senha)
console.log("Configurações de conexão:", {
  host: dbConfig.host,
  port: dbConfig.port,
  user: dbConfig.user,
  database: dbConfig.database,
  password: dbConfig.password ? "[SENHA CONFIGURADA]" : "[SENHA NÃO CONFIGURADA]",
})

// Criação do pool de conexões
const pool = mysql.createPool(dbConfig)

// Função para testar a conexão
export async function testConnection() {
  try {
    console.log("Testando conexão com o banco de dados...")
    const connection = await pool.getConnection()
    console.log("Conexão com o banco de dados estabelecida com sucesso!")

    // Testar com uma consulta simples
    const [rows] = await connection.execute("SELECT 1 as test")
    console.log("Consulta de teste executada com sucesso:", rows)

    connection.release()
    return true
  } catch (error) {
    console.error("Erro ao conectar ao banco de dados:", error)
    return false
  }
}

// Função genérica para executar consultas
export async function query(sql: string, params: any[] = []) {
  try {
    console.log("Executando query:", sql)
    console.log("Parâmetros:", params)

    const [results] = await pool.execute(sql, params)
    console.log("Resultado da query:", results)

    return { success: true, data: results }
  } catch (error) {
    console.error("Erro na consulta:", error)
    return {
      success: false,
      message:
        "Erro ao executar consulta no banco de dados: " + (error instanceof Error ? error.message : String(error)),
    }
  }
}

// Exportar a função query como padrão para manter compatibilidade com código existente
export default query
