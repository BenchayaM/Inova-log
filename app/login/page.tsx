"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { User, Lock, Briefcase } from "lucide-react"
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
    <div className="flex justify-center items-center min-h-screen w-full bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        {/* Seletor de idioma */}
        <div className="flex justify-center mb-6">
          <div className="flex gap-3">
            <button
              onClick={() => setLang("pt")}
              className={`px-4 py-2 rounded-md border transition-colors ${
                language === "pt"
                  ? "bg-[#153462] text-white font-medium"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Português
            </button>
            <button
              onClick={() => setLang("en")}
              className={`px-4 py-2 rounded-md border transition-colors ${
                language === "en"
                  ? "bg-[#153462] text-white font-medium"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              English
            </button>
          </div>
        </div>

        {/* Logo */}
        <div className="flex justify-center items-center mb-8">
          <div className="flex items-center">
            <Briefcase className="h-10 w-10 text-[#153462]" />
            <span className="text-3xl font-bold text-[#153462] ml-2">Inova-Log</span>
          </div>
        </div>

        {/* Formulário */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-[#153462]" />
            </div>
            <input
              type="email"
              placeholder={translations[language].user}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-blue-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#153462] focus:border-transparent"
              required
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-[#153462]" />
            </div>
            <input
              type="password"
              placeholder={translations[language].pass}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-blue-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#153462] focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[#153462] text-white font-medium rounded-lg hover:bg-[#0c2547] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#153462]"
          >
            {isLoading ? "..." : translations[language].login}
          </button>
        </form>

        {/* Link para recuperar senha */}
        <div className="text-center mt-6">
          <button className="text-[#153462] hover:underline text-sm">{translations[language].forgot}</button>
        </div>
      </div>
    </div>
  )
}
