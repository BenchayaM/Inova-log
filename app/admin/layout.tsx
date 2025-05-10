"use client"

import type { ReactNode } from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  Users,
  Package,
  TrendingUp,
  Bell,
  User,
  LogOut,
  FileText,
  Truck,
  ShoppingCart,
  Settings,
  Menu,
  X,
  DollarSign,
  FileTextIcon as FileText2,
  BarChart,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { getLanguage, translations } from "@/lib/i18n"

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [language, setLanguage] = useState<"pt" | "en">("pt")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("dashboard")

  useEffect(() => {
    setLanguage(getLanguage())

    // Definir a aba ativa com base na URL atual
    const path = window.location.pathname
    if (path.includes("/admin/dashboard")) setActiveTab("dashboard")
    else if (path.includes("/admin/pedidos")) setActiveTab("orders")
    else if (path.includes("/admin/orcamentos")) setActiveTab("quotes")
    else if (path.includes("/admin/clientes")) setActiveTab("clients")
    else if (path.includes("/admin/produtos")) setActiveTab("products")
    else if (path.includes("/admin/exportadores")) setActiveTab("exporters")
    else if (path.includes("/admin/documentos")) setActiveTab("documents")
    else if (path.includes("/admin/contas")) setActiveTab("accounts")
    else if (path.includes("/admin/financeiro")) setActiveTab("financial")
    else if (path.includes("/admin/configuracoes")) setActiveTab("settings")
  }, [])

  const t = translations[language]

  const menuItems = [
    { id: "dashboard", href: "/admin/dashboard", icon: <TrendingUp className="h-5 w-5" />, label: t.dashboard },
    { id: "orders", href: "/admin/pedidos", icon: <ShoppingCart className="h-5 w-5" />, label: t.orders },
    { id: "quotes", href: "/admin/orcamentos", icon: <FileText className="h-5 w-5" />, label: t.quotes },
    { id: "clients", href: "/admin/clientes", icon: <Users className="h-5 w-5" />, label: t.clients },
    { id: "products", href: "/admin/produtos", icon: <Package className="h-5 w-5" />, label: t.products },
    { id: "exporters", href: "/admin/exportadores", icon: <Truck className="h-5 w-5" />, label: t.exporters },
    { id: "documents", href: "/admin/documentos", icon: <FileText2 className="h-5 w-5" />, label: t.documents },
    { id: "accounts", href: "/admin/contas", icon: <DollarSign className="h-5 w-5" />, label: t.accounts },
    {
      id: "financial",
      href: "/admin/financeiro",
      icon: <BarChart className="h-5 w-5" />,
      label: t.financial || "Financeiro",
    },
    { id: "settings", href: "/admin/configuracoes", icon: <Settings className="h-5 w-5" />, label: t.settings },
  ]

  return (
    <div className="flex flex-col h-screen">
      {/* Header com navegação horizontal */}
      <header className="h-16 border-b flex items-center px-4 bg-background sticky top-0 z-10">
        <div className="flex items-center">
          {/* Menu para mobile */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden mr-4">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="flex flex-col h-full">
                <div className="p-4 border-b flex items-center justify-between">
                  <div className="w-[150px] h-[45px] relative">
                    <Image src="/images/logo.png" alt="InovaLog" fill className="object-contain" />
                  </div>
                  <SheetClose asChild>
                    <Button variant="ghost" size="icon">
                      <X className="h-5 w-5" />
                    </Button>
                  </SheetClose>
                </div>
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                  {menuItems.map((item) => (
                    <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                      <Button variant={activeTab === item.id ? "default" : "ghost"} className="w-full justify-start">
                        {item.icon}
                        <span className="ml-2">{item.label}</span>
                      </Button>
                    </Link>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>

          <div className="w-[150px] h-[45px] relative mr-6">
            <Image src="/images/logo.png" alt="InovaLog" fill className="object-contain" />
          </div>
        </div>

        {/* Navegação horizontal para desktop */}
        <nav className="hidden md:flex space-x-1 overflow-x-auto">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={activeTab === item.id ? "default" : "ghost"}
                size="sm"
                className="flex items-center"
                onClick={() => setActiveTab(item.id)}
              >
                {item.icon}
                <span className="ml-2">{item.label}</span>
              </Button>
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">5</Badge>
          </Button>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              // Em uma implementação real, limparíamos tokens, cookies, etc.
              // Por enquanto, apenas redirecionamos para a página de login
              window.location.href = "/login"
            }}
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 p-4 overflow-auto">{children}</main>
    </div>
  )
}
