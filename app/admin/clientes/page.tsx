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
import { Search, Plus, Edit, Trash2, Eye, Loader2 } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import { getLanguage, translations } from "@/lib/i18n"
// NOVO: Importar o componente de edição
import EditarCliente from "./editar-cliente"
// NOVO: Importar o tipo Cliente do arquivo clients.ts
import type { Cliente } from "@/lib/clients"

export default function ClientesPage() {
  // NOVO: Estado para armazenar clientes do banco de dados
  const [clientes, setClientes] = useState<Cliente[]>([])
  // NOVO: Estado para indicar carregamento
  const [loading, setLoading] = useState(true)
  const [termoBusca, setTermoBusca] = useState("")
  const [novoCliente, setNovoCliente] = useState<Partial<Cliente>>({
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
  })
  const [dialogAberto, setDialogAberto] = useState(false)
  const [tabAtiva, setTabAtiva] = useState("informacoes")
  const [language, setLanguage] = useState<"pt" | "en">("pt")
  // NOVO: Estado para indicar salvamento em progresso
  const [salvando, setSalvando] = useState(false)
  // NOVO: Estados para controlar a edição de cliente
  const [clienteEditandoId, setClienteEditandoId] = useState<number | null>(null)
  const [dialogEdicaoAberto, setDialogEdicaoAberto] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    setLanguage(getLanguage())
    // NOVO: Carregar clientes ao montar o componente
    carregarClientes()
  }, [])

  const t = translations[language]

  // NOVO: Função para carregar clientes do banco de dados
  const carregarClientes = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/clientes")
      const data = await response.json()

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

  // NOVO: Buscar clientes pelo termo
  const buscarClientes = async () => {
    if (!termoBusca.trim()) {
      carregarClientes()
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/clientes?termo=${encodeURIComponent(termoBusca)}`)
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

  // NOVO: Excluir cliente
  const excluirCliente = async (id: number) => {
    if (
      !confirm(
        language === "pt"
          ? "Tem certeza que deseja excluir este cliente?"
          : "Are you sure you want to delete this client?"
      )
    ) {
      return
    }

    try {
      const response = await fetch(`/api/clientes/${id}`, {
        method: "DELETE",
      })

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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNovoCliente((prev) => ({ ...prev, [name]: value }))
  }

  // MODIFICADO: Adicionar novo cliente (agora conectado à API)
  const adicionarCliente = async () => {
    setSalvando(true)

    try {
      const response = await fetch("/api/clientes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(novoCliente),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: language === "pt" ? "Cliente adicionado" : "Client added",
          description:
            language === "pt"
              ? `${novoCliente.nome} foi adicionado com sucesso.`
              : `${novoCliente.nome} has been successfully added.`,
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

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t.clientManagement}</h1>

        <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {t.newClient}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{t.addClient}</DialogTitle>
              <DialogDescription>{t.clientData}</DialogDescription>
            </DialogHeader>

            <Tabs value={tabAtiva} onValueChange={setTabAtiva} className="w-full mt-4">
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="informacoes">{t.generalInfo}</TabsTrigger>
                <TabsTrigger value="endereco">{t.addressInfo}</TabsTrigger>
              </TabsList>

              <TabsContent value="informacoes" className="space-y-4 mt-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="nome">{t.companyName}</Label>
                    <Input
                      id="nome"
                      name="nome"
                      value={novoCliente.nome}
                      onChange={handleChange}
                      placeholder={language === "pt" ? "Nome da empresa" : "Company name"}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={novoCliente.email}
                        onChange={handleChange}
                        placeholder={language === "pt" ? "contato@empresa.com" : "contact@company.com"}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="telefone">{language === "pt" ? "Telefone" : "Phone"}</Label>
                      <Input
                        id="telefone"
                        name="telefone"
                        value={novoCliente.telefone}
                        onChange={handleChange}
                        placeholder="(00) 0000-0000"
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="contato">{t.contactPerson}</Label>
                    <Input
                      id="contato"
                      name="contato"
                      value={novoCliente.contato}
                      onChange={handleChange}
                      placeholder={language === "pt" ? "Nome do contato principal" : "Main contact name"}
                    />
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <Label htmlFor="cep">{language === "pt" ? "CEP" : "Postal Code"}</Label>
                      <Input
                        id="cep"
                        name="cep"
                        value={novoCliente.cep}
                        onChange={handleChange}
                        placeholder={language === "pt" ? "CEP" : "Postal Code"}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter className="mt-6">
              <Button variant="outline" onClick={() => setDialogAberto(false)}>
                {t.cancel}
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
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead className="hidden lg:table-cell">
                  {language === "pt" ? "Cidade/Estado" : "City/State"}
                </TableHead>
                <TableHead className="hidden lg:table-cell">{language === "pt" ? "Contato" : "Contact"}</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>{t.actions}</TableHead>
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
                    <TableCell className="hidden md:table-cell">{cliente.email}</TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {cliente.cidade}/{cliente.estado}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">{cliente.contato}</TableCell>
                    <TableCell>
                      <Badge variant={cliente.status === "Ativo" ? "success" : "secondary"}>
                        {cliente.status === "Ativo" ? t.active : t.inactive}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            // Implementar visualização detalhada
                            // Esta funcionalidade será implementada posteriormente
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {/* MODIFICADO: Botão de edição agora abre o diálogo de edição */}
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            setClienteEditandoId(Number(cliente.id));
                            setDialogEdicaoAberto(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {/* MODIFICADO: Botão de exclusão agora chama a função excluirCliente */}
                        <Button variant="outline" size="icon" onClick={() => excluirCliente(Number(cliente.id))}>
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

      {/* NOVO: Componente de edição de cliente */}
      <EditarCliente
        clienteId={clienteEditandoId}
        aberto={dialogEdicaoAberto}
        onOpenChange={setDialogEdicaoAberto}
        onClienteAtualizado={carregarClientes}
      />
    </div>
  )
}
