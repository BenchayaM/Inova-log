"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Eye, Edit, CheckCircle, AlertCircle, Printer } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { getLanguage, translations } from "@/lib/i18n"
import { QuotePreview } from "@/components/quote-preview"

// Dados de exemplo para orçamentos
const orcamentos = [
  {
    id: "COT-2025-001",
    data: "10/05/2025",
    valor: 12500.0,
    status: "waitingApproval",
    itens: 5,
    alertas: 1,
  },
  {
    id: "COT-2025-002",
    data: "15/05/2025",
    valor: 34500.0,
    status: "inAnalysis",
    itens: 8,
    alertas: 0,
  },
  {
    id: "COT-2025-003",
    data: "18/05/2025",
    valor: 21000.0,
    status: "approved",
    itens: 3,
    alertas: 0,
  },
  {
    id: "COT-2025-004",
    data: "20/05/2025",
    valor: 18000.0,
    status: "readyForOrder",
    itens: 4,
    alertas: 2,
  },
]

export default function ClienteOrcamentosPage() {
  const [language, setLanguage] = useState<"pt" | "en">("pt")
  const [filteredQuotes, setFilteredQuotes] = useState(orcamentos)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string | null>(null)
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false)
  const [selectedQuote, setSelectedQuote] = useState<(typeof orcamentos)[0] | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)

  useEffect(() => {
    setLanguage(getLanguage())
  }, [])

  const t = translations[language]

  // Filtrar orçamentos
  useEffect(() => {
    let filtered = orcamentos

    if (searchTerm) {
      filtered = filtered.filter(
        (orcamento) =>
          orcamento.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          orcamento.data.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (filterStatus && filterStatus !== "all") {
      filtered = filtered.filter((orcamento) => orcamento.status === filterStatus)
    }

    setFilteredQuotes(filtered)
  }, [searchTerm, filterStatus])

  // Obter nome traduzido do status
  const getStatusName = (status: string) => {
    switch (status) {
      case "waitingApproval":
        return t.status.waitingApproval
      case "inAnalysis":
        return t.status.inAnalysis
      case "approved":
        return t.status.approved
      case "readyForOrder":
        return t.status.readyForOrder
      default:
        return status
    }
  }

  // Obter variante de badge para o status
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "waitingApproval":
        return "outline"
      case "inAnalysis":
        return "default"
      case "approved":
        return "success"
      case "readyForOrder":
        return "success"
      default:
        return "outline"
    }
  }

  // Abrir diálogo de aprovação
  const openApprovalDialog = (quote: (typeof orcamentos)[0]) => {
    setSelectedQuote(quote)
    setApprovalDialogOpen(true)
  }

  // Abrir visualização de cotação
  const openQuotePreview = (quote: (typeof orcamentos)[0]) => {
    setSelectedQuote(quote)
    setPreviewOpen(true)
  }

  // Aprovar orçamento
  const approveQuote = () => {
    // Aqui seria implementada a lógica para aprovar o orçamento
    console.log("Approving quote:", selectedQuote)

    // Fechar diálogo
    setApprovalDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t.quotes}</h1>
        <p className="text-muted-foreground">
          {language === "pt" ? "Acompanhe e gerencie seus orçamentos." : "Track and manage your quotes."}
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={language === "pt" ? "Buscar por número..." : "Search by number..."}
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Select value={filterStatus || "all"} onValueChange={(value) => setFilterStatus(value)}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{language === "pt" ? "Todos os status" : "All statuses"}</SelectItem>
            <SelectItem value="waitingApproval">{t.status.waitingApproval}</SelectItem>
            <SelectItem value="inAnalysis">{t.status.inAnalysis}</SelectItem>
            <SelectItem value="approved">{t.status.approved}</SelectItem>
            <SelectItem value="readyForOrder">{t.status.readyForOrder}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t.quotes}</CardTitle>
          <CardDescription>{language === "pt" ? "Todos os seus orçamentos." : "All your quotes."}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{language === "pt" ? "Número" : "Number"}</TableHead>
                <TableHead>{t.date}</TableHead>
                <TableHead>{language === "pt" ? "Valor" : "Value"}</TableHead>
                <TableHead>{language === "pt" ? "Itens" : "Items"}</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>{language === "pt" ? "Alertas" : "Alerts"}</TableHead>
                <TableHead>{t.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQuotes.length > 0 ? (
                filteredQuotes.map((orcamento, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{orcamento.id}</TableCell>
                    <TableCell>{orcamento.data}</TableCell>
                    <TableCell>${orcamento.valor.toFixed(2)}</TableCell>
                    <TableCell>{orcamento.itens}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(orcamento.status)}>{getStatusName(orcamento.status)}</Badge>
                    </TableCell>
                    <TableCell>
                      {orcamento.alertas > 0 ? (
                        <Badge variant="destructive" className="flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {orcamento.alertas}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />0
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => openQuotePreview(orcamento)}>
                          <Eye className="h-4 w-4 mr-1" />
                          {language === "pt" ? "Ver" : "View"}
                        </Button>

                        <Button variant="outline" size="sm" onClick={() => openQuotePreview(orcamento)}>
                          <Printer className="h-4 w-4 mr-1" />
                          {language === "pt" ? "Imprimir" : "Print"}
                        </Button>

                        {orcamento.status === "waitingApproval" && (
                          <Button variant="default" size="sm" onClick={() => openApprovalDialog(orcamento)}>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            {language === "pt" ? "Aprovar" : "Approve"}
                          </Button>
                        )}

                        {orcamento.status === "inAnalysis" && (
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-1" />
                            {language === "pt" ? "Editar" : "Edit"}
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    {language === "pt" ? "Nenhum orçamento encontrado." : "No quotes found."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Diálogo de aprovação */}
      {selectedQuote && (
        <Dialog open={approvalDialogOpen} onOpenChange={setApprovalDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{language === "pt" ? "Aprovar Orçamento" : "Approve Quote"}</DialogTitle>
              <DialogDescription>
                {language === "pt"
                  ? `Número: ${selectedQuote.id} - Valor: $${selectedQuote.valor.toFixed(2)}`
                  : `Number: ${selectedQuote.id} - Value: $${selectedQuote.valor.toFixed(2)}`}
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              <p>
                {language === "pt"
                  ? "Tem certeza que deseja aprovar este orçamento? Após a aprovação, o pedido será processado."
                  : "Are you sure you want to approve this quote? After approval, the order will be processed."}
              </p>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setApprovalDialogOpen(false)}>
                {t.cancel}
              </Button>
              <Button onClick={approveQuote}>{language === "pt" ? "Confirmar Aprovação" : "Confirm Approval"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Visualização da cotação para impressão */}
      {selectedQuote && <QuotePreview open={previewOpen} onClose={() => setPreviewOpen(false)} quote={selectedQuote} />}
    </div>
  )
}
