"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
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
      <div className="w-full max-w-md p-8">
        <div className="flex justify-between mb-8">
          <div className="flex flex-col items-center cursor-pointer" onClick={() => setLang("pt")}>
            <div className="w-12 h-8 relative overflow-hidden rounded">
              <Image src="https://flagcdn.com/w320/br.png" alt="BR" fill className="object-cover" />
            </div>
            <span className={`mt-1 text-sm ${language === "pt" ? "font-bold text-[#153462]" : ""}`}>BR</span>
          </div>
          <div className="flex flex-col items-center cursor-pointer" onClick={() => setLang("en")}>
            <div className="w-12 h-8 relative overflow-hidden rounded">
              <Image src="https://flagcdn.com/w320/us.png" alt="US" fill className="object-cover" />
            </div>
            <span className={`mt-1 text-sm ${language === "en" ? "font-bold text-[#153462]" : ""}`}>US</span>
          </div>
          <div className="flex flex-col items-center cursor-pointer">
            <div className="w-12 h-8 relative overflow-hidden rounded">
              <Image src="https://flagcdn.com/w320/cn.png" alt="CN" fill className="object-cover" />
            </div>
            <span className="mt-1 text-sm">CN</span>
          </div>
        </div>

        <div className="flex justify-center mb-8">
          <div className="w-[200px] h-[60px] relative">
            <Image src="/images/logo.png" alt="InovaLog" fill className="object-contain" unoptimized />
          </div>
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
