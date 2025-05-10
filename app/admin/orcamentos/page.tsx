"use client"

import { Label } from "@/components/ui/label"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Eye, Edit, CheckCircle, AlertCircle, FileUp, FileCheck } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { getLanguage, translations } from "@/lib/i18n"
import { DocumentPreview } from "@/components/document-preview"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"

// Atualizar os dados de exemplo para orçamentos removendo nomes de demonstração
const orcamentos = [
  {
    id: "ORC-001",
    cliente: "Cliente 001",
    data: "10/05/2025",
    valor: 12500.0,
    status: "waitingApproval",
    itens: 5,
    alertas: 1,
    proformaGerada: false,
  },
  {
    id: "ORC-002",
    cliente: "Cliente 002",
    data: "15/05/2025",
    valor: 34500.0,
    status: "inAnalysis",
    itens: 8,
    alertas: 0,
    proformaGerada: false,
  },
  {
    id: "ORC-003",
    cliente: "Cliente 003",
    data: "18/05/2025",
    valor: 21000.0,
    status: "approved",
    itens: 3,
    alertas: 0,
    proformaGerada: false,
  },
  {
    id: "ORC-004",
    cliente: "Cliente 004",
    data: "20/05/2025",
    valor: 18000.0,
    status: "approved",
    itens: 4,
    alertas: 2,
    proformaGerada: true,
  },
  {
    id: "ORC-005",
    cliente: "Cliente 005",
    data: "22/05/2025",
    valor: 27500.0,
    status: "waitingApproval",
    itens: 6,
    alertas: 0,
    proformaGerada: false,
  },
  {
    id: "ORC-006",
    cliente: "Cliente 006",
    data: "25/05/2025",
    valor: 15800.0,
    status: "inAnalysis",
    itens: 4,
    alertas: 1,
    proformaGerada: false,
  },
  {
    id: "ORC-007",
    cliente: "Cliente 007",
    data: "28/05/2025",
    valor: 32000.0,
    status: "approved",
    itens: 7,
    alertas: 0,
    proformaGerada: false,
  },
]

// Dados de exemplo para termos de entrega (Incoterms)
const termosEntrega = [
  { id: "fob", nome: "FOB - Free On Board" },
  { id: "cif", nome: "CIF - Cost, Insurance and Freight" },
  { id: "exw", nome: "EXW - Ex Works" },
  { id: "cfr", nome: "CFR - Cost and Freight" },
  { id: "dap", nome: "DAP - Delivered At Place" },
]

export default function AdminOrcamentosPage() {
  const [language, setLanguage] = useState<"pt" | "en">("pt")
  const [filteredQuotes, setFilteredQuotes] = useState(orcamentos)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string | null>(null)
  const [filterClient, setFilterClient] = useState<string | null>(null)
  const [exporterDialogOpen, setExporterDialogOpen] = useState(false)
  const [selectedQuote, setSelectedQuote] = useState<(typeof orcamentos)[0] | null>(null)
  const [selectedExporter, setSelectedExporter] = useState<string>("")
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("")
  const [selectedDeliveryTerm, setSelectedDeliveryTerm] = useState<string>("")
  const [quotesWithProforma, setQuotesWithProforma] = useState<string[]>(
    orcamentos.filter((quote) => quote.proformaGerada).map((quote) => quote.id),
  )
  const [documentPreviewOpen, setDocumentPreviewOpen] = useState(false)
  const [documentOrientation, setDocumentOrientation] = useState<"retrato" | "paisagem">("retrato")
  const [documentReference, setDocumentReference] = useState("")
  const [documentObservations, setDocumentObservations] = useState("")

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
          orcamento.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
          orcamento.id.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (filterStatus) {
      filtered = filtered.filter((orcamento) => orcamento.status === filterStatus)
    }

    if (filterClient) {
      filtered = filtered.filter((orcamento) => orcamento.cliente === filterClient)
    }

    setFilteredQuotes(filtered)
  }, [searchTerm, filterStatus, filterClient])

  // Clientes únicos para o filtro
  const uniqueClients = Array.from(new Set(orcamentos.map((orcamento) => orcamento.cliente)))

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

  // Verificar se a proforma já foi gerada para um orçamento
  const hasProformaGenerated = (quoteId: string) => {
    return quotesWithProforma.includes(quoteId)
  }

  // Abrir diálogo de seleção de exportador
  const openExporterDialog = (quote: (typeof orcamentos)[0]) => {
    setSelectedQuote(quote)
    setSelectedExporter("")
    setSelectedPaymentMethod("")
    setSelectedDeliveryTerm("")
    setDocumentReference(`PI-${new Date().getFullYear()}-${quote.id.split("-")[1]}`)
    setDocumentObservations("")
    setExporterDialogOpen(true)
  }

  // Gerar proforma invoice
  const generateProformaInvoice = () => {
    if (!selectedQuote) return

    // Aqui seria implementada a lógica para gerar a proforma invoice
    console.log("Generating proforma invoice for quote:", selectedQuote)
    console.log("Selected exporter:", selectedExporter)
    console.log("Selected payment method:", selectedPaymentMethod)
    console.log("Selected delivery term:", selectedDeliveryTerm)
    console.log("Document orientation:", documentOrientation)
    console.log("Document reference:", documentReference)
    console.log("Document observations:", documentObservations)

    // Marcar o orçamento como tendo proforma gerada
    setQuotesWithProforma((prev) => [...prev, selectedQuote.id])

    // Fechar diálogo de exportador e abrir preview do documento
    setExporterDialogOpen(false)
    setDocumentPreviewOpen(true)
  }

  // Dados de exemplo para exportadores
  const exportadores = [
    {
      id: "EXP-001",
      nome: "Baoxinsheng Industrial",
      dadosBancarios: {
        banco: "Bank of China",
        agencia: "0001",
        conta: "12345678",
        swift: "BKCHCNBJ",
        beneficiario: "Baoxinsheng Industrial Co., Ltd.",
      },
    },
    {
      id: "EXP-002",
      nome: "Oriental Industrial",
      dadosBancarios: {
        banco: "Industrial and Commercial Bank of China",
        agencia: "2345",
        conta: "87654321",
        swift: "ICBKCNBJ",
        beneficiario: "Oriental Industrial Co., Ltd.",
      },
    },
  ]

  // Obter dados do exportador selecionado
  const getSelectedExporter = () => {
    return exportadores.find((exp) => exp.id === selectedExporter) || null
  }

  // Dados de exemplo para o documento
  const documentData = {
    createdAt: new Date().toISOString(),
    cliente: selectedQuote?.cliente,
    paymentMethod: selectedPaymentMethod,
    items: [
      {
        id: 1,
        descricao: "Vidro Temperado 10mm",
        ncm: "7005.29.00",
        quantidade: 200,
        peso: 12.5,
        preco: 45.0,
      },
      {
        id: 2,
        descricao: "Vidro Laminado 8mm",
        ncm: "7005.29.00",
        quantidade: 150,
        peso: 12.0,
        preco: 38.0,
      },
      {
        id: 3,
        descricao: "Ferragens para Instalação",
        ncm: "8302.41.00",
        quantidade: 350,
        peso: 2.0,
        preco: 12.0,
      },
    ],
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t.quotes}</h1>
        <p className="text-muted-foreground">
          {language === "pt" ? "Gerencie todos os orçamentos dos clientes." : "Manage all customer quotes."}
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={language === "pt" ? "Buscar por ID ou cliente..." : "Search by ID or client..."}
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
            <SelectItem value="waitingApproval">{t.status.waitingApproval}</SelectItem>
            <SelectItem value="inAnalysis">{t.status.inAnalysis}</SelectItem>
            <SelectItem value="approved">{t.status.approved}</SelectItem>
            <SelectItem value="readyForOrder">{t.status.readyForOrder}</SelectItem>
          </SelectContent>
        </Select>

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
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t.quotes}</CardTitle>
          <CardDescription>
            {language === "pt" ? "Todos os orçamentos dos clientes." : "All customer quotes."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>{language === "pt" ? "Cliente" : "Client"}</TableHead>
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
                    <TableCell>{orcamento.id}</TableCell>
                    <TableCell className="font-medium">{orcamento.cliente}</TableCell>
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
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          {language === "pt" ? "Ver" : "View"}
                        </Button>

                        {orcamento.status === "waitingApproval" && (
                          <Button variant="default" size="sm">
                            <Edit className="h-4 w-4 mr-1" />
                            {language === "pt" ? "Analisar" : "Analyze"}
                          </Button>
                        )}

                        {orcamento.status === "approved" &&
                          (hasProformaGenerated(orcamento.id) ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedQuote(orcamento)
                                setDocumentPreviewOpen(true)
                              }}
                            >
                              <FileCheck className="h-4 w-4 mr-1" />
                              {language === "pt" ? "Ver Proforma" : "View Proforma"}
                            </Button>
                          ) : (
                            <Button variant="default" size="sm" onClick={() => openExporterDialog(orcamento)}>
                              <FileUp className="h-4 w-4 mr-1" />
                              {language === "pt" ? "Gerar Proforma" : "Generate Proforma"}
                            </Button>
                          ))}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4">
                    {language === "pt" ? "Nenhum orçamento encontrado." : "No quotes found."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Diálogo de seleção de exportador */}
      {selectedQuote && (
        <Dialog open={exporterDialogOpen} onOpenChange={setExporterDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {language === "pt" ? "Configurar Proforma Invoice" : "Configure Proforma Invoice"}
              </DialogTitle>
              <DialogDescription>
                {language === "pt" ? `Orçamento para ${selectedQuote.cliente}` : `Quote for ${selectedQuote.cliente}`}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div>
                <Label>{t.selectExporter}</Label>
                <Select value={selectedExporter} onValueChange={setSelectedExporter}>
                  <SelectTrigger>
                    <SelectValue placeholder={language === "pt" ? "Selecione um exportador" : "Select an exporter"} />
                  </SelectTrigger>
                  <SelectContent>
                    {exportadores.map((exportador) => (
                      <SelectItem key={exportador.id} value={exportador.id}>
                        {exportador.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Modalidade de Pagamento */}
              <div>
                <Label>{language === "pt" ? "Modalidade de Pagamento" : "Payment Method"}</Label>
                <Select value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue placeholder={language === "pt" ? "Selecione a modalidade" : "Select payment method"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="carta-credito">
                      {language === "pt" ? "Carta de Crédito" : "Letter of Credit"}
                    </SelectItem>
                    <SelectItem value="transferencia">
                      {language === "pt" ? "Transferência Bancária" : "Wire Transfer"}
                    </SelectItem>
                    <SelectItem value="antecipado">
                      {language === "pt" ? "Pagamento Antecipado" : "Advance Payment"}
                    </SelectItem>
                    <SelectItem value="parcelado">
                      {language === "pt" ? "Pagamento Parcelado" : "Installment Payment"}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Termos de Entrega (Incoterms) */}
              <div>
                <Label>{language === "pt" ? "Termos de Entrega" : "Delivery Terms"}</Label>
                <Select value={selectedDeliveryTerm} onValueChange={setSelectedDeliveryTerm}>
                  <SelectTrigger>
                    <SelectValue placeholder={language === "pt" ? "Selecione o termo" : "Select delivery term"} />
                  </SelectTrigger>
                  <SelectContent>
                    {termosEntrega.map((termo) => (
                      <SelectItem key={termo.id} value={termo.id}>
                        {termo.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Referência do documento */}
              <div>
                <Label>{language === "pt" ? "Referência do Documento" : "Document Reference"}</Label>
                <Input
                  value={documentReference}
                  onChange={(e) => setDocumentReference(e.target.value)}
                  placeholder="PI-2025-001"
                />
              </div>

              {/* Observações */}
              <div>
                <Label>{language === "pt" ? "Observações" : "Notes"}</Label>
                <Textarea
                  value={documentObservations}
                  onChange={(e) => setDocumentObservations(e.target.value)}
                  placeholder={
                    language === "pt"
                      ? "Informações complementares para a proforma..."
                      : "Complementary information for the proforma..."
                  }
                  rows={3}
                />
              </div>

              {/* Orientação do documento */}
              <div>
                <Label>{language === "pt" ? "Orientação do Documento" : "Document Orientation"}</Label>
                <RadioGroup
                  value={documentOrientation}
                  onValueChange={(value) => setDocumentOrientation(value as "retrato" | "paisagem")}
                  className="flex space-x-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="retrato" id="retrato-option" />
                    <label htmlFor="retrato-option">{language === "pt" ? "Retrato" : "Portrait"}</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="paisagem" id="paisagem-option" />
                    <label htmlFor="paisagem-option">{language === "pt" ? "Paisagem" : "Landscape"}</label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setExporterDialogOpen(false)}>
                {t.cancel}
              </Button>
              <Button
                onClick={generateProformaInvoice}
                disabled={!selectedExporter || !selectedPaymentMethod || !selectedDeliveryTerm || !documentReference}
              >
                {t.generateProforma}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Preview do documento */}
      {selectedQuote && (
        <DocumentPreview
          open={documentPreviewOpen}
          onClose={() => setDocumentPreviewOpen(false)}
          documentType="proformaInvoice"
          documentData={documentData}
          referencia={documentReference}
          orientacao={documentOrientation}
          incoterm={selectedDeliveryTerm}
          observacoes={documentObservations}
          exportador={getSelectedExporter()}
        />
      )}
    </div>
  )
}
