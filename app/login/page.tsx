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
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        width: "100%",
        backgroundColor: "white",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          padding: "30px",
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "16px",
            }}
          >
            <button
              onClick={() => setLang("pt")}
              style={{
                padding: "4px 12px",
                borderRadius: "4px",
                backgroundColor: language === "pt" ? "#153462" : "#f3f4f6",
                color: language === "pt" ? "white" : "black",
                border: "1px solid #d1d5db",
                cursor: "pointer",
              }}
            >
              Português
            </button>
            <button
              onClick={() => setLang("en")}
              style={{
                padding: "4px 12px",
                borderRadius: "4px",
                backgroundColor: language === "en" ? "#153462" : "#f3f4f6",
                color: language === "en" ? "white" : "black",
                border: "1px solid #d1d5db",
                cursor: "pointer",
              }}
            >
              English
            </button>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "32px",
          }}
        >
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              color: "#153462",
            }}
          >
            InovaLog
          </h1>
        </div>

        <form
          onSubmit={handleLogin}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          <div style={{ position: "relative" }}>
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "12px",
                transform: "translateY(-50%)",
                pointerEvents: "none",
              }}
            >
              <User size={20} color="#153462" />
            </div>
            <Input
              type="email"
              placeholder={translations[language].user}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 12px 12px 40px",
                backgroundColor: "#f9fafb",
                borderColor: "#d1d5db",
                borderRadius: "8px",
              }}
              required
            />
          </div>

          <div style={{ position: "relative" }}>
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "12px",
                transform: "translateY(-50%)",
                pointerEvents: "none",
              }}
            >
              <Lock size={20} color="#153462" />
            </div>
            <Input
              type="password"
              placeholder={translations[language].pass}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 12px 12px 40px",
                backgroundColor: "#f9fafb",
                borderColor: "#d1d5db",
                borderRadius: "8px",
              }}
              required
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "12px",
              fontSize: "18px",
              backgroundColor: "#153462",
              color: "white",
              borderRadius: "8px",
              cursor: isLoading ? "not-allowed" : "pointer",
            }}
          >
            {isLoading ? "..." : translations[language].login}
          </Button>

          <div
            style={{
              textAlign: "center",
            }}
          >
            <span
              style={{
                color: "#153462",
                cursor: "pointer",
                textDecoration: "none",
              }}
              className="hover:underline"
            >
              {translations[language].forgot}
            </span>
          </div>
        </form>
      </div>
    </div>
  )
}
