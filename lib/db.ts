// lib/db.ts
import mysql from 'mysql2/promise';

// Configuração da conexão com o banco de dados
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Função para executar consultas SQL
export async function executeQuery<T>(
  query: string,
  params: any[] = []
): Promise<T[]> {
  try {
    console.log('Conectando ao banco de dados com config:', {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      database: process.env.DB_NAME
    });
    
    // Criar uma conexão com o banco de dados
    const connection = await mysql.createConnection(dbConfig);
    
    console.log('Conexão estabelecida, executando query:', query);
    
    // Executar a consulta
    const [rows] = await connection.execute(query, params);
    
    // Fechar a conexão
    await connection.end();
    
    console.log('Query executada com sucesso, resultado:', rows);
    
    // Retornar os resultados
    return rows as T[];
  } catch (error) {
    console.error('Erro ao executar consulta SQL:', error);
    throw error;
  }
}

// Interfaces para tipagem (você pode manter estas)
export interface Cliente {
  id: number;
  nome: string;
  email: string;
}

export interface Orcamento {
  id: number;
  cliente_id: number;
  valor: number;
  data: string;
}
