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
import { Search, Plus, Edit, Trash2, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getLanguage, translations } from "@/lib/i18n"

// Tipos para os clientes
interface Cliente {
  id: string
  nome: string
  email: string
  telefone: string
  endereco: string
  cidade: string
  estado: string
  pais: string
  cep: string
  contato: string
  status: "Ativo" | "Inativo"
}

// Dados de exemplo
const clientes: Cliente[] = [
  {
    id: "CLI-001",
    nome: "AMAZON TEMPER MANAUS",
    email: "contato@amazontemper-manaus.com.br",
    telefone: "(92) 3456-7890",
    endereco: "Av. Industrial, 1500",
    cidade: "Manaus",
    estado: "AM",
    pais: "Brasil",
    cep: "69000-000",
    contato: "Carlos Silva",
    status: "Ativo",
  },
  {
    id: "CLI-002",
    nome: "AMAZON TEMPER FORTALEZA",
    email: "contato@amazontemper-fortaleza.com.br",
    telefone: "(85) 3456-7890",
    endereco: "Av. Santos Dumont, 2500",
    cidade: "Fortaleza",
    estado: "CE",
    pais: "Brasil",
    cep: "60000-000",
    contato: "Ana Oliveira",
    status: "Ativo",
  },
  {
    id: "CLI-003",
    nome: "VITRAL MANAUS",
    email: "contato@vitralmanaus.com.br",
    telefone: "(92) 3456-7891",
    endereco: "Rua das Indústrias, 500",
    cidade: "Manaus",
    estado: "AM",
    pais: "Brasil",
    cep: "69000-100",
    contato: "Roberto Mendes",
    status: "Ativo",
  },
  {
    id: "CLI-004",
    nome: "PORTAL VIDROS",
    email: "contato@portalvidros.com.br",
    telefone: "(11) 3456-7890",
    endereco: "Av. Industrial, 800",
    cidade: "São Paulo",
    estado: "SP",
    pais: "Brasil",
    cep: "04000-000",
    contato: "Mariana Costa",
    status: "Ativo",
  },
  {
    id: "CLI-005",
    nome: "AMAZON TEMPER LUCAS DO RIO VERDE",
    email: "contato@amazontemper-lrv.com.br",
    telefone: "(65) 3456-7890",
    endereco: "Rodovia BR-163, Km 680",
    cidade: "Lucas do Rio Verde",
    estado: "MT",
    pais: "Brasil",
    cep: "78000-000",
    contato: "Paulo Rodrigues",
    status: "Ativo",
  },
  {
    id: "CLI-006",
    nome: "VIDRORIOS",
    email: "contato@vidrorios.com.br",
    telefone: "(21) 3456-7890",
    endereco: "Av. Brasil, 5000",
    cidade: "Rio de Janeiro",
    estado: "RJ",
    pais: "Brasil",
    cep: "20000-000",
    contato: "Fernanda Lima",
    status: "Inativo",
  },
  {
    id: "CLI-007",
    nome: "AMAZON TEMPER VARZEA GRANDE",
    email: "contato@amazontemper-vg.com.br",
    telefone: "(65) 3456-7891",
    endereco: "Av. Industrial, 1200",
    cidade: "Várzea Grande",
    estado: "MT",
    pais: "Brasil",
    cep: "78000-100",
    contato: "Ricardo Santos",
    status: "Ativo",
  },
]

export default function ClientesPage() {
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
  const { toast } = useToast()

  useEffect(() => {
    setLanguage(getLanguage())
  }, [])

  const t = translations[language]

  // Filtrar clientes pelo termo de busca
  const clientesFiltrados = clientes.filter((cliente) => {
    const termo = termoBusca.toLowerCase()
    return (
      cliente.nome.toLowerCase().includes(termo) ||
      cliente.email.toLowerCase().includes(termo) ||
      cliente.id.toLowerCase().includes(termo) ||
      cliente.cidade.toLowerCase().includes(termo) ||
      cliente.estado.toLowerCase().includes(termo)
    )
  })

  // Manipular mudanças no formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNovoCliente((prev) => ({ ...prev, [name]: value }))
  }

  // Adicionar novo cliente
  const adicionarCliente = () => {
    // Aqui seria implementada a lógica para adicionar o cliente ao backend
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
              <Button onClick={adicionarCliente}>{language === "pt" ? "Adicionar Cliente" : "Add Client"}</Button>
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
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={language === "pt" ? "Buscar clientes..." : "Search clients..."}
                className="pl-8"
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
              />
            </div>
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
              {clientesFiltrados.map((cliente) => (
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
                      <Button variant="outline" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
