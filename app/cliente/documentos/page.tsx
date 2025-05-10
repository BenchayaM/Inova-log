"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Eye, Search, File, FileTextIcon } from "lucide-react"
import { getLanguage, translations } from "@/lib/i18n"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DocumentPreview } from "@/components/document-preview"
import { useToast } from "@/components/ui/use-toast"

// Dados de exemplo para pedidos do cliente logado
const pedidos = [
  {
    id: "PED-2025-001",
    data: "05/05/2025",
    valor: 12500.0,
    status: "finished",
    documentos: [
      { tipo: "proformaInvoice", data: "05/05/2025", status: "approved" },
      { tipo: "commercialInvoice", data: "07/05/2025", status: "approved" },
      { tipo: "packingList", data: "07/05/2025", status: "approved" },
      { tipo: "billOfLading", data: "12/05/2025", status: "pending" },
    ],
  },
  {
    id: "PED-2025-002",
    data: "10/05/2025",
    valor: 18700.0,
    status: "inProduction",
    documentos: [
      { tipo: "proformaInvoice", data: "10/05/2025", status: "approved" },
      { tipo: "commercialInvoice", data: "12/05/2025", status: "pending" },
    ],
  },
]

// Dados de exemplo para documentos
const documentos = [
  {
    id: "DOC-2025-001",
    tipo: "proformaInvoice",
    pedidoId: "PED-2025-001",
    data: "05/05/2025",
    numero: "PI-2025-001",
    status: "approved",
  },
  {
    id: "DOC-2025-002",
    tipo: "commercialInvoice",
    pedidoId: "PED-2025-001",
    data: "07/05/2025",
    numero: "CI-2025-001",
    status: "approved",
  },
  {
    id: "DOC-2025-003",
    tipo: "packingList",
    pedidoId: "PED-2025-001",
    data: "07/05/2025",
    numero: "PL-2025-001",
    status: "approved",
  },
  {
    id: "DOC-2025-004",
    tipo: "billOfLading",
    pedidoId: "PED-2025-001",
    data: "12/05/2025",
    numero: "BL-2025-001",
    status: "pending",
  },
  {
    id: "DOC-2025-005",
    tipo: "proformaInvoice",
    pedidoId: "PED-2025-002",
    data: "10/05/2025",
    numero: "PI-2025-002",
    status: "approved",
  },
]

// Adicionar dados de exemplo para orçamentos aprovados
const orcamentosAprovados = [
  {
    id: "ORC-2025-001",
    pedidoId: "PED-2025-001",
    data: "03/05/2025",
    numero: "ORC-2025-001",
    status: "approved",
    valor: 12500.0,
  },
  {
    id: "ORC-2025-002",
    pedidoId: "PED-2025-002",
    data: "08/05/2025",
    numero: "ORC-2025-002",
    status: "approved",
    valor: 18700.0,
  },
]

export default function DocumentosPage() {
  const [language, setLanguage] = useState<"pt" | "en">("pt")
  const [filteredOrders, setFilteredOrders] = useState(pedidos)
  const [filteredDocuments, setFilteredDocuments] = useState(documentos)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("orders")
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewDocumentType, setPreviewDocumentType] = useState("")
  const [previewDocumentData, setPreviewDocumentData] = useState<any>(null)

  const { toast } = useToast()

  useEffect(() => {
    setLanguage(getLanguage())
  }, [])

  const t = translations[language]

  // Filtrar pedidos
  useEffect(() => {
    let filtered = pedidos

    if (searchTerm) {
      filtered = filtered.filter((pedido) => pedido.id.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    setFilteredOrders(filtered)
  }, [searchTerm])

  // Filtrar documentos
  useEffect(() => {
    let filtered = documentos

    if (searchTerm) {
      filtered = filtered.filter(
        (doc) =>
          doc.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doc.pedidoId.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (filterType) {
      filtered = filtered.filter((doc) => doc.tipo === filterType)
    }

    setFilteredDocuments(filtered)

    // Extrair o parâmetro pedido da URL
    const urlParams = new URLSearchParams(window.location.search)
    const pedidoId = urlParams.get("pedido")

    if (pedidoId) {
      setSearchTerm(pedidoId)
      setActiveTab("orders")
    }
  }, [searchTerm, filterType])

  // Obter nome traduzido do tipo de documento
  const getDocumentTypeName = (tipo: string) => {
    switch (tipo) {
      case "proformaInvoice":
        return t.proformaInvoice
      case "commercialInvoice":
        return t.commercialInvoice
      case "packingList":
        return t.packingList
      case "billOfLading":
        return t.billOfLading
      case "certificateOfOrigin":
        return t.certificateOfOrigin
      case "insurancePolicy":
        return t.insurancePolicy
      case "customsDeclaration":
        return t.customsDeclaration
      case "approvedQuote":
        return language === "pt" ? "Orçamento Aprovado" : "Approved Quote"
      default:
        return t.otherDocuments
    }
  }

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
      case "finished":
        return t.status.finished
      case "inProduction":
        return t.status.inProduction
      case "waitingAuthorization":
        return t.status.waitingAuthorization
      case "pending":
        return t.status.pending
      default:
        return status
    }
  }

  // Abrir preview do documento
  const openDocumentPreview = (tipo: string, pedidoId: string) => {
    setPreviewDocumentType(tipo)
    setPreviewDocumentData({
      pedidoId: pedidoId,
      createdAt: new Date().toISOString(),
      documentUrl: `/api/documents/${tipo}/${pedidoId}`,
    })
    setPreviewOpen(true)
  }

  // Baixar documento
  const downloadDocument = (tipo: string, pedidoId: string) => {
    toast({
      title: language === "pt" ? "Download iniciado" : "Download started",
      description:
        language === "pt"
          ? `O download do documento ${getDocumentTypeName(tipo)} foi iniciado.`
          : `The download of the ${getDocumentTypeName(tipo)} document has started.`,
    })
  }

  // Adicionar orçamentos aprovados à lista de documentos
  useEffect(() => {
    // Converter orçamentos aprovados para o formato de documentos
    const orcamentosComoDocumentos = orcamentosAprovados.map((orc) => ({
      id: orc.id,
      tipo: "approvedQuote",
      pedidoId: orc.pedidoId,
      data: orc.data,
      numero: orc.numero,
      status: orc.status,
    }))

    // Combinar com os documentos existentes
    const todosDocumentos = [...documentos, ...orcamentosComoDocumentos]
    setFilteredDocuments(todosDocumentos)
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t.documents}</h1>
        <p className="text-muted-foreground">
          {language === "pt"
            ? "Visualize e gerencie todos os documentos relacionados aos seus pedidos."
            : "View and manage all documents related to your orders."}
        </p>
      </div>

      <Tabs defaultValue="orders" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="orders">{language === "pt" ? "Pedidos" : "Orders"}</TabsTrigger>
          <TabsTrigger value="documents">{t.documents}</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={language === "pt" ? "Buscar por pedido..." : "Search by order..."}
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{language === "pt" ? "Pedidos" : "Orders"}</CardTitle>
              <CardDescription>
                {language === "pt"
                  ? "Todos os pedidos e seus documentos relacionados."
                  : "All orders and their related documents."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredOrders.map((pedido, index) => (
                <div key={index} className="mb-6 border rounded-lg p-4">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                    <div>
                      <h3 className="text-lg font-bold">{pedido.id}</h3>
                      <p className="text-sm text-muted-foreground">
                        {pedido.data} - ${pedido.valor.toFixed(2)}
                      </p>
                    </div>
                    <Badge className="mt-2 md:mt-0">{getStatusName(pedido.status)}</Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {/* Orçamento Aprovado */}
                    <Card className="bg-muted/50">
                      <CardHeader className="p-3">
                        <CardTitle className="text-sm flex items-center">
                          <FileTextIcon className="h-4 w-4 mr-2" />
                          {language === "pt" ? "Orçamento Aprovado" : "Approved Quote"}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-3 pt-0">
                        {orcamentosAprovados.find((orc) => orc.pedidoId === pedido.id) ? (
                          <div className="space-y-2">
                            <p className="text-xs">
                              {orcamentosAprovados.find((orc) => orc.pedidoId === pedido.id)?.data} - $
                              {orcamentosAprovados.find((orc) => orc.pedidoId === pedido.id)?.valor.toFixed(2)}
                            </p>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full"
                                onClick={() => {
                                  window.location.href = `/cliente/orcamentos?id=${
                                    orcamentosAprovados.find((orc) => orc.pedidoId === pedido.id)?.id
                                  }`
                                }}
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                {t.preview}
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <p className="text-xs text-muted-foreground">
                              {language === "pt" ? "Orçamento não encontrado" : "Quote not found"}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Proforma Invoice */}
                    <Card className="bg-muted/50">
                      <CardHeader className="p-3">
                        <CardTitle className="text-sm flex items-center">
                          <FileTextIcon className="h-4 w-4 mr-2" />
                          {t.proformaInvoice}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-3 pt-0">
                        {pedido.documentos.find((doc) => doc.tipo === "proformaInvoice") ? (
                          <div className="space-y-2">
                            <p className="text-xs">
                              {pedido.documentos.find((doc) => doc.tipo === "proformaInvoice")?.data}
                            </p>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full"
                                onClick={() => openDocumentPreview("proformaInvoice", pedido.id)}
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                {t.preview}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full"
                                onClick={() => downloadDocument("proformaInvoice", pedido.id)}
                              >
                                <Download className="h-3 w-3 mr-1" />
                                {t.download}
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <p className="text-xs text-muted-foreground">
                              {language === "pt" ? "Documento não gerado" : "Document not generated"}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Commercial Invoice */}
                    <Card className="bg-muted/50">
                      <CardHeader className="p-3">
                        <CardTitle className="text-sm flex items-center">
                          <FileTextIcon className="h-4 w-4 mr-2" />
                          {t.commercialInvoice}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-3 pt-0">
                        {pedido.documentos.find((doc) => doc.tipo === "commercialInvoice") ? (
                          <div className="space-y-2">
                            <p className="text-xs">
                              {pedido.documentos.find((doc) => doc.tipo === "commercialInvoice")?.data}
                            </p>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full"
                                onClick={() => openDocumentPreview("commercialInvoice", pedido.id)}
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                {t.preview}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full"
                                onClick={() => downloadDocument("commercialInvoice", pedido.id)}
                              >
                                <Download className="h-3 w-3 mr-1" />
                                {t.download}
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <p className="text-xs text-muted-foreground">
                              {language === "pt" ? "Documento não gerado" : "Document not generated"}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Packing List */}
                    <Card className="bg-muted/50">
                      <CardHeader className="p-3">
                        <CardTitle className="text-sm flex items-center">
                          <File className="h-4 w-4 mr-2" />
                          {t.packingList}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-3 pt-0">
                        {pedido.documentos.find((doc) => doc.tipo === "packingList") ? (
                          <div className="space-y-2">
                            <p className="text-xs">
                              {pedido.documentos.find((doc) => doc.tipo === "packingList")?.data}
                            </p>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full"
                                onClick={() => openDocumentPreview("packingList", pedido.id)}
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                {t.preview}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full"
                                onClick={() => downloadDocument("packingList", pedido.id)}
                              >
                                <Download className="h-3 w-3 mr-1" />
                                {t.download}
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <p className="text-xs text-muted-foreground">
                              {language === "pt" ? "Documento não gerado" : "Document not generated"}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Bill of Lading */}
                    <Card className="bg-muted/50">
                      <CardHeader className="p-3">
                        <CardTitle className="text-sm flex items-center">
                          <File className="h-4 w-4 mr-2" />
                          {t.billOfLading}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-3 pt-0">
                        {pedido.documentos.find((doc) => doc.tipo === "billOfLading") ? (
                          <div className="space-y-2">
                            <p className="text-xs">
                              {pedido.documentos.find((doc) => doc.tipo === "billOfLading")?.data}
                            </p>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full"
                                onClick={() => openDocumentPreview("billOfLading", pedido.id)}
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                {t.preview}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full"
                                onClick={() => downloadDocument("billOfLading", pedido.id)}
                              >
                                <Download className="h-3 w-3 mr-1" />
                                {t.download}
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <p className="text-xs text-muted-foreground">
                              {language === "pt" ? "Documento não gerado" : "Document not generated"}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}

              {filteredOrders.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    {language === "pt" ? "Nenhum pedido encontrado." : "No orders found."}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4 mt-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={language === "pt" ? "Buscar por número ou pedido..." : "Search by number or order..."}
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select value={filterType || ""} onValueChange={(value) => setFilterType(value || null)}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder={t.documentType} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{language === "pt" ? "Todos os tipos" : "All types"}</SelectItem>
                <SelectItem value="proformaInvoice">{t.proformaInvoice}</SelectItem>
                <SelectItem value="commercialInvoice">{t.commercialInvoice}</SelectItem>
                <SelectItem value="packingList">{t.packingList}</SelectItem>
                <SelectItem value="billOfLading">{t.billOfLading}</SelectItem>
                <SelectItem value="certificateOfOrigin">{t.certificateOfOrigin}</SelectItem>
                <SelectItem value="approvedQuote">
                  {language === "pt" ? "Orçamento Aprovado" : "Approved Quote"}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t.documents}</CardTitle>
              <CardDescription>
                {language === "pt"
                  ? "Todos os documentos relacionados aos seus pedidos."
                  : "All documents related to your orders."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t.documentType}</TableHead>
                    <TableHead>{t.documentNumber}</TableHead>
                    <TableHead>{language === "pt" ? "Pedido" : "Order"}</TableHead>
                    <TableHead>{t.documentDate}</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>{t.actions}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.length > 0 ? (
                    filteredDocuments.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell className="font-medium">{getDocumentTypeName(doc.tipo)}</TableCell>
                        <TableCell>{doc.numero}</TableCell>
                        <TableCell>{doc.pedidoId}</TableCell>
                        <TableCell>{doc.data}</TableCell>
                        <TableCell>
                          <Badge variant={doc.status === "approved" ? "success" : "outline"}>
                            {doc.status === "approved"
                              ? language === "pt"
                                ? "Aprovado"
                                : "Approved"
                              : language === "pt"
                                ? "Pendente"
                                : "Pending"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openDocumentPreview(doc.tipo, doc.pedidoId)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              {t.preview}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => downloadDocument(doc.tipo, doc.pedidoId)}
                            >
                              <Download className="h-4 w-4 mr-1" />
                              {t.download}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        {language === "pt" ? "Nenhum documento encontrado." : "No documents found."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Componente de preview do documento */}
      <DocumentPreview
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        documentType={previewDocumentType}
        documentData={previewDocumentData}
      />
    </div>
  )
}
