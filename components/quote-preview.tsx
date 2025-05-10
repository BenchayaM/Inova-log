"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download, Printer, X } from "lucide-react"
import { getLanguage, translations } from "@/lib/i18n"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface QuotePreviewProps {
  open: boolean
  onClose: () => void
  quote: any
}

export function QuotePreview({ open, onClose, quote }: QuotePreviewProps) {
  const language = getLanguage()
  const t = translations[language]
  const [orientation, setOrientation] = useState<"retrato" | "paisagem">("retrato")

  // Dados de exemplo para os itens da cotação
  const quoteItems = [
    {
      id: 1,
      descricao: "Vidro Float Incolor 10mm",
      ncm: "7005.29.00",
      quantidade: 50,
      unidade: "m²",
      precoUnitario: 85.0,
      total: 4250.0,
    },
    {
      id: 2,
      descricao: "Vidro Temperado 8mm",
      ncm: "7007.19.00",
      quantidade: 30,
      unidade: "m²",
      precoUnitario: 120.0,
      total: 3600.0,
    },
    {
      id: 3,
      descricao: "Espelho 4mm",
      ncm: "7009.91.00",
      quantidade: 25,
      unidade: "m²",
      precoUnitario: 75.0,
      total: 1875.0,
    },
    {
      id: 4,
      descricao: "Vidro Laminado 10mm (5+5)",
      ncm: "7007.29.00",
      quantidade: 15,
      unidade: "m²",
      precoUnitario: 185.0,
      total: 2775.0,
    },
  ]

  // Função para simular download do documento
  const handleDownload = () => {
    alert(`Download da cotação ${quote.id} iniciado!`)
    // Em um ambiente real, aqui você redirecionaria para a URL do documento
  }

  // Função para simular impressão do documento
  const handlePrint = () => {
    alert(`Impressão da cotação ${quote.id} iniciada!`)
    // Em um ambiente real, aqui você usaria window.print() ou uma solução similar
  }

  // Data atual formatada
  const dataAtual = new Date().toLocaleDateString(language === "pt" ? "pt-BR" : "en-US")

  // Calcular totais
  const calcularTotais = () => {
    return quoteItems.reduce(
      (acc, item) => {
        acc.quantidade += item.quantidade
        acc.valor += item.total
        return acc
      },
      { quantidade: 0, valor: 0 },
    )
  }

  const totais = calcularTotais()

  // Dados do cliente (exemplo)
  const cliente = {
    nome: "AMAZON TEMPER MANAUS",
    endereco: "Av. Torquato Tapajós, 5555",
    cidade: "Manaus",
    estado: "AM",
    pais: "Brasil",
    telefone: "+55 92 3123-4567",
    email: "contato@amazontemper.com.br",
  }

  // Dados do fornecedor (exemplo)
  const fornecedor = {
    nome: "Baoxinsheng Industrial Co., Ltd.",
    endereco: "123 Industrial Avenue",
    cidade: "Shenzhen",
    estado: "Guangdong",
    pais: "China",
    telefone: "+86 755 1234 5678",
    email: "sales@baoxinsheng.com",
  }

  // Condições da cotação (exemplo)
  const condicoes = {
    validade: "30 dias",
    prazoEntrega: "45-60 dias após confirmação",
    formaPagamento: "Carta de Crédito",
    incoterm: "FOB Shenzhen",
    garantia: "12 meses contra defeitos de fabricação",
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className={`max-w-4xl ${orientation === "paisagem" ? "h-[80vh]" : "max-h-[90vh]"}`}>
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>
              {language === "pt" ? "Cotação" : "Quote"} #{quote.id}
            </span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
          <DialogDescription>
            {language === "pt" ? `Cotação gerada em ${quote.data}` : `Quote generated on ${quote.data}`}
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
          {/* Conteúdo da cotação */}
          <div className={`space-y-6 ${orientation === "paisagem" ? "landscape" : "portrait"}`}>
            <div className="text-center border-b pb-4">
              <h1 className="text-2xl font-bold mb-1">{language === "pt" ? "COTAÇÃO" : "QUOTATION"}</h1>
              <p className="text-sm text-muted-foreground">{dataAtual}</p>
              <p className="text-sm font-semibold mt-1">Ref: {quote.id}</p>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold mb-2">{language === "pt" ? "Fornecedor" : "Supplier"}</h3>
                <p>{fornecedor.nome}</p>
                <p>{fornecedor.endereco}</p>
                <p>
                  {fornecedor.cidade}, {fornecedor.estado}
                </p>
                <p>{fornecedor.pais}</p>
                <p>{fornecedor.telefone}</p>
                <p>{fornecedor.email}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">{language === "pt" ? "Cliente" : "Customer"}</h3>
                <p>{cliente.nome}</p>
                <p>{cliente.endereco}</p>
                <p>
                  {cliente.cidade}, {cliente.estado}
                </p>
                <p>{cliente.pais}</p>
                <p>{cliente.telefone}</p>
                <p>{cliente.email}</p>
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
                    <th className="text-center py-2">{language === "pt" ? "Unidade" : "Unit"}</th>
                    <th className="text-right py-2">{language === "pt" ? "Preço Unitário" : "Unit Price"}</th>
                    <th className="text-right py-2">{language === "pt" ? "Total" : "Total"}</th>
                  </tr>
                </thead>
                <tbody>
                  {quoteItems.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2">{item.id}</td>
                      <td className="py-2">{item.descricao}</td>
                      <td className="text-center py-2">{item.ncm}</td>
                      <td className="text-right py-2">{item.quantidade}</td>
                      <td className="text-center py-2">{item.unidade}</td>
                      <td className="text-right py-2">${item.precoUnitario.toFixed(2)}</td>
                      <td className="text-right py-2">${item.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t">
                    <td colSpan={3} className="text-right font-semibold py-2">
                      {language === "pt" ? "Total" : "Total"}
                    </td>
                    <td className="text-right py-2 font-semibold">{totais.quantidade}</td>
                    <td colSpan={2} className="text-right font-semibold py-2">
                      {language === "pt" ? "Valor Total" : "Total Value"}
                    </td>
                    <td className="text-right py-2 font-bold">${totais.valor.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Condições da cotação */}
            <div className="mt-8 border-t pt-4">
              <h3 className="font-semibold mb-2">{language === "pt" ? "Condições da Cotação" : "Quote Conditions"}</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p>
                    <span className="font-medium">{language === "pt" ? "Validade" : "Validity"}:</span>{" "}
                    {condicoes.validade}
                  </p>
                  <p>
                    <span className="font-medium">{language === "pt" ? "Prazo de Entrega" : "Delivery Time"}:</span>{" "}
                    {condicoes.prazoEntrega}
                  </p>
                  <p>
                    <span className="font-medium">{language === "pt" ? "Forma de Pagamento" : "Payment Terms"}:</span>{" "}
                    {condicoes.formaPagamento}
                  </p>
                </div>
                <div>
                  <p>
                    <span className="font-medium">Incoterm:</span> {condicoes.incoterm}
                  </p>
                  <p>
                    <span className="font-medium">{language === "pt" ? "Garantia" : "Warranty"}:</span>{" "}
                    {condicoes.garantia}
                  </p>
                </div>
              </div>
            </div>

            {/* Observações */}
            <div className="mt-4 border-t pt-4">
              <h3 className="font-semibold mb-2">{language === "pt" ? "Observações" : "Notes"}</h3>
              <p className="text-sm">
                {language === "pt"
                  ? "Esta cotação é válida pelo período especificado acima. Preços sujeitos a alteração sem aviso prévio após o término da validade. Impostos de importação e taxas aduaneiras não estão inclusos no valor cotado."
                  : "This quotation is valid for the period specified above. Prices are subject to change without notice after the validity period. Import duties and customs fees are not included in the quoted value."}
              </p>
            </div>

            {/* Assinatura */}
            <div className="mt-8 pt-8 border-t">
              <div className="w-64 mx-auto text-center">
                <div className="border-b border-dashed border-gray-400 pb-1 mb-1"></div>
                <p className="text-sm">{language === "pt" ? "Assinatura e Carimbo" : "Signature and Stamp"}</p>
              </div>
            </div>
          </div>
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
    <label
      htmlFor={htmlFor}
      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    >
      {children}
    </label>
  )
}
