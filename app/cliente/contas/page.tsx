"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DollarSign, Search, Eye, CreditCard } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { getLanguage, translations } from "@/lib/i18n"

// Atualizar os dados de exemplo para contas com as formas de pagamento configuradas
const contas = [
  {
    exportador: "Baoxinsheng Industrial",
    valorTotal: 12500.0,
    valorPago: 12500.0,
    dataVencimento: "15/05/2025",
    dataPagamento: "10/05/2025",
    status: "paid",
    metodoPagamento: "carta-credito",
  },
  {
    exportador: "Oriental Industrial",
    valorTotal: 18700.0,
    valorPago: 15000.0,
    valorDiferenca: 3700.0,
    dataVencimento: "20/05/2025",
    dataPagamento: "12/05/2025",
    status: "partiallyPaid",
    metodoPagamento: "transferencia",
  },
  {
    exportador: "Baoxinsheng Industrial",
    valorTotal: 45000.0,
    valorPago: 0.0,
    dataVencimento: "25/05/2025",
    dataPagamento: null,
    status: "pending",
    metodoPagamento: null,
  },
]

export default function ClienteContasPage() {
  const [language, setLanguage] = useState<"pt" | "en">("pt")
  const [filteredAccounts, setFilteredAccounts] = useState(contas)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string | null>(null)
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState<(typeof contas)[0] | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<string>("transfer")
  const [paymentNotes, setPaymentNotes] = useState<string>("")

  useEffect(() => {
    setLanguage(getLanguage())
  }, [])

  const t = translations[language]

  // Filtrar contas
  useEffect(() => {
    let filtered = contas

    if (searchTerm) {
      filtered = filtered.filter((conta) => conta.exportador.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    if (filterStatus) {
      filtered = filtered.filter((conta) => conta.status === filterStatus)
    }

    setFilteredAccounts(filtered)
  }, [searchTerm, filterStatus])

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

  // Abrir diálogo de pagamento
  const openPaymentDialog = (account: (typeof contas)[0]) => {
    setSelectedAccount(account)
    setPaymentMethod("transfer")
    setPaymentNotes("")
    setPaymentDialogOpen(true)
  }

  // Processar pagamento
  const processPayment = () => {
    // Aqui seria implementada a lógica para processar o pagamento
    console.log("Processing payment for account:", selectedAccount)
    console.log("Payment method:", paymentMethod)
    console.log("Payment notes:", paymentNotes)

    // Fechar diálogo
    setPaymentDialogOpen(false)
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
          {language === "pt" ? "Acompanhe suas contas e pagamentos." : "Track your accounts and payments."}
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
            placeholder={language === "pt" ? "Buscar por pedido ou exportador..." : "Search by order or exporter..."}
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

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
          <CardTitle>{language === "pt" ? "Minhas Contas" : "My Accounts"}</CardTitle>
          <CardDescription>
            {language === "pt"
              ? "Todas as contas e pagamentos relacionados aos seus pedidos."
              : "All accounts and payments related to your orders."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
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
                    <TableCell className="font-medium">{conta.exportador}</TableCell>
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
                          {language === "pt" ? "Detalhes" : "Details"}
                        </Button>
                        {(conta.status === "pending" || conta.status === "partiallyPaid") && (
                          <Button variant="default" size="sm" onClick={() => openPaymentDialog(conta)}>
                            <CreditCard className="h-4 w-4 mr-1" />
                            {language === "pt" ? "Pagar" : "Pay"}
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    {language === "pt" ? "Nenhuma conta encontrada." : "No accounts found."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Diálogo de pagamento */}
      {selectedAccount && (
        <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{language === "pt" ? "Realizar Pagamento" : "Make Payment"}</DialogTitle>
              <DialogDescription>
                {language === "pt"
                  ? `Pedido ${selectedAccount.pedidoId} - ${selectedAccount.exportador}`
                  : `Order ${selectedAccount.pedidoId} - ${selectedAccount.exportador}`}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>{t.totalValue}</Label>
                  <p className="font-medium">${selectedAccount.valorTotal.toFixed(2)}</p>
                </div>
                <div>
                  <Label>{t.amountPaid}</Label>
                  <p className="font-medium">${selectedAccount.valorPago.toFixed(2)}</p>
                </div>
              </div>

              <div>
                <Label>{t.amountDue}</Label>
                <p className="font-medium text-red-600">
                  ${(selectedAccount.valorTotal - selectedAccount.valorPago).toFixed(2)}
                </p>
              </div>

              <div className="space-y-2">
                <Label>{t.paymentOptions}</Label>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="carta-credito" id="carta-credito" />
                    <Label htmlFor="carta-credito">{language === "pt" ? "Carta de Crédito" : "Letter of Credit"}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="transferencia" id="transferencia" />
                    <Label htmlFor="transferencia">
                      {language === "pt" ? "Transferência Bancária" : "Wire Transfer"}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="antecipado" id="antecipado" />
                    <Label htmlFor="antecipado">{language === "pt" ? "Pagamento Antecipado" : "Advance Payment"}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="parcelado" id="parcelado" />
                    <Label htmlFor="parcelado">
                      {language === "pt" ? "Pagamento Parcelado" : "Installment Payment"}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="service" id="service" />
                    <Label htmlFor="service">{t.service}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="returnProduct" id="returnProduct" />
                    <Label htmlFor="returnProduct">{t.returnProduct}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other">{t.other}</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">{t.notes}</Label>
                <Textarea
                  id="notes"
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  placeholder={
                    language === "pt"
                      ? "Adicione informações sobre o pagamento..."
                      : "Add information about the payment..."
                  }
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setPaymentDialogOpen(false)}>
                {t.cancel}
              </Button>
              <Button onClick={processPayment}>{language === "pt" ? "Confirmar Pagamento" : "Confirm Payment"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
