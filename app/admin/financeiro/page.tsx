"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Search,
  Download,
  PieChart,
  BarChart,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import { getTranslations } from "@/lib/i18n"

// Tipos para os dados financeiros
interface TransacaoFinanceira {
  id: string
  data: string
  descricao: string
  categoria: string
  tipo: "receita" | "despesa" | "custo"
  valor: number
  pedidoId?: string
  produtoId?: string
}

interface ResumoFinanceiro {
  receitas: number
  despesas: number
  custos: number
  lucroLiquido: number
  margemLucro: number
}

interface DadosMensais {
  mes: string
  receitas: number
  despesas: number
  custos: number
  lucroLiquido: number
}

// Dados de exemplo
const transacoes: TransacaoFinanceira[] = [
  {
    id: "TRX-001",
    data: "01/05/2025",
    descricao: "Venda - Pedido PED-2025-001",
    categoria: "Vendas",
    tipo: "receita",
    valor: 2340.0,
    pedidoId: "PED-2025-001",
  },
  {
    id: "TRX-002",
    data: "05/05/2025",
    descricao: "Venda - Pedido PED-2025-002",
    categoria: "Vendas",
    tipo: "receita",
    valor: 1870.0,
    pedidoId: "PED-2025-002",
  },
  {
    id: "TRX-003",
    data: "08/05/2025",
    descricao: "Venda - Pedido PED-2025-003",
    categoria: "Vendas",
    tipo: "receita",
    valor: 4500.0,
    pedidoId: "PED-2025-003",
  },
  {
    id: "TRX-004",
    data: "02/05/2025",
    descricao: "Custo - Produtos Pedido PED-2025-001",
    categoria: "Custo de Produtos",
    tipo: "custo",
    valor: 1560.0,
    pedidoId: "PED-2025-001",
  },
  {
    id: "TRX-005",
    data: "06/05/2025",
    descricao: "Custo - Produtos Pedido PED-2025-002",
    categoria: "Custo de Produtos",
    tipo: "custo",
    valor: 1240.0,
    pedidoId: "PED-2025-002",
  },
  {
    id: "TRX-006",
    data: "09/05/2025",
    descricao: "Custo - Produtos Pedido PED-2025-003",
    categoria: "Custo de Produtos",
    tipo: "custo",
    valor: 3200.0,
    pedidoId: "PED-2025-003",
  },
  {
    id: "TRX-007",
    data: "03/05/2025",
    descricao: "Transporte - Pedido PED-2025-001",
    categoria: "Logística",
    tipo: "despesa",
    valor: 120.0,
    pedidoId: "PED-2025-001",
  },
  {
    id: "TRX-008",
    data: "07/05/2025",
    descricao: "Transporte - Pedido PED-2025-002",
    categoria: "Logística",
    tipo: "despesa",
    valor: 95.0,
    pedidoId: "PED-2025-002",
  },
  {
    id: "TRX-009",
    data: "10/05/2025",
    descricao: "Transporte - Pedido PED-2025-003",
    categoria: "Logística",
    tipo: "despesa",
    valor: 180.0,
    pedidoId: "PED-2025-003",
  },
  {
    id: "TRX-010",
    data: "15/05/2025",
    descricao: "Salários - Maio 2025",
    categoria: "Folha de Pagamento",
    tipo: "despesa",
    valor: 3500.0,
  },
  {
    id: "TRX-011",
    data: "16/05/2025",
    descricao: "Aluguel - Maio 2025",
    categoria: "Instalações",
    tipo: "despesa",
    valor: 1200.0,
  },
  {
    id: "TRX-012",
    data: "17/05/2025",
    descricao: "Serviços Públicos - Maio 2025",
    categoria: "Instalações",
    tipo: "despesa",
    valor: 450.0,
  },
]

// Dados mensais para o gráfico
const dadosMensais: DadosMensais[] = [
  { mes: "Jan", receitas: 12500, despesas: 4200, custos: 7500, lucroLiquido: 800 },
  { mes: "Fev", receitas: 13200, despesas: 4300, custos: 7800, lucroLiquido: 1100 },
  { mes: "Mar", receitas: 14500, despesas: 4500, custos: 8200, lucroLiquido: 1800 },
  { mes: "Abr", receitas: 15800, despesas: 4600, custos: 9000, lucroLiquido: 2200 },
  { mes: "Mai", receitas: 8710, despesas: 5545, custos: 6000, lucroLiquido: -2835 },
]

export default function FinanceiroPage() {
  const [termoBusca, setTermoBusca] = useState("")
  const [periodoSelecionado, setPeriodoSelecionado] = useState("maio-2025")
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("todas")
  const [t, setT] = useState(getTranslations())

  // Atualizar traduções quando o componente montar
  useEffect(() => {
    setT(getTranslations())

    // Adicionar listener para mudanças de idioma
    const handleStorageChange = () => {
      setT(getTranslations())
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  // Tradução de categorias
  const traduzirCategoria = (categoria: string) => {
    const traducoes: Record<string, string> = {
      Vendas: t.sales || "Sales",
      "Custo de Produtos": t.productCosts || "Product Costs",
      Logística: t.logistics || "Logistics",
      "Folha de Pagamento": t.payroll || "Payroll",
      Instalações: t.facilities || "Facilities",
    }
    return traducoes[categoria] || categoria
  }

  // Tradução de tipos de transação
  const traduzirTipoTransacao = (tipo: "receita" | "despesa" | "custo") => {
    if (tipo === "receita") return t.income || "Income"
    if (tipo === "despesa") return t.expense || "Expense"
    return t.cost || "Cost"
  }

  // Calcular resumo financeiro
  const calcularResumoFinanceiro = (): ResumoFinanceiro => {
    const receitas = transacoes.filter((t) => t.tipo === "receita").reduce((sum, t) => sum + t.valor, 0)

    const despesas = transacoes.filter((t) => t.tipo === "despesa").reduce((sum, t) => sum + t.valor, 0)

    const custos = transacoes.filter((t) => t.tipo === "custo").reduce((sum, t) => sum + t.valor, 0)

    const lucroLiquido = receitas - despesas - custos
    const margemLucro = receitas > 0 ? (lucroLiquido / receitas) * 100 : 0

    return {
      receitas,
      despesas,
      custos,
      lucroLiquido,
      margemLucro,
    }
  }

  const resumo = calcularResumoFinanceiro()

  // Filtrar transações
  const transacoesFiltradas = transacoes.filter((transacao) => {
    const termoBuscaMatch =
      transacao.descricao.toLowerCase().includes(termoBusca.toLowerCase()) ||
      transacao.id.toLowerCase().includes(termoBusca.toLowerCase()) ||
      (transacao.pedidoId && transacao.pedidoId.toLowerCase().includes(termoBusca.toLowerCase()))

    const categoriaMatch = categoriaSelecionada === "todas" || transacao.categoria === categoriaSelecionada

    return termoBuscaMatch && categoriaMatch
  })

  // Calcular totais por categoria
  const calcularTotaisPorCategoria = () => {
    const categorias: Record<string, { receitas: number; despesas: number; custos: number }> = {}

    transacoes.forEach((t) => {
      if (!categorias[t.categoria]) {
        categorias[t.categoria] = { receitas: 0, despesas: 0, custos: 0 }
      }

      if (t.tipo === "receita") categorias[t.categoria].receitas += t.valor
      else if (t.tipo === "despesa") categorias[t.categoria].despesas += t.valor
      else if (t.tipo === "custo") categorias[t.categoria].custos += t.valor
    })

    return Object.entries(categorias).map(([categoria, valores]) => ({
      categoria,
      ...valores,
      total: valores.receitas - valores.despesas - valores.custos,
    }))
  }

  const totaisPorCategoria = calcularTotaisPorCategoria()

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t.financialBalance || "Financial Balance"}</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            {t.exportReport || "Export Report"}
          </Button>
        </div>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.income || "Income"}</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${resumo.receitas.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
              +12.5% {t.comparedToPreviousMonth || "compared to previous month"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.productCosts || "Product Costs"}</CardTitle>
            <TrendingDown className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${resumo.custos.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <ArrowUpRight className="mr-1 h-4 w-4 text-amber-500" />
              +8.3% {t.comparedToPreviousMonth || "compared to previous month"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.expenses || "Expenses"}</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${resumo.despesas.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <ArrowUpRight className="mr-1 h-4 w-4 text-red-500" />
              +5.2% {t.comparedToPreviousMonth || "compared to previous month"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.netProfit || "Net Profit"}</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${resumo.lucroLiquido.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              {resumo.lucroLiquido > 0 ? (
                <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
              ) : (
                <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
              )}
              {resumo.lucroLiquido > 0 ? "+" : ""}
              {((resumo.lucroLiquido / 8710) * 100).toFixed(1)}%{" "}
              {t.comparedToPreviousMonth || "compared to previous month"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.profitMargin || "Profit Margin"}</CardTitle>
            <PieChart className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resumo.margemLucro.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground flex items-center">
              {resumo.margemLucro > 15 ? (
                <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
              ) : (
                <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
              )}
              {resumo.margemLucro > 15 ? "+" : ""}
              {(resumo.margemLucro - 15).toFixed(1)}% {t.comparedToTarget || "compared to target"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="visao-geral" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="visao-geral">{t.overview || "Overview"}</TabsTrigger>
          <TabsTrigger value="transacoes">{t.transactions || "Transactions"}</TabsTrigger>
          <TabsTrigger value="categorias">{t.categoryAnalysis || "Category Analysis"}</TabsTrigger>
          <TabsTrigger value="produtos">{t.productAnalysis || "Product Analysis"}</TabsTrigger>
        </TabsList>

        <TabsContent value="visao-geral">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t.monthlyPerformance || "Monthly Performance"}</CardTitle>
                <CardDescription>
                  {t.revenueAndProfitComparison || "Revenue, costs and net profit comparison"}
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[350px] flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <BarChart className="h-16 w-16 mx-auto mb-2" />
                  <p>{t.monthlyPerformanceChart || "Bar chart showing monthly performance"}</p>
                  <p className="text-sm">
                    {t.monthlyMetricsDescription || "Revenue, costs, expenses and net profit by month"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t.expenseDistribution || "Expense Distribution"}</CardTitle>
                <CardDescription>{t.expenseAnalysisByCategory || "Expense analysis by category"}</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px] flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <PieChart className="h-16 w-16 mx-auto mb-2" />
                  <p>{t.expenseDistributionChart || "Pie chart showing expense distribution"}</p>
                  <p className="text-sm">
                    {t.expensePercentageDescription || "Percentage of each category in total expenses"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>{t.profitTrend || "Profit Trend"}</CardTitle>
                <CardDescription>
                  {t.netProfitEvolution || "Net profit evolution over the last 5 months"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t.month || "Month"}</TableHead>
                      <TableHead>{t.income || "Income"}</TableHead>
                      <TableHead>{t.cost || "Costs"}</TableHead>
                      <TableHead>{t.expenses || "Expenses"}</TableHead>
                      <TableHead>{t.netProfit || "Net Profit"}</TableHead>
                      <TableHead>{t.variation || "Variation"}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dadosMensais.map((mes, index) => (
                      <TableRow key={mes.mes}>
                        <TableCell className="font-medium">{mes.mes}/2025</TableCell>
                        <TableCell>${mes.receitas.toFixed(2)}</TableCell>
                        <TableCell>${mes.custos.toFixed(2)}</TableCell>
                        <TableCell>${mes.despesas.toFixed(2)}</TableCell>
                        <TableCell className={mes.lucroLiquido >= 0 ? "text-green-600" : "text-red-600"}>
                          ${mes.lucroLiquido.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          {index > 0 ? (
                            <div className="flex items-center">
                              {mes.lucroLiquido > dadosMensais[index - 1].lucroLiquido ? (
                                <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
                              ) : (
                                <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
                              )}
                              {(
                                ((mes.lucroLiquido - dadosMensais[index - 1].lucroLiquido) /
                                  Math.abs(dadosMensais[index - 1].lucroLiquido)) *
                                100
                              ).toFixed(1)}
                              %
                            </div>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transacoes">
          <Card>
            <CardHeader>
              <CardTitle>{t.financialTransactions || "Financial Transactions"}</CardTitle>
              <CardDescription>
                {t.allTransactionsForPeriod || "All transactions for the selected period"}
              </CardDescription>
              <div className="mt-4 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder={t.searchTransactions || "Search transactions..."}
                    className="pl-8"
                    value={termoBusca}
                    onChange={(e) => setTermoBusca(e.target.value)}
                  />
                </div>
                <Select value={categoriaSelecionada} onValueChange={setCategoriaSelecionada}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={t.category || "Category"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">{t.allCategories || "All Categories"}</SelectItem>
                    <SelectItem value="Vendas">{t.sales || "Sales"}</SelectItem>
                    <SelectItem value="Custo de Produtos">{t.productCosts || "Product Costs"}</SelectItem>
                    <SelectItem value="Logística">{t.logistics || "Logistics"}</SelectItem>
                    <SelectItem value="Folha de Pagamento">{t.payroll || "Payroll"}</SelectItem>
                    <SelectItem value="Instalações">{t.facilities || "Facilities"}</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="maio-2025">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={t.period || "Period"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="maio-2025">{t.may || "May"} 2025</SelectItem>
                    <SelectItem value="abril-2025">{t.april || "April"} 2025</SelectItem>
                    <SelectItem value="marco-2025">{t.march || "March"} 2025</SelectItem>
                    <SelectItem value="fevereiro-2025">{t.february || "February"} 2025</SelectItem>
                    <SelectItem value="janeiro-2025">{t.january || "January"} 2025</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>{t.date || "Date"}</TableHead>
                    <TableHead>{t.description || "Description"}</TableHead>
                    <TableHead>{t.category || "Category"}</TableHead>
                    <TableHead>{t.type || "Type"}</TableHead>
                    <TableHead>{t.amount || "Amount"}</TableHead>
                    <TableHead>{t.order || "Order"}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transacoesFiltradas.map((transacao) => (
                    <TableRow key={transacao.id}>
                      <TableCell className="font-medium">{transacao.id}</TableCell>
                      <TableCell>{transacao.data}</TableCell>
                      <TableCell>{transacao.descricao}</TableCell>
                      <TableCell>{traduzirCategoria(transacao.categoria)}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            transacao.tipo === "receita"
                              ? "bg-green-100 text-green-800"
                              : transacao.tipo === "despesa"
                                ? "bg-red-100 text-red-800"
                                : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {traduzirTipoTransacao(transacao.tipo)}
                        </span>
                      </TableCell>
                      <TableCell className={transacao.tipo === "receita" ? "text-green-600" : "text-red-600"}>
                        {transacao.tipo === "receita" ? "+" : "-"}${transacao.valor.toFixed(2)}
                      </TableCell>
                      <TableCell>{transacao.pedidoId || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categorias">
          <Card>
            <CardHeader>
              <CardTitle>{t.categoryAnalysis || "Category Analysis"}</CardTitle>
              <CardDescription>
                {t.financialPerformanceByCategory || "Financial performance by category"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t.category || "Category"}</TableHead>
                    <TableHead>{t.income || "Income"}</TableHead>
                    <TableHead>{t.cost || "Costs"}</TableHead>
                    <TableHead>{t.expenses || "Expenses"}</TableHead>
                    <TableHead>{t.total || "Total"}</TableHead>
                    <TableHead>% {t.ofTotal || "of Total"}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {totaisPorCategoria.map((categoria) => (
                    <TableRow key={categoria.categoria}>
                      <TableCell className="font-medium">{traduzirCategoria(categoria.categoria)}</TableCell>
                      <TableCell className="text-green-600">
                        {categoria.receitas > 0 ? `$${categoria.receitas.toFixed(2)}` : "-"}
                      </TableCell>
                      <TableCell className="text-amber-600">
                        {categoria.custos > 0 ? `$${categoria.custos.toFixed(2)}` : "-"}
                      </TableCell>
                      <TableCell className="text-red-600">
                        {categoria.despesas > 0 ? `$${categoria.despesas.toFixed(2)}` : "-"}
                      </TableCell>
                      <TableCell className={categoria.total >= 0 ? "text-green-600" : "text-red-600"}>
                        ${categoria.total.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        {(
                          (Math.abs(categoria.total) / (resumo.receitas + resumo.despesas + resumo.custos)) *
                          100
                        ).toFixed(1)}
                        %
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="produtos">
          <Card>
            <CardHeader>
              <CardTitle>{t.productAnalysis || "Product Analysis"}</CardTitle>
              <CardDescription>{t.financialPerformanceByProduct || "Financial performance by product"}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-16 w-16 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  {t.productAnalysisInDevelopment || "Product Analysis in Development"}
                </h3>
                <p>
                  {t.productAnalysisComingSoon ||
                    "This feature will be implemented soon, allowing detailed analysis of profit margin by product, acquisition costs, additional costs and selling price."}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
