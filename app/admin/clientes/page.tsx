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
import { Search, Plus, Edit, Trash2, Eye, Loader2, Key } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Cliente } from "@/lib/clients"
import VisualizarCliente from "./visualizar-cliente"
import EditarCliente from "./editar-cliente"

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

  useEffect(() => {
    // Tentar detectar o idioma do usuário
    try {
      const storedLang = localStorage.getItem("selectedLanguage")
      if (storedLang === "en") setLanguage("en")
    } catch (e) {
      console.error("Erro ao acessar localStorage:", e)
    }

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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{language === "pt" ? "Gerenciamento de Clientes" : "Client Management"}</h1>

        <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {language === "pt" ? "Novo Cliente" : "New Client"}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{language === "pt" ? "Adicionar Cliente" : "Add Client"}</DialogTitle>
              <DialogDescription>
                {language === "pt" ? "Preencha os dados do cliente abaixo:" : "Fill in the client data below:"}{" "}
                <span className="text-red-500">*</span> {language === "pt" ? "Campos obrigatórios" : "Required fields"}
              </DialogDescription>
            </DialogHeader>

            <Tabs value={tabAtiva} onValueChange={setTabAtiva} className="w-full mt-4">
              <TabsList className="grid grid-cols-4">
                <TabsTrigger value="informacoes">
                  {language === "pt" ? "Informações Gerais" : "General Information"}
                </TabsTrigger>
                <TabsTrigger value="endereco">{language === "pt" ? "Endereço" : "Address"}</TabsTrigger>
                <TabsTrigger value="fiscal">
                  {language === "pt" ? "Informações Fiscais" : "Tax Information"}
                </TabsTrigger>
                <TabsTrigger value="acesso">{language === "pt" ? "Acesso" : "Access"}</TabsTrigger>
              </TabsList>

              <TabsContent value="informacoes" className="space-y-4 mt-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="nome" className="flex items-center">
                      {language === "pt" ? "Nome da Empresa" : "Company Name"}{" "}
                      <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input
                      id="nome"
                      name="nome"
                      value={novoCliente.nome}
                      onChange={handleChange}
                      placeholder={language === "pt" ? "Nome da empresa" : "Company name"}
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
                    <Label htmlFor="telefone">{language === "pt" ? "Telefone" : "Phone"}</Label>
                    <Input
                      id="telefone"
                      name="telefone"
                      value={novoCliente.telefone}
                      onChange={handleChange}
                      placeholder={language === "pt" ? "(00) 0000-0000" : "(00) 0000-0000"}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="contato">{language === "pt" ? "Pessoa de Contato" : "Contact Person"}</Label>
                    <Input
                      id="contato"
                      name="contato"
                      value={novoCliente.contato}
                      onChange={handleChange}
                      placeholder={language === "pt" ? "Nome do contato principal" : "Main contact name"}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="cargo_contato">{language === "pt" ? "Cargo do Contato" : "Contact Position"}</Label>
                    <Input
                      id="cargo_contato"
                      name="cargo_contato"
                      value={novoCliente.cargo_contato}
                      onChange={handleChange}
                      placeholder={language === "pt" ? "Diretor, Gerente, etc." : "Director, Manager, etc."}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="status">{language === "pt" ? "Status" : "Status"}</Label>
                    <select
                      id="status"
                      name="status"
                      value={novoCliente.status}
                      onChange={handleChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="Ativo">{language === "pt" ? "Ativo" : "Active"}</option>
                      <option value="Inativo">{language === "pt" ? "Inativo" : "Inactive"}</option>
                    </select>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="endereco" className="space-y-4 mt-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="endereco">{language === "pt" ? "Endereço" : "Address"}</Label>
                    <Input
                      id="endereco"
                      name="endereco"
                      value={novoCliente.endereco}
                      onChange={handleChange}
                      placeholder={language === "pt" ? "Rua, número, complemento" : "Street, number, complement"}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="cidade">{language === "pt" ? "Cidade" : "City"}</Label>
                      <Input
                        id="cidade"
                        name="cidade"
                        value={novoCliente.cidade}
                        onChange={handleChange}
                        placeholder={language === "pt" ? "Cidade" : "City"}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="estado">{language === "pt" ? "Estado" : "State"}</Label>
                      <Input
                        id="estado"
                        name="estado"
                        value={novoCliente.estado}
                        onChange={handleChange}
                        placeholder={language === "pt" ? "Estado" : "State"}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="pais">{language === "pt" ? "País" : "Country"}</Label>
                      <Input
                        id="pais"
                        name="pais"
                        value={novoCliente.pais}
                        onChange={handleChange}
                        placeholder={language === "pt" ? "País" : "Country"}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="cep">{language === "pt" ? "CEP" : "Zip Code"}</Label>
                      <Input
                        id="cep"
                        name="cep"
                        value={novoCliente.cep}
                        onChange={handleChange}
                        placeholder={language === "pt" ? "CEP" : "Zip Code"}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="fiscal" className="space-y-4 mt-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="cnpj_cpf">{language === "pt" ? "CNPJ/CPF" : "Tax ID"}</Label>
                    <Input
                      id="cnpj_cpf"
                      name="cnpj_cpf"
                      value={novoCliente.cnpj_cpf}
                      onChange={handleChange}
                      placeholder={language === "pt" ? "00.000.000/0000-00" : "Tax ID number"}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="inscricao_estadual">
                      {language === "pt" ? "Inscrição Estadual" : "State Registration"}
                    </Label>
                    <Input
                      id="inscricao_estadual"
                      name="inscricao_estadual"
                      value={novoCliente.inscricao_estadual}
                      onChange={handleChange}
                      placeholder={language === "pt" ? "Inscrição Estadual" : "State Registration"}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="segmento">
                      {language === "pt" ? "Segmento/Ramo de Atividade" : "Business Segment"}
                    </Label>
                    <Input
                      id="segmento"
                      name="segmento"
                      value={novoCliente.segmento}
                      onChange={handleChange}
                      placeholder={
                        language === "pt" ? "Ex: Construção Civil, Varejo, etc." : "Ex: Construction, Retail, etc."
                      }
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="acesso" className="space-y-4 mt-4">
                <div className="grid gap-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 text-yellow-800">
                    <h4 className="font-medium mb-2">
                      {language === "pt" ? "Informações de Acesso" : "Access Information"}
                    </h4>
                    <p className="text-sm">
                      {language === "pt"
                        ? "Defina uma senha para que o cliente possa acessar o sistema. O email será usado como login."
                        : "Set a password for the client to access the system. The email will be used as login."}
                    </p>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="senha">{language === "pt" ? "Senha" : "Password"}</Label>
                    <Input
                      id="senha"
                      name="senha"
                      type="password"
                      value={novoCliente.senha}
                      onChange={handleChange}
                      placeholder={language === "pt" ? "Digite a senha" : "Enter password"}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="confirmarSenha">{language === "pt" ? "Confirmar Senha" : "Confirm Password"}</Label>
                    <Input
                      id="confirmarSenha"
                      name="confirmarSenha"
                      type="password"
                      placeholder={language === "pt" ? "Confirme a senha" : "Confirm password"}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter className="mt-6">
              <Button variant="outline" onClick={() => setDialogAberto(false)}>
                {language === "pt" ? "Cancelar" : "Cancel"}
              </Button>
              <Button onClick={adicionarCliente} disabled={salvando}>
                {salvando ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {language === "pt" ? "Salvando..." : "Saving..."}
                  </>
                ) : language === "pt" ? (
                  "Adicionar Cliente"
                ) : (
                  "Add Client"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{language === "pt" ? "Clientes" : "Clients"}</CardTitle>
          <CardDescription>
            {language === "pt"
              ? "Gerencie todos os clientes cadastrados no sistema."
              : "Manage all clients registered in the system."}
          </CardDescription>
          <div className="mt-4 flex gap-2">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={language === "pt" ? "Buscar clientes..." : "Search clients..."}
                className="pl-8"
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && buscarClientes()}
              />
            </div>
            <Button onClick={buscarClientes} variant="outline">
              {language === "pt" ? "Buscar" : "Search"}
            </Button>
            <Button
              onClick={() => {
                setTermoBusca("")
                carregarClientes()
              }}
              variant="outline"
            >
              {language === "pt" ? "Limpar" : "Clear"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>{language === "pt" ? "Nome" : "Name"}</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="hidden md:table-cell">{language === "pt" ? "Telefone" : "Phone"}</TableHead>
                <TableHead className="hidden lg:table-cell">
                  {language === "pt" ? "Cidade/Estado" : "City/State"}
                </TableHead>
                <TableHead>{language === "pt" ? "Status" : "Status"}</TableHead>
                <TableHead>{language === "pt" ? "Ações" : "Actions"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    <div className="flex justify-center items-center">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      <span className="ml-2">{language === "pt" ? "Carregando..." : "Loading..."}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : clientes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    {language === "pt" ? "Nenhum cliente encontrado" : "No clients found"}
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
                        {cliente.status === "Ativo"
                          ? language === "pt"
                            ? "Ativo"
                            : "Active"
                          : language === "pt"
                            ? "Inativo"
                            : "Inactive"}
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
                          title={language === "pt" ? "Visualizar" : "View"}
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
                          title={language === "pt" ? "Editar" : "Edit"}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            // Abrir diálogo para definir senha
                            const senha = prompt(
                              language === "pt"
                                ? "Digite a nova senha para o cliente:"
                                : "Enter new password for client:",
                            )
                            if (senha) {
                              definirSenha(cliente.id!, senha)
                            }
                          }}
                          title={language === "pt" ? "Definir Senha" : "Set Password"}
                        >
                          <Key className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => excluirCliente(cliente.id!)}
                          title={language === "pt" ? "Excluir" : "Delete"}
                        >
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

      {/* Componentes de diálogo para visualizar e editar clientes */}
      <VisualizarCliente
        clienteId={clienteSelecionado}
        aberto={visualizarDialogAberto}
        onOpenChange={setVisualizarDialogAberto}
        language={language}
      />

      <EditarCliente
        clienteId={clienteSelecionado}
        aberto={editarDialogAberto}
        onOpenChange={setEditarDialogAberto}
        onClienteAtualizado={carregarClientes}
        language={language}
      />
    </div>
  )
}
