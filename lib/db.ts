// lib/db.ts
import mysql from 'mysql2/promise';

// Função para conectar ao banco de dados
export async function connectToDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });
    
    return connection;
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
    throw error;
  }
}

// Função para executar queries
export async function executeQuery<T>(query: string, params: any[] = []): Promise<T> {
  const connection = await connectToDatabase();
  try {
    const [results] = await connection.query(query, params);
    return results as T;
  } finally {
    await connection.end();
  }
}
