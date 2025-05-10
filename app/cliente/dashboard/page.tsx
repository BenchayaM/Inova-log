"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getLanguage, translations } from "@/lib/i18n"
import {
  PushNotificationButton,
  requestNotificationPermission,
  sendPushNotification,
} from "@/components/push-notification"

export default function ClienteDashboard() {
  const [notificacoes] = useState(3)
  const [language, setLanguage] = useState<"pt" | "en">("pt")

  useEffect(() => {
    setLanguage(getLanguage())

    // Solicitar permissão para notificações quando a página carregar
    requestNotificationPermission()

    // Exemplo de notificação após 3 segundos
    const timer = setTimeout(() => {
      sendPushNotification({
        title: language === "pt" ? "Bem-vindo ao InovaLog" : "Welcome to InovaLog",
        body:
          language === "pt"
            ? "Acompanhe seus pedidos e orçamentos em tempo real."
            : "Track your orders and quotes in real time.",
      })
    }, 3000)

    return () => clearTimeout(timer)
  }, [language])

  const t = translations[language]

  // Dados de exemplo
  const orcamentos = [
    {
      id: "ORC-2025-001",
      data: "10/05/2025",
      valor: 1250.0,
      status: language === "pt" ? "Aguardando aprovação" : "Waiting approval",
    },
    { id: "ORC-2025-002", data: "15/05/2025", valor: 3450.0, status: language === "pt" ? "Em análise" : "In analysis" },
  ]

  const pedidos = [
    {
      id: "PED-2025-001",
      data: "01/05/2025",
      valor: 2340.0,
      status: language === "pt" ? "Finalizado" : "Finished",
      pago: true,
    },
    {
      id: "PED-2025-002",
      data: "05/05/2025",
      valor: 1870.0,
      status: language === "pt" ? "Em produção" : "In production",
      pago: true,
    },
    {
      id: "PED-2025-003",
      data: "08/05/2025",
      valor: 4500.0,
      status: language === "pt" ? "Aguardando autorização" : "Waiting authorization",
      pago: false,
    },
  ]

  // Função para testar notificação push
  const testPushNotification = () => {
    sendPushNotification({
      title: language === "pt" ? "Novo orçamento aprovado" : "New quote approved",
      body:
        language === "pt" ? "Seu orçamento ORC-2025-002 foi aprovado." : "Your quote ORC-2025-002 has been approved.",
      onClick: () => {
        window.location.href = "/cliente/orcamentos"
      },
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{t.welcome}</h1>
          <p className="text-muted-foreground">{t.trackOrders}</p>
        </div>
        <PushNotificationButton />
      </div>

      <Button onClick={testPushNotification} variant="outline">
        {language === "pt" ? "Testar Notificação" : "Test Notification"}
      </Button>

      <Tabs defaultValue="orcamentos" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="orcamentos">{t.quotes}</TabsTrigger>
          <TabsTrigger value="pedidos">{t.orders}</TabsTrigger>
        </TabsList>

        <TabsContent value="orcamentos">
          <div className="grid gap-4">
            {orcamentos.map((orcamento) => (
              <Card key={orcamento.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle>{orcamento.id}</CardTitle>
                    <Badge variant="outline">{orcamento.status}</Badge>
                  </div>
                  <CardDescription>
                    {t.date}: {orcamento.data}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{t.totalValue}:</p>
                      <p className="text-xl font-bold">${orcamento.valor.toFixed(2)}</p>
                    </div>
                    <Button>{t.viewDetails}</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pedidos">
          <div className="grid gap-4">
            {pedidos.map((pedido) => (
              <Card key={pedido.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle>{pedido.id}</CardTitle>
                    <div className="flex gap-2">
                      <Badge variant={pedido.pago ? "success" : "destructive"}>
                        {pedido.pago ? t.status.paid : t.status.pending}
                      </Badge>
                      <Badge variant="outline">{pedido.status}</Badge>
                    </div>
                  </div>
                  <CardDescription>
                    {t.date}: {pedido.data}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{t.totalValue}:</p>
                      <p className="text-xl font-bold">${pedido.valor.toFixed(2)}</p>
                    </div>
                    <Button>{t.viewDetails}</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
