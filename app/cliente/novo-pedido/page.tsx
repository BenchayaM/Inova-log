"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ShoppingCart, Search, Plus, Minus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getLanguage, translations } from "@/lib/i18n"

// Tipos para os produtos
type UnidadeMedida = "unidade" | "kit" | "m2" | "metro_linear"

interface Produto {
  id: string
  nome: string
  descricao: string
  preco: number
  peso: number
  unidadeMedida: UnidadeMedida
  imagem: string
  categoria: string
}

// Dados de exemplo
const categorias = ["Materiais de Construção", "Ferramentas", "Acabamentos", "Elétrica", "Hidráulica"]

const produtos: Produto[] = [
  {
    id: "prod-001",
    nome: "Tijolo Cerâmico",
    descricao: "Tijolo cerâmico 9x19x29cm para construção",
    preco: 0.75,
    peso: 2.5,
    unidadeMedida: "unidade",
    imagem: "/placeholder.svg",
    categoria: "Materiais de Construção",
  },
  {
    id: "prod-002",
    nome: "Kit Ferramentas Básicas",
    descricao: "Kit com martelo, chave de fenda e alicate",
    preco: 89.9,
    peso: 1.2,
    unidadeMedida: "kit",
    imagem: "/placeholder.svg",
    categoria: "Ferramentas",
  },
  {
    id: "prod-003",
    nome: "Porcelanato Polido",
    descricao: "Porcelanato polido 60x60cm",
    preco: 45.5,
    peso: 22.5,
    unidadeMedida: "m2",
    imagem: "/placeholder.svg",
    categoria: "Acabamentos",
  },
  {
    id: "prod-004",
    nome: "Cabo Elétrico 2.5mm",
    descricao: "Cabo elétrico flexível 2.5mm",
    preco: 2.3,
    peso: 0.1,
    unidadeMedida: "metro_linear",
    imagem: "/placeholder.svg",
    categoria: "Elétrica",
  },
  {
    id: "prod-005",
    nome: "Tubo PVC 100mm",
    descricao: "Tubo PVC 100mm para esgoto",
    preco: 35.9,
    peso: 1.8,
    unidadeMedida: "metro_linear",
    imagem: "/placeholder.svg",
    categoria: "Hidráulica",
  },
]

interface ItemCarrinho {
  produto: Produto
  quantidade: number
  observacao: string
}

export default function NovoPedidoPage() {
  const [language, setLanguage] = useState<"pt" | "en">("pt")
  const [categoriaAtiva, setCategoriaAtiva] = useState<string | null>(null)
  const [termoBusca, setTermoBusca] = useState("")
  const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([])
  const [observacoes, setObservacoes] = useState<Record<string, string>>({})
  const { toast } = useToast()

  useEffect(() => {
    setLanguage(getLanguage())
  }, [])

  const t = translations[language]

  // Filtrar produtos por categoria e termo de busca
  const produtosFiltrados = produtos.filter((produto) => {
    const matchCategoria = categoriaAtiva ? produto.categoria === categoriaAtiva : true
    const matchBusca =
      produto.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
      produto.descricao.toLowerCase().includes(termoBusca.toLowerCase())
    return matchCategoria && matchBusca
  })

  // Adicionar produto ao carrinho
  const adicionarAoCarrinho = (produto: Produto) => {
    setCarrinho((prev) => {
      const itemExistente = prev.find((item) => item.produto.id === produto.id)
      if (itemExistente) {
        return prev.map((item) =>
          item.produto.id === produto.id ? { ...item, quantidade: item.quantidade + 1 } : item,
        )
      } else {
        return [...prev, { produto, quantidade: 1, observacao: "" }]
      }
    })

    toast({
      title: language === "pt" ? "Produto adicionado" : "Product added",
      description:
        language === "pt"
          ? `${produto.nome} foi adicionado ao orçamento.`
          : `${produto.nome} has been added to the quote.`,
    })
  }

  // Alterar quantidade de um produto no carrinho
  const alterarQuantidade = (produtoId: string, delta: number) => {
    setCarrinho((prev) => {
      return prev
        .map((item) => {
          if (item.produto.id === produtoId) {
            const novaQuantidade = Math.max(0, item.quantidade + delta)
            return { ...item, quantidade: novaQuantidade }
          }
          return item
        })
        .filter((item) => item.quantidade > 0)
    })
  }

  // Atualizar observação de um item
  const atualizarObservacao = (produtoId: string, observacao: string) => {
    setCarrinho((prev) => {
      return prev.map((item) => {
        if (item.produto.id === produtoId) {
          return { ...item, observacao }
        }
        return item
      })
    })
  }

  // Calcular total do orçamento
  const totalOrcamento = carrinho.reduce((total, item) => {
    return total + item.produto.preco * item.quantidade
  }, 0)

  // Finalizar orçamento
  const finalizarOrcamento = () => {
    if (carrinho.length === 0) {
      toast({
        title: language === "pt" ? "Carrinho vazio" : "Empty cart",
        description:
          language === "pt"
            ? "Adicione produtos ao orçamento antes de finalizar."
            : "Add products to the quote before finishing.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: language === "pt" ? "Orçamento enviado" : "Quote sent",
      description:
        language === "pt"
          ? "Seu orçamento foi enviado com sucesso e está em análise."
          : "Your quote has been successfully sent and is under review.",
    })

    // Aqui seria implementada a lógica para enviar o orçamento para o backend
    console.log("Orçamento finalizado:", carrinho)
    setCarrinho([])
  }

  const formatarUnidadeMedida = (unidade: UnidadeMedida) => {
    switch (unidade) {
      case "unidade":
        return language === "pt" ? "un" : "unit"
      case "kit":
        return "kit"
      case "m2":
        return "m²"
      case "metro_linear":
        return language === "pt" ? "m" : "m"
    }
  }

  // Traduzir categorias
  const traduzirCategoria = (categoria: string) => {
    if (language === "pt") return categoria

    switch (categoria) {
      case "Materiais de Construção":
        return "Construction Materials"
      case "Ferramentas":
        return "Tools"
      case "Acabamentos":
        return "Finishes"
      case "Elétrica":
        return "Electrical"
      case "Hidráulica":
        return "Plumbing"
      default:
        return categoria
    }
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-6">{t.newOrder}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={language === "pt" ? "Buscar produtos..." : "Search products..."}
                className="pl-8"
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
              />
            </div>
          </div>

          <Tabs defaultValue="todos" className="w-full mb-6">
            <TabsList className="mb-4 flex flex-wrap">
              <TabsTrigger value="todos" onClick={() => setCategoriaAtiva(null)}>
                {language === "pt" ? "Todos" : "All"}
              </TabsTrigger>
              {categorias.map((categoria) => (
                <TabsTrigger key={categoria} value={categoria} onClick={() => setCategoriaAtiva(categoria)}>
                  {traduzirCategoria(categoria)}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {produtosFiltrados.map((produto) => (
              <Card key={produto.id} className="overflow-hidden">
                <div className="aspect-square relative">
                  <Image src={produto.imagem || "/placeholder.svg"} alt={produto.nome} fill className="object-cover" />
                </div>
                <CardHeader className="p-4">
                  <CardTitle className="text-lg">{produto.nome}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm text-muted-foreground mb-2">{produto.descricao}</p>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">
                        {language === "pt" ? "Preço" : "Price"}: ${produto.preco.toFixed(2)}/
                        {formatarUnidadeMedida(produto.unidadeMedida)}
                      </p>
                      <p className="text-sm">
                        {language === "pt" ? "Peso" : "Weight"}: {produto.peso}kg
                      </p>
                    </div>
                    <Badge variant="outline">{formatarUnidadeMedida(produto.unidadeMedida)}</Badge>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button className="w-full" onClick={() => adicionarAoCarrinho(produto)}>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    {language === "pt" ? "Adicionar" : "Add"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>{language === "pt" ? "Seu Orçamento" : "Your Quote"}</CardTitle>
            </CardHeader>
            <CardContent>
              {carrinho.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  {language === "pt"
                    ? "Seu orçamento está vazio. Adicione produtos para continuar."
                    : "Your quote is empty. Add products to continue."}
                </p>
              ) : (
                <div className="space-y-4">
                  {carrinho.map((item) => (
                    <div key={item.produto.id} className="border-b pb-4">
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <p className="font-medium">{item.produto.nome}</p>
                          <p className="text-sm text-muted-foreground">
                            ${item.produto.preco.toFixed(2)} x {item.quantidade}{" "}
                            {formatarUnidadeMedida(item.produto.unidadeMedida)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="icon" onClick={() => alterarQuantidade(item.produto.id, -1)}>
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span>{item.quantidade}</span>
                          <Button variant="outline" size="icon" onClick={() => alterarQuantidade(item.produto.id, 1)}>
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="mt-2">
                        <Textarea
                          placeholder={language === "pt" ? "Observações (opcional)" : "Notes (optional)"}
                          value={item.observacao}
                          onChange={(e) => atualizarObservacao(item.produto.id, e.target.value)}
                          className="text-sm"
                          rows={2}
                        />
                      </div>
                    </div>
                  ))}

                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <p className="font-medium">{t.total}:</p>
                      <p className="text-xl font-bold">${totalOrcamento.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={finalizarOrcamento} disabled={carrinho.length === 0}>
                {language === "pt" ? "Finalizar Orçamento" : "Finish Quote"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
