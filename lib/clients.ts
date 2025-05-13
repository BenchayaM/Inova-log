// Funções para gerenciamento de clientes no banco de dados Braslink
import { query } from "./db"

export interface Cliente {
  id?: number
  nome: string
  email: string
  telefone: string
  endereco?: string
  cidade?: string
  estado?: string
  pais?: string
  cep?: string
  contato?: string
  status: "Ativo" | "Inativo"
  data_cadastro?: Date
  observacoes?: string
  // Novos campos
  telefone_secundario?: string
  website?: string
  cargo_contato?: string
  cnpj_cpf?: string
  inscricao_estadual?: string
  regime_tributario?: string
  segmento?: string
  condicoes_pagamento?: string
  classificacao?: string
  origem?: string
}

// Listar todos os clientes
export async function listarClientes() {
  try {
    const result = await query("SELECT * FROM clientes ORDER BY nome")
    return { success: true, data: result.data }
  } catch (error) {
    console.error("Erro ao listar clientes:", error)
    return { success: false, message: "Erro ao listar clientes" }
  }
}

// Buscar cliente por ID
export async function buscarClientePorId(id: number) {
  try {
    const result = await query("SELECT * FROM clientes WHERE id = ?", [id])
    const clientes = result.data as any[]

    if (clientes && clientes.length > 0) {
      return { success: true, data: clientes[0] }
    } else {
      return { success: false, message: "Cliente não encontrado" }
    }
  } catch (error) {
    console.error("Erro ao buscar cliente:", error)
    return { success: false, message: "Erro ao buscar cliente" }
  }
}

// Adicionar novo cliente
export async function adicionarCliente(cliente: Cliente) {
  try {
    const result = await query(
      `INSERT INTO clientes (
        nome, email, telefone, endereco, cidade, estado, pais, 
        cep, contato, status, observacoes, telefone_secundario, 
        website, cargo_contato, cnpj_cpf, inscricao_estadual, 
        regime_tributario, segmento, condicoes_pagamento, 
        classificacao, origem
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
        cliente.telefone_secundario || null,
        cliente.website || null,
        cliente.cargo_contato || null,
        cliente.cnpj_cpf || null,
        cliente.inscricao_estadual || null,
        cliente.regime_tributario || null,
        cliente.segmento || null,
        cliente.condicoes_pagamento || null,
        cliente.classificacao || null,
        cliente.origem || null,
      ],
    )

    if (result.success) {
      return {
        success: true,
        message: "Cliente adicionado com sucesso",
        id: (result.data as any).insertId,
      }
    } else {
      return { success: false, message: "Erro ao adicionar cliente" }
    }
  } catch (error) {
    console.error("Erro ao adicionar cliente:", error)
    return { success: false, message: "Erro ao adicionar cliente" }
  }
}

// Atualizar cliente existente
export async function atualizarCliente(id: number, cliente: Partial<Cliente>) {
  try {
    // Construir a query dinamicamente com base nos campos fornecidos
    const updateFields: string[] = []
    const values: any[] = []

    // Adicionar cada campo não nulo à query
    Object.entries(cliente).forEach(([key, value]) => {
      if (value !== undefined && key !== "id" && key !== "data_cadastro") {
        updateFields.push(`${key} = ?`)
        values.push(value)
      }
    })

    // Adicionar o ID ao final dos valores
    values.push(id)

    const result = await query(`UPDATE clientes SET ${updateFields.join(", ")} WHERE id = ?`, values)

    if (result.success) {
      return {
        success: true,
        message: "Cliente atualizado com sucesso",
        affectedRows: (result.data as any).affectedRows,
      }
    } else {
      return { success: false, message: "Erro ao atualizar cliente" }
    }
  } catch (error) {
    console.error("Erro ao atualizar cliente:", error)
    return { success: false, message: "Erro ao atualizar cliente" }
  }
}

// Excluir cliente
export async function excluirCliente(id: number) {
  try {
    const result = await query("DELETE FROM clientes WHERE id = ?", [id])

    if (result.success && (result.data as any).affectedRows > 0) {
      return { success: true, message: "Cliente excluído com sucesso" }
    } else if (result.success && (result.data as any).affectedRows === 0) {
      return { success: false, message: "Cliente não encontrado" }
    } else {
      return { success: false, message: "Erro ao excluir cliente" }
    }
  } catch (error) {
    console.error("Erro ao excluir cliente:", error)
    return { success: false, message: "Erro ao excluir cliente" }
  }
}

// Buscar clientes por termo de pesquisa
export async function buscarClientes(termo: string) {
  try {
    const termoPesquisa = `%${termo}%`
    const result = await query(
      `SELECT * FROM clientes 
       WHERE nome LIKE ? OR email LIKE ? OR telefone LIKE ? OR cidade LIKE ? OR estado LIKE ?
       ORDER BY nome`,
      [termoPesquisa, termoPesquisa, termoPesquisa, termoPesquisa, termoPesquisa],
    )

    return { success: true, data: result.data }
  } catch (error) {
    console.error("Erro ao buscar clientes:", error)
    return { success: false, message: "Erro ao buscar clientes" }
  }
}
