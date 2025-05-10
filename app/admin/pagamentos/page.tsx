"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { Textarea } from "@/components/ui/textarea"
import { Search, Eye, FileText, DollarSign, Plus } from "lucide-react"
import { getLanguage, translations } from "@/lib/i18n"
import { useToast } from "@/hooks/use-toast"

// Tipos para pagamentos
interface Pagamento {
  id: string
  cliente: string
  exportador: string
  pedido: string
  valor: number
  dataPagamento: string
  dataRepasse?: string
  formaPagamento: string
  status: "recebido" | "repassado" | "pendente" | "parcial"
  comprovante?: string
  observacoes?: string
}

// Dados de exemplo para pagamentos
const pagamentosExemplo: Pagamento[] = [
  {
    id: "PAG-2025-001",
    cliente: "Cliente 001",
    exportador: "Baoxinsheng Industrial",
    pedido: "Cliente 001 - 05/05/2025",
    valor: 12500.0,
    dataPagamento: "03/05/2025",
    dataRepasse: "06/05/2025",
    formaPagamento: "Carta de Crédito",
    status: "repassado",
    comprovante: "comprovante-001.pdf",
    observacoes: "Pagamento confirmado e repassado ao exportador.",
  },
  {
    id: "PAG-2025-002",
    cliente: "Cliente 002",
    exportador: "Oriental Industrial",
    pedido: "Cliente 002 - 10/05/2025",
    valor: 18700.0,
    dataPagamento: "08/05/2025",
    formaPagamento: "Transferência Bancária",
    status: "recebido",
    comprovante: "comprovante-002.pdf",
    observacoes: "Pagamento recebido, aguardando repasse ao exportador.",
  },
  {
    id: "PAG-2025-003",
    cliente: "Cliente 003",
    exportador: "Baoxinsheng Industrial",
    pedido: "Cliente 003 - 15/05/2025",
    valor: 45000.0,
    dataPagamento: "",
    formaPagamento: "Pagamento Antecipado",
    status: "pendente",
    observacoes: "Aguardando confirmação de pagamento do cliente.",
  },
  {
    id: "PAG-2025-004",
    cliente: "Cliente 004",
    exportador: "Oriental Industrial",
    pedido: "Cliente 004 - 18/05/2025",
    valor: 32000.0,
    dataPagamento: "15/05/2025",
    formaPagamento: "Pagamento Parcelado",
    status: "parcial",
    comprovante: "comprovante-004.pdf",
    observacoes: "Recebido 50% do valor. Aguardando pagamento do restante.",
  },
]

export default function PagamentosPage() {
  const [language, setLanguage] = useState<"pt" | "en">("pt")
  const [pagamentos, setPagamentos] = useState<Pagamento[]>(pagamentosExemplo)
  const [filteredPagamentos, setFilteredPagamentos] = useState<Pagamento[]>(pagamentosExemplo)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string | null>(null)
  const [filterCliente, setFilterCliente] = useState<string | null>(null)
  const [filterExportador, setFilterExportador] = useState<string | null>(null)

  // Estados para novo pagamento
  const [dialogOpen, setDialogOpen] = useState(false)
  const [novoPagamento, setNovoPagamento] = useState<Partial<Pagamento>>({
    cliente: "",
    exportador: "",
    pedido: "",
    valor: 0,
    dataPagamento: "",
    formaPagamento: "",
    status: "recebido",
    observacoes: "",
  })

  // Estados para diálogo de repasse
  const [repasseDialogOpen, setRepasseDialogOpen] = useState(false)
  const [pagamentoSelecionado, setPagamentoSelecionado] = useState<Pagamento | null>(null)
  const [dataRepasse, setDataRepasse] = useState("")
  const [observacoesRepasse, setObservacoesRepasse] = useState("")

  const { toast } = useToast()

  useEffect(() => {
    setLanguage(getLanguage())
  }, [])

  const t = translations[language]

  // Filtrar pagamentos
  useEffect(() => {
    let filtered = pagamentos

    if (searchTerm) {
      filtered = filtered.filter(
        (pagamento) =>
          pagamento.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pagamento.exportador.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pagamento.pedido.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pagamento.id.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (filterStatus) {
      filtered = filtered.filter((pagamento) => pagamento.status === filterStatus)
    }

    if (filterCliente) {
      filtered = filtered.filter((pagamento) => pagamento.cliente === filterCliente)
    }

    if (filterExportador) {
      filtered = filtered.filter((pagamento) => pagamento.exportador === filterExportador)
    }

    setFilteredPagamentos(filtered)
  }, [searchTerm, filterStatus, filterCliente, filterExportador, pagamentos])

  // Clientes únicos para o filtro
  const uniqueClientes = Array.from(new Set(pagamentos.map((pagamento) => pagamento.cliente)))

  // Exportadores únicos para o filtro
  const uniqueExportadores = Array.from(new Set(pagamentos.map((pagamento) => pagamento.exportador)))

  // Obter nome traduzido do status
  const getStatusName = (status: string) => {
    switch (status) {
      case "recebido":
        return language === "pt" ? "Recebido" : "Received"
      case "repassado":
        return language === "pt" ? "Repassado" : "Transferred"
      case "pendente":
        return language === "pt" ? "Pendente" : "Pending"
      case "parcial":
        return language === "pt" ? "Parcial" : "Partial"
      default:
        return status
    }
  }

  // Obter variante de badge para o status
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "recebido":
        return "default"
      case "repassado":
        return "success"
      case "pendente":
        return "outline"
      case "parcial":
        return "warning"
      default:
        return "outline"
    }
  }

  // Manipular mudanças no formulário de novo pagamento
  const handleNovoPagamentoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setNovoPagamento((prev) => ({ ...prev, [name]: value }))
  }

  // Adicionar novo pagamento
  const adicionarPagamento = () => {
    if (!novoPagamento.cliente || !novoPagamento.exportador || !novoPagamento.pedido || !novoPagamento.valor) {
      toast({
        title: language === "pt" ? "Erro" : "Error",
        description: language === "pt" ? "Preencha todos os campos obrigatórios" : "Fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const novoPag: Pagamento = {
      id: `PAG-2025-${pagamentos.length + 1}`.padStart(11, "0"),
      cliente: novoPagamento.cliente || "",
      exportador: novoPagamento.exportador || "",
      pedido: novoPagamento.pedido || "",
      valor: Number(novoPagamento.valor) || 0,
      dataPagamento: novoPagamento.dataPagamento || "",
      formaPagamento: novoPagamento.formaPagamento || "",
      status: (novoPagamento.status as "recebido" | "repassado" | "pendente" | "parcial") || "recebido",
      observacoes: novoPagamento.observacoes,
    }

    setPagamentos([...pagamentos, novoPag])

    toast({
      title: language === "pt" ? "Sucesso" : "Success",
      description: language === "pt" ? "Pagamento registrado com sucesso" : "Payment registered successfully",
    })

    setDialogOpen(false)
    setNovoPagamento({
      cliente: "",
      exportador: "",
      pedido: "",
      valor: 0,
      dataPagamento: "",
      formaPagamento: "",
      status: "recebido",
      observacoes: "",
    })
  }

  // Abrir diálogo de repasse
  const abrirDialogoRepasse = (pagamento: Pagamento) => {
    setPagamentoSelecionado(pagamento)
    setDataRepasse("")
    setObservacoesRepasse("")
    setRepasseDialogOpen(true)
  }

  // Registrar repasse
  const registrarRepasse = () => {
    if (!pagamentoSelecionado || !dataRepasse) {
      toast({
        title: language === "pt" ? "Erro" : "Error",
        description: language === "pt" ? "Informe a data de repasse" : "Enter the transfer date",
        variant: "destructive",
      })
      return
    }

    setPagamentos(
      pagamentos.map((pagamento) =>
        pagamento.id === pagamentoSelecionado.id
          ? {
              ...pagamento,
              status: "repassado",
              dataRepasse: dataRepasse,
              observacoes: observacoesRepasse || pagamento.observacoes,
            }
          : pagamento,
      ),
    )

    toast({
      title: language === "pt" ? "Sucesso" : "Success",
      description: language === "pt" ? "Repasse registrado com sucesso" : "Transfer registered successfully",
    })

    setRepasseDialogOpen(false)
    setPagamentoSelecionado(null)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          {language === "pt" ? "Gerenciamento de Pagamentos" : "Payment Management"}
        </h1>
        <p className="text-muted-foreground">
          {language === "pt"
            ? "Gerencie os pagamentos recebidos e repassados aos exportadores."
            : "Manage payments received and transferred to exporters."}
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={
              language === "pt"
                ? "Buscar por cliente, exportador ou pedido..."
                : "Search by client, exporter or order..."
            }
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Select value={filterStatus || ""} onValueChange={(value) => setFilterStatus(value || null)}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="recebido">{getStatusName("recebido")}</SelectItem>
            <SelectItem value="repassado">{getStatusName("repassado")}</SelectItem>
            <SelectItem value="pendente">{getStatusName("pendente")}</SelectItem>
            <SelectItem value="parcial">{getStatusName("parcial")}</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterCliente || ""} onValueChange={(value) => setFilterCliente(value || null)}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder={language === "pt" ? "Cliente" : "Client"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{language === "pt" ? "Todos os clientes" : "All clients"}</SelectItem>
            {uniqueClientes.map((cliente) => (
              <SelectItem key={cliente} value={cliente}>
                {cliente}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterExportador || ""} onValueChange={(value) => setFilterExportador(value || null)}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder={language === "pt" ? "Exportador" : "Exporter"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{language === "pt" ? "Todos os exportadores" : "All exporters"}</SelectItem>
            {uniqueExportadores.map((exportador) => (
              <SelectItem key={exportador} value={exportador}>
                {exportador}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              {language === "pt" ? "Novo Pagamento" : "New Payment"}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{language === "pt" ? "Registrar Novo Pagamento" : "Register New Payment"}</DialogTitle>
              <DialogDescription>
                {language === "pt"
                  ? "Preencha os dados do pagamento recebido do cliente."
                  : "Fill in the payment details received from the client."}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="cliente">{language === "pt" ? "Cliente" : "Client"}</Label>
                  <Select
                    name="cliente"
                    value={novoPagamento.cliente}
                    onValueChange={(value) => setNovoPagamento({ ...novoPagamento, cliente: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={language === "pt" ? "Selecione o cliente" : "Select client"} />
                    </SelectTrigger>
                    <SelectContent>
                      {uniqueClientes.map((cliente) => (
                        <SelectItem key={cliente} value={cliente}>
                          {cliente}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="exportador">{language === "pt" ? "Exportador" : "Exporter"}</Label>
                  <Select
                    name="exportador"
                    value={novoPagamento.exportador}
                    onValueChange={(value) => setNovoPagamento({ ...novoPagamento, exportador: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={language === "pt" ? "Selecione o exportador" : "Select exporter"} />
                    </SelectTrigger>
                    <SelectContent>
                      {uniqueExportadores.map((exportador) => (
                        <SelectItem key={exportador} value={exportador}>
                          {exportador}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="pedido">{language === "pt" ? "Pedido" : "Order"}</Label>
                <Input
                  id="pedido"
                  name="pedido"
                  value={novoPagamento.pedido}
                  onChange={handleNovoPagamentoChange}
                  placeholder={language === "pt" ? "Referência do pedido" : "Order reference"}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="valor">{language === "pt" ? "Valor (USD)" : "Amount (USD)"}</Label>
                  <Input
                    id="valor"
                    name="valor"
                    type="number"
                    step="0.01"
                    value={novoPagamento.valor || ""}
                    onChange={handleNovoPagamentoChange}
                    placeholder="0.00"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="dataPagamento">{language === "pt" ? "Data do Pagamento" : "Payment Date"}</Label>
                  <Input
                    id="dataPagamento"
                    name="dataPagamento"
                    type="date"
                    value={novoPagamento.dataPagamento}
                    onChange={handleNovoPagamentoChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="formaPagamento">{language === "pt" ? "Forma de Pagamento" : "Payment Method"}</Label>
                  <Select
                    name="formaPagamento"
                    value={novoPagamento.formaPagamento}
                    onValueChange={(value) => setNovoPagamento({ ...novoPagamento, formaPagamento: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={language === "pt" ? "Selecione" : "Select"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Carta de Crédito">Carta de Crédito</SelectItem>
                      <SelectItem value="Transferência Bancária">Transferência Bancária</SelectItem>
                      <SelectItem value="Pagamento Antecipado">Pagamento Antecipado</SelectItem>
                      <SelectItem value="Pagamento Parcelado">Pagamento Parcelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="status">{language === "pt" ? "Status" : "Status"}</Label>
                  <Select
                    name="status"
                    value={novoPagamento.status}
                    onValueChange={(value: any) => setNovoPagamento({ ...novoPagamento, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={language === "pt" ? "Selecione" : "Select"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recebido">{getStatusName("recebido")}</SelectItem>
                      <SelectItem value="pendente">{getStatusName("pendente")}</SelectItem>
                      <SelectItem value="parcial">{getStatusName("parcial")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="observacoes">{language === "pt" ? "Observações" : "Notes"}</Label>
                <Textarea
                  id="observacoes"
                  name="observacoes"
                  value={novoPagamento.observacoes}
                  onChange={handleNovoPagamentoChange}
                  placeholder={
                    language === "pt"
                      ? "Informações adicionais sobre o pagamento"
                      : "Additional information about the payment"
                  }
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                {language === "pt" ? "Cancelar" : "Cancel"}
              </Button>
              <Button onClick={adicionarPagamento}>
                {language === "pt" ? "Registrar Pagamento" : "Register Payment"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={repasseDialogOpen} onOpenChange={setRepasseDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {language === "pt" ? "Registrar Repasse ao Exportador" : "Register Transfer to Exporter"}
              </DialogTitle>
              <DialogDescription>
                {language === "pt"
                  ? "Informe os dados do repasse realizado para o exportador."
                  : "Enter the transfer details made to the exporter."}
              </DialogDescription>
            </DialogHeader>

            {pagamentoSelecionado && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">{language === "pt" ? "Cliente" : "Client"}</p>
                    <p className="text-sm">{pagamentoSelecionado.cliente}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{language === "pt" ? "Exportador" : "Exporter"}</p>
                    <p className="text-sm">{pagamentoSelecionado.exportador}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">{language === "pt" ? "Valor" : "Amount"}</p>
                    <p className="text-sm">${pagamentoSelecionado.valor.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{language === "pt" ? "Data do Pagamento" : "Payment Date"}</p>
                    <p className="text-sm">{pagamentoSelecionado.dataPagamento || "-"}</p>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="dataRepasse">{language === "pt" ? "Data do Repasse" : "Transfer Date"}</Label>
                  <Input
                    id="dataRepasse"
                    type="date"
                    value={dataRepasse}
                    onChange={(e) => setDataRepasse(e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="observacoesRepasse">{language === "pt" ? "Observações" : "Notes"}</Label>
                  <Textarea
                    id="observacoesRepasse"
                    value={observacoesRepasse}
                    onChange={(e) => setObservacoesRepasse(e.target.value)}
                    placeholder={
                      language === "pt"
                        ? "Informações adicionais sobre o repasse"
                        : "Additional information about the transfer"
                    }
                    rows={3}
                  />
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setRepasseDialogOpen(false)}>
                {language === "pt" ? "Cancelar" : "Cancel"}
              </Button>
              <Button onClick={registrarRepasse}>{language === "pt" ? "Confirmar Repasse" : "Confirm Transfer"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{language === "pt" ? "Pagamentos" : "Payments"}</CardTitle>
          <CardDescription>
            {language === "pt"
              ? "Todos os pagamentos registrados no sistema."
              : "All payments registered in the system."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>{language === "pt" ? "Cliente" : "Client"}</TableHead>
                <TableHead>{language === "pt" ? "Exportador" : "Exporter"}</TableHead>
                <TableHead>{language === "pt" ? "Pedido" : "Order"}</TableHead>
                <TableHead>{language === "pt" ? "Valor" : "Amount"}</TableHead>
                <TableHead>{language === "pt" ? "Data Pagamento" : "Payment Date"}</TableHead>
                <TableHead>{language === "pt" ? "Data Repasse" : "Transfer Date"}</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>{language === "pt" ? "Ações" : "Actions"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPagamentos.length > 0 ? (
                filteredPagamentos.map((pagamento) => (
                  <TableRow key={pagamento.id}>
                    <TableCell className="font-medium">{pagamento.id}</TableCell>
                    <TableCell>{pagamento.cliente}</TableCell>
                    <TableCell>{pagamento.exportador}</TableCell>
                    <TableCell>{pagamento.pedido}</TableCell>
                    <TableCell>${pagamento.valor.toFixed(2)}</TableCell>
                    <TableCell>{pagamento.dataPagamento || "-"}</TableCell>
                    <TableCell>{pagamento.dataRepasse || "-"}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(pagamento.status)}>{getStatusName(pagamento.status)}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          {language === "pt" ? "Ver" : "View"}
                        </Button>
                        {pagamento.status === "recebido" && (
                          <Button variant="outline" size="sm" onClick={() => abrirDialogoRepasse(pagamento)}>
                            <DollarSign className="h-4 w-4 mr-1" />
                            {language === "pt" ? "Repasse" : "Transfer"}
                          </Button>
                        )}
                        {pagamento.comprovante && (
                          <Button variant="outline" size="sm">
                            <FileText className="h-4 w-4 mr-1" />
                            {language === "pt" ? "Comprovante" : "Receipt"}
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-4">
                    {language === "pt" ? "Nenhum pagamento encontrado." : "No payments found."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
