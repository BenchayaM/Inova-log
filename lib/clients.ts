// lib/clients.ts
import { executeQuery } from './db';

// Interface expandida para Cliente com todos os campos necessários
export interface Cliente {
  id?: number;
  nome: string;
  email: string;
  telefone: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  pais?: string;
  cep?: string;
  contato?: string;
  status: "Ativo" | "Inativo";
  data_cadastro?: Date;
  observacoes?: string;
}

// Listar todos os clientes
export async function listarClientes(): Promise<{ success: boolean; data?: Cliente[]; message?: string }> {
  try {
    const clientes = await executeQuery<Cliente>("SELECT * FROM clientes ORDER BY nome");
    return { success: true, data: clientes };
  } catch (error) {
    console.error("Erro ao listar clientes:", error);
    return { success: false, message: "Erro ao listar clientes" };
  }
}

// Buscar cliente por ID
export async function buscarClientePorId(id: number): Promise<{ success: boolean; data?: Cliente; message?: string }> {
  try {
    const clientes = await executeQuery<Cliente>("SELECT * FROM clientes WHERE id = ?", [id]);
    
    if (clientes && clientes.length > 0) {
      return { success: true, data: clientes[0] };
    } else {
      return { success: false, message: "Cliente não encontrado" };
    }
  } catch (error) {
    console.error("Erro ao buscar cliente:", error);
    return { success: false, message: "Erro ao buscar cliente" };
  }
}

// Adicionar novo cliente
export async function adicionarCliente(cliente: Cliente): Promise<{ success: boolean; message: string; id?: number }> {
  try {
    const result = await executeQuery(
      `INSERT INTO clientes (
        nome, email, telefone, endereco, cidade, estado, pais, 
        cep, contato, status, observacoes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        cliente.nome,
        cliente.email,
        cliente.telefone,
        cliente.endereco || null,
        cliente.cidade || null,
        cliente.estado || null,
        cliente.pais || "Brasil",
        cliente.cep || null,
        cliente.contato || null,
        cliente.status,
        cliente.observacoes || null,
      ]
    );

    // Verificar se a inserção foi bem-sucedida
    // Nota: A estrutura exata do resultado pode variar dependendo da implementação do executeQuery
    const insertId = (result as any).insertId;
    
    return {
      success: true,
      message: "Cliente adicionado com sucesso",
      id: insertId
    };
  } catch (error) {
    console.error("Erro ao adicionar cliente:", error);
    return { success: false, message: "Erro ao adicionar cliente" };
  }
}

// Atualizar cliente existente
export async function atualizarCliente(id: number, cliente: Partial<Cliente>): Promise<{ success: boolean; message: string; affectedRows?: number }> {
  try {
    // Construir a query dinamicamente com base nos campos fornecidos
    const updateFields: string[] = [];
    const values: any[] = [];

    // Adicionar cada campo não nulo à query
    Object.entries(cliente).forEach(([key, value]) => {
      if (value !== undefined && key !== "id" && key !== "data_cadastro") {
        updateFields.push(`${key} = ?`);
        values.push(value);
      }
    });

    // Adicionar o ID ao final dos valores
    values.push(id);

    const result = await executeQuery(
      `UPDATE clientes SET ${updateFields.join(", ")} WHERE id = ?`,
      values
    );

    // Verificar se a atualização foi bem-sucedida
    const affectedRows = (result as any).affectedRows || 0;
    
    return {
      success: affectedRows > 0,
      message: affectedRows > 0 ? "Cliente atualizado com sucesso" : "Nenhum registro foi atualizado",
      affectedRows
    };
  } catch (error) {
    console.error("Erro ao atualizar cliente:", error);
    return { success: false, message: "Erro ao atualizar cliente" };
  }
}

// Excluir cliente
export async function excluirCliente(id: number): Promise<{ success: boolean; message: string }> {
  try {
    const result = await executeQuery("DELETE FROM clientes WHERE id = ?", [id]);
    
    // Verificar se a exclusão foi bem-sucedida
    const affectedRows = (result as any).affectedRows || 0;
    
    if (affectedRows > 0) {
      return { success: true, message: "Cliente excluído com sucesso" };
    } else {
      return { success: false, message: "Cliente não encontrado" };
    }
  } catch (error) {
    console.error("Erro ao excluir cliente:", error);
    return { success: false, message: "Erro ao excluir cliente" };
  }
}

// Buscar clientes por termo de pesquisa
export async function buscarClientes(termo: string): Promise<{ success: boolean; data?: Cliente[]; message?: string }> {
  try {
    const termoPesquisa = `%${termo}%`;
    const clientes = await executeQuery<Cliente>(
      `SELECT * FROM clientes 
       WHERE nome LIKE ? OR email LIKE ? OR telefone LIKE ? OR cidade LIKE ? OR estado LIKE ?
       ORDER BY nome`,
      [termoPesquisa, termoPesquisa, termoPesquisa, termoPesquisa, termoPesquisa]
    );
    
    return { success: true, data: clientes };
  } catch (error) {
    console.error("Erro ao buscar clientes:", error);
    return { success: false, message: "Erro ao buscar clientes" };
  }
}
