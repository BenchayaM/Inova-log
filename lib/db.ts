// lib/db.ts

// Interface para simular resultados do banco de dados
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

// Função simulada para executar queries
export async function executeQuery<T>(query: string, params: any[] = []): Promise<T> {
  console.log('Executando query:', query, 'com parâmetros:', params);
  
  // Dados simulados
  const clientes: Cliente[] = [
    { id: 1, nome: 'Cliente Teste', email: 'cliente@teste.com' }
  ];
  
  const orcamentos: Orcamento[] = [
    { id: 1, cliente_id: 1, valor: 1000, data: '2023-05-10' }
  ];
  
  // Simular diferentes queries
  if (query.includes('clientes')) {
    return clientes.filter(c => c.id === params[0]) as unknown as T;
  } else if (query.includes('orcamentos')) {
    return orcamentos.filter(o => o.cliente_id === params[0]) as unknown as T;
  }
  
  return [] as unknown as T;
}
