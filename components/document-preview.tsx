"use client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download, Printer, X } from 'lucide-react'
import { getLanguage, translations } from "@/lib/i18n"
import { useState } from "react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"

interface DocumentPreviewProps {
  open: boolean
  onClose: () => void
  documentType: string
  documentData: any
  referencia?: string
  orientacao?: "retrato" | "paisagem"
  incoterm?: string
  observacoes?: string
  exportador?: any
}

export function DocumentPreview({ 
  open, 
  onClose, 
  documentType, 
  documentData, 
  referencia = "PI-2025-001",
  orientacao = "retrato",
  incoterm = "fob",
  observacoes = "",
  exportador = null
}: DocumentPreviewProps) {
  const language = getLanguage()
  const t = translations[language]
  const [orientation, setOrientation] = useState<"retrato" | "paisagem">(orientacao)
  const [notes, setNotes] = useState(observacoes)

  // Função para formatar o tipo de documento
  const formatDocumentType = (type: string) => {
    switch (type) {
      case "proformaInvoice":
        return t.proformaInvoice
      case "commercialInvoice":
        return t.commercialInvoice
      case "packingList":
        return t.packingList
      default:
        return type
    }
  }

  // Função para simular download do documento
  const handleDownload = () => {
    alert(`Download do documento iniciado!`)
    // Em um ambiente real, aqui você redirecionaria para a URL do documento
    // window.open(documentData.documentUrl, '_blank')
  }

  // Função para simular impressão do documento
  const handlePrint = () => {
    alert(`Impressão do documento iniciada!`)
    // Em um ambiente real, aqui você usaria window.print() ou uma solução similar
  }

  // Data atual formatada
  const dataAtual = new Date().toLocaleDateString(language === "pt" ? "pt-BR" : "en-US")

  // Calcular totais para a proforma
  const calcularTotais = () => {
    if (!documentData || !documentData.items) return { quantidade: 0, peso: 0, valor: 0 }
    
    return documentData.items.reduce(
      (acc: any, item: any) => {
        acc.quantidade += item.quantidade
        acc.peso += item.peso * item.quantidade
        acc.valor += item.preco * item.quantidade
        return acc
      },
      { quantidade: 0, peso: 0, valor: 0 }
    )
  }

  const totais = calcularTotais()
  
  // Verificar se o incoterm é CFR para distribuir o frete
  const isCFR = incoterm === "cfr" || incoterm === "cif"
  
  // Valor do frete (exemplo)
  const valorFrete = 2500.00
  
  // Calcular preço com frete incluído para incoterm CFR
  const calcularPrecoComFrete = (item: any, totalValor: number) => {
    if (!isCFR) return item.preco
    
    // Distribuir o frete proporcionalmente ao valor do item
    const proporcao = (item.preco * item.quantidade) / totalValor
    const freteProporcional = valorFrete * proporcao / item.quantidade
    
    return item.preco + freteProporcional
  }

  // Dados bancários do exportador (exemplo)
  const dadosBancarios = exportador?.dadosBancarios || {
    banco: "Bank of China",
    agencia: "0001",
    conta: "12345678",
    swift: "BKCHCNBJ",
    beneficiario: "Baoxinsheng Industrial Co., Ltd."
  }

  // Formatar o nome do incoterm
  const formatarIncoterm = (incoterm: string) => {
    switch (incoterm) {
      case "fob": return "FOB Shenzhen"
      case "cif": return "CIF Destination Port"
      case "exw": return "EXW Factory"
      case "cfr": return "CFR Destination Port"
      case "dap": return "DAP Destination"
      default: return incoterm.toUpperCase()
    }
  }

  // Formatar modalidade de pagamento
  const formatarModalidadePagamento = (modalidade: string) => {
    switch (modalidade) {
      case "carta-credito": return language === "pt" ? "Carta de Crédito" : "Letter of Credit"
      case "transferencia": return language === "pt" ? "Transferência Bancária" : "Wire Transfer"
      case "antecipado": return language === "pt" ? "Pagamento Antecipado" : "Advance Payment"
      case "parcelado": return language === "pt" ? "Pagamento Parcelado" : "Installment Payment"
      default: return modalidade
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className={`max-w-4xl ${orientation === "paisagem" ? "h-[80vh]" : "max-h-[90vh]"}`}>
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>{formatDocumentType(documentType)}</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
          <DialogDescription>
            {language === "pt"
              ? `Documento gerado em ${new Date(documentData?.createdAt || new Date()).toLocaleString("pt-BR")}`
              : `Document generated on ${new Date(documentData?.createdAt || new Date()).toLocaleString("en-US")}`}
          </DialogDescription>
          
          {/* Opções de orientação do documento */}
          <div className="mt-2">
            <RadioGroup
              value={orientation}
              onValueChange={(value) => setOrientation(value as "retrato" | "paisagem")}
              className="flex space-x-4"
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
        </DialogHeader>

        <div 
          className={`bg-white border rounded-md p-6 shadow-sm overflow-auto ${
            orientation === "paisagem" ? "h-[60vh]" : "max-h-[60vh]"
          }`}
        >
          {/* Simulação do conteúdo do documento */}
          {documentType === "proformaInvoice" && (
            <div className={`space-y-6 ${orientation === "paisagem" ? "landscape" : "portrait"}`}>
              <div className="text-center border-b pb-4">
                <h1 className="text-2xl font-bold mb-1">PROFORMA INVOICE</h1>
                <p className="text-sm text-muted-foreground">{dataAtual}</p>
                <p className="text-sm font-semibold mt-1">Ref: {referencia}</p>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold mb-2">{language === "pt" ? "Exportador" : "Exporter"}</h3>
                  <p>Baoxinsheng Industrial Co., Ltd.</p>
                  <p>123 Industrial Avenue</p>
                  <p>Shenzhen, Guangdong</p>
                  <p>China</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">{language === "pt" ? "Importador" : "Importer"}</h3>
                  <p>AMAZON TEMPER MANAUS</p>
                  <p>Av. Torquato Tapajós, 5555</p>
                  <p>Manaus, AM</p>
                  <p>Brasil</p>
                </div>
              </div>

              {/* Termos de entrega e modalidade de pagamento */}
              <div className="grid grid-cols-2 gap-8 border-t border-b py-3">
                <div>
                  <h3 className="font-semibold mb-1">
                    {language === "pt" ? "Termos de Entrega" : "Delivery Terms"}
                  </h3>
                  <p>{formatarIncoterm(incoterm)}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">
                    {language === "pt" ? "Modalidade de Pagamento" : "Payment Method"}
                  </h3>
                  <p>{formatarModalidadePagamento(documentData.paymentMethod || "carta-credito")}</p>
                </div>
              </div>

              <div className="mt-8">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">{language === "pt" ? "Item" : "Item"}</th>
                      <th className="text-left py-2">{language === "pt" ? "Descrição" : "Description"}</th>
                      <th className="text-center py-2">NCM</th>
                      <th className="text-right py-2">{language === "pt" ? "Quantidade" : "Quantity"}</th>
                      <th className="text-right py-2">{language === "pt" ? "Peso (kg)" : "Weight (kg)"}</th>
                      <th className="text-right py-2">{language === "pt" ? "Preço Unitário" : "Unit Price"}</th>
                      <th className="text-right py-2">{language === "pt" ? "Total" : "Total"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documentData.items && documentData.items.map((item: any, index: number) => {
                      const precoUnitario = calcularPrecoComFrete(item, totais.valor)
                      return (
                        <tr key={index} className="border-b">
                          <td className="py-2">{index + 1}</td>
                          <td className="py-2">{item.descricao}</td>
                          <td className="text-center py-2">{item.ncm}</td>
                          <td className="text-right py-2">{item.quantidade}</td>
                          <td className="text-right py-2">{(item.peso * item.quantidade).toFixed(2)}</td>
                          <td className="text-right py-2">${precoUnitario.toFixed(2)}</td>
                          <td className="text-right py-2">${(precoUnitario * item.quantidade).toFixed(2)}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="border-t">
                      <td colSpan={3} className="text-right font-semibold py-2">
                        {language === "pt" ? "Total" : "Total"}
                      </td>
                      <td className="text-right py-2 font-semibold">{totais.quantidade}</td>
                      <td className="text-right py-2 font-semibold">{totais.peso.toFixed(2)} kg</td>
                      <td className="text-right font-semibold py-2">
                        {language === "pt" ? "Subtotal" : "Subtotal"}
                      </td>
                      <td className="text-right py-2">${totais.valor.toFixed(2)}</td>
                    </tr>
                    
                    {/* Mostrar frete separadamente apenas se não for CFR/CIF */}
                    {!isCFR && (
                      <tr>
                        <td colSpan={6} className="text-right font-semibold py-2">
                          {language === "pt" ? "Frete" : "Shipping"}
                        </td>
                        <td className="text-right py-2">${valorFrete.toFixed(2)}</td>
                      </tr>
                    )}
                    
                    <tr>
                      <td colSpan={6} className="text-right font-semibold py-2">
                        {language === "pt" ? "Total" : "Total"}
                      </td>
                      <td className="text-right font-bold py-2">
                        ${(totais.valor + (isCFR ? 0 : valorFrete)).toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Dados bancários do exportador */}
              <div className="mt-8 border-t pt-4">
                <h3 className="font-semibold mb-2">
                  {language === "pt" ? "Dados Bancários" : "Banking Details"}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p><span className="font-medium">{language === "pt" ? "Banco" : "Bank"}:</span> {dadosBancarios.banco}</p>
                    <p><span className="font-medium">{language === "pt" ? "Agência" : "Branch"}:</span> {dadosBancarios.agencia}</p>
                    <p><span className="font-medium">{language === "pt" ? "Conta" : "Account"}:</span> {dadosBancarios.conta}</p>
                  </div>
                  <div>
                    <p><span className="font-medium">SWIFT:</span> {dadosBancarios.swift}</p>
                    <p><span className="font-medium">{language === "pt" ? "Beneficiário" : "Beneficiary"}:</span> {dadosBancarios.beneficiario}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 border-t pt-4">
                <h3 className="font-semibold mb-2">{language === "pt" ? "Observações" : "Notes"}</h3>
                <Textarea 
                  value={notes} 
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder={language === "pt" 
                    ? "Adicione informações complementares aqui..." 
                    : "Add complementary information here..."}
                />
              </div>
            </div>
          )}

          {documentType === "commercialInvoice" && (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">
                {language === "pt"
                  ? "Prévia da Commercial Invoice estará disponível aqui"
                  : "Commercial Invoice preview will be available here"}
              </p>
            </div>
          )}

          {documentType === "packingList" && (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">
                {language === "pt"
                  ? "Prévia da Packing List estará disponível aqui"
                  : "Packing List preview will be available here"}
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              {language === "pt" ? "Imprimir" : "Print"}
            </Button>
            <Button onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              {language === "pt" ? "Download" : "Download"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Componente Label para uso interno
function Label({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
      {children}
    </label>
  )
}
