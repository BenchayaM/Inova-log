"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Eye, Search, FileUp, FileTextIcon, File, Upload } from "lucide-react"
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
import { getLanguage, translations } from "@/lib/i18n"
import { DocumentPreview } from "@/components/document-preview"
import { DocumentEditor } from "@/components/document-editor"
import { useToast } from "@/components/ui/use-toast"

// Dados de exemplo para pedidos
const pedidos = [
  {
    id: "PED-2025-001",
    cliente: "AMAZON TEMPER MANAUS",
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
    cliente: "AMAZON TEMPER FORTALEZA",
    data: "10/05/2025",
    valor: 18700.0,
    status: "inProduction",
    documentos: [
      { tipo: "proformaInvoice", data: "10/05/2025", status: "approved" },
      { tipo: "commercialInvoice", data: "12/05/2025", status: "pending" },
    ],
  },
  {
    id: "PED-2025-003",
    cliente: "VITRAL MANAUS",
    data: "15/05/2025",
    valor: 45000.0,
    status: "waitingAuthorization",
    documentos: [{ tipo: "proformaInvoice", data: "15/05/2025", status: "pending" }],
  },
]

// Adicionar dados de exemplo para orçamentos aprovados após a declaração da constante 'pedidos'
const orcamentosAprovados = [
  {
    id: "ORC-2025-001",
    pedidoId: "PED-2025-001",
    cliente: "AMAZON TEMPER MANAUS",
    data: "03/05/2025",
    numero: "ORC-2025-001",
    status: "approved",
    valor: 12500.0,
  },
  {
    id: "ORC-2025-002",
    pedidoId: "PED-2025-002",
    cliente: "AMAZON TEMPER FORTALEZA",
    data: "08/05/2025",
    numero: "ORC-2025-002",
    status: "approved",
    valor: 18700.0,
  },
  {
    id: "ORC-2025-003",
    pedidoId: "PED-2025-003",
    cliente: "VITRAL MANAUS",
    data: "13/05/2025",
    numero: "ORC-2025-003",
    status: "approved",
    valor: 45000.0,
  },
]

export default function AdminDocumentosPage() {
  const [language, setLanguage] = useState<"pt" | "en">("pt")
  const [filteredOrders, setFilteredOrders] = useState(pedidos)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string | null>(null)
  const [filterClient, setFilterClient] = useState<string | null>(null)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [documentType, setDocumentType] = useState("")
  const [orderId, setOrderId] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewDocumentType, setPreviewDocumentType] = useState("")
  const [previewDocumentData, setPreviewDocumentData] = useState<any>(null)
  const [currentUploadOrderId, setCurrentUploadOrderId] = useState("")
  const [currentUploadDocType, setCurrentUploadDocType] = useState("")
  const [editorOpen, setEditorOpen] = useState(false)
  const [editorDocumentType, setEditorDocumentType] = useState("")
  const [editorPedidoId, setEditorPedidoId] = useState("")
  const [editorCliente, setEditorCliente] = useState("")
  const [editorInitialData, setEditorInitialData] = useState<any>(null)

  const { toast } = useToast()

  useEffect(() => {
    setLanguage(getLanguage())
  }, [])

  const t = translations[language]

  // Filtrar pedidos
  useEffect(() => {
    let filtered = pedidos

    if (searchTerm) {
      filtered = filtered.filter(
        (pedido) =>
          pedido.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pedido.id.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (filterStatus) {
      filtered = filtered.filter((pedido) => pedido.status === filterStatus)
    }

    if (filterClient) {
      filtered = filtered.filter((pedido) => pedido.cliente === filterClient)
    }

    setFilteredOrders(filtered)
  }, [searchTerm, filterStatus, filterClient])

  // Adicionar useEffect para incluir orçamentos aprovados na lista de documentos
  useEffect(() => {
    // Extrair o parâmetro pedido da URL
    const urlParams = new URLSearchParams(window.location.search)
    const pedidoId = urlParams.get("pedido")

    if (pedidoId) {
      setSearchTerm(pedidoId)
    }
  }, [])

  // Clientes únicos para o filtro
  const uniqueClients = Array.from(new Set(pedidos.map((pedido) => pedido.cliente)))

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

  // Abrir diálogo de upload para um documento específico
  const openUploadDialog = (orderId: string, docType: string) => {
    setCurrentUploadOrderId(orderId)
    setCurrentUploadDocType(docType)
    setOrderId(orderId)
    setDocumentType(docType)
    setUploadDialogOpen(true)
  }

  // Manipular upload de arquivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleUpload = () => {
    // Aqui seria implementada a lógica para fazer upload do documento
    console.log("Uploading file:", selectedFile)
    console.log("Document type:", documentType)
    console.log("Order ID:", orderId)

    toast({
      title: language === "pt" ? "Documento enviado" : "Document uploaded",
      description:
        language === "pt"
          ? `O documento ${getDocumentTypeName(documentType)} foi enviado com sucesso para o pedido ${orderId}`
          : `The ${getDocumentTypeName(documentType)} document was successfully uploaded for order ${orderId}`,
    })

    // Resetar e fechar o diálogo
    setSelectedFile(null)
    setDocumentType("")
    setOrderId("")
    setUploadDialogOpen(false)
  }

  // Gerar documento
  const generateDocument = async (pedidoId: string, tipoDocumento: string) => {
    // Para Commercial Invoice e Packing List, abrir o editor em vez de gerar diretamente
    if (tipoDocumento === "commercialInvoice" || tipoDocumento === "packingList") {
      const pedido = pedidos.find((p) => p.id === pedidoId)
      if (pedido) {
        // Encontrar o orçamento aprovado relacionado ao pedido
        const orcamento = orcamentosAprovados.find((orc) => orc.pedidoId === pedidoId)

        setEditorDocumentType(tipoDocumento)
        setEditorPedidoId(pedidoId)
        setEditorCliente(pedido.cliente)

        // Dados iniciais mais completos para o editor
        setEditorInitialData({
          pedidoId,
          cliente: pedido.cliente,
          data: new Date().toISOString(),
          items: [
            {
              id: 1,
              descricao: "Vidro Temperado 10mm",
              ncm: "7005.29.00",
              quantidade: 200,
              pesoLiquido: 2300,
              pesoBruto: 2500,
              preco: 45,
            },
            {
              id: 2,
              descricao: "Vidro Laminado 8mm",
              ncm: "7005.29.00",
              quantidade: 150,
              pesoLiquido: 1650,
              pesoBruto: 1800,
              preco: 38,
            },
            {
              id: 3,
              descricao: "Ferragens para Instalação",
              ncm: "8302.41.00",
              quantidade: 350,
              pesoLiquido: 650,
              pesoBruto: 700,
              preco: 12,
            },
          ],
          observacoes: "",
          incoterm: "fob",
          paymentMethod: "carta-credito",
          referencia: `${tipoDocumento === "commercialInvoice" ? "CI" : "PL"}-${pedidoId.replace("PED-", "")}`,
          exportador: {
            nome: "Baoxinsheng Industrial Co., Ltd.",
            endereco: "123 Industrial Avenue",
            cidade: "Shenzhen",
            estado: "Guangdong",
            pais: "China",
            telefone: "+86 755 1234 5678",
            email: "contact@baoxinsheng.com",
            contato: "Li Wei",
          },
          importador: {
            nome: pedido.cliente,
            endereco: "Av. Torquato Tapajós, 5555",
            cidade: "Manaus",
            estado: "AM",
            pais: "Brasil",
            telefone: "+55 92 3123 4567",
            email: `contato@${pedido.cliente.toLowerCase().replace(/\s+/g, "")}.com.br`,
            contato: "João Silva",
          },
        })
        setEditorOpen(true)
        return
      }
    }

    try {
      setIsGenerating(true)

      // Simulação de chamada à API para gerar o documento
      const response = await fetch("/api/generate-document", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          documentType: tipoDocumento,
          orderId: pedidoId,
          data: {
            // Dados específicos para o documento
            // Em um ambiente real, você enviaria os dados necessários para gerar o documento
          },
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: language === "pt" ? "Documento gerado" : "Document generated",
          description: result.message,
        })

        // Abrir preview do documento
        setPreviewDocumentType(tipoDocumento)
        setPreviewDocumentData(result.document)
        setPreviewOpen(true)
      } else {
        toast({
          variant: "destructive",
          title: language === "pt" ? "Erro" : "Error",
          description: result.message,
        })
      }
    } catch (error) {
      console.error("Erro ao gerar documento:", error)
      toast({
        variant: "destructive",
        title: language === "pt" ? "Erro" : "Error",
        description:
          language === "pt"
            ? "Ocorreu um erro ao gerar o documento. Tente novamente."
            : "An error occurred while generating the document. Please try again.",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  // Salvar documento editado
  const handleSaveDocument = (documentData: any) => {
    console.log("Documento salvo:", documentData)

    // Em um ambiente real, aqui você salvaria o documento no banco de dados
    // e atualizaria a lista de documentos

    // Simulação de atualização da lista de documentos
    const pedidoIndex = pedidos.findIndex((p) => p.id === documentData.pedidoId)
    if (pedidoIndex >= 0) {
      const docIndex = pedidos[pedidoIndex].documentos.findIndex((d) => d.tipo === editorDocumentType)
      if (docIndex >= 0) {
        // Atualizar documento existente
        pedidos[pedidoIndex].documentos[docIndex].data = new Date().toLocaleDateString()
      } else {
        // Adicionar novo documento
        pedidos[pedidoIndex].documentos.push({
          tipo: editorDocumentType,
          data: new Date().toLocaleDateString(),
          status: "draft",
        })
      }
    }
  }

  // Enviar documento para aprovação
  const handleSendForApproval = (documentData: any) => {
    console.log("Documento enviado para aprovação:", documentData)

    // Em um ambiente real, aqui você enviaria uma notificação para o cliente
    // e atualizaria o status do documento para "waitingApproval"

    // Simulação de atualização da lista de documentos
    const pedidoIndex = pedidos.findIndex((p) => p.id === documentData.pedidoId)
    if (pedidoIndex >= 0) {
      const docIndex = pedidos[pedidoIndex].documentos.findIndex((d) => d.tipo === editorDocumentType)
      if (docIndex >= 0) {
        // Atualizar documento existente
        pedidos[pedidoIndex].documentos[docIndex].status = "waitingApproval"
      } else {
        // Adicionar novo documento
        pedidos[pedidoIndex].documentos.push({
          tipo: editorDocumentType,
          data: new Date().toLocaleDateString(),
          status: "waitingApproval",
        })
      }
    }

    // Mostrar notificação de sucesso
    toast({
      title: language === "pt" ? "Notificação enviada" : "Notification sent",
      description:
        language === "pt"
          ? `Uma notificação foi enviada para ${documentData.importador.nome} para aprovação do ${getDocumentTypeName(editorDocumentType)}.`
          : `A notification has been sent to ${documentData.importador.nome} for ${getDocumentTypeName(editorDocumentType)} approval.`,
    })

    // Fechar o editor
    setEditorOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{t.documents}</h1>
          <p className="text-muted-foreground">
            {language === "pt"
              ? "Gerencie todos os documentos relacionados aos pedidos."
              : "Manage all documents related to orders."}
          </p>
        </div>

        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <FileUp className="mr-2 h-4 w-4" />
              {language === "pt" ? "Enviar Documento" : "Upload Document"}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{language === "pt" ? "Enviar Novo Documento" : "Upload New Document"}</DialogTitle>
              <DialogDescription>
                {language === "pt"
                  ? "Selecione o arquivo e preencha as informações do documento."
                  : "Select the file and fill in the document information."}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="documentType">{t.documentType}</Label>
                <Select value={documentType} onValueChange={setDocumentType}>
                  <SelectTrigger>
                    <SelectValue placeholder={language === "pt" ? "Selecione o tipo" : "Select type"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="proformaInvoice">{t.proformaInvoice}</SelectItem>
                    <SelectItem value="commercialInvoice">{t.commercialInvoice}</SelectItem>
                    <SelectItem value="packingList">{t.packingList}</SelectItem>
                    <SelectItem value="billOfLading">{t.billOfLading}</SelectItem>
                    <SelectItem value="certificateOfOrigin">{t.certificateOfOrigin}</SelectItem>
                    <SelectItem value="otherDocuments">{t.otherDocuments}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="orderId">{language === "pt" ? "Número do Pedido" : "Order Number"}</Label>
                <Input
                  id="orderId"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder={language === "pt" ? "Ex: PED-2025-001" : "Ex: PED-2025-001"}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="file">{language === "pt" ? "Arquivo" : "File"}</Label>
                <Input
                  id="file"
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.png"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
                {t.cancel}
              </Button>
              <Button onClick={handleUpload} disabled={!selectedFile || !documentType || !orderId}>
                {t.upload}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={language === "pt" ? "Buscar por pedido ou cliente..." : "Search by order or client..."}
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
          </SelectContent>
        </Select>

        <Select value={filterClient || ""} onValueChange={(value) => setFilterClient(value || null)}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder={language === "pt" ? "Cliente" : "Client"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{language === "pt" ? "Todos os clientes" : "All clients"}</SelectItem>
            {uniqueClients.map((client) => (
              <SelectItem key={client} value={client}>
                {client}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
                  <h3 className="text-lg font-bold">
                    {pedido.id} - {pedido.cliente}
                  </h3>
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
                              window.location.href = `/admin/orcamentos?id=${
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
                            onClick={() => {
                              setPreviewDocumentType("proformaInvoice")
                              setPreviewDocumentData({
                                cliente: pedido.cliente,
                                createdAt: new Date().toISOString(),
                                documentUrl: `/api/documents/proformaInvoice/${pedido.cliente}`,
                              })
                              setPreviewOpen(true)
                            }}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            {t.preview}
                          </Button>
                          <Button variant="outline" size="sm" className="w-full">
                            <Download className="h-3 w-3 mr-1" />
                            {t.download}
                          </Button>
                        </div>
                        <Button
                          size="sm"
                          className="w-full"
                          variant="outline"
                          onClick={() => openUploadDialog(pedido.id, "proformaInvoice")}
                        >
                          <Upload className="h-3 w-3 mr-1" />
                          {language === "pt" ? "Upload" : "Upload"}
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground">
                          {language === "pt" ? "Documento não gerado" : "Document not generated"}
                        </p>
                        <Button
                          size="sm"
                          className="w-full"
                          onClick={() => generateDocument(pedido.id, "proformaInvoice")}
                          disabled={isGenerating}
                        >
                          <FileUp className="h-3 w-3 mr-1" />
                          {isGenerating
                            ? language === "pt"
                              ? "Gerando..."
                              : "Generating..."
                            : language === "pt"
                              ? "Gerar"
                              : "Generate"}
                        </Button>
                        <Button
                          size="sm"
                          className="w-full"
                          variant="outline"
                          onClick={() => openUploadDialog(pedido.id, "proformaInvoice")}
                        >
                          <Upload className="h-3 w-3 mr-1" />
                          {language === "pt" ? "Upload" : "Upload"}
                        </Button>
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
                            onClick={() => {
                              setPreviewDocumentType("commercialInvoice")
                              setPreviewDocumentData({
                                cliente: pedido.cliente,
                                createdAt: new Date().toISOString(),
                                documentUrl: `/api/documents/commercialInvoice/${pedido.cliente}`,
                              })
                              setPreviewOpen(true)
                            }}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            {t.preview}
                          </Button>
                          <Button variant="outline" size="sm" className="w-full">
                            <Download className="h-3 w-3 mr-1" />
                            {t.download}
                          </Button>
                        </div>
                        <Button
                          size="sm"
                          className="w-full"
                          variant="outline"
                          onClick={() => openUploadDialog(pedido.id, "commercialInvoice")}
                        >
                          <Upload className="h-3 w-3 mr-1" />
                          {language === "pt" ? "Upload" : "Upload"}
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground">
                          {language === "pt" ? "Documento não gerado" : "Document not generated"}
                        </p>
                        <Button
                          size="sm"
                          className="w-full"
                          onClick={() => generateDocument(pedido.id, "commercialInvoice")}
                          disabled={isGenerating}
                        >
                          <FileUp className="h-3 w-3 mr-1" />
                          {isGenerating
                            ? language === "pt"
                              ? "Gerando..."
                              : "Generating..."
                            : language === "pt"
                              ? "Gerar"
                              : "Generate"}
                        </Button>
                        <Button
                          size="sm"
                          className="w-full"
                          variant="outline"
                          onClick={() => openUploadDialog(pedido.id, "commercialInvoice")}
                        >
                          <Upload className="h-3 w-3 mr-1" />
                          {language === "pt" ? "Upload" : "Upload"}
                        </Button>
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
                        <p className="text-xs">{pedido.documentos.find((doc) => doc.tipo === "packingList")?.data}</p>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => {
                              setPreviewDocumentType("packingList")
                              setPreviewDocumentData({
                                cliente: pedido.cliente,
                                createdAt: new Date().toISOString(),
                                documentUrl: `/api/documents/packingList/${pedido.cliente}`,
                              })
                              setPreviewOpen(true)
                            }}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            {t.preview}
                          </Button>
                          <Button variant="outline" size="sm" className="w-full">
                            <Download className="h-3 w-3 mr-1" />
                            {t.download}
                          </Button>
                        </div>
                        <Button
                          size="sm"
                          className="w-full"
                          variant="outline"
                          onClick={() => openUploadDialog(pedido.id, "packingList")}
                        >
                          <Upload className="h-3 w-3 mr-1" />
                          {language === "pt" ? "Upload" : "Upload"}
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground">
                          {language === "pt" ? "Documento não gerado" : "Document not generated"}
                        </p>
                        <Button
                          size="sm"
                          className="w-full"
                          onClick={() => generateDocument(pedido.id, "packingList")}
                          disabled={isGenerating}
                        >
                          <FileUp className="h-3 w-3 mr-1" />
                          {isGenerating
                            ? language === "pt"
                              ? "Gerando..."
                              : "Generating..."
                            : language === "pt"
                              ? "Gerar"
                              : "Generate"}
                        </Button>
                        <Button
                          size="sm"
                          className="w-full"
                          variant="outline"
                          onClick={() => openUploadDialog(pedido.id, "packingList")}
                        >
                          <Upload className="h-3 w-3 mr-1" />
                          {language === "pt" ? "Upload" : "Upload"}
                        </Button>
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
                        <p className="text-xs">{pedido.documentos.find((doc) => doc.tipo === "billOfLading")?.data}</p>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="w-full">
                            <Eye className="h-3 w-3 mr-1" />
                            {t.preview}
                          </Button>
                          <Button variant="outline" size="sm" className="w-full">
                            <Download className="h-3 w-3 mr-1" />
                            {t.download}
                          </Button>
                        </div>
                        <Button
                          size="sm"
                          className="w-full"
                          variant="outline"
                          onClick={() => openUploadDialog(pedido.id, "billOfLading")}
                        >
                          <Upload className="h-3 w-3 mr-1" />
                          {language === "pt" ? "Upload" : "Upload"}
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground">
                          {language === "pt" ? "Documento não gerado" : "Document not generated"}
                        </p>
                        <Button
                          size="sm"
                          className="w-full"
                          onClick={() => generateDocument(pedido.id, "billOfLading")}
                          disabled={!pedido.documentos.find((doc) => doc.tipo === "commercialInvoice") || isGenerating}
                        >
                          <FileUp className="h-3 w-3 mr-1" />
                          {isGenerating
                            ? language === "pt"
                              ? "Gerando..."
                              : "Generating..."
                            : language === "pt"
                              ? "Gerar"
                              : "Generate"}
                        </Button>
                        <Button
                          size="sm"
                          className="w-full"
                          variant="outline"
                          onClick={() => openUploadDialog(pedido.id, "billOfLading")}
                        >
                          <Upload className="h-3 w-3 mr-1" />
                          {language === "pt" ? "Upload" : "Upload"}
                        </Button>
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

      {/* Componente de preview do documento */}
      <DocumentPreview
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        documentType={previewDocumentType}
        documentData={previewDocumentData}
      />

      {/* Componente de edição do documento */}
      <DocumentEditor
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        documentType={editorDocumentType}
        pedidoId={editorPedidoId}
        cliente={editorCliente}
        initialData={editorInitialData}
        onSave={handleSaveDocument}
        onSendForApproval={handleSendForApproval}
      />
    </div>
  )
}
