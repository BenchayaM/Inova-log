// Funções para gerenciamento de clientes no banco de dados
import { query } from "./db"

export interface Cliente {
  id?: number
  nome: string
  email: string
  telefone?: string
  endereco?: string
  cidade?: string
  estado?: string
  pais?: string
  cep?: string
  contato?: string
  status?: "Ativo" | "Inativo"
  data_cadastro?: Date
  cnpj_cpf?: string
  inscricao_estadual?: string
  cargo_contato?: string
  segmento?: string
  observacoes?: string
  senha?: string // Campo adicionado para senha
}

// Função simples para "criptografar" senha (temporária, não segura para produção)
async function hashSenha(senha: string): Promise<string> {
  // Esta é uma implementação temporária e NÃO SEGURA
  // Em produção, você deve usar bcrypt ou outra biblioteca de criptografia
  return Buffer.from(senha).toString("base64")
}

// Função simples para verificar senha (temporária, não segura para produção)
async function verificarSenha(senha: string, hash: string): Promise<boolean> {
  // Esta é uma implementação temporária e NÃO SEGURA
  return Buffer.from(senha).toString("base64") === hash
}

// Listar todos os clientes
export async function listarClientes() {
  try {
    console.log("Listando todos os clientes")
    const result = await query("SELECT * FROM clientes ORDER BY nome")

    if (!result.success) {
      console.error("Erro retornado pela query:", result.message)
      return { success: false, message: result.message || "Erro ao listar clientes" }
    }

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

    if (!result.success) {
      console.error("Erro retornado pela query:", result.message)
      return { success: false, message: result.message || "Erro ao buscar cliente" }
    }

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

// Buscar cliente por email
export async function buscarClientePorEmail(email: string) {
  try {
    console.log(`Buscando cliente com email: ${email}`)
    const result = await query("SELECT * FROM clientes WHERE email = ?", [email])

    if (!result.success) {
      console.error("Erro retornado pela query:", result.message)
      return { success: false, message: result.message || "Erro ao buscar cliente" }
    }

    const clientes = result.data as any[]

    if (clientes && clientes.length > 0) {
      console.log("Cliente encontrado:", clientes[0])
      return { success: true, data: clientes[0] }
    } else {
      console.log(`Cliente com email ${email} não encontrado`)
      return { success: false, message: "Cliente não encontrado" }
    }
  } catch (error) {
    console.error(`Erro ao buscar cliente com email ${email}:`, error)
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

    // Garantir que os campos obrigatórios estejam presentes
    if (!cliente.nome || !cliente.email) {
      console.error("Nome e email são obrigatórios")
      return { success: false, message: "Nome e email são obrigatórios" }
    }

    // Verificar se o email já está em uso
    const emailExistente = await buscarClientePorEmail(cliente.email)
    if (emailExistente.success) {
      return { success: false, message: "Este email já está cadastrado" }
    }

    // Hash da senha se fornecida
    let senhaHash = null
    if (cliente.senha) {
      senhaHash = await hashSenha(cliente.senha)
      console.log("Senha criptografada com sucesso")
    }

    // Definir valores padrão para campos não fornecidos
    const clienteCompleto = {
      nome: cliente.nome,
      email: cliente.email,
      telefone: cliente.telefone || null,
      endereco: cliente.endereco || null,
      cidade: cliente.cidade || null,
      estado: cliente.estado || null,
      pais: cliente.pais || "Brasil",
      cep: cliente.cep || null,
      contato: cliente.contato || null,
      status: cliente.status || "Ativo",
      cnpj_cpf: cliente.cnpj_cpf || null,
      inscricao_estadual: cliente.inscricao_estadual || null,
      cargo_contato: cliente.cargo_contato || null,
      segmento: cliente.segmento || null,
      senha: senhaHash, // Senha criptografada
    }

    // Construir a query dinamicamente
    const campos = Object.keys(clienteCompleto)
    const placeholders = campos.map(() => "?").join(", ")
    const valores = Object.values(clienteCompleto)

    const sql = `INSERT INTO clientes (${campos.join(", ")}) VALUES (${placeholders})`
    console.log("SQL Query:", sql)
    console.log("Valores:", valores)

    const result = await query(sql, valores)

    if (!result.success) {
      console.error("Erro retornado pela query:", result.message)
      return { success: false, message: result.message || "Erro ao adicionar cliente" }
    }

    console.log("Cliente adicionado com sucesso, ID:", (result.data as any).insertId)
    return {
      success: true,
      message: "Cliente adicionado com sucesso",
      id: (result.data as any).insertId,
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

    // Verificar se há campos para atualizar
    if (Object.keys(cliente).length === 0) {
      console.error("Nenhum campo fornecido para atualização")
      return { success: false, message: "Nenhum campo fornecido para atualização" }
    }

    // Se estiver atualizando o email, verificar se já está em uso por outro cliente
    if (cliente.email) {
      const emailExistente = await buscarClientePorEmail(cliente.email)
      if (emailExistente.success && emailExistente.data.id !== id) {
        return { success: false, message: "Este email já está sendo usado por outro cliente" }
      }
    }

    // Criar uma cópia do cliente para não modificar o original
    const clienteAtualizado = { ...cliente }

    // Hash da senha se fornecida
    if (cliente.senha) {
      clienteAtualizado.senha = await hashSenha(cliente.senha)
      console.log("Senha atualizada e criptografada com sucesso")
    }

    // Construir a query dinamicamente
    const updateFields = Object.entries(clienteAtualizado)
      .filter(([key]) => key !== "id" && key !== "data_cadastro")
      .map(([key]) => `${key} = ?`)
      .join(", ")

    const valores = Object.entries(clienteAtualizado)
      .filter(([key]) => key !== "id" && key !== "data_cadastro")
      .map(([, value]) => (value === "" ? null : value))

    // Adicionar o ID ao final dos valores
    valores.push(id)

    const sql = `UPDATE clientes SET ${updateFields} WHERE id = ?`
    console.log("SQL Query:", sql)
    console.log("Valores:", valores)

    const result = await query(sql, valores)

    if (!result.success) {
      console.error("Erro retornado pela query:", result.message)
      return { success: false, message: result.message || "Erro ao atualizar cliente" }
    }

    console.log("Cliente atualizado com sucesso, linhas afetadas:", (result.data as any).affectedRows)
    return {
      success: true,
      message: "Cliente atualizado com sucesso",
      affectedRows: (result.data as any).affectedRows,
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

    if (!result.success) {
      console.error("Erro retornado pela query:", result.message)
      return { success: false, message: result.message || "Erro ao excluir cliente" }
    }

    if ((result.data as any).affectedRows > 0) {
      console.log("Cliente excluído com sucesso")
      return { success: true, message: "Cliente excluído com sucesso" }
    } else {
      console.log(`Cliente com ID ${id} não encontrado para exclusão`)
      return { success: false, message: "Cliente não encontrado" }
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
       WHERE nome LIKE ? OR email LIKE ? OR telefone LIKE ? OR cidade LIKE ? OR estado LIKE ? OR cnpj_cpf LIKE ?
       ORDER BY nome`,
      [termoPesquisa, termoPesquisa, termoPesquisa, termoPesquisa, termoPesquisa, termoPesquisa],
    )

    if (!result.success) {
      console.error("Erro retornado pela query:", result.message)
      return { success: false, message: result.message || "Erro ao buscar clientes" }
    }

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

// Verificar credenciais do cliente (login)
export async function verificarCredenciaisCliente(email: string, senha: string) {
  try {
    console.log(`Verificando credenciais para o email: ${email}`)

    // Buscar cliente pelo email
    const result = await buscarClientePorEmail(email)

    if (!result.success) {
      return { success: false, message: "Email ou senha incorretos" }
    }

    const cliente = result.data

    // Verificar se o cliente tem senha cadastrada
    if (!cliente.senha) {
      return { success: false, message: "Este cliente não possui senha cadastrada" }
    }

    // Verificar se a senha está correta
    const senhaCorreta = await verificarSenha(senha, cliente.senha)

    if (!senhaCorreta) {
      return { success: false, message: "Email ou senha incorretos" }
    }

    // Remover a senha do objeto cliente antes de retornar
    const { senha: _, ...clienteSemSenha } = cliente

    return {
      success: true,
      message: "Login realizado com sucesso",
      cliente: clienteSemSenha,
    }
  } catch (error) {
    console.error("Erro ao verificar credenciais:", error)
    return {
      success: false,
      message: "Erro ao verificar credenciais: " + (error instanceof Error ? error.message : String(error)),
    }
  }
}

// Definir senha para cliente existente
export async function definirSenhaCliente(id: number, senha: string) {
  try {
    console.log(`Definindo senha para cliente com ID: ${id}`)

    // Hash da senha
    const senhaHash = await hashSenha(senha)

    // Atualizar apenas o campo senha
    const result = await query("UPDATE clientes SET senha = ? WHERE id = ?", [senhaHash, id])

    if (!result.success) {
      console.error("Erro retornado pela query:", result.message)
      return { success: false, message: result.message || "Erro ao definir senha" }
    }

    if ((result.data as any).affectedRows > 0) {
      console.log("Senha definida com sucesso")
      return { success: true, message: "Senha definida com sucesso" }
    } else {
      console.log(`Cliente com ID ${id} não encontrado`)
      return { success: false, message: "Cliente não encontrado" }
    }
  } catch (error) {
    console.error(`Erro ao definir senha para cliente com ID ${id}:`, error)
    return {
      success: false,
      message: "Erro ao definir senha: " + (error instanceof Error ? error.message : String(error)),
    }
  }
}
