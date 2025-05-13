// lib/db.ts
import mysql from "mysql2/promise"

// Configuração da conexão com o banco de dados
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: Number.parseInt(process.env.DB_PORT || "3306"),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "inovalog_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
}

// Criação do pool de conexões
const pool = mysql.createPool(dbConfig)

// Função para testar a conexão
export async function testConnection() {
  try {
    const connection = await pool.getConnection()
    console.log("Conexão com o banco de dados estabelecida com sucesso!")
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
