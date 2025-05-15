"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { User, Lock } from "lucide-react"
import { translations } from "@/lib/i18n"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [language, setLanguage] = useState<"pt" | "en">("pt")
  const router = useRouter()
  const { toast } = useToast()

  // Carregar idioma salvo
  useEffect(() => {
    const savedLang = localStorage.getItem("lang")
    if (savedLang === "pt" || savedLang === "en") {
      setLanguage(savedLang)
    }
  }, [])

  // Mudar idioma
  const setLang = (lang: "pt" | "en") => {
    setLanguage(lang)
    localStorage.setItem("lang", lang)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Verificar credenciais
      if (email === "admin@inova-log.com" && password === "admin123") {
        router.push("/admin/dashboard")
      } else if (email === "cliente@inova-log.com" && password === "cliente123") {
        router.push("/cliente/dashboard")
      } else {
        toast({
          title: translations[language].invalid,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: translations[language].invalid,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <div className="flex justify-center mb-4">
          <div className="flex space-x-4">
            <button
              onClick={() => setLang("pt")}
              className={`px-3 py-1 rounded ${language === "pt" ? "bg-[#153462] text-white" : "bg-gray-100"}`}
            >
              Português
            </button>
            <button
              onClick={() => setLang("en")}
              className={`px-3 py-1 rounded ${language === "en" ? "bg-[#153462] text-white" : "bg-gray-100"}`}
            >
              English
            </button>
          </div>
        </div>

        <div className="flex justify-center mb-8">
          <h1 className="text-2xl font-bold text-[#153462]">InovaLog</h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <User className="h-5 w-5 text-[#153462]" />
            </div>
            <Input
              type="email"
              placeholder={translations[language].user}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 py-6 bg-gray-50 border-gray-300 rounded-lg"
              required
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Lock className="h-5 w-5 text-[#153462]" />
            </div>
            <Input
              type="password"
              placeholder={translations[language].pass}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 py-6 bg-gray-50 border-gray-300 rounded-lg"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full py-6 text-lg bg-[#153462] hover:bg-[#0c2547] text-white rounded-lg"
          >
            {isLoading ? "..." : translations[language].login}
          </Button>

          <div className="text-center">
            <span className="text-[#153462] cursor-pointer hover:underline">{translations[language].forgot}</span>
          </div>
        </form>
      </div>
    </div>
  )
}
