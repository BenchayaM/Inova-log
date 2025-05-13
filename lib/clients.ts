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
    console.log("Listando todos os clientes")
    const result = await query("SELECT * FROM clientes ORDER BY nome")
    console.log(`Clientes encontrados: ${(result.data as any[]).length}`)
    return { success: true, data: result.data }
  } catch (error) {
    console.error("Erro ao listar clientes:", error)
    return {
      success: false,
      message: "Erro ao listar clientes: " + (error instanceof Error ? error.message : String(error)),
    }
  }
}

// Buscar cliente por ID
export async function buscarClientePorId(id: number) {
  try {
    console.log(`Buscando cliente com ID: ${id}`)
    const result = await query("SELECT * FROM clientes WHERE id = ?", [id])
    const clientes = result.data as any[]

    if (clientes && clientes.length > 0) {
      console.log("Cliente encontrado:", clientes[0])
      return { success: true, data: clientes[0] }
    } else {
      console.log(`Cliente com ID ${id} não encontrado`)
      return { success: false, message: "Cliente não encontrado" }
    }
  } catch (error) {
    console.error(`Erro ao buscar cliente com ID ${id}:`, error)
    return {
      success: false,
      message: "Erro ao buscar cliente: " + (error instanceof Error ? error.message : String(error)),
    }
  }
}

// Adicionar novo cliente
export async function adicionarCliente(cliente: Cliente) {
  try {
    console.log("Adicionando novo cliente:", cliente)

    // Verificar se há campos vazios e removê-los
    Object.keys(cliente).forEach((key) => {
      if (cliente[key as keyof Cliente] === "") {
        console.log(`Removendo campo vazio: ${key}`)
        delete cliente[key as keyof Cliente]
      }
    })

    // Construir a query dinamicamente com base nos campos fornecidos
    const campos: string[] = []
    const placeholders: string[] = []
    const valores: any[] = []

    // Adicionar cada campo não nulo à query
    Object.entries(cliente).forEach(([key, value]) => {
      if (key !== "id" && key !== "data_cadastro" && value !== undefined && value !== null) {
        campos.push(key)
        placeholders.push("?")
        valores.push(value)
      }
    })

    // Verificar se há campos para inserir
    if (campos.length === 0) {
      console.error("Nenhum campo válido para inserção")
      return { success: false, message: "Nenhum campo válido para inserção" }
    }

    const sql = `INSERT INTO clientes (${campos.join(", ")}) VALUES (${placeholders.join(", ")})`
    console.log("SQL Query:", sql)
    console.log("Valores:", valores)

    const result = await query(sql, valores)
    console.log("Resultado da query:", result)

    if (result.success) {
      console.log("Cliente adicionado com sucesso, ID:", (result.data as any).insertId)
      return {
        success: true,
        message: "Cliente adicionado com sucesso",
        id: (result.data as any).insertId,
      }
    } else {
      console.error("Erro retornado pela query:", result.message)
      return { success: false, message: result.message || "Erro ao adicionar cliente" }
    }
  } catch (error) {
    console.error("Exceção ao adicionar cliente:", error)
    return {
      success: false,
      message: "Erro ao adicionar cliente: " + (error instanceof Error ? error.message : String(error)),
    }
  }
}

// Atualizar cliente existente
export async function atualizarCliente(id: number, cliente: Partial<Cliente>) {
  try {
    console.log(`Atualizando cliente com ID ${id}:`, cliente)

    // Verificar se há campos vazios e removê-los
    Object.keys(cliente).forEach((key) => {
      if (cliente[key as keyof Partial<Cliente>] === "") {
        console.log(`Removendo campo vazio: ${key}`)
        delete cliente[key as keyof Partial<Cliente>]
      }
    })

    // Construir a query dinamicamente com base nos campos fornecidos
    const updateFields: string[] = []
    const values: any[] = []

    // Adicionar cada campo não nulo à query
    Object.entries(cliente).forEach(([key, value]) => {
      if (value !== undefined && value !== null && key !== "id" && key !== "data_cadastro") {
        updateFields.push(`${key} = ?`)
        values.push(value)
      }
    })

    // Verificar se há campos para atualizar
    if (updateFields.length === 0) {
      console.error("Nenhum campo válido para atualização")
      return { success: false, message: "Nenhum campo válido para atualização" }
    }

    // Adicionar o ID ao final dos valores
    values.push(id)

    const sql = `UPDATE clientes SET ${updateFields.join(", ")} WHERE id = ?`
    console.log("SQL Query:", sql)
    console.log("Valores:", values)

    const result = await query(sql, values)
    console.log("Resultado da query:", result)

    if (result.success) {
      console.log("Cliente atualizado com sucesso, linhas afetadas:", (result.data as any).affectedRows)
      return {
        success: true,
        message: "Cliente atualizado com sucesso",
        affectedRows: (result.data as any).affectedRows,
      }
    } else {
      console.error("Erro retornado pela query:", result.message)
      return { success: false, message: result.message || "Erro ao atualizar cliente" }
    }
  } catch (error) {
    console.error(`Erro ao atualizar cliente com ID ${id}:`, error)
    return {
      success: false,
      message: "Erro ao atualizar cliente: " + (error instanceof Error ? error.message : String(error)),
    }
  }
}

// Excluir cliente
export async function excluirCliente(id: number) {
  try {
    console.log(`Excluindo cliente com ID: ${id}`)
    const result = await query("DELETE FROM clientes WHERE id = ?", [id])
    console.log("Resultado da query:", result)

    if (result.success && (result.data as any).affectedRows > 0) {
      console.log("Cliente excluído com sucesso")
      return { success: true, message: "Cliente excluído com sucesso" }
    } else if (result.success && (result.data as any).affectedRows === 0) {
      console.log(`Cliente com ID ${id} não encontrado para exclusão`)
      return { success: false, message: "Cliente não encontrado" }
    } else {
      console.error("Erro retornado pela query:", result.message)
      return { success: false, message: result.message || "Erro ao excluir cliente" }
    }
  } catch (error) {
    console.error(`Erro ao excluir cliente com ID ${id}:`, error)
    return {
      success: false,
      message: "Erro ao excluir cliente: " + (error instanceof Error ? error.message : String(error)),
    }
  }
}

// Buscar clientes por termo de pesquisa
export async function buscarClientes(termo: string) {
  try {
    console.log(`Buscando clientes com termo: "${termo}"`)
    const termoPesquisa = `%${termo}%`
    const result = await query(
      `SELECT * FROM clientes 
       WHERE nome LIKE ? OR email LIKE ? OR telefone LIKE ? OR cidade LIKE ? OR estado LIKE ?
       ORDER BY nome`,
      [termoPesquisa, termoPesquisa, termoPesquisa, termoPesquisa, termoPesquisa],
    )

    console.log(`Clientes encontrados: ${(result.data as any[]).length}`)
    return { success: true, data: result.data }
  } catch (error) {
    console.error(`Erro ao buscar clientes com termo "${termo}":`, error)
    return {
      success: false,
      message: "Erro ao buscar clientes: " + (error instanceof Error ? error.message : String(error)),
    }
  }
}
