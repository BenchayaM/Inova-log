"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { getLanguage, translations } from "@/lib/i18n"
import {
  ShoppingCart,
  ClipboardList,
  DollarSign,
  Truck,
  FileText,
  Eye,
  Edit,
  Trash2,
  Plus,
  Download,
  Search,
  Bell,
  User,
  LogOut,
  Settings,
  Save,
  CheckCircle,
  AlertCircle,
  FileUp,
} from "lucide-react"

export default function DocumentacaoPage() {
  const [language, setLanguage] = useState<"pt" | "en">("pt")
  const [activeTab, setActiveTab] = useState("visao-geral")

  useEffect(() => {
    setLanguage(getLanguage())
  }, [])

  const t = translations[language]

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="flex justify-center mb-8">
        <div className="w-[180px] h-[60px] relative">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-A8QkpvKaIgbJ13IiuqjJSqWuKTUUxK.png"
            alt="InovaLog"
            fill
            className="object-contain"
          />
        </div>
      </div>

      <h1 className="text-3xl font-bold text-center mb-8">
        {language === "pt" ? "Documentação do Sistema" : "System Documentation"}
      </h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8">
          <TabsTrigger value="visao-geral">{language === "pt" ? "Visão Geral" : "Overview"}</TabsTrigger>
          <TabsTrigger value="cliente">{language === "pt" ? "Área do Cliente" : "Client Area"}</TabsTrigger>
          <TabsTrigger value="admin">{language === "pt" ? "Área do Admin" : "Admin Area"}</TabsTrigger>
          <TabsTrigger value="icones">{language === "pt" ? "Ícones e Ações" : "Icons and Actions"}</TabsTrigger>
        </TabsList>

        {/* Visão Geral */}
        <TabsContent value="visao-geral">
          <Card>
            <CardHeader>
              <CardTitle>{language === "pt" ? "Visão Geral do Sistema" : "System Overview"}</CardTitle>
              <CardDescription>
                {language === "pt"
                  ? "Entenda o funcionamento geral do sistema InovaLog"
                  : "Understand the general operation of the InovaLog system"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">
                  {language === "pt" ? "O que é o InovaLog?" : "What is InovaLog?"}
                </h3>
                <p>
                  {language === "pt"
                    ? "O InovaLog é um sistema completo de gerenciamento de pedidos e exportação, projetado para facilitar o processo de compra, venda e exportação de produtos entre empresas e clientes internacionais."
                    : "InovaLog is a complete order management and export system, designed to facilitate the process of buying, selling, and exporting products between companies and international clients."}
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">{language === "pt" ? "Fluxo de Trabalho" : "Workflow"}</h3>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>
                    <strong>{language === "pt" ? "Orçamento" : "Quote"}</strong>:{" "}
                    {language === "pt"
                      ? "O cliente cria um orçamento selecionando produtos."
                      : "The client creates a quote by selecting products."}
                  </li>
                  <li>
                    <strong>{language === "pt" ? "Análise" : "Analysis"}</strong>:{" "}
                    {language === "pt"
                      ? "O administrador analisa o orçamento e pode fazer ajustes."
                      : "The administrator analyzes the quote and can make adjustments."}
                  </li>
                  <li>
                    <strong>{language === "pt" ? "Aprovação" : "Approval"}</strong>:{" "}
                    {language === "pt" ? "O cliente aprova o orçamento final." : "The client approves the final quote."}
                  </li>
                  <li>
                    <strong>{language === "pt" ? "Pedido" : "Order"}</strong>:{" "}
                    {language === "pt"
                      ? "Um pedido é gerado a partir do orçamento aprovado."
                      : "An order is generated from the approved quote."}
                  </li>
                  <li>
                    <strong>{language === "pt" ? "Documentação" : "Documentation"}</strong>:{" "}
                    {language === "pt"
                      ? "Os documentos necessários são gerados (Proforma Invoice, Commercial Invoice, etc.)."
                      : "The necessary documents are generated (Proforma Invoice, Commercial Invoice, etc.)."}
                  </li>
                  <li>
                    <strong>{language === "pt" ? "Pagamento" : "Payment"}</strong>:{" "}
                    {language === "pt"
                      ? "O cliente realiza o pagamento conforme acordado."
                      : "The client makes the payment as agreed."}
                  </li>
                  <li>
                    <strong>{language === "pt" ? "Produção" : "Production"}</strong>:{" "}
                    {language === "pt"
                      ? "Os produtos são preparados para envio."
                      : "The products are prepared for shipping."}
                  </li>
                  <li>
                    <strong>{language === "pt" ? "Envio" : "Shipping"}</strong>:{" "}
                    {language === "pt"
                      ? "Os produtos são enviados ao cliente."
                      : "The products are shipped to the client."}
                  </li>
                  <li>
                    <strong>{language === "pt" ? "Rastreamento" : "Tracking"}</strong>:{" "}
                    {language === "pt"
                      ? "O cliente pode acompanhar o status do envio."
                      : "The client can track the shipping status."}
                  </li>
                  <li>
                    <strong>{language === "pt" ? "Entrega" : "Delivery"}</strong>:{" "}
                    {language === "pt"
                      ? "Os produtos são entregues ao cliente."
                      : "The products are delivered to the client."}
                  </li>
                </ol>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">{language === "pt" ? "Principais Recursos" : "Main Features"}</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>{language === "pt" ? "Gerenciamento de orçamentos e pedidos" : "Quote and order management"}</li>
                  <li>
                    {language === "pt"
                      ? "Geração automática de documentos de exportação"
                      : "Automatic generation of export documents"}
                  </li>
                  <li>{language === "pt" ? "Rastreamento de cargas" : "Shipment tracking"}</li>
                  <li>
                    {language === "pt" ? "Gerenciamento de contas e pagamentos" : "Account and payment management"}
                  </li>
                  <li>
                    {language === "pt"
                      ? "Suporte a múltiplos idiomas (Português, Inglês, etc.)"
                      : "Support for multiple languages (Portuguese, English, etc.)"}
                  </li>
                  <li>{language === "pt" ? "Notificações em tempo real" : "Real-time notifications"}</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">{language === "pt" ? "Áreas do Sistema" : "System Areas"}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">{language === "pt" ? "Área do Cliente" : "Client Area"}</h4>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>{language === "pt" ? "Dashboard" : "Dashboard"}</li>
                      <li>{language === "pt" ? "Orçamentos" : "Quotes"}</li>
                      <li>{language === "pt" ? "Pedidos" : "Orders"}</li>
                      <li>{language === "pt" ? "Contas" : "Accounts"}</li>
                      <li>{language === "pt" ? "Cargas" : "Shipments"}</li>
                      <li>{language === "pt" ? "Documentos" : "Documents"}</li>
                    </ul>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">
                      {language === "pt" ? "Área do Administrador" : "Administrator Area"}
                    </h4>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>{language === "pt" ? "Dashboard" : "Dashboard"}</li>
                      <li>{language === "pt" ? "Pedidos" : "Orders"}</li>
                      <li>{language === "pt" ? "Orçamentos" : "Quotes"}</li>
                      <li>{language === "pt" ? "Clientes" : "Clients"}</li>
                      <li>{language === "pt" ? "Produtos" : "Products"}</li>
                      <li>{language === "pt" ? "Exportadores" : "Exporters"}</li>
                      <li>{language === "pt" ? "Documentos" : "Documents"}</li>
                      <li>{language === "pt" ? "Contas" : "Accounts"}</li>
                      <li>{language === "pt" ? "Configurações" : "Settings"}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Área do Cliente */}
        <TabsContent value="cliente">
          <Card>
            <CardHeader>
              <CardTitle>{language === "pt" ? "Área do Cliente" : "Client Area"}</CardTitle>
              <CardDescription>
                {language === "pt"
                  ? "Guia detalhado das funcionalidades disponíveis para os clientes"
                  : "Detailed guide of the functionalities available to clients"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">{language === "pt" ? "Dashboard" : "Dashboard"}</h3>
                <p>
                  {language === "pt"
                    ? "O Dashboard do cliente apresenta uma visão geral dos orçamentos e pedidos recentes, permitindo acesso rápido às principais funcionalidades do sistema."
                    : "The client Dashboard presents an overview of recent quotes and orders, allowing quick access to the main functionalities of the system."}
                </p>
                <div className="border rounded-lg p-4 bg-muted/30">
                  <h4 className="font-medium mb-2">{language === "pt" ? "Funcionalidades:" : "Features:"}</h4>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>
                      {language === "pt" ? "Visualização rápida de orçamentos recentes" : "Quick view of recent quotes"}
                    </li>
                    <li>
                      {language === "pt" ? "Visualização rápida de pedidos recentes" : "Quick view of recent orders"}
                    </li>
                    <li>
                      {language === "pt"
                        ? "Notificações de atualizações importantes"
                        : "Notifications of important updates"}
                    </li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">{language === "pt" ? "Orçamentos" : "Quotes"}</h3>
                <p>
                  {language === "pt"
                    ? "A seção de Orçamentos permite ao cliente criar, visualizar e gerenciar seus orçamentos. Os orçamentos são o ponto de partida para a criação de pedidos."
                    : "The Quotes section allows the client to create, view, and manage their quotes. Quotes are the starting point for creating orders."}
                </p>
                <div className="border rounded-lg p-4 bg-muted/30">
                  <h4 className="font-medium mb-2">{language === "pt" ? "Funcionalidades:" : "Features:"}</h4>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>{language === "pt" ? "Visualização de todos os orçamentos" : "View all quotes"}</li>
                    <li>{language === "pt" ? "Filtros por status e data" : "Filters by status and date"}</li>
                    <li>{language === "pt" ? "Aprovação de orçamentos" : "Quote approval"}</li>
                    <li>
                      {language === "pt" ? "Detalhes completos de cada orçamento" : "Complete details of each quote"}
                    </li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">{language === "pt" ? "Pedidos" : "Orders"}</h3>
                <p>
                  {language === "pt"
                    ? "A seção de Pedidos permite ao cliente visualizar e acompanhar seus pedidos, que são gerados a partir de orçamentos aprovados."
                    : "The Orders section allows the client to view and track their orders, which are generated from approved quotes."}
                </p>
                <div className="border rounded-lg p-4 bg-muted/30">
                  <h4 className="font-medium mb-2">{language === "pt" ? "Funcionalidades:" : "Features:"}</h4>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>{language === "pt" ? "Visualização de todos os pedidos" : "View all orders"}</li>
                    <li>
                      {language === "pt"
                        ? "Filtros por status, data e pagamento"
                        : "Filters by status, date, and payment"}
                    </li>
                    <li>
                      {language === "pt" ? "Detalhes completos de cada pedido" : "Complete details of each order"}
                    </li>
                    <li>
                      {language === "pt"
                        ? "Acesso rápido a documentos, rastreamento e pagamentos"
                        : "Quick access to documents, tracking, and payments"}
                    </li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">{language === "pt" ? "Contas" : "Accounts"}</h3>
                <p>
                  {language === "pt"
                    ? "A seção de Contas permite ao cliente gerenciar seus pagamentos e visualizar o histórico financeiro."
                    : "The Accounts section allows the client to manage their payments and view financial history."}
                </p>
                <div className="border rounded-lg p-4 bg-muted/30">
                  <h4 className="font-medium mb-2">{language === "pt" ? "Funcionalidades:" : "Features:"}</h4>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>{language === "pt" ? "Visualização de todas as contas" : "View all accounts"}</li>
                    <li>
                      {language === "pt"
                        ? "Resumo de valores pagos e pendentes"
                        : "Summary of paid and pending amounts"}
                    </li>
                    <li>{language === "pt" ? "Realização de pagamentos" : "Make payments"}</li>
                    <li>{language === "pt" ? "Histórico de transações" : "Transaction history"}</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">{language === "pt" ? "Cargas" : "Shipments"}</h3>
                <p>
                  {language === "pt"
                    ? "A seção de Cargas permite ao cliente acompanhar o status de envio de seus pedidos."
                    : "The Shipments section allows the client to track the shipping status of their orders."}
                </p>
                <div className="border rounded-lg p-4 bg-muted/30">
                  <h4 className="font-medium mb-2">{language === "pt" ? "Funcionalidades:" : "Features:"}</h4>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>{language === "pt" ? "Visualização de todas as cargas" : "View all shipments"}</li>
                    <li>{language === "pt" ? "Rastreamento em tempo real" : "Real-time tracking"}</li>
                    <li>
                      {language === "pt"
                        ? "Informações detalhadas de cada carga"
                        : "Detailed information of each shipment"}
                    </li>
                    <li>{language === "pt" ? "Histórico de atualizações de status" : "Status update history"}</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">{language === "pt" ? "Documentos" : "Documents"}</h3>
                <p>
                  {language === "pt"
                    ? "A seção de Documentos permite ao cliente acessar, visualizar e baixar todos os documentos relacionados aos seus pedidos."
                    : "The Documents section allows the client to access, view, and download all documents related to their orders."}
                </p>
                <div className="border rounded-lg p-4 bg-muted/30">
                  <h4 className="font-medium mb-2">{language === "pt" ? "Funcionalidades:" : "Features:"}</h4>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>{language === "pt" ? "Visualização de todos os documentos" : "View all documents"}</li>
                    <li>
                      {language === "pt"
                        ? "Filtros por tipo de documento e pedido"
                        : "Filters by document type and order"}
                    </li>
                    <li>{language === "pt" ? "Visualização online de documentos" : "Online document viewing"}</li>
                    <li>{language === "pt" ? "Download de documentos" : "Document download"}</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Área do Admin */}
        <TabsContent value="admin">
          <Card>
            <CardHeader>
              <CardTitle>{language === "pt" ? "Área do Administrador" : "Administrator Area"}</CardTitle>
              <CardDescription>
                {language === "pt"
                  ? "Guia detalhado das funcionalidades disponíveis para os administradores"
                  : "Detailed guide of the functionalities available to administrators"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">{language === "pt" ? "Dashboard" : "Dashboard"}</h3>
                <p>
                  {language === "pt"
                    ? "O Dashboard do administrador apresenta uma visão geral das métricas do sistema, orçamentos e pedidos recentes, permitindo acesso rápido às principais funcionalidades administrativas."
                    : "The administrator Dashboard presents an overview of system metrics, recent quotes and orders, allowing quick access to the main administrative functionalities."}
                </p>
                <div className="border rounded-lg p-4 bg-muted/30">
                  <h4 className="font-medium mb-2">{language === "pt" ? "Funcionalidades:" : "Features:"}</h4>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>
                      {language === "pt"
                        ? "Métricas de receita, pedidos, clientes e produtos"
                        : "Revenue, orders, clients, and products metrics"}
                    </li>
                    <li>
                      {language === "pt"
                        ? "Orçamentos recentes que precisam de atenção"
                        : "Recent quotes that need attention"}
                    </li>
                    <li>{language === "pt" ? "Pedidos recentes e seus status" : "Recent orders and their status"}</li>
                    <li>{language === "pt" ? "Notificações de sistema" : "System notifications"}</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">{language === "pt" ? "Pedidos" : "Orders"}</h3>
                <p>
                  {language === "pt"
                    ? "A seção de Pedidos permite ao administrador gerenciar todos os pedidos do sistema, atualizando status, gerando documentos e acompanhando o processo completo."
                    : "The Orders section allows the administrator to manage all system orders, updating status, generating documents, and tracking the complete process."}
                </p>
                <div className="border rounded-lg p-4 bg-muted/30">
                  <h4 className="font-medium mb-2">{language === "pt" ? "Funcionalidades:" : "Features:"}</h4>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>{language === "pt" ? "Visualização de todos os pedidos" : "View all orders"}</li>
                    <li>
                      {language === "pt"
                        ? "Filtros avançados por cliente, status, data e pagamento"
                        : "Advanced filters by client, status, date, and payment"}
                    </li>
                    <li>{language === "pt" ? "Atualização de status de pedidos" : "Order status update"}</li>
                    <li>
                      {language === "pt"
                        ? "Geração e gerenciamento de documentos"
                        : "Document generation and management"}
                    </li>
                    <li>{language === "pt" ? "Gerenciamento de envios" : "Shipment management"}</li>
                    <li>{language === "pt" ? "Gerenciamento de pagamentos" : "Payment management"}</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">{language === "pt" ? "Orçamentos" : "Quotes"}</h3>
                <p>
                  {language === "pt"
                    ? "A seção de Orçamentos permite ao administrador analisar, ajustar e aprovar orçamentos enviados pelos clientes."
                    : "The Quotes section allows the administrator to analyze, adjust, and approve quotes sent by clients."}
                </p>
                <div className="border rounded-lg p-4 bg-muted/30">
                  <h4 className="font-medium mb-2">{language === "pt" ? "Funcionalidades:" : "Features:"}</h4>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>{language === "pt" ? "Visualização de todos os orçamentos" : "View all quotes"}</li>
                    <li>
                      {language === "pt" ? "Filtros por cliente, status e data" : "Filters by client, status, and date"}
                    </li>
                    <li>{language === "pt" ? "Análise detalhada de orçamentos" : "Detailed quote analysis"}</li>
                    <li>{language === "pt" ? "Ajustes de preços e quantidades" : "Price and quantity adjustments"}</li>
                    <li>{language === "pt" ? "Geração de proforma invoice" : "Proforma invoice generation"}</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">{language === "pt" ? "Clientes" : "Clients"}</h3>
                <p>
                  {language === "pt"
                    ? "A seção de Clientes permite ao administrador gerenciar todos os clientes cadastrados no sistema."
                    : "The Clients section allows the administrator to manage all clients registered in the system."}
                </p>
                <div className="border rounded-lg p-4 bg-muted/30">
                  <h4 className="font-medium mb-2">{language === "pt" ? "Funcionalidades:" : "Features:"}</h4>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>{language === "pt" ? "Visualização de todos os clientes" : "View all clients"}</li>
                    <li>{language === "pt" ? "Adição de novos clientes" : "Add new clients"}</li>
                    <li>{language === "pt" ? "Edição de informações de clientes" : "Edit client information"}</li>
                    <li>
                      {language === "pt"
                        ? "Visualização de histórico de pedidos por cliente"
                        : "View order history by client"}
                    </li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">{language === "pt" ? "Produtos" : "Products"}</h3>
                <p>
                  {language === "pt"
                    ? "A seção de Produtos permite ao administrador gerenciar o catálogo de produtos disponíveis no sistema."
                    : "The Products section allows the administrator to manage the catalog of products available in the system."}
                </p>
                <div className="border rounded-lg p-4 bg-muted/30">
                  <h4 className="font-medium mb-2">{language === "pt" ? "Funcionalidades:" : "Features:"}</h4>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>{language === "pt" ? "Visualização de todos os produtos" : "View all products"}</li>
                    <li>{language === "pt" ? "Adição de novos produtos" : "Add new products"}</li>
                    <li>{language === "pt" ? "Edição de informações de produtos" : "Edit product information"}</li>
                    <li>{language === "pt" ? "Gerenciamento de estoque" : "Inventory management"}</li>
                    <li>{language === "pt" ? "Categorização de produtos" : "Product categorization"}</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">{language === "pt" ? "Exportadores" : "Exporters"}</h3>
                <p>
                  {language === "pt"
                    ? "A seção de Exportadores permite ao administrador gerenciar as empresas exportadoras cadastradas no sistema."
                    : "The Exporters section allows the administrator to manage the exporting companies registered in the system."}
                </p>
                <div className="border rounded-lg p-4 bg-muted/30">
                  <h4 className="font-medium mb-2">{language === "pt" ? "Funcionalidades:" : "Features:"}</h4>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>{language === "pt" ? "Visualização de todos os exportadores" : "View all exporters"}</li>
                    <li>{language === "pt" ? "Adição de novos exportadores" : "Add new exporters"}</li>
                    <li>{language === "pt" ? "Edição de informações de exportadores" : "Edit exporter information"}</li>
                    <li>{language === "pt" ? "Gerenciamento de dados bancários" : "Banking data management"}</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">{language === "pt" ? "Documentos" : "Documents"}</h3>
                <p>
                  {language === "pt"
                    ? "A seção de Documentos permite ao administrador gerenciar todos os documentos gerados no sistema."
                    : "The Documents section allows the administrator to manage all documents generated in the system."}
                </p>
                <div className="border rounded-lg p-4 bg-muted/30">
                  <h4 className="font-medium mb-2">{language === "pt" ? "Funcionalidades:" : "Features:"}</h4>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>{language === "pt" ? "Visualização de todos os documentos" : "View all documents"}</li>
                    <li>{language === "pt" ? "Geração de novos documentos" : "Generate new documents"}</li>
                    <li>{language === "pt" ? "Upload de documentos externos" : "Upload external documents"}</li>
                    <li>
                      {language === "pt" ? "Visualização e download de documentos" : "View and download documents"}
                    </li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">{language === "pt" ? "Contas" : "Accounts"}</h3>
                <p>
                  {language === "pt"
                    ? "A seção de Contas permite ao administrador gerenciar todas as transações financeiras do sistema."
                    : "The Accounts section allows the administrator to manage all financial transactions in the system."}
                </p>
                <div className="border rounded-lg p-4 bg-muted/30">
                  <h4 className="font-medium mb-2">{language === "pt" ? "Funcionalidades:" : "Features:"}</h4>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>{language === "pt" ? "Visualização de todas as contas" : "View all accounts"}</li>
                    <li>{language === "pt" ? "Resumo financeiro geral" : "General financial summary"}</li>
                    <li>{language === "pt" ? "Gerenciamento de pagamentos" : "Payment management"}</li>
                    <li>{language === "pt" ? "Relatórios financeiros" : "Financial reports"}</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">{language === "pt" ? "Configurações" : "Settings"}</h3>
                <p>
                  {language === "pt"
                    ? "A seção de Configurações permite ao administrador gerenciar as configurações gerais do sistema."
                    : "The Settings section allows the administrator to manage the general system settings."}
                </p>
                <div className="border rounded-lg p-4 bg-muted/30">
                  <h4 className="font-medium mb-2">{language === "pt" ? "Funcionalidades:" : "Features:"}</h4>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>
                      {language === "pt" ? "Configurações de conta de administrador" : "Administrator account settings"}
                    </li>
                    <li>
                      {language === "pt"
                        ? "Gerenciamento de usuários administradores"
                        : "Administrator user management"}
                    </li>
                    <li>{language === "pt" ? "Configurações de notificações" : "Notification settings"}</li>
                    <li>{language === "pt" ? "Backup e restauração do sistema" : "System backup and restoration"}</li>
                    <li>{language === "pt" ? "Logs do sistema" : "System logs"}</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Ícones e Ações */}
        <TabsContent value="icones">
          <Card>
            <CardHeader>
              <CardTitle>{language === "pt" ? "Ícones e Ações" : "Icons and Actions"}</CardTitle>
              <CardDescription>
                {language === "pt"
                  ? "Guia de referência para todos os ícones e ações disponíveis no sistema"
                  : "Reference guide for all icons and actions available in the system"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">
                  {language === "pt" ? "Ícones de Navegação" : "Navigation Icons"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-4 border rounded-lg p-4">
                    <ClipboardList className="h-6 w-6" />
                    <div>
                      <p className="font-medium">Dashboard</p>
                      <p className="text-sm text-muted-foreground">
                        {language === "pt" ? "Acesso à página inicial do sistema" : "Access to the system home page"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 border rounded-lg p-4">
                    <ShoppingCart className="h-6 w-6" />
                    <div>
                      <p className="font-medium">{language === "pt" ? "Pedidos" : "Orders"}</p>
                      <p className="text-sm text-muted-foreground">
                        {language === "pt" ? "Acesso à seção de pedidos" : "Access to the orders section"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 border rounded-lg p-4">
                    <FileText className="h-6 w-6" />
                    <div>
                      <p className="font-medium">{language === "pt" ? "Orçamentos" : "Quotes"}</p>
                      <p className="text-sm text-muted-foreground">
                        {language === "pt" ? "Acesso à seção de orçamentos" : "Access to the quotes section"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 border rounded-lg p-4">
                    <DollarSign className="h-6 w-6" />
                    <div>
                      <p className="font-medium">{language === "pt" ? "Contas" : "Accounts"}</p>
                      <p className="text-sm text-muted-foreground">
                        {language === "pt"
                          ? "Acesso à seção de contas e pagamentos"
                          : "Access to the accounts and payments section"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 border rounded-lg p-4">
                    <Truck className="h-6 w-6" />
                    <div>
                      <p className="font-medium">{language === "pt" ? "Cargas" : "Shipments"}</p>
                      <p className="text-sm text-muted-foreground">
                        {language === "pt"
                          ? "Acesso à seção de rastreamento de cargas"
                          : "Access to the shipment tracking section"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 border rounded-lg p-4">
                    <FileText className="h-6 w-6" />
                    <div>
                      <p className="font-medium">{language === "pt" ? "Documentos" : "Documents"}</p>
                      <p className="text-sm text-muted-foreground">
                        {language === "pt" ? "Acesso à seção de documentos" : "Access to the documents section"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 border rounded-lg p-4">
                    <Settings className="h-6 w-6" />
                    <div>
                      <p className="font-medium">{language === "pt" ? "Configurações" : "Settings"}</p>
                      <p className="text-sm text-muted-foreground">
                        {language === "pt" ? "Acesso às configurações do sistema" : "Access to system settings"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">{language === "pt" ? "Ícones de Ação" : "Action Icons"}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-4 border rounded-lg p-4">
                    <Eye className="h-6 w-6" />
                    <div>
                      <p className="font-medium">{language === "pt" ? "Visualizar" : "View"}</p>
                      <p className="text-sm text-muted-foreground">
                        {language === "pt"
                          ? "Visualizar detalhes completos de um item"
                          : "View complete details of an item"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 border rounded-lg p-4">
                    <Edit className="h-6 w-6" />
                    <div>
                      <p className="font-medium">{language === "pt" ? "Editar" : "Edit"}</p>
                      <p className="text-sm text-muted-foreground">
                        {language === "pt" ? "Editar informações de um item" : "Edit information of an item"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 border rounded-lg p-4">
                    <Trash2 className="h-6 w-6" />
                    <div>
                      <p className="font-medium">{language === "pt" ? "Excluir" : "Delete"}</p>
                      <p className="text-sm text-muted-foreground">
                        {language === "pt" ? "Excluir um item do sistema" : "Delete an item from the system"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 border rounded-lg p-4">
                    <Plus className="h-6 w-6" />
                    <div>
                      <p className="font-medium">{language === "pt" ? "Adicionar" : "Add"}</p>
                      <p className="text-sm text-muted-foreground">
                        {language === "pt" ? "Adicionar um novo item" : "Add a new item"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 border rounded-lg p-4">
                    <Save className="h-6 w-6" />
                    <div>
                      <p className="font-medium">{language === "pt" ? "Salvar" : "Save"}</p>
                      <p className="text-sm text-muted-foreground">
                        {language === "pt" ? "Salvar alterações" : "Save changes"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 border rounded-lg p-4">
                    <Download className="h-6 w-6" />
                    <div>
                      <p className="font-medium">{language === "pt" ? "Baixar" : "Download"}</p>
                      <p className="text-sm text-muted-foreground">
                        {language === "pt" ? "Baixar um arquivo ou documento" : "Download a file or document"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 border rounded-lg p-4">
                    <Search className="h-6 w-6" />
                    <div>
                      <p className="font-medium">{language === "pt" ? "Buscar" : "Search"}</p>
                      <p className="text-sm text-muted-foreground">
                        {language === "pt" ? "Buscar itens no sistema" : "Search for items in the system"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 border rounded-lg p-4">
                    <FileUp className="h-6 w-6" />
                    <div>
                      <p className="font-medium">{language === "pt" ? "Enviar/Gerar" : "Upload/Generate"}</p>
                      <p className="text-sm text-muted-foreground">
                        {language === "pt"
                          ? "Enviar um arquivo ou gerar um documento"
                          : "Upload a file or generate a document"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">{language === "pt" ? "Ícones de Status" : "Status Icons"}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-4 border rounded-lg p-4">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                    <div>
                      <p className="font-medium">{language === "pt" ? "Aprovado/Concluído" : "Approved/Completed"}</p>
                      <p className="text-sm text-muted-foreground">
                        {language === "pt"
                          ? "Indica que um item foi aprovado ou concluído"
                          : "Indicates that an item has been approved or completed"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 border rounded-lg p-4">
                    <AlertCircle className="h-6 w-6 text-red-500" />
                    <div>
                      <p className="font-medium">{language === "pt" ? "Alerta/Atenção" : "Alert/Attention"}</p>
                      <p className="text-sm text-muted-foreground">
                        {language === "pt"
                          ? "Indica que um item precisa de atenção ou tem um problema"
                          : "Indicates that an item needs attention or has an issue"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 border rounded-lg p-4">
                    <Bell className="h-6 w-6 text-yellow-500" />
                    <div>
                      <p className="font-medium">{language === "pt" ? "Notificação" : "Notification"}</p>
                      <p className="text-sm text-muted-foreground">
                        {language === "pt"
                          ? "Indica que há notificações pendentes"
                          : "Indicates that there are pending notifications"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 border rounded-lg p-4">
                    <User className="h-6 w-6 text-blue-500" />
                    <div>
                      <p className="font-medium">{language === "pt" ? "Usuário/Perfil" : "User/Profile"}</p>
                      <p className="text-sm text-muted-foreground">
                        {language === "pt"
                          ? "Acesso às informações de perfil do usuário"
                          : "Access to user profile information"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">{language === "pt" ? "Ícones de Cabeçalho" : "Header Icons"}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-4 border rounded-lg p-4">
                    <Bell className="h-6 w-6" />
                    <div>
                      <p className="font-medium">{language === "pt" ? "Notificações" : "Notifications"}</p>
                      <p className="text-sm text-muted-foreground">
                        {language === "pt" ? "Acesso às notificações do sistema" : "Access to system notifications"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 border rounded-lg p-4">
                    <User className="h-6 w-6" />
                    <div>
                      <p className="font-medium">{language === "pt" ? "Perfil" : "Profile"}</p>
                      <p className="text-sm text-muted-foreground">
                        {language === "pt" ? "Acesso às configurações de perfil" : "Access to profile settings"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 border rounded-lg p-4">
                    <LogOut className="h-6 w-6" />
                    <div>
                      <p className="font-medium">{language === "pt" ? "Sair" : "Logout"}</p>
                      <p className="text-sm text-muted-foreground">
                        {language === "pt" ? "Sair do sistema" : "Log out of the system"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 border rounded-lg bg-muted/30">
                <h3 className="text-xl font-semibold mb-4">{language === "pt" ? "Dicas de Uso" : "Usage Tips"}</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                    <p>
                      {language === "pt"
                        ? "Passe o mouse sobre os ícones para ver dicas de ferramentas com descrições."
                        : "Hover over icons to see tooltips with descriptions."}
                    </p>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                    <p>
                      {language === "pt"
                        ? "Os ícones de ação geralmente aparecem em tabelas e listagens para operações rápidas."
                        : "Action icons typically appear in tables and listings for quick operations."}
                    </p>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                    <p>
                      {language === "pt"
                        ? "Ícones com badges numéricos indicam a quantidade de itens pendentes ou notificações."
                        : "Icons with numeric badges indicate the number of pending items or notifications."}
                    </p>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                    <p>
                      {language === "pt"
                        ? "Alguns ícones podem estar desabilitados dependendo do status atual do item ou das permissões do usuário."
                        : "Some icons may be disabled depending on the current status of the item or user permissions."}
                    </p>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          {language === "pt"
            ? "Esta documentação está em constante atualização. Para mais informações, entre em contato com o suporte."
            : "This documentation is constantly being updated. For more information, contact support."}
        </p>
        <div className="mt-4">
          <Link href="/login">
            <Button variant="outline">{language === "pt" ? "Voltar para o Sistema" : "Back to System"}</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
