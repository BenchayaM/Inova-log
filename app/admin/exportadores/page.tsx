"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Search, MoreHorizontal, Plus, FileText, Trash2, Edit } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Tipos
interface Exportador {
  id: string
  nome: string
  pais: string
  contato: string
  email: string
  telefone: string
  status: "Ativo" | "Inativo"
}

// Dados de exemplo
const exportadoresExemplo: Exportador[] = [
  {
    id: "EXP-001",
    nome: "Baoxinsheng Industrial",
    pais: "China",
    contato: "Gabriel Lee",
    email: "contact@baoxinsheng.com",
    telefone: "+86 755 2345 6789",
    status: "Ativo",
  },
  {
    id: "EXP-002",
    nome: "Oriental Industrial",
    pais: "China",
    contato: "Luke Lee",
    email: "info@oriental-ind.com",
    telefone: "+86 21 5678 9012",
    status: "Ativo",
  },
  {
    id: "EXP-003",
    nome: "Guangzhou Trading Co.",
    pais: "China",
    contato: "Zhang Wei",
    email: "contact@gztradingco.com",
    telefone: "+86 20 3456 7890",
    status: "Inativo",
  },
  {
    id: "EXP-004",
    nome: "Shenzhen Electronics",
    pais: "China",
    contato: "Chen Min",
    email: "info@szelectronics.com",
    telefone: "+86 755 8765 4321",
    status: "Ativo",
  },
  {
    id: "EXP-005",
    nome: "Vietnam Manufacturing Ltd.",
    pais: "Vietnã",
    contato: "Nguyen Van",
    email: "contact@vnmanufacturing.com",
    telefone: "+84 28 1234 5678",
    status: "Ativo",
  },
]

export default function ExportadoresPage() {
  const [exportadores, setExportadores] = useState<Exportador[]>(exportadoresExemplo)
  const [busca, setBusca] = useState("")
  const { toast } = useToast()

  // Filtrar exportadores com base na busca
  const exportadoresFiltrados = exportadores.filter(
    (exportador) =>
      exportador.nome.toLowerCase().includes(busca.toLowerCase()) ||
      exportador.pais.toLowerCase().includes(busca.toLowerCase()) ||
      exportador.contato.toLowerCase().includes(busca.toLowerCase()) ||
      exportador.id.toLowerCase().includes(busca.toLowerCase()),
  )

  // Excluir exportador
  const excluirExportador = (id: string) => {
    setExportadores(exportadores.filter((exportador) => exportador.id !== id))
    toast({
      title: "Exportador excluído",
      description: `O exportador ${id} foi excluído com sucesso.`,
    })
  }

  // Alternar status do exportador
  const alternarStatus = (id: string) => {
    setExportadores(
      exportadores.map((exportador) =>
        exportador.id === id
          ? {
              ...exportador,
              status: exportador.status === "Ativo" ? "Inativo" : "Ativo",
            }
          : exportador,
      ),
    )

    const exportador = exportadores.find((exp) => exp.id === id)
    const novoStatus = exportador?.status === "Ativo" ? "Inativo" : "Ativo"

    toast({
      title: "Status alterado",
      description: `O exportador ${id} agora está ${novoStatus}.`,
    })
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Exportadores</CardTitle>
            <CardDescription>Gerencie os exportadores cadastrados no sistema.</CardDescription>
          </div>
          <Link href="/admin/exportadores/novo">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Exportador
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar exportadores..."
                className="pl-8"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>País</TableHead>
                  <TableHead className="hidden md:table-cell">Contato</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {exportadoresFiltrados.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-6">
                      Nenhum exportador encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  exportadoresFiltrados.map((exportador) => (
                    <TableRow key={exportador.id}>
                      <TableCell className="font-medium">{exportador.id}</TableCell>
                      <TableCell>{exportador.nome}</TableCell>
                      <TableCell>{exportador.pais}</TableCell>
                      <TableCell className="hidden md:table-cell">{exportador.contato}</TableCell>
                      <TableCell className="hidden md:table-cell">{exportador.email}</TableCell>
                      <TableCell>
                        <Badge variant={exportador.status === "Ativo" ? "success" : "secondary"}>
                          {exportador.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Abrir menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <Link href={`/admin/exportadores/${exportador.id}`}>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem onClick={() => alternarStatus(exportador.id)}>
                              <FileText className="mr-2 h-4 w-4" />
                              {exportador.status === "Ativo" ? "Desativar" : "Ativar"}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => excluirExportador(exportador.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
