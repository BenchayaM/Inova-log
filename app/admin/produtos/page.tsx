"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Search, Plus, Edit, Trash2, Eye, Filter } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getTranslations } from "@/lib/i18n"

// Tipos para os produtos
type UnidadeMedida = "unidade" | "kit" | "m2" | "metro_linear" | "container" | "meio_container"
type Espessura = "2mm" | "3mm" | "4mm" | "5mm" | "6mm" | "8mm" | "10mm" | "12mm" | "15mm" | "19mm"

interface Produto {
  id: string
  nome: string
  descricao: string
  preco: number
  custoAquisicao: number
  custoAdicional: number
  peso: number
  unidadeMedida: UnidadeMedida
  imagem: string
  categoria: string
  estoque: number
  grupo?: string
  subgrupo?: string
  espessura?: Espessura
  ncm?: string // Adicionado campo NCM
}

// Dados dos produtos solicitados
const produtos: Produto[] = [
  {
    id: "VID-001",
    nome: "Clear Float Glass",
    descricao:
      "Vidro float transparente para uso em janelas, portas e divisórias. Alta transparência e qualidade superior.",
    preco: 2500.0,
    custoAquisicao: 1800.0,
    custoAdicional: 200.0,
    peso: 25000,
    unidadeMedida: "container",
    imagem: "/images/produtos/clear-float-glass.png",
    categoria: "Vidros",
    estoque: 5,
    grupo: "Matéria Prima",
    subgrupo: "Vidro Comum",
    espessura: "4mm",
    ncm: "7005.29.00", // NCM para vidro float
  },
  {
    id: "MAQ-001",
    nome: "Glass Edging Machine 9325A",
    descricao: "Máquina de lapidação e biselamento de bordas de vidro. Alta precisão e velocidade de processamento.",
    preco: 45000.0,
    custoAquisicao: 32000.0,
    custoAdicional: 3000.0,
    peso: 2800,
    unidadeMedida: "unidade",
    imagem: "/images/produtos/glass-edging-machine-9325a.png",
    categoria: "Equipamentos",
    estoque: 2,
    grupo: "Máquinas",
    subgrupo: "Processamento Vidros",
    ncm: "8464.20.90", // NCM para máquinas de trabalhar vidro
  },
  {
    id: "INS-001",
    nome: "Tubo de Mistura Waterjet 6.35mm",
    descricao: "Tubo de mistura para máquinas de corte a jato d'água. Alta durabilidade e precisão no corte.",
    preco: 120.0,
    custoAquisicao: 75.0,
    custoAdicional: 10.0,
    peso: 0.05,
    unidadeMedida: "unidade",
    imagem: "/images/produtos/tubo-mistura-waterjet-635mm.png",
    categoria: "Peças",
    estoque: 150,
    grupo: "Insumos",
    subgrupo: "Waterjet",
    ncm: "8466.93.40", // NCM para partes de máquinas
  },
]

// Categorias disponíveis
const categorias = ["Vidros", "Equipamentos", "Peças", "Ferramentas"]

// Grupos e subgrupos disponíveis
const grupos = [
  { nome: "Matéria Prima", subgrupos: ["Vidro Comum", "Vidro Temperado", "Vidro Laminado"] },
  { nome: "Máquinas", subgrupos: ["Processamento Vidros", "Corte", "Furação"] },
  { nome: "Insumos", subgrupos: ["Waterjet", "Abrasivos", "Lubrificantes"] },
]

// Lista de todos os grupos para o filtro
const todosGrupos = grupos.map((g) => g.nome)

// Espessuras disponíveis para vidros
const espessuras: Espessura[] = ["2mm", "3mm", "4mm", "5mm", "6mm", "8mm", "10mm", "12mm", "15mm", "19mm"]

// Valor especial para "Todos os grupos"
const TODOS_GRUPOS = "todos"

export default function ProdutosPage() {
  const [termoBusca, setTermoBusca] = useState("")
  const [grupoFiltro, setGrupoFiltro] = useState<string>(TODOS_GRUPOS)
  const [novoProduto, setNovoProduto] = useState<Partial<Produto>>({
    nome: "",
    descricao: "",
    preco: 0,
    custoAquisicao: 0,
    custoAdicional: 0,
    peso: 0,
    unidadeMedida: "unidade",
    categoria: "",
    estoque: 0,
    grupo: "",
    subgrupo: "",
  })
  const [dialogAberto, setDialogAberto] = useState(false)
  const [subgruposDisponiveis, setSubgruposDisponiveis] = useState<string[]>([])
  const [mostrarEspessura, setMostrarEspessura] = useState(false)
  const { toast } = useToast()
  const [t, setT] = useState(getTranslations())

  // Atualizar traduções quando o idioma mudar
  useEffect(() => {
    const handleLanguageChange = () => {
      setT(getTranslations())
    }

    // Adicionar listener para mudanças no localStorage
    window.addEventListener("storage", handleLanguageChange)

    // Limpar listener
    return () => {
      window.removeEventListener("storage", handleLanguageChange)
    }
  }, [])

  // Filtrar produtos pelo termo de busca e grupo selecionado
  const produtosFiltrados = produtos.filter((produto) => {
    const termo = termoBusca.toLowerCase()
    const filtroTexto =
      produto.nome.toLowerCase().includes(termo) ||
      produto.descricao.toLowerCase().includes(termo) ||
      produto.id.toLowerCase().includes(termo) ||
      produto.categoria.toLowerCase().includes(termo) ||
      (produto.grupo && produto.grupo.toLowerCase().includes(termo)) ||
      (produto.subgrupo && produto.subgrupo.toLowerCase().includes(termo))

    // Se o filtro é "todos", retorna apenas o filtro de texto
    if (grupoFiltro === TODOS_GRUPOS) return filtroTexto

    // Se há filtro de grupo, verifica se o produto pertence ao grupo selecionado
    return filtroTexto && produto.grupo === grupoFiltro
  })

  // Manipular mudanças no formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNovoProduto((prev) => ({ ...prev, [name]: value }))
  }

  // Manipular mudanças em campos numéricos
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNovoProduto((prev) => ({ ...prev, [name]: Number.parseFloat(value) || 0 }))
  }

  // Manipular mudança de grupo
  const handleGrupoChange = (grupo: string) => {
    const grupoSelecionado = grupos.find((g) => g.nome === grupo)
    setSubgruposDisponiveis(grupoSelecionado?.subgrupos || [])

    // Verificar se é o grupo de Matéria Prima para mostrar opção de espessura
    setMostrarEspessura(grupo === "Matéria Prima")

    setNovoProduto((prev) => ({
      ...prev,
      grupo,
      subgrupo: "", // Resetar subgrupo quando o grupo muda
      // Resetar espessura se não for Matéria Prima
      ...(grupo !== "Matéria Prima" && { espessura: undefined }),
      // Definir unidade de medida para container se for Vidro Comum
      ...(grupo === "Matéria Prima" && { unidadeMedida: "container" }),
    }))
  }

  // Manipular mudança de subgrupo
  const handleSubgrupoChange = (subgrupo: string) => {
    setNovoProduto((prev) => ({
      ...prev,
      subgrupo,
      // Definir unidade de medida para container se for Vidro Comum
      ...(subgrupo === "Vidro Comum" && { unidadeMedida: "container" }),
    }))
  }

  // Limpar todos os filtros
  const limparFiltros = () => {
    setTermoBusca("")
    setGrupoFiltro(TODOS_GRUPOS)
  }

  // Adicionar novo produto
  const adicionarProduto = () => {
    // Aqui seria implementada a lógica para adicionar o produto ao backend
    toast({
      title: t.productAdded,
      description: `${novoProduto.nome} ${t.wasAddedSuccessfully}`,
    })

    // Resetar formulário e fechar diálogo
    setNovoProduto({
      nome: "",
      descricao: "",
      preco: 0,
      custoAquisicao: 0,
      custoAdicional: 0,
      peso: 0,
      unidadeMedida: "unidade",
      categoria: "",
      estoque: 0,
      grupo: "",
      subgrupo: "",
    })
    setDialogAberto(false)
  }

  const formatarUnidadeMedida = (unidade: UnidadeMedida) => {
    switch (unidade) {
      case "unidade":
        return t.unit
      case "kit":
        return t.kit
      case "m2":
        return t.squareMeter
      case "metro_linear":
        return t.linearMeter
      case "container":
        return "Container"
      case "meio_container":
        return "Meio Container"
    }
  }

  // Calcular margem de lucro
  const calcularMargemLucro = (produto: Produto) => {
    const custoTotal = produto.custoAquisicao + produto.custoAdicional
    return custoTotal > 0 ? ((produto.preco - custoTotal) / produto.preco) * 100 : 0
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t.productManagement}</h1>

        <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {t.newProduct}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{t.addNewProduct}</DialogTitle>
              <DialogDescription>{t.fillProductData}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="nome">{t.productName}</Label>
                <Input
                  id="nome"
                  name="nome"
                  value={novoProduto.nome}
                  onChange={handleChange}
                  placeholder={t.productNamePlaceholder}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="descricao">{t.description}</Label>
                <Textarea
                  id="descricao"
                  name="descricao"
                  value={novoProduto.descricao}
                  onChange={handleChange}
                  placeholder={t.productDescriptionPlaceholder}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="preco">{t.sellingPrice} (USD)</Label>
                  <Input
                    id="preco"
                    name="preco"
                    type="number"
                    step="0.01"
                    value={novoProduto.preco}
                    onChange={handleNumberChange}
                    placeholder="0.00"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="custoAquisicao">{t.acquisitionCost} (USD)</Label>
                  <Input
                    id="custoAquisicao"
                    name="custoAquisicao"
                    type="number"
                    step="0.01"
                    value={novoProduto.custoAquisicao}
                    onChange={handleNumberChange}
                    placeholder="0.00"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="custoAdicional">{t.additionalCosts} (USD)</Label>
                  <Input
                    id="custoAdicional"
                    name="custoAdicional"
                    type="number"
                    step="0.01"
                    value={novoProduto.custoAdicional}
                    onChange={handleNumberChange}
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="peso">{t.weight} (kg)</Label>
                  <Input
                    id="peso"
                    name="peso"
                    type="number"
                    step="0.1"
                    value={novoProduto.peso}
                    onChange={handleNumberChange}
                    placeholder="0.0"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="unidadeMedida">{t.measurementUnit}</Label>
                  <Select
                    value={novoProduto.unidadeMedida}
                    onValueChange={(value) =>
                      setNovoProduto((prev) => ({ ...prev, unidadeMedida: value as UnidadeMedida }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t.select} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unidade">{t.unit}</SelectItem>
                      <SelectItem value="kit">{t.kit}</SelectItem>
                      <SelectItem value="m2">{t.squareMeter}</SelectItem>
                      <SelectItem value="metro_linear">{t.linearMeter}</SelectItem>
                      {novoProduto.subgrupo === "Vidro Comum" && (
                        <>
                          <SelectItem value="container">Container</SelectItem>
                          <SelectItem value="meio_container">Meio Container</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="categoria">{t.category}</Label>
                  <Select
                    value={novoProduto.categoria}
                    onValueChange={(value) => setNovoProduto((prev) => ({ ...prev, categoria: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t.select} />
                    </SelectTrigger>
                    <SelectContent>
                      {categorias.map((categoria) => (
                        <SelectItem key={categoria} value={categoria}>
                          {categoria}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="grupo">{t.group}</Label>
                  <Select value={novoProduto.grupo} onValueChange={handleGrupoChange}>
                    <SelectTrigger>
                      <SelectValue placeholder={t.select} />
                    </SelectTrigger>
                    <SelectContent>
                      {grupos.map((grupo) => (
                        <SelectItem key={grupo.nome} value={grupo.nome}>
                          {grupo.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="subgrupo">{t.subgroup}</Label>
                  <Select
                    value={novoProduto.subgrupo}
                    onValueChange={handleSubgrupoChange}
                    disabled={!novoProduto.grupo}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={novoProduto.grupo ? t.select : t.selectGroupFirst} />
                    </SelectTrigger>
                    <SelectContent>
                      {subgruposDisponiveis.map((subgrupo) => (
                        <SelectItem key={subgrupo} value={subgrupo}>
                          {subgrupo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Campo de espessura para vidros */}
              {mostrarEspessura && novoProduto.subgrupo === "Vidro Comum" && (
                <div className="grid gap-2">
                  <Label htmlFor="espessura">Espessura</Label>
                  <Select
                    value={novoProduto.espessura}
                    onValueChange={(value) => setNovoProduto((prev) => ({ ...prev, espessura: value as Espessura }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a espessura" />
                    </SelectTrigger>
                    <SelectContent>
                      {espessuras.map((espessura) => (
                        <SelectItem key={espessura} value={espessura}>
                          {espessura}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* No formulário de adição/edição de produto, adicionar campo para NCM
              Dentro do grid de campos do formulário, adicionar: */}
              <div className="grid gap-2">
                <Label htmlFor="ncm">Código NCM</Label>
                <Input
                  id="ncm"
                  name="ncm"
                  value={novoProduto.ncm || ""}
                  onChange={handleChange}
                  placeholder="Ex: 7005.29.00"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="estoque">{t.initialStock}</Label>
                <Input
                  id="estoque"
                  name="estoque"
                  type="number"
                  value={novoProduto.estoque}
                  onChange={handleNumberChange}
                  placeholder="0"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="imagem">{t.productImage}</Label>
                <Input id="imagem" name="imagem" type="file" accept="image/*" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogAberto(false)}>
                {t.cancel}
              </Button>
              <Button onClick={adicionarProduto}>{t.addProduct}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t.products}</CardTitle>
          <CardDescription>{t.manageAllProducts}</CardDescription>

          {/* Área de filtros */}
          <div className="mt-4 space-y-4">
            {/* Filtro por texto */}
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t.searchProducts}
                className="pl-8"
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
              />
            </div>

            {/* Filtros adicionais */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="filtroGrupo" className="mb-2 block">
                  <Filter className="h-4 w-4 inline mr-2" />
                  Filtrar por Grupo
                </Label>
                <Select value={grupoFiltro} onValueChange={setGrupoFiltro}>
                  <SelectTrigger id="filtroGrupo">
                    <SelectValue placeholder="Todos os grupos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={TODOS_GRUPOS}>Todos os grupos</SelectItem>
                    {todosGrupos.map((grupo) => (
                      <SelectItem key={grupo} value={grupo}>
                        {grupo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Botão para limpar filtros */}
              <div className="flex items-end">
                <Button variant="outline" onClick={limparFiltros} className="w-full sm:w-auto">
                  Limpar Filtros
                </Button>
              </div>
            </div>

            {/* Indicadores de filtros ativos */}
            {(grupoFiltro !== TODOS_GRUPOS || termoBusca) && (
              <div className="flex flex-wrap gap-2 mt-2">
                {grupoFiltro !== TODOS_GRUPOS && (
                  <div className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm flex items-center">
                    Grupo: {grupoFiltro}
                    <button className="ml-2 hover:text-primary/70" onClick={() => setGrupoFiltro(TODOS_GRUPOS)}>
                      ×
                    </button>
                  </div>
                )}
                {termoBusca && (
                  <div className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm flex items-center">
                    Busca: {termoBusca}
                    <button className="ml-2 hover:text-primary/70" onClick={() => setTermoBusca("")}>
                      ×
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">{t.image}</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>{t.name}</TableHead>
                <TableHead className="hidden md:table-cell">{t.category}</TableHead>
                <TableHead className="hidden lg:table-cell">{t.groupSubgroup}</TableHead>
                {/* Na tabela de produtos, adicionar coluna para NCM
                Dentro do TableHeader, adicionar: */}
                <TableHead className="hidden md:table-cell">NCM</TableHead>
                <TableHead>{t.price}</TableHead>
                <TableHead>{t.cost}</TableHead>
                <TableHead>{t.margin}</TableHead>
                <TableHead className="hidden lg:table-cell">{t.unit}</TableHead>
                <TableHead>{t.stock}</TableHead>
                <TableHead>{t.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {produtosFiltrados.length > 0 ? (
                produtosFiltrados.map((produto) => (
                  <TableRow key={produto.id}>
                    <TableCell>
                      <Image
                        src={produto.imagem || "/placeholder.svg"}
                        alt={produto.nome}
                        width={40}
                        height={40}
                        className="rounded-md object-cover"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{produto.id}</TableCell>
                    <TableCell>
                      {produto.nome}
                      {produto.espessura && <span className="ml-2 text-xs text-gray-500">({produto.espessura})</span>}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{produto.categoria}</TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {produto.grupo && produto.subgrupo
                        ? `${produto.grupo} / ${produto.subgrupo}`
                        : produto.grupo || "-"}
                    </TableCell>
                    {/* E dentro do mapeamento de produtos: */}
                    <TableCell className="hidden md:table-cell">{produto.ncm || "-"}</TableCell>
                    <TableCell>${produto.preco.toFixed(2)}</TableCell>
                    <TableCell>${(produto.custoAquisicao + produto.custoAdicional).toFixed(2)}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          calcularMargemLucro(produto) >= 30
                            ? "bg-green-100 text-green-800"
                            : calcularMargemLucro(produto) >= 15
                              ? "bg-amber-100 text-amber-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {calcularMargemLucro(produto).toFixed(1)}%
                      </span>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {formatarUnidadeMedida(produto.unidadeMedida)}
                    </TableCell>
                    <TableCell>{produto.estoque}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon" title={t.view}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" title={t.edit}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" title={t.delete}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={11} className="h-24 text-center">
                    {t.noProductsFound}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
