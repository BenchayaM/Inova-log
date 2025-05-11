// app/api/test-db/route.ts
import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";

export async function GET() {
  try {
    console.log("Iniciando teste de conexão com o banco de dados");
    
    // Testar a conexão com uma consulta simples
    const result = await executeQuery<any>("SELECT NOW() as time");
    
    // Verificar quantas tabelas existem no banco
    const tables = await executeQuery<any>(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = ?",
      [process.env.DB_NAME]
    );
    
    // Contar registros em algumas tabelas principais
    const clientesCount = await executeQuery<any>("SELECT COUNT(*) as count FROM clientes");
    const produtosCount = await executeQuery<any>("SELECT COUNT(*) as count FROM produtos");
    const orcamentosCount = await executeQuery<any>("SELECT COUNT(*) as count FROM orcamentos");
    const pedidosCount = await executeQuery<any>("SELECT COUNT(*) as count FROM pedidos");
    const documentosCount = await executeQuery<any>("SELECT COUNT(*) as count FROM documentos");
    
    return NextResponse.json({
      success: true,
      message: "Conexão com o banco de dados estabelecida com sucesso!",
      serverTime: result[0].time,
      databaseInfo: {
        host: process.env.DB_HOST?.replace(/:.+/, ":****"), // Oculta a porta por segurança
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        tablesCount: tables.length,
        tables: tables.map((t: any) => t.table_name)
      },
      counts: {
        clientes: clientesCount[0].count,
        produtos: produtosCount[0].count,
        orcamentos: orcamentosCount[0].count,
        pedidos: pedidosCount[0].count,
        documentos: documentosCount[0].count
      }
    });
  } catch (error) {
    console.error("Erro ao conectar ao banco de dados:", error);
    
    return NextResponse.json(
      {
        success: false,
        message: "Erro ao conectar ao banco de dados",
        error: (error as Error).message,
        // Incluir informações de configuração para depuração (sem senhas)
        config: {
          host: process.env.DB_HOST?.replace(/:.+/, ":****"),
          database: process.env.DB_NAME,
          user: process.env.DB_USER
        }
      },
      { status: 500 }
    );
  }
}
