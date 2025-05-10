"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { getLanguage, translations } from "@/lib/i18n"
import { useToast } from "@/components/ui/use-toast"
import { Save, Send } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DocumentEditorProps {
  open: boolean
  onClose: () => void
  documentType: string
  pedidoId: string
  cliente: string
  onSave: (documentData: any) => void
  onSendForApproval: (documentData: any) => void
  initialData?: any
}

export function DocumentEditor({
  open,
  onClose,
  documentType,
  pedidoId,
  cliente,
  onSave,
  onSendForApproval,
  initialData,
}: DocumentEditorProps) {
  const language = getLanguage()
  const t = translations[language]
  const { toast } = useToast()

  const [activeTab, setActiveTab] = useState("edit")
  const [orientation, setOrientation] = useState<"retrato" | "paisagem">("retrato")
  const [documentData, setDocumentData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Inicializar dados do documento
  useEffect(() => {
    if (initialData) {
      setDocumentData(initialData)
    } else {
      // Dados padrão para um novo documento
      const defaultData = {
        pedidoId,
        cliente,
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
        referencia: `${documentType === "commercialInvoice" ? "CI" : "PL"}-${pedidoId.replace("PED-", "")}`,
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
          nome: cliente,
          endereco: "Av. Torquato Tapajós, 5555",
          cidade: "Manaus",
          estado: "AM",
          pais: "Brasil",
          telefone: "+55 92 3123 4567",
          email: `contato@${cliente.toLowerCase().replace(/\s+/g, "")}.com.br`,
          contato: "João Silva",
        },
      }
      setDocumentData(defaultData)
    }
  }, [initialData, pedidoId, cliente, documentType])

  // Obter nome traduzido do tipo de documento
  const getDocumentTypeName = (type: string) => {
    switch (type) {
      case "commercialInvoice":
        return t.commercialInvoice
      case "packingList":
        return t.packingList
      default:
        return type
    }
  }

  // Atualizar um item específico
  const updateItem = (index: number, field: string, value: any) => {
    const updatedItems = [...documentData.items]
    updatedItems[index] = { ...updatedItems[index], [field]: value }
    setDocumentData({ ...documentData, items: updatedItems })
  }

  // Adicionar um novo item
  const addItem = () => {
    const newItem = {
      id: documentData.items.length + 1,
      descricao: "",
      ncm: "",
      quantidade: 0,
      pesoLiquido: 0,
      pesoBruto: 0,
      preco: 0,
    }
    setDocumentData({ ...documentData, items: [...documentData.items, newItem] })
  }

  // Remover um item
  const removeItem = (index: number) => {
    const updatedItems = documentData.items.filter((_: any, i: number) => i !== index)
    setDocumentData({ ...documentData, items: updatedItems })
  }

  // Calcular totais
  const calcularTotais = () => {
    if (!documentData || !documentData.items) return { quantidade: 0, pesoLiquido: 0, pesoBruto: 0, valor: 0 }

    return documentData.items.reduce(
      (acc: any, item: any) => {
        acc.quantidade += Number(item.quantidade)
        acc.pesoLiquido += Number(item.pesoLiquido || 0)
        acc.pesoBruto += Number(item.pesoBruto || 0)
        acc.valor += Number(item.preco) * Number(item.quantidade)
        return acc
      },
      { quantidade: 0, pesoLiquido: 0, pesoBruto: 0, valor: 0 },
    )
  }

  const totais = calcularTotais()

  // Salvar documento
  const handleSave = () => {
    setIsLoading(true)

    // Simulação de salvamento
    setTimeout(() => {
      onSave(documentData)
      toast({
        title: language === "pt" ? "Documento salvo" : "Document saved",
        description:
          language === "pt"
            ? `${getDocumentTypeName(documentType)} salvo com sucesso.`
            : `${getDocumentTypeName(documentType)} successfully saved.`,
      })
      setIsLoading(false)
    }, 1000)
  }

  // Enviar para aprovação
  const handleSendForApproval = () => {
    setIsLoading(true)

    // Simulação de envio para aprovação
    setTimeout(() => {
      onSendForApproval(documentData)
      toast({
        title: language === "pt" ? "Enviado para aprovação" : "Sent for approval",
        description:
          language === "pt"
            ? `${getDocumentTypeName(documentType)} enviado para aprovação do cliente.`
            : `${getDocumentTypeName(documentType)} sent for client approval.`,
      })
      setIsLoading(false)
      onClose()
    }, 1500)
  }

  if (!documentData) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {language === "pt"
              ? `Editar ${getDocumentTypeName(documentType)}`
              : `Edit ${getDocumentTypeName(documentType)}`}
          </DialogTitle>
          <DialogDescription>
            {language === "pt"
              ? `Ajuste as informações do documento antes de gerar o ${getDocumentTypeName(documentType)}.`
              : `Adjust the document information before generating the ${getDocumentTypeName(documentType)}.`}
          </DialogDescription>
        </DialogHeader>

        <Tabs
          defaultValue="edit"
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex-1 overflow-hidden flex flex-col"
        >
          <TabsList>
            <TabsTrigger value="edit">{language === "pt" ? "Editar" : "Edit"}</TabsTrigger>
            <TabsTrigger value="preview">{language === "pt" ? "Visualizar" : "Preview"}</TabsTrigger>
          </TabsList>

          <TabsContent value="edit" className="flex-1 overflow-auto">
            <div className="space-y-6 p-1">
              {/* Informações básicas */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="referencia">{language === "pt" ? "Referência" : "Reference"}</Label>
                  <Input
                    id="referencia"
                    value={documentData.referencia}
                    onChange={(e) => setDocumentData({ ...documentData, referencia: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="data">{language === "pt" ? "Data" : "Date"}</Label>
                  <Input
                    id="data"
                    type="date"
                    value={new Date(documentData.data).toISOString().split("T")[0]}
                    onChange={(e) => setDocumentData({ ...documentData, data: new Date(e.target.value).toISOString() })}
                  />
                </div>
              </div>

              {/* Incoterm e Método de Pagamento */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="incoterm">Incoterm</Label>
                  <Select
                    value={documentData.incoterm}
                    onValueChange={(value) => setDocumentData({ ...documentData, incoterm: value })}
                  >
                    <SelectTrigger id="incoterm">
                      <SelectValue placeholder="Selecione o Incoterm" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fob">FOB</SelectItem>
                      <SelectItem value="cif">CIF</SelectItem>
                      <SelectItem value="cfr">CFR</SelectItem>
                      <SelectItem value="exw">EXW</SelectItem>
                      <SelectItem value="dap">DAP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="paymentMethod">{language === "pt" ? "Método de Pagamento" : "Payment Method"}</Label>
                  <Select
                    value={documentData.paymentMethod}
                    onValueChange={(value) => setDocumentData({ ...documentData, paymentMethod: value })}
                  >
                    <SelectTrigger id="paymentMethod">
                      <SelectValue placeholder={language === "pt" ? "Selecione o método" : "Select method"} />
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
              </div>

              {/* Orientação do documento */}
              <div>
                <Label>{language === "pt" ? "Orientação do documento" : "Document orientation"}</Label>
                <RadioGroup
                  value={orientation}
                  onValueChange={(value) => setOrientation(value as "retrato" | "paisagem")}
                  className="flex space-x-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="retrato" id="retrato" />
                    <Label htmlFor="retrato">{language === "pt" ? "Retrato" : "Portrait"}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="paisagem" id="paisagem" />
                    <Label htmlFor="paisagem">{language === "pt" ? "Paisagem" : "Landscape"}</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="grid grid-cols-2 gap-6 mt-4">
                {/* Dados do Exportador */}
                <div className="space-y-4">
                  <h3 className="font-medium">{language === "pt" ? "Dados do Exportador" : "Exporter Details"}</h3>
                  <div className="space-y-2">
                    <Label htmlFor="exportador-nome">{language === "pt" ? "Nome" : "Name"}</Label>
                    <Input
                      id="exportador-nome"
                      value={documentData.exportador.nome}
                      onChange={(e) =>
                        setDocumentData({
                          ...documentData,
                          exportador: { ...documentData.exportador, nome: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="exportador-endereco">{language === "pt" ? "Endereço" : "Address"}</Label>
                    <Input
                      id="exportador-endereco"
                      value={documentData.exportador.endereco}
                      onChange={(e) =>
                        setDocumentData({
                          ...documentData,
                          exportador: { ...documentData.exportador, endereco: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label htmlFor="exportador-cidade">{language === "pt" ? "Cidade" : "City"}</Label>
                      <Input
                        id="exportador-cidade"
                        value={documentData.exportador.cidade}
                        onChange={(e) =>
                          setDocumentData({
                            ...documentData,
                            exportador: { ...documentData.exportador, cidade: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="exportador-estado">{language === "pt" ? "Estado" : "State"}</Label>
                      <Input
                        id="exportador-estado"
                        value={documentData.exportador.estado}
                        onChange={(e) =>
                          setDocumentData({
                            ...documentData,
                            exportador: { ...documentData.exportador, estado: e.target.value },
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="exportador-pais">{language === "pt" ? "País" : "Country"}</Label>
                    <Input
                      id="exportador-pais"
                      value={documentData.exportador.pais}
                      onChange={(e) =>
                        setDocumentData({
                          ...documentData,
                          exportador: { ...documentData.exportador, pais: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="exportador-contato">{language === "pt" ? "Contato" : "Contact"}</Label>
                    <Input
                      id="exportador-contato"
                      value={documentData.exportador.contato}
                      onChange={(e) =>
                        setDocumentData({
                          ...documentData,
                          exportador: { ...documentData.exportador, contato: e.target.value },
                        })
                      }
                    />
                  </div>
                </div>

                {/* Dados do Importador */}
                <div className="space-y-4">
                  <h3 className="font-medium">{language === "pt" ? "Dados do Importador" : "Importer Details"}</h3>
                  <div className="space-y-2">
                    <Label htmlFor="importador-nome">{language === "pt" ? "Nome" : "Name"}</Label>
                    <Input
                      id="importador-nome"
                      value={documentData.importador.nome}
                      onChange={(e) =>
                        setDocumentData({
                          ...documentData,
                          importador: { ...documentData.importador, nome: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="importador-endereco">{language === "pt" ? "Endereço" : "Address"}</Label>
                    <Input
                      id="importador-endereco"
                      value={documentData.importador.endereco}
                      onChange={(e) =>
                        setDocumentData({
                          ...documentData,
                          importador: { ...documentData.importador, endereco: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label htmlFor="importador-cidade">{language === "pt" ? "Cidade" : "City"}</Label>
                      <Input
                        id="importador-cidade"
                        value={documentData.importador.cidade}
                        onChange={(e) =>
                          setDocumentData({
                            ...documentData,
                            importador: { ...documentData.importador, cidade: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="importador-estado">{language === "pt" ? "Estado" : "State"}</Label>
                      <Input
                        id="importador-estado"
                        value={documentData.importador.estado}
                        onChange={(e) =>
                          setDocumentData({
                            ...documentData,
                            importador: { ...documentData.importador, estado: e.target.value },
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="importador-pais">{language === "pt" ? "País" : "Country"}</Label>
                    <Input
                      id="importador-pais"
                      value={documentData.importador.pais}
                      onChange={(e) =>
                        setDocumentData({
                          ...documentData,
                          importador: { ...documentData.importador, pais: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="importador-contato">{language === "pt" ? "Contato" : "Contact"}</Label>
                    <Input
                      id="importador-contato"
                      value={documentData.importador.contato}
                      onChange={(e) =>
                        setDocumentData({
                          ...documentData,
                          importador: { ...documentData.importador, contato: e.target.value },
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Tabela de itens */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label>{language === "pt" ? "Itens" : "Items"}</Label>
                  <Button variant="outline" size="sm" onClick={addItem}>
                    {language === "pt" ? "Adicionar Item" : "Add Item"}
                  </Button>
                </div>
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">#</TableHead>
                        <TableHead>{language === "pt" ? "Descrição" : "Description"}</TableHead>
                        <TableHead>NCM</TableHead>
                        <TableHead className="text-right">{language === "pt" ? "Qtd" : "Qty"}</TableHead>
                        {documentType === "packingList" ? (
                          <>
                            <TableHead className="text-right">
                              {language === "pt" ? "Peso Líq. (kg)" : "Net Weight (kg)"}
                            </TableHead>
                            <TableHead className="text-right">
                              {language === "pt" ? "Peso Bruto (kg)" : "Gross Weight (kg)"}
                            </TableHead>
                          </>
                        ) : (
                          <TableHead className="text-right">
                            {language === "pt" ? "Peso (kg)" : "Weight (kg)"}
                          </TableHead>
                        )}
                        {documentType === "commercialInvoice" && (
                          <TableHead className="text-right">
                            {language === "pt" ? "Preço Unit." : "Unit Price"}
                          </TableHead>
                        )}
                        {documentType === "commercialInvoice" && <TableHead className="text-right">Total</TableHead>}
                        <TableHead className="w-[80px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {documentData.items.map((item: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>
                            <Input
                              value={item.descricao}
                              onChange={(e) => updateItem(index, "descricao", e.target.value)}
                              className="w-full"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={item.ncm}
                              onChange={(e) => updateItem(index, "ncm", e.target.value)}
                              className="w-full"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={item.quantidade}
                              onChange={(e) => updateItem(index, "quantidade", Number(e.target.value))}
                              className="w-full text-right"
                            />
                          </TableCell>
                          {documentType === "packingList" ? (
                            <>
                              <TableCell>
                                <Input
                                  type="number"
                                  value={item.pesoLiquido}
                                  onChange={(e) => updateItem(index, "pesoLiquido", Number(e.target.value))}
                                  className="w-full text-right"
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  type="number"
                                  value={item.pesoBruto}
                                  onChange={(e) => updateItem(index, "pesoBruto", Number(e.target.value))}
                                  className="w-full text-right"
                                />
                              </TableCell>
                            </>
                          ) : (
                            <TableCell>
                              <Input
                                type="number"
                                value={item.pesoBruto}
                                onChange={(e) => updateItem(index, "pesoBruto", Number(e.target.value))}
                                className="w-full text-right"
                              />
                            </TableCell>
                          )}
                          {documentType === "commercialInvoice" && (
                            <TableCell>
                              <Input
                                type="number"
                                value={item.preco}
                                onChange={(e) => updateItem(index, "preco", Number(e.target.value))}
                                className="w-full text-right"
                              />
                            </TableCell>
                          )}
                          {documentType === "commercialInvoice" && (
                            <TableCell className="text-right">${(item.preco * item.quantidade).toFixed(2)}</TableCell>
                          )}
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(index)}
                              disabled={documentData.items.length <= 1}
                            >
                              {language === "pt" ? "Remover" : "Remove"}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    {documentType === "commercialInvoice" && (
                      <tfoot>
                        <tr>
                          <td colSpan={3} className="px-4 py-2 text-right font-medium">
                            {language === "pt" ? "Totais:" : "Totals:"}
                          </td>
                          <td className="px-4 py-2 text-right">{totais.quantidade}</td>
                          <td className="px-4 py-2 text-right">{totais.pesoBruto.toFixed(2)} kg</td>
                          <td className="px-4 py-2 text-right"></td>
                          <td className="px-4 py-2 text-right font-medium">${totais.valor.toFixed(2)}</td>
                          <td></td>
                        </tr>
                      </tfoot>
                    )}
                    {documentType === "packingList" && (
                      <tfoot>
                        <tr>
                          <td colSpan={3} className="px-4 py-2 text-right font-medium">
                            {language === "pt" ? "Totais:" : "Totals:"}
                          </td>
                          <td className="px-4 py-2 text-right">{totais.quantidade}</td>
                          <td className="px-4 py-2 text-right">{totais.pesoLiquido.toFixed(2)} kg</td>
                          <td className="px-4 py-2 text-right">{totais.pesoBruto.toFixed(2)} kg</td>
                          <td></td>
                        </tr>
                      </tfoot>
                    )}
                  </Table>
                </div>
              </div>

              {/* Observações */}
              <div>
                <Label htmlFor="observacoes">{language === "pt" ? "Observações" : "Notes"}</Label>
                <Textarea
                  id="observacoes"
                  value={documentData.observacoes}
                  onChange={(e) => setDocumentData({ ...documentData, observacoes: e.target.value })}
                  rows={4}
                  placeholder={
                    language === "pt"
                      ? "Adicione observações ou instruções especiais..."
                      : "Add notes or special instructions..."
                  }
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="flex-1 overflow-auto">
            <div className={`p-6 border rounded-md ${orientation === "paisagem" ? "landscape" : "portrait"}`}>
              {/* Cabeçalho do documento */}
              <div className="text-center border-b pb-4">
                <h1 className="text-2xl font-bold mb-1">
                  {documentType === "commercialInvoice" ? "COMMERCIAL INVOICE" : "PACKING LIST"}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {new Date(documentData.data).toLocaleDateString(language === "pt" ? "pt-BR" : "en-US")}
                </p>
                <p className="text-sm font-semibold mt-1">Ref: {documentData.referencia}</p>
              </div>

              {/* Informações de exportador e importador */}
              <div className="grid grid-cols-2 gap-8 mt-6">
                <div>
                  <h3 className="font-semibold mb-2">{language === "pt" ? "Exportador" : "Exporter"}</h3>
                  <p>{documentData.exportador.nome}</p>
                  <p>{documentData.exportador.endereco}</p>
                  <p>
                    {documentData.exportador.cidade}, {documentData.exportador.estado}
                  </p>
                  <p>{documentData.exportador.pais}</p>
                  {documentData.exportador.contato && (
                    <p>
                      {language === "pt" ? "Contato: " : "Contact: "}
                      {documentData.exportador.contato}
                    </p>
                  )}
                </div>

                <div>
                  <h3 className="font-semibold mb-2">{language === "pt" ? "Importador" : "Importer"}</h3>
                  <p>{documentData.importador.nome}</p>
                  <p>{documentData.importador.endereco}</p>
                  <p>
                    {documentData.importador.cidade}, {documentData.importador.estado}
                  </p>
                  <p>{documentData.importador.pais}</p>
                  {documentData.importador.contato && (
                    <p>
                      {language === "pt" ? "Contato: " : "Contact: "}
                      {documentData.importador.contato}
                    </p>
                  )}
                </div>
              </div>

              {/* Termos de entrega e modalidade de pagamento */}
              {documentType === "commercialInvoice" && (
                <div className="grid grid-cols-2 gap-8 border-t border-b py-3 mt-6">
                  <div>
                    <h3 className="font-semibold mb-1">{language === "pt" ? "Termos de Entrega" : "Delivery Terms"}</h3>
                    <p>{documentData.incoterm.toUpperCase()}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">
                      {language === "pt" ? "Modalidade de Pagamento" : "Payment Method"}
                    </h3>
                    <p>
                      {documentData.paymentMethod === "carta-credito"
                        ? language === "pt"
                          ? "Carta de Crédito"
                          : "Letter of Credit"
                        : documentData.paymentMethod === "transferencia"
                          ? language === "pt"
                            ? "Transferência Bancária"
                            : "Wire Transfer"
                          : documentData.paymentMethod === "antecipado"
                            ? language === "pt"
                              ? "Pagamento Antecipado"
                              : "Advance Payment"
                            : language === "pt"
                              ? "Pagamento Parcelado"
                              : "Installment Payment"}
                    </p>
                  </div>
                </div>
              )}

              {/* Tabela de itens */}
              <div className="mt-6">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">{language === "pt" ? "Item" : "Item"}</th>
                      <th className="text-left py-2">{language === "pt" ? "Descrição" : "Description"}</th>
                      <th className="text-center py-2">NCM</th>
                      <th className="text-right py-2">{language === "pt" ? "Quantidade" : "Quantity"}</th>
                      {documentType === "packingList" ? (
                        <>
                          <th className="text-right py-2">
                            {language === "pt" ? "Peso Líq. (kg)" : "Net Weight (kg)"}
                          </th>
                          <th className="text-right py-2">
                            {language === "pt" ? "Peso Bruto (kg)" : "Gross Weight (kg)"}
                          </th>
                        </>
                      ) : (
                        <th className="text-right py-2">{language === "pt" ? "Peso (kg)" : "Weight (kg)"}</th>
                      )}
                      {documentType === "commercialInvoice" && (
                        <th className="text-right py-2">{language === "pt" ? "Preço Unitário" : "Unit Price"}</th>
                      )}
                      {documentType === "commercialInvoice" && (
                        <th className="text-right py-2">{language === "pt" ? "Total" : "Total"}</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {documentData.items.map((item: any, index: number) => (
                      <tr key={index} className="border-b">
                        <td className="py-2">{index + 1}</td>
                        <td className="py-2">{item.descricao}</td>
                        <td className="text-center py-2">{item.ncm}</td>
                        <td className="text-right py-2">{item.quantidade}</td>
                        {documentType === "packingList" ? (
                          <>
                            <td className="text-right py-2">{Number(item.pesoLiquido).toFixed(2)}</td>
                            <td className="text-right py-2">{Number(item.pesoBruto).toFixed(2)}</td>
                          </>
                        ) : (
                          <td className="text-right py-2">{Number(item.pesoBruto).toFixed(2)}</td>
                        )}
                        {documentType === "commercialInvoice" && (
                          <td className="text-right py-2">${Number(item.preco).toFixed(2)}</td>
                        )}
                        {documentType === "commercialInvoice" && (
                          <td className="text-right py-2">${(item.preco * item.quantidade).toFixed(2)}</td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t">
                      <td colSpan={3} className="text-right font-semibold py-2">
                        {language === "pt" ? "Total" : "Total"}
                      </td>
                      <td className="text-right py-2 font-semibold">{totais.quantidade}</td>
                      {documentType === "packingList" ? (
                        <>
                          <td className="text-right py-2 font-semibold">{totais.pesoLiquido.toFixed(2)} kg</td>
                          <td className="text-right py-2 font-semibold">{totais.pesoBruto.toFixed(2)} kg</td>
                        </>
                      ) : (
                        <td className="text-right py-2 font-semibold">{totais.pesoBruto.toFixed(2)} kg</td>
                      )}
                      {documentType === "commercialInvoice" && (
                        <td className="text-right font-semibold py-2">{language === "pt" ? "Subtotal" : "Subtotal"}</td>
                      )}
                      {documentType === "commercialInvoice" && (
                        <td className="text-right py-2">${totais.valor.toFixed(2)}</td>
                      )}
                    </tr>
                    {documentType === "commercialInvoice" &&
                      documentData.incoterm !== "cfr" &&
                      documentData.incoterm !== "cif" && (
                        <tr>
                          <td colSpan={6} className="text-right font-semibold py-2">
                            {language === "pt" ? "Frete" : "Shipping"}
                          </td>
                          <td className="text-right py-2">$2,500.00</td>
                        </tr>
                      )}
                    {documentType === "commercialInvoice" && (
                      <tr>
                        <td colSpan={6} className="text-right font-semibold py-2">
                          {language === "pt" ? "Total" : "Total"}
                        </td>
                        <td className="text-right font-bold py-2">
                          $
                          {(
                            totais.valor +
                            (documentData.incoterm !== "cfr" && documentData.incoterm !== "cif" ? 2500 : 0)
                          ).toFixed(2)}
                        </td>
                      </tr>
                    )}
                  </tfoot>
                </table>
              </div>

              {/* Observações */}
              {documentData.observacoes && (
                <div className="mt-8 border-t pt-4">
                  <h3 className="font-semibold mb-2">{language === "pt" ? "Observações" : "Notes"}</h3>
                  <p>{documentData.observacoes}</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="pt-2">
          <div className="flex gap-2 ml-auto">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              {t.cancel}
            </Button>
            <Button variant="outline" onClick={handleSave} disabled={isLoading}>
              <Save className="h-4 w-4 mr-2" />
              {isLoading && activeTab === "edit"
                ? language === "pt"
                  ? "Salvando..."
                  : "Saving..."
                : language === "pt"
                  ? "Salvar"
                  : "Save"}
            </Button>
            <Button onClick={handleSendForApproval} disabled={isLoading}>
              <Send className="h-4 w-4 mr-2" />
              {isLoading && activeTab === "preview"
                ? language === "pt"
                  ? "Enviando..."
                  : "Sending..."
                : language === "pt"
                  ? "Enviar para Aprovação"
                  : "Send for Approval"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
