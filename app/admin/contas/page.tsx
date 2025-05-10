"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DollarSign, Search, Eye, Edit } from "lucide-react"
import { getLanguage, translations } from "@/lib/i18n"

// Atualizar os dados de exemplo para contas com as formas de pagamento configuradas
const contas = [
  {
    cliente: "Cliente 001",
    exportador: "Baoxinsheng Industrial",
    valorTotal: 12500.0,
    valorPago: 12500.0,
    dataVencimento: "15/05/2025",
    dataPagamento: "10/05/2025",
    status: "paid",
    metodoPagamento: "carta-credito",
  },
  {
    cliente: "Cliente 002",
    exportador: "Oriental Industrial",
    valorTotal: 18700.0,
    valorPago: 15000.0,
    dataVencimento: "20/05/2025",
    dataPagamento: "12/05/2025",
    status: "partiallyPaid",
    metodoPagamento: "transferencia",
  },
  {
    cliente: "Cliente 003",
    exportador: "Baoxinsheng Industrial",
    valorTotal: 45000.0,
    valorPago: 0.0,
    dataVencimento: "25/05/2025",
    dataPagamento: null,
    status: "pending",
    metodoPagamento: null,
  },
]

export default function AdminContasPage() {
  const [language, setLanguage] = useState<"pt" | "en">("pt")
  const [filteredAccounts, setFilteredAccounts] = useState(contas)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterClient, setFilterClient] = useState<string | null>(null)
  const [filterExporter, setFilterExporter] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string | null>(null)

  useEffect(() => {
    setLanguage(getLanguage())
  }, [])

  const t = translations[language]

  // Filtrar contas
  useEffect(() => {
    let filtered = contas

    if (searchTerm) {
      filtered = filtered.filter(
        (conta) =>
          conta.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
          conta.exportador.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (filterClient) {
      filtered = filtered.filter((conta) => conta.cliente === filterClient)
    }

    if (filterExporter) {
      filtered = filtered.filter((conta) => conta.exportador === filterExporter)
    }

    if (filterStatus) {
      filtered = filtered.filter((conta) => conta.status === filterStatus)
    }

    setFilteredAccounts(filtered)
  }, [searchTerm, filterClient, filterExporter, filterStatus])

  // Clientes únicos para o filtro
  const uniqueClients = Array.from(new Set(contas.map((conta) => conta.cliente)))

  // Exportadores únicos para o filtro
  const uniqueExporters = Array.from(new Set(contas.map((conta) => conta.exportador)))

  // Obter nome traduzido do status
  const getStatusName = (status: string) => {
    switch (status) {
      case "paid":
        return t.status.paid
      case "partiallyPaid":
        return t.status.partiallyPaid
      case "pending":
        return t.status.pending
      default:
        return status
    }
  }

  // Atualizar a função getPaymentMethodName para usar as formas de pagamento configuradas
  const getPaymentMethodName = (method: string | null) => {
    if (!method) return "-"
    switch (method) {
      case "carta-credito":
        return language === "pt" ? "Carta de Crédito" : "Letter of Credit"
      case "transferencia":
        return language === "pt" ? "Transferência Bancária" : "Wire Transfer"
      case "antecipado":
        return language === "pt" ? "Pagamento Antecipado" : "Advance Payment"
      case "parcelado":
        return language === "pt" ? "Pagamento Parcelado" : "Installment Payment"
      case "service":
        return t.service
      case "returnProduct":
        return t.returnProduct
      default:
        return method
    }
  }

  // Calcular totais
  const totalValue = filteredAccounts.reduce((sum, conta) => sum + conta.valorTotal, 0)
  const totalPaid = filteredAccounts.reduce((sum, conta) => sum + conta.valorPago, 0)
  const totalPending = totalValue - totalPaid

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t.accounts}</h1>
        <p className="text-muted-foreground">
          {language === "pt"
            ? "Gerencie todas as contas e pagamentos dos pedidos."
            : "Manage all accounts and payments for orders."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t.total}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t.amountPaid}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${totalPaid.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t.amountDue}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">${totalPending.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={
              language === "pt"
                ? "Buscar por pedido, cliente ou exportador..."
                : "Search by order, client or exporter..."
            }
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Select value={filterClient || ""} onValueChange={(value) => setFilterClient(value || null)}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder={language === "pt" ? "Cliente" : "Client"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{language === "pt" ? "Todos os clientes" : "All clients"}</SelectItem>
            {uniqueClients.map((client) => (
              <SelectItem key={client} value={client as string}>
                {client}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterExporter || ""} onValueChange={(value) => setFilterExporter(value || null)}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder={language === "pt" ? "Exportador" : "Exporter"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{language === "pt" ? "Todos os exportadores" : "All exporters"}</SelectItem>
            {uniqueExporters.map((exporter) => (
              <SelectItem key={exporter} value={exporter as string}>
                {exporter}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterStatus || ""} onValueChange={(value) => setFilterStatus(value || null)}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder={t.paymentStatus} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{language === "pt" ? "Todos os status" : "All statuses"}</SelectItem>
            <SelectItem value="paid">{t.status.paid}</SelectItem>
            <SelectItem value="partiallyPaid">{t.status.partiallyPaid}</SelectItem>
            <SelectItem value="pending">{t.status.pending}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{language === "pt" ? "Contas" : "Accounts"}</CardTitle>
          <CardDescription>
            {language === "pt"
              ? "Todas as contas e pagamentos relacionados aos pedidos."
              : "All accounts and payments related to orders."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{language === "pt" ? "Cliente" : "Client"}</TableHead>
                <TableHead>{language === "pt" ? "Exportador" : "Exporter"}</TableHead>
                <TableHead>{t.totalValue}</TableHead>
                <TableHead>{t.amountPaid}</TableHead>
                <TableHead>{t.dueDate}</TableHead>
                <TableHead>{t.paymentStatus}</TableHead>
                <TableHead>{t.paymentMethod}</TableHead>
                <TableHead>{t.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAccounts.length > 0 ? (
                filteredAccounts.map((conta, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{conta.cliente}</TableCell>
                    <TableCell>{conta.exportador}</TableCell>
                    <TableCell>${conta.valorTotal.toFixed(2)}</TableCell>
                    <TableCell>${conta.valorPago.toFixed(2)}</TableCell>
                    <TableCell>{conta.dataVencimento}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          conta.status === "paid"
                            ? "success"
                            : conta.status === "partiallyPaid"
                              ? "default"
                              : "destructive"
                        }
                      >
                        {getStatusName(conta.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>{getPaymentMethodName(conta.metodoPagamento)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          {language === "pt" ? "Ver" : "View"}
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-1" />
                          {language === "pt" ? "Editar" : "Edit"}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4">
                    {language === "pt" ? "Nenhuma conta encontrada." : "No accounts found."}
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
