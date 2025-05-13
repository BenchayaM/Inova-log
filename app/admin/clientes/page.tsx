"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Plus, Edit, Trash2, Eye, Loader2 } from "lucide-react"
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
    observacoes: "",
  })
  const [dialogAberto, setDialogAberto] = useState(false)
  const [tabAtiva, setTabAtiva] = useState("informacoes")
  const [salvando, setSalvando] = useState(false)
  const [clienteSelecionado, setClienteSelecionado] = useState<number | null>(null)
  const [editarDialogAberto, setEditarDialogAberto] = useState(false)
  const [visualizarDialogAberto, setVisualizarDialogAberto] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    carregarClientes()
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
          title: "Erro",
          description: data.message || "Erro ao carregar clientes",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erro ao carregar clientes:", error)
      toast({
        title: "Erro",
        description: "Erro ao conectar ao servidor",
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
          title: "Erro",
          description: data.message || "Erro ao buscar clientes",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erro ao buscar clientes:", error)
      toast({
        title: "Erro",
        description: "Erro ao conectar ao servidor",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Excluir cliente
  const excluirCliente = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este cliente?")) {
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
          title: "Cliente excluído",
          description: "Cliente excluído com sucesso",
        })
      } else {
        toast({
          title: "Erro",
          description: data.message || "Erro ao excluir cliente",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erro ao excluir cliente:", error)
      toast({
        title: "Erro",
        description: "Erro ao conectar ao servidor",
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
        title: "Erro",
        description: "Preencha os campos obrigatórios (Nome e Email)",
        variant: "destructive",
      })
      return
    }

    setSalvando(true)
    console.log("Enviando dados:", novoCliente)

    try {
      // Criar um objeto com apenas os campos obrigatórios
      const clienteMinimo = {
        nome: novoCliente.nome,
        email: novoCliente.email,
      }

      console.log("Enviando cliente mínimo:", clienteMinimo)

      const response = await fetch("/api/clientes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(clienteMinimo),
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
          title: "Cliente adicionado",
          description: `${novoCliente.nome} foi adicionado com sucesso.`,
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
          observacoes: "",
        })
        setDialogAberto(false)
        setTabAtiva("informacoes")

        // Recarregar a lista de clientes
        carregarClientes()
      } else {
        toast({
          title: "Erro",
          description: data.message || "Erro ao adicionar cliente",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erro ao adicionar cliente:", error)
      toast({
        title: "Erro",
        description: "Erro ao conectar ao servidor",
        variant: "destructive",
      })
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gerenciamento de Clientes</h1>

        <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Adicionar Cliente</DialogTitle>
              <DialogDescription>
                Preencha os dados do cliente abaixo. <span className="text-red-500">*</span> Campos obrigatórios
              </DialogDescription>
            </DialogHeader>

            <Tabs value={tabAtiva} onValueChange={setTabAtiva} className="w-full mt-4">
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="informacoes">Informações Gerais</TabsTrigger>
                <TabsTrigger value="endereco">Endereço</TabsTrigger>
                <TabsTrigger value="fiscal">Informações Fiscais</TabsTrigger>
              </TabsList>

              <TabsContent value="informacoes" className="space-y-4 mt-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="nome" className="flex items-center">
                      Nome da Empresa <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input
                      id="nome"
                      name="nome"
                      value={novoCliente.nome}
                      onChange={handleChange}
                      placeholder="Nome da empresa"
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="email" className="flex items-center">
                      Email <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={novoCliente.email}
                      onChange={handleChange}
                      placeholder="contato@empresa.com"
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input
                      id="telefone"
                      name="telefone"
                      value={novoCliente.telefone}
                      onChange={handleChange}
                      placeholder="(00) 0000-0000"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="contato">Pessoa de Contato</Label>
                    <Input
                      id="contato"
                      name="contato"
                      value={novoCliente.contato}
                      onChange={handleChange}
                      placeholder="Nome do contato principal"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="cargo_contato">Cargo do Contato</Label>
                    <Input
                      id="cargo_contato"
                      name="cargo_contato"
                      value={novoCliente.cargo_contato}
                      onChange={handleChange}
                      placeholder="Diretor, Gerente, etc."
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <select
                      id="status"
                      name="status"
                      value={novoCliente.status}
                      onChange={handleChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="Ativo">Ativo</option>
                      <option value="Inativo">Inativo</option>
                    </select>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="endereco" className="space-y-4 mt-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="endereco">Endereço</Label>
                    <Input
                      id="endereco"
                      name="endereco"
                      value={novoCliente.endereco}
                      onChange={handleChange}
                      placeholder="Rua, número, complemento"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="cidade">Cidade</Label>
                      <Input
                        id="cidade"
                        name="cidade"
                        value={novoCliente.cidade}
                        onChange={handleChange}
                        placeholder="Cidade"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="estado">Estado</Label>
                      <Input
                        id="estado"
                        name="estado"
                        value={novoCliente.estado}
                        onChange={handleChange}
                        placeholder="Estado"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="pais">País</Label>
                      <Input
                        id="pais"
                        name="pais"
                        value={novoCliente.pais}
                        onChange={handleChange}
                        placeholder="País"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="cep">CEP</Label>
                      <Input id="cep" name="cep" value={novoCliente.cep} onChange={handleChange} placeholder="CEP" />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="fiscal" className="space-y-4 mt-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="cnpj_cpf">CNPJ/CPF</Label>
                    <Input
                      id="cnpj_cpf"
                      name="cnpj_cpf"
                      value={novoCliente.cnpj_cpf}
                      onChange={handleChange}
                      placeholder="00.000.000/0000-00"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="inscricao_estadual">Inscrição Estadual</Label>
                    <Input
                      id="inscricao_estadual"
                      name="inscricao_estadual"
                      value={novoCliente.inscricao_estadual}
                      onChange={handleChange}
                      placeholder="Inscrição Estadual"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="segmento">Segmento/Ramo de Atividade</Label>
                    <Input
                      id="segmento"
                      name="segmento"
                      value={novoCliente.segmento}
                      onChange={handleChange}
                      placeholder="Ex: Construção Civil, Varejo, etc."
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="observacoes">Observações</Label>
                    <textarea
                      id="observacoes"
                      name="observacoes"
                      value={novoCliente.observacoes}
                      onChange={handleChange}
                      placeholder="Observações adicionais sobre o cliente"
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter className="mt-6">
              <Button variant="outline" onClick={() => setDialogAberto(false)}>
                Cancelar
              </Button>
              <Button onClick={adicionarCliente} disabled={salvando}>
                {salvando ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Adicionar Cliente"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Clientes</CardTitle>
          <CardDescription>Gerencie todos os clientes cadastrados no sistema.</CardDescription>
          <div className="mt-4 flex gap-2">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar clientes..."
                className="pl-8"
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && buscarClientes()}
              />
            </div>
            <Button onClick={buscarClientes} variant="outline">
              Buscar
            </Button>
            <Button
              onClick={() => {
                setTermoBusca("")
                carregarClientes()
              }}
              variant="outline"
            >
              Limpar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="hidden md:table-cell">Telefone</TableHead>
                <TableHead className="hidden lg:table-cell">Cidade/Estado</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    <div className="flex justify-center items-center">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      <span className="ml-2">Carregando...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : clientes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    Nenhum cliente encontrado
                  </TableCell>
                </TableRow>
              ) : (
                clientes.map((cliente) => (
                  <TableRow key={cliente.id}>
                    <TableCell className="font-medium">{cliente.id}</TableCell>
                    <TableCell>{cliente.nome}</TableCell>
                    <TableCell>{cliente.email}</TableCell>
                    <TableCell className="hidden md:table-cell">{cliente.telefone || "-"}</TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {cliente.cidade && cliente.estado ? `${cliente.cidade}/${cliente.estado}` : "-"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={cliente.status === "Ativo" ? "success" : "secondary"}>
                        {cliente.status || "Ativo"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            setClienteSelecionado(cliente.id!)
                            setVisualizarDialogAberto(true)
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            setClienteSelecionado(cliente.id!)
                            setEditarDialogAberto(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => excluirCliente(cliente.id!)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Componentes de edição e visualização seriam adicionados aqui */}
    </div>
  )
}
