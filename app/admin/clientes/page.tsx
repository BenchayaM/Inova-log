"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import type { Cliente } from "@/lib/clients"

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [termoBusca, setTermoBusca] = useState("")
  const [novoCliente, setNovoCliente] = useState<Cliente>({
    nome: "",
    email: "",
    telefone: "",
    endereco: "",
    cidade: "",
    estado: "",
    pais: "Brasil",
    cep: "",
    contato: "",
    status: "Ativo",
    cnpj_cpf: "",
    inscricao_estadual: "",
    cargo_contato: "",
    segmento: "",
    senha: "", // Campo adicionado para senha
  })
  const [dialogAberto, setDialogAberto] = useState(false)
  const [tabAtiva, setTabAtiva] = useState("informacoes")
  const [salvando, setSalvando] = useState(false)
  const [clienteSelecionado, setClienteSelecionado] = useState<number | null>(null)
  const [editarDialogAberto, setEditarDialogAberto] = useState(false)
  const [visualizarDialogAberto, setVisualizarDialogAberto] = useState(false)
  const [senhaDialogAberto, setSenhaDialogAberto] = useState(false)
  const { toast } = useToast()
  const [language, setLanguage] = useState<"pt" | "en">("pt")
  const [testMessage, setTestMessage] = useState("Carregando...")

  useEffect(() => {
    // Tentar detectar o idioma do usuário
    try {
      const storedLang = localStorage.getItem("selectedLanguage")
      if (storedLang === "en") setLanguage("en")
    } catch (e) {
      console.error("Erro ao acessar localStorage:", e)
    }

    carregarClientes()

    // Simular um carregamento
    setTimeout(() => {
      setTestMessage("Teste de deploy no Vercel concluído com sucesso!")
    }, 1500)
  }, [])

  // Carregar clientes do banco de dados
  const carregarClientes = async () => {
    setLoading(true)
    try {
      console.log("Carregando clientes...")
      const response = await fetch("/api/clientes", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Adicionar cabeçalhos para evitar cache
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      })

      console.log("Status da resposta:", response.status)
      console.log("Headers da resposta:", Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`)
      }

      const text = await response.text()
      console.log("Resposta (texto):", text)

      let data
      try {
        data = JSON.parse(text)
        console.log("Resposta (JSON):", data)
      } catch (error) {
        console.error("Erro ao fazer parse do JSON:", error)
        throw new Error("Resposta inválida do servidor")
      }

      if (data.success) {
        setClientes(data.clientes)
      } else {
        toast({
          title: language === "pt" ? "Erro" : "Error",
          description: data.message || (language === "pt" ? "Erro ao carregar clientes" : "Error loading clients"),
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erro ao carregar clientes:", error)
      toast({
        title: language === "pt" ? "Erro" : "Error",
        description: language === "pt" ? "Erro ao conectar ao servidor" : "Error connecting to server",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Buscar clientes pelo termo
  const buscarClientes = async () => {
    if (!termoBusca.trim()) {
      carregarClientes()
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/clientes?termo=${encodeURIComponent(termoBusca)}`, {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      })

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        setClientes(data.clientes)
      } else {
        toast({
          title: language === "pt" ? "Erro" : "Error",
          description: data.message || (language === "pt" ? "Erro ao buscar clientes" : "Error searching clients"),
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erro ao buscar clientes:", error)
      toast({
        title: language === "pt" ? "Erro" : "Error",
        description: language === "pt" ? "Erro ao conectar ao servidor" : "Error connecting to server",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Excluir cliente
  const excluirCliente = async (id: number) => {
    if (
      !confirm(
        language === "pt"
          ? "Tem certeza que deseja excluir este cliente?"
          : "Are you sure you want to delete this client?",
      )
    ) {
      return
    }

    try {
      const response = await fetch(`/api/clientes/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        setClientes(clientes.filter((cliente) => cliente.id !== id))
        toast({
          title: language === "pt" ? "Cliente excluído" : "Client deleted",
          description: language === "pt" ? "Cliente excluído com sucesso" : "Client successfully deleted",
        })
      } else {
        toast({
          title: language === "pt" ? "Erro" : "Error",
          description: data.message || (language === "pt" ? "Erro ao excluir cliente" : "Error deleting client"),
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erro ao excluir cliente:", error)
      toast({
        title: language === "pt" ? "Erro" : "Error",
        description: language === "pt" ? "Erro ao conectar ao servidor" : "Error connecting to server",
        variant: "destructive",
      })
    }
  }

  // Manipular mudanças no formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNovoCliente((prev) => ({ ...prev, [name]: value }))
  }

  // Adicionar novo cliente
  const adicionarCliente = async () => {
    // Validar campos obrigatórios
    if (!novoCliente.nome || !novoCliente.email) {
      toast({
        title: language === "pt" ? "Erro" : "Error",
        description:
          language === "pt"
            ? "Preencha os campos obrigatórios (Nome e Email)"
            : "Fill in the required fields (Name and Email)",
        variant: "destructive",
      })
      return
    }

    setSalvando(true)
    console.log("Enviando dados:", novoCliente)

    try {
      const response = await fetch("/api/clientes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(novoCliente),
      })

      console.log("Status da resposta:", response.status)

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`)
      }

      const text = await response.text()
      console.log("Resposta (texto):", text)

      let data
      try {
        data = JSON.parse(text)
        console.log("Resposta (JSON):", data)
      } catch (error) {
        console.error("Erro ao fazer parse do JSON:", error)
        throw new Error("Resposta inválida do servidor")
      }

      if (data.success) {
        toast({
          title: language === "pt" ? "Cliente adicionado" : "Client added",
          description:
            language === "pt"
              ? `${novoCliente.nome} foi adicionado com sucesso.`
              : `${novoCliente.nome} was successfully added.`,
        })

        // Resetar formulário e fechar diálogo
        setNovoCliente({
          nome: "",
          email: "",
          telefone: "",
          endereco: "",
          cidade: "",
          estado: "",
          pais: "Brasil",
          cep: "",
          contato: "",
          status: "Ativo",
          cnpj_cpf: "",
          inscricao_estadual: "",
          cargo_contato: "",
          segmento: "",
          senha: "",
        })
        setDialogAberto(false)
        setTabAtiva("informacoes")

        // Recarregar a lista de clientes
        carregarClientes()
      } else {
        toast({
          title: language === "pt" ? "Erro" : "Error",
          description: data.message || (language === "pt" ? "Erro ao adicionar cliente" : "Error adding client"),
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erro ao adicionar cliente:", error)
      toast({
        title: language === "pt" ? "Erro" : "Error",
        description: language === "pt" ? "Erro ao conectar ao servidor" : "Error connecting to server",
        variant: "destructive",
      })
    } finally {
      setSalvando(false)
    }
  }

  // Definir senha para cliente
  const definirSenha = async (id: number, senha: string) => {
    try {
      const response = await fetch(`/api/clientes/${id}/senha`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ senha }),
      })

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        toast({
          title: language === "pt" ? "Senha definida" : "Password set",
          description:
            language === "pt"
              ? "A senha do cliente foi definida com sucesso"
              : "Client password has been successfully set",
        })
        return true
      } else {
        toast({
          title: language === "pt" ? "Erro" : "Error",
          description: data.message || (language === "pt" ? "Erro ao definir senha" : "Error setting password"),
          variant: "destructive",
        })
        return false
      }
    } catch (error) {
      console.error("Erro ao definir senha:", error)
      toast({
        title: language === "pt" ? "Erro" : "Error",
        description: language === "pt" ? "Erro ao conectar ao servidor" : "Error connecting to server",
        variant: "destructive",
      })
      return false
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Página de Teste</h1>

      <Card>
        <CardHeader>
          <CardTitle>Teste de Deploy</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">{testMessage}</p>
          <p className="text-sm text-gray-500">
            Esta é uma versão simplificada da página para testar o deploy no Vercel. Se você está vendo esta mensagem,
            significa que o deploy foi bem-sucedido.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
