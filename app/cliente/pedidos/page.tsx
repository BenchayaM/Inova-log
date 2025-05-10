"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Eye, Truck, DollarSign } from "lucide-react"
import { getLanguage, translations } from "@/lib/i18n"

// Dados de exemplo para pedidos
const pedidos = [
  {
    id: "PED-2025-001",
    data: "05/05/2025",
    valor: 12500.0,
    status: "finished",
    pagamento: "paid",
    exportador: "Baoxinsheng Industrial",
    modalidadePagamento: "Carta de Crédito",
  },
  {
    id: "PED-2025-002",
    data: "10/05/2025",
    valor: 18700.0,
    status: "inProduction",
    pagamento: "paid",
    exportador: "Oriental Industrial",
    modalidadePagamento: "Transferência Bancária",
  },
  {
    id: "PED-2025-003",
    data: "15/05/2025",
    valor: 45000.0,
    status: "waitingAuthorization",
    pagamento: "pending",
    exportador: "Baoxinsheng Industrial",
    modalidadePagamento: "Pagamento Antecipado",
  },
]

export default function ClientePedidosPage() {
  const [language, setLanguage] = useState<"pt" | "en">("pt")
  const [filteredOrders, setFilteredOrders] = useState(pedidos)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string | null>(null)
  const [filterPayment, setFilterPayment] = useState<string | null>(null)

  useEffect(() => {
    setLanguage(getLanguage())
  }, [])

  const t = translations[language]

  // Filtrar pedidos
  useEffect(() => {
    let filtered = pedidos

    if (searchTerm) {
      filtered = filtered.filter((pedido) => pedido.exportador.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    if (filterStatus) {
      filtered = filtered.filter((pedido) => pedido.status === filterStatus)
    }

    if (filterPayment) {
      filtered = filtered.filter((pedido) => pedido.pagamento === filterPayment)
    }

    setFilteredOrders(filtered)
  }, [searchTerm, filterStatus, filterPayment])

  // Obter nome traduzido do status
  const getStatusName = (status: string) => {
    switch (status) {
      case "finished":
        return t.status.finished
      case "inProduction":
        return t.status.inProduction
      case "waitingAuthorization":
        return t.status.waitingAuthorization
      case "processing":
        return t.status.processing
      case "shipped":
        return t.status.shipped
      case "delivered":
        return t.status.delivered
      default:
        return status
    }
  }

  // Obter nome traduzido do status de pagamento
  const getPaymentStatusName = (status: string) => {
    switch (status) {
      case "paid":
        return t.status.paid
      case "partiallyPaid":
        return t.status.partiallyPaid
      case "pending":
        return t.status.pending
      case "notPaid":
        return t.status.notPaid
      default:
        return status
    }
  }

  // Obter variante de badge para o status
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "finished":
        return "success"
      case "inProduction":
        return "default"
      case "waitingAuthorization":
        return "outline"
      case "processing":
        return "default"
      case "shipped":
        return "success"
      case "delivered":
        return "success"
      default:
        return "outline"
    }
  }

  // Obter variante de badge para o status de pagamento
  const getPaymentBadgeVariant = (status: string) => {
    switch (status) {
      case "paid":
        return "success"
      case "partiallyPaid":
        return "default"
      case "pending":
        return "outline"
      case "notPaid":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t.orders}</h1>
        <p className="text-muted-foreground">
          {language === "pt" ? "Acompanhe e gerencie seus pedidos." : "Track and manage your orders."}
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={language === "pt" ? "Buscar por pedido ou exportador..." : "Search by order or exporter..."}
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
            <SelectItem value="all">{language === "pt" ? "Todos os status" : "All statuses"}</SelectItem>
            <SelectItem value="finished">{t.status.finished}</SelectItem>
            <SelectItem value="inProduction">{t.status.inProduction}</SelectItem>
            <SelectItem value="waitingAuthorization">{t.status.waitingAuthorization}</SelectItem>
            <SelectItem value="processing">{t.status.processing}</SelectItem>
            <SelectItem value="shipped">{t.status.shipped}</SelectItem>
            <SelectItem value="delivered">{t.status.delivered}</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterPayment || ""} onValueChange={(value) => setFilterPayment(value || null)}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder={t.paymentStatus} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{language === "pt" ? "Todos os status" : "All statuses"}</SelectItem>
            <SelectItem value="paid">{t.status.paid}</SelectItem>
            <SelectItem value="partiallyPaid">{t.status.partiallyPaid}</SelectItem>
            <SelectItem value="pending">{t.status.pending}</SelectItem>
            <SelectItem value="notPaid">{t.status.notPaid}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t.orders}</CardTitle>
          <CardDescription>{language === "pt" ? "Todos os seus pedidos." : "All your orders."}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{language === "pt" ? "Nº do Pedido" : "Order Number"}</TableHead>
                <TableHead>{language === "pt" ? "Exportador" : "Exporter"}</TableHead>
                <TableHead>{t.date}</TableHead>
                <TableHead>{language === "pt" ? "Valor" : "Value"}</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>{t.paymentStatus}</TableHead>
                <TableHead>{language === "pt" ? "Modalidade de Pagamento" : "Payment Method"}</TableHead>
                <TableHead>{t.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((pedido, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{pedido.id}</TableCell>
                    <TableCell>{pedido.exportador}</TableCell>
                    <TableCell>{pedido.data}</TableCell>
                    <TableCell>${pedido.valor.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(pedido.status)}>{getStatusName(pedido.status)}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getPaymentBadgeVariant(pedido.pagamento)}>
                        {getPaymentStatusName(pedido.pagamento)}
                      </Badge>
                    </TableCell>
                    <TableCell>{pedido.modalidadePagamento || "-"}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          title={language === "pt" ? "Ver documentos" : "View documents"}
                          onClick={() => {
                            // Redirecionar para a aba documentos
                            window.location.href = `/cliente/documentos?pedido=${pedido.id}`
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          title={language === "pt" ? "Rastrear envio" : "Track shipment"}
                          onClick={() =>
                            window.alert(
                              language === "pt"
                                ? `Rastreando envio do pedido ${pedido.id}`
                                : `Tracking shipment for order ${pedido.id}`,
                            )
                          }
                        >
                          <Truck className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          title={language === "pt" ? "Informações de pagamento" : "Payment information"}
                          onClick={() =>
                            window.alert(
                              language === "pt"
                                ? `Visualizando informações de pagamento do pedido ${pedido.id}`
                                : `Viewing payment information for order ${pedido.id}`,
                            )
                          }
                        >
                          <DollarSign className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4">
                    {language === "pt" ? "Nenhum pedido encontrado." : "No orders found."}
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
