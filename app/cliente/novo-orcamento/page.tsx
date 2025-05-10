"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ShoppingCart, Search, Plus, Minus, Filter, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getLanguage, translations } from "@/lib/i18n"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Tipos para os produtos
type UnidadeMedida = "unidade" | "kit" | "m2" | "metro_linear" | "kg"

interface Produto {
  id: string
  nome: string
  descricao: string
  preco: number
  peso: number
  unidadeMedida: UnidadeMedida
  imagem: string
  categoria: string
  ncm?: string
  estoque?: number
}

// Dados de exemplo - produtos mais realistas para exportação
const categorias = ["Vidros", "Máquinas", "Ferramentas", "Acessórios", "Insumos"]

const produtos: Produto[] = [
  {
    id: "prod-001",
    nome: "Vidro Float Incolor 10mm",
    descricao: "Vidro float incolor 10mm de espessura, qualidade premium",
    preco: 120.5,
    peso: 25.0,
    unidadeMedida: "m2",
    imagem: "/images/produtos/clear-float-glass.png",
    categoria: "Vidros",
    ncm: "7005.29.00",
    estoque: 500,
  },
  {
    id: "prod-002",
    nome: "Máquina de Lapidação Automática",
    descricao: "Máquina de lapidação automática para vidros de até 30mm",
    preco: 45000.0,
    peso: 1200.0,
    unidadeMedida: "unidade",
    imagem: "/images/produtos/glass-edging-machine-9325a.png",
    categoria: "Máquinas",
    ncm: "8464.20.10",
    estoque: 5,
  },
  {
    id: "prod-003",
    nome: "Kit Ferramentas para Vidraceiro",
    descricao: "Kit completo com ventosas, cortadores e medidores",
    preco: 1250.0,
    peso: 15.0,
    unidadeMedida: "kit",
    imagem: "/glass-tools-kit.png",
    categoria: "Ferramentas",
    ncm: "8205.59.00",
    estoque: 30,
  },
  {
    id: "prod-004",
    nome: "Silicone Estrutural 600ml",
    descricao: "Silicone estrutural para fachadas e envidraçamentos",
    preco: 85.9,
    peso: 0.6,
    unidadeMedida: "unidade",
    imagem: "/silicone-estrutural.png",
    categoria: "Insumos",
    ncm: "3214.10.10",
    estoque: 200,
  },
  {
    id: "prod-005",
    nome: "Tubo de Mistura para Waterjet",
    descricao: "Tubo de mistura para máquina de corte waterjet, 635mm",
    preco: 1890.0,
    peso: 2.5,
    unidadeMedida: "unidade",
    imagem: "/images/produtos/tubo-mistura-waterjet-635mm.png",
    categoria: "Acessórios",
    ncm: "8466.93.40",
    estoque: 15,
  },
  {
    id: "prod-006",
    nome: "Vidro Laminado 8mm (4+4)",
    descricao: "Vidro laminado 8mm (4+4) com PVB incolor",
    preco: 180.0,
    peso: 20.0,
    unidadeMedida: "m2",
    imagem: "/laminated-glass.png",
    categoria: "Vidros",
    ncm: "7007.29.00",
    estoque: 300,
  },
  {
    id: "prod-007",
    nome: "Forno de Têmpera 2500x5000mm",
    descricao: "Forno de têmpera para vidros de até 2500x5000mm",
    preco: 350000.0,
    peso: 12000.0,
    unidadeMedida: "unidade",
    imagem: "/glass-tempering-furnace.png",
    categoria: "Máquinas",
    ncm: "8419.89.99",
    estoque: 2,
  },
  {
    id: "prod-008",
    nome: "Abrasivo Garnet 80 Mesh",
    descricao: "Abrasivo Garnet 80 Mesh para corte waterjet",
    preco: 5.2,
    peso: 1.0,
    unidadeMedida: "kg",
    imagem: "/garnet-abrasive.png",
    categoria: "Insumos",
    ncm: "2513.20.90",
    estoque: 5000,
  },
]

interface ItemCarrinho {
  produto: Produto
  quantidade: number
  observacao: string
}

export default function NovoOrcamentoPage() {
  const [language, setLanguage] = useState<"pt" | "en">("pt")
  const [categoriaAtiva, setCategoriaAtiva] = useState<string | null>(null)
  const [termoBusca, setTermoBusca] = useState("")
  const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([])
  const [observacoes, setObservacoes] = useState<Record<string, string>>({})
  const { toast } = useToast()
  const [ordenacao, setOrdenacao] = useState<"nome" | "preco" | "disponibilidade">("nome")
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null)
  const [quantidadeInput, setQuantidadeInput] = useState<Record<string, number>>({})

  useEffect(() => {
    setLanguage(getLanguage())
  }, [])

  const t = translations[language]

  // Filtrar produtos por categoria e termo de busca
  const produtosFiltrados = produtos
    .filter((produto) => {
      const matchCategoria = categoriaAtiva ? produto.categoria === categoriaAtiva : true
      const matchBusca =
        produto.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
        produto.descricao.toLowerCase().includes(termoBusca.toLowerCase()) ||
        (produto.ncm && produto.ncm.includes(termoBusca))
      return matchCategoria && matchBusca
    })
    .sort((a, b) => {
      switch (ordenacao) {
        case "nome":
          return a.nome.localeCompare(b.nome)
        case "preco":
          return a.preco - b.preco
        case "disponibilidade":
          return (b.estoque || 0) - (a.estoque || 0)
        default:
          return 0
      }
    })

  // Adicionar produto ao carrinho
  const adicionarAoCarrinho = (produto: Produto, quantidade = 1) => {
    if (quantidade <= 0) {
      toast({
        title: language === "pt" ? "Quantidade inválida" : "Invalid quantity",
        description:
          language === "pt" ? "A quantidade deve ser maior que zero." : "Quantity must be greater than zero.",
        variant: "destructive",
      })
      return
    }

    setCarrinho((prev) => {
      const itemExistente = prev.find((item) => item.produto.id === produto.id)
      if (itemExistente) {
        return prev.map((item) =>
          item.produto.id === produto.id ? { ...item, quantidade: item.quantidade + quantidade } : item,
        )
      } else {
        return [...prev, { produto, quantidade, observacao: "" }]
      }
    })

    // Limpar o input de quantidade após adicionar
    setQuantidadeInput((prev) => ({
      ...prev,
      [produto.id]: 0,
    }))

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

  // Calcular peso total do orçamento
  const pesoTotalOrcamento = carrinho.reduce((total, item) => {
    return total + item.produto.peso * item.quantidade
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

    // Gerar número de cotação
    const numeroCotacao = `COT-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")}`

    toast({
      title: language === "pt" ? "Orçamento enviado" : "Quote sent",
      description:
        language === "pt"
          ? `Seu orçamento ${numeroCotacao} foi enviado com sucesso e está em análise.`
          : `Your quote ${numeroCotacao} has been successfully sent and is under review.`,
    })

    // Aqui seria implementada a lógica para enviar o orçamento para o backend
    console.log("Orçamento finalizado:", {
      numeroCotacao,
      itens: carrinho,
      total: totalOrcamento,
      pesoTotal: pesoTotalOrcamento,
      data: new Date().toISOString(),
    })

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
      case "kg":
        return "kg"
    }
  }

  // Traduzir categorias
  const traduzirCategoria = (categoria: string) => {
    if (language === "pt") return categoria

    switch (categoria) {
      case "Vidros":
        return "Glass"
      case "Máquinas":
        return "Machines"
      case "Ferramentas":
        return "Tools"
      case "Acessórios":
        return "Accessories"
      case "Insumos":
        return "Supplies"
      default:
        return categoria
    }
  }

  // Manipular mudança de quantidade no input
  const handleQuantidadeChange = (produtoId: string, valor: string) => {
    const quantidade = Number.parseInt(valor)
    if (!isNaN(quantidade)) {
      setQuantidadeInput((prev) => ({
        ...prev,
        [produtoId]: quantidade,
      }))
    }
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-6">{t.newQuote}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="mb-4 flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={
                  language === "pt"
                    ? "Buscar produtos por nome, descrição ou NCM..."
                    : "Search products by name, description or NCM..."
                }
                className="pl-8"
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                className="border rounded p-2 text-sm"
                value={ordenacao}
                onChange={(e) => setOrdenacao(e.target.value as any)}
              >
                <option value="nome">{language === "pt" ? "Nome" : "Name"}</option>
                <option value="preco">{language === "pt" ? "Preço" : "Price"}</option>
                <option value="disponibilidade">{language === "pt" ? "Disponibilidade" : "Availability"}</option>
              </select>
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

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">{language === "pt" ? "Produto" : "Product"}</TableHead>
                  <TableHead className="hidden md:table-cell">{language === "pt" ? "Categoria" : "Category"}</TableHead>
                  <TableHead className="text-right">{language === "pt" ? "Preço" : "Price"}</TableHead>
                  <TableHead className="text-center">{language === "pt" ? "Estoque" : "Stock"}</TableHead>
                  <TableHead className="text-center">{language === "pt" ? "Quantidade" : "Quantity"}</TableHead>
                  <TableHead className="text-right">{language === "pt" ? "Ações" : "Actions"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {produtosFiltrados.map((produto) => (
                  <TableRow key={produto.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 relative rounded overflow-hidden">
                          <Image
                            src={produto.imagem || "/placeholder.svg"}
                            alt={produto.nome}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-medium">{produto.nome}</div>
                          <div className="text-xs text-muted-foreground hidden md:block">
                            {produto.descricao.length > 60
                              ? produto.descricao.substring(0, 60) + "..."
                              : produto.descricao}
                          </div>
                          <div className="text-xs text-muted-foreground">NCM: {produto.ncm}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline">{traduzirCategoria(produto.categoria)}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="font-medium">${produto.preco.toFixed(2)}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatarUnidadeMedida(produto.unidadeMedida)}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={produto.estoque && produto.estoque > 10 ? "outline" : "secondary"}>
                        {produto.estoque} {formatarUnidadeMedida(produto.unidadeMedida)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Input
                        type="number"
                        min="1"
                        className="w-16 text-center mx-auto"
                        value={quantidadeInput[produto.id] || ""}
                        onChange={(e) => handleQuantidadeChange(produto.id, e.target.value)}
                        placeholder="0"
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="icon" onClick={() => setProdutoSelecionado(produto)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                              <DialogTitle>{produto.nome}</DialogTitle>
                              <DialogDescription>
                                {language === "pt" ? "Detalhes do produto" : "Product details"}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                              <div className="relative aspect-square">
                                <Image
                                  src={produto.imagem || "/placeholder.svg"}
                                  alt={produto.nome}
                                  fill
                                  className="object-cover rounded-md"
                                />
                              </div>
                              <div className="space-y-3">
                                <p className="text-sm">{produto.descricao}</p>
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <p className="text-sm font-medium">
                                      {language === "pt" ? "Categoria" : "Category"}
                                    </p>
                                    <p className="text-sm">{traduzirCategoria(produto.categoria)}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">{language === "pt" ? "Preço" : "Price"}</p>
                                    <p className="text-sm">
                                      ${produto.preco.toFixed(2)} / {formatarUnidadeMedida(produto.unidadeMedida)}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">{language === "pt" ? "Peso" : "Weight"}</p>
                                    <p className="text-sm">
                                      {produto.peso}kg / {formatarUnidadeMedida(produto.unidadeMedida)}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">{language === "pt" ? "Estoque" : "Stock"}</p>
                                    <p className="text-sm">
                                      {produto.estoque} {formatarUnidadeMedida(produto.unidadeMedida)}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">NCM</p>
                                    <p className="text-sm">{produto.ncm}</p>
                                  </div>
                                </div>
                                <div className="pt-4 flex gap-2">
                                  <Input
                                    type="number"
                                    min="1"
                                    className="w-20"
                                    value={quantidadeInput[produto.id] || ""}
                                    onChange={(e) => handleQuantidadeChange(produto.id, e.target.value)}
                                    placeholder="1"
                                  />
                                  <Button
                                    onClick={() => {
                                      adicionarAoCarrinho(produto, quantidadeInput[produto.id] || 1)
                                      document
                                        .querySelector<HTMLButtonElement>(
                                          '[data-state="open"] button[aria-label="Close"]',
                                        )
                                        ?.click()
                                    }}
                                  >
                                    <ShoppingCart className="mr-2 h-4 w-4" />
                                    {language === "pt" ? "Adicionar" : "Add"}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button onClick={() => adicionarAoCarrinho(produto, quantidadeInput[produto.id] || 1)}>
                          <ShoppingCart className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {produtosFiltrados.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      {language === "pt"
                        ? "Nenhum produto encontrado. Tente ajustar os filtros."
                        : "No products found. Try adjusting your filters."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
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
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">{item.produto.nome}</p>
                          <p className="text-sm text-muted-foreground">
                            ${item.produto.preco.toFixed(2)} x {item.quantidade}{" "}
                            {formatarUnidadeMedida(item.produto.unidadeMedida)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {language === "pt" ? "Subtotal" : "Subtotal"}: $
                            {(item.produto.preco * item.quantidade).toFixed(2)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {language === "pt" ? "Peso" : "Weight"}: {(item.produto.peso * item.quantidade).toFixed(2)}
                            kg
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
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-medium">{t.total}:</p>
                      <p className="text-xl font-bold">${totalOrcamento.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-muted-foreground">
                        {language === "pt" ? "Peso Total" : "Total Weight"}:
                      </p>
                      <p className="text-sm font-medium">{pesoTotalOrcamento.toFixed(2)}kg</p>
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
