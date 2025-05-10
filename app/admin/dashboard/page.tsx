"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Users, Package, DollarSign, ShoppingCart } from "lucide-react"
import { getLanguage, translations } from "@/lib/i18n"
import {
  PushNotificationButton,
  requestNotificationPermission,
  sendPushNotification,
} from "@/components/push-notification"

export default function AdminDashboard() {
  const [notificacoes] = useState(5)
  const [language, setLanguage] = useState<"pt" | "en">("pt")

  useEffect(() => {
    setLanguage(getLanguage())

    // Solicitar permissão para notificações quando a página carregar
    requestNotificationPermission()

    // Exemplo de notificação após 3 segundos
    const timer = setTimeout(() => {
      sendPushNotification({
        title: language === "pt" ? "Bem-vindo ao Painel Admin" : "Welcome to Admin Panel",
        body:
          language === "pt" ? "Você tem 2 orçamentos aguardando análise." : "You have 2 quotes waiting for analysis.",
      })
    }, 3000)

    return () => clearTimeout(timer)
  }, [language])

  const t = translations[language]

  // Dados de exemplo
  const orcamentosRecentes = [
    {
      id: "ORC-2025-001",
      cliente: "Cliente 001",
      data: "10/05/2025",
      valor: 1250.0,
      status: language === "pt" ? "Aguardando análise" : "Waiting analysis",
    },
    {
      id: "ORC-2025-002",
      cliente: "Cliente 002",
      data: "15/05/2025",
      valor: 3450.0,
      status: language === "pt" ? "Em análise" : "In analysis",
    },
  ]

  const pedidosRecentes = [
    {
      id: "PED-2025-001",
      cliente: "Cliente 001",
      data: "01/05/2025",
      valor: 2340.0,
      status: language === "pt" ? "Finalizado" : "Finished",
      pago: true,
    },
    {
      id: "PED-2025-002",
      cliente: "Cliente 002",
      data: "05/05/2025",
      valor: 1870.0,
      status: language === "pt" ? "Em produção" : "In production",
      pago: true,
    },
    {
      id: "PED-2025-003",
      cliente: "Cliente 003",
      data: "08/05/2025",
      valor: 4500.0,
      status: language === "pt" ? "Aguardando autorização" : "Waiting authorization",
      pago: false,
    },
  ]

  // Função para testar notificação push
  const testPushNotification = () => {
    sendPushNotification({
      title: language === "pt" ? "Novo orçamento recebido" : "New quote received",
      body: language === "pt" ? "Cliente 002 enviou um novo orçamento." : "Client 002 sent a new quote.",
      onClick: () => {
        window.location.href = "/admin/orcamentos"
      },
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t.dashboard}</h1>
        <PushNotificationButton />
      </div>

      <Button onClick={testPushNotification} variant="outline">
        {language === "pt" ? "Testar Notificação" : "Test Notification"}
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.revenue}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">
              {language === "pt" ? "+20.1% em relação ao mês anterior" : "+20.1% from last month"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.orders}</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12</div>
            <p className="text-xs text-muted-foreground">
              {language === "pt" ? "+12.2% em relação ao mês anterior" : "+12.2% from last month"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.clients}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground">
              {language === "pt" ? "+6.1% em relação ao mês anterior" : "+6.1% from last month"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.activeProducts}</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">152</div>
            <p className="text-xs text-muted-foreground">
              {language === "pt" ? "+12 novos produtos este mês" : "+12 new products this month"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="orcamentos" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="orcamentos">{t.recentQuotes}</TabsTrigger>
          <TabsTrigger value="pedidos">{t.recentOrders}</TabsTrigger>
        </TabsList>

        <TabsContent value="orcamentos">
          <Card>
            <CardHeader>
              <CardTitle>{t.recentQuotes}</CardTitle>
              <CardDescription>{t.needAttention}</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>{language === "pt" ? "Cliente" : "Client"}</TableHead>
                    <TableHead>{t.date}</TableHead>
                    <TableHead>{language === "pt" ? "Valor" : "Value"}</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>{t.actions}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orcamentosRecentes.map((orcamento) => (
                    <TableRow key={orcamento.id}>
                      <TableCell className="font-medium">{orcamento.id}</TableCell>
                      <TableCell>{orcamento.cliente}</TableCell>
                      <TableCell>{orcamento.data}</TableCell>
                      <TableCell>${orcamento.valor.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{orcamento.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button size="sm">{language === "pt" ? "Analisar" : "Analyze"}</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pedidos">
          <Card>
            <CardHeader>
              <CardTitle>{t.recentOrders}</CardTitle>
              <CardDescription>{t.latestOrders}</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>{language === "pt" ? "Cliente" : "Client"}</TableHead>
                    <TableHead>{t.date}</TableHead>
                    <TableHead>{language === "pt" ? "Valor" : "Value"}</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>{language === "pt" ? "Pagamento" : "Payment"}</TableHead>
                    <TableHead>{t.actions}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pedidosRecentes.map((pedido) => (
                    <TableRow key={pedido.id}>
                      <TableCell className="font-medium">{pedido.id}</TableCell>
                      <TableCell>{pedido.cliente}</TableCell>
                      <TableCell>{pedido.data}</TableCell>
                      <TableCell>${pedido.valor.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{pedido.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={pedido.pago ? "success" : "destructive"}>
                          {pedido.pago ? t.status.paid : t.status.pending}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button size="sm">{language === "pt" ? "Gerenciar" : "Manage"}</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
