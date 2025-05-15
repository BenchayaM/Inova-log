"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
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

    // Pequeno atraso para garantir que o estado seja atualizado
    setTimeout(() => {
      try {
        console.log("Tentando login com:", email, password)

        // Verificar credenciais
        if (email === "admin@inova-log.com" && password === "admin123") {
          console.log("Login de admin bem-sucedido, redirecionando...")
          window.location.href = "/admin/dashboard"
        } else if (email === "cliente@inova-log.com" && password === "cliente123") {
          console.log("Login de cliente bem-sucedido, redirecionando...")
          window.location.href = "/cliente/dashboard"
        } else {
          console.log("Credenciais inválidas")
          toast({
            title: translations[language].invalid,
            variant: "destructive",
          })
          setIsLoading(false)
        }
      } catch (error) {
        console.error("Erro durante o login:", error)
        toast({
          title: translations[language].invalid,
          variant: "destructive",
        })
        setIsLoading(false)
      }
    }, 500)
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f0f2f5",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "360px",
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
          padding: "30px 20px",
          boxSizing: "border-box",
        }}
      >
        {/* Seletor de idioma */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "10px",
            }}
          >
            <button
              onClick={() => setLang("pt")}
              style={{
                padding: "8px 16px",
                borderRadius: "4px",
                border: "1px solid #d1d5db",
                backgroundColor: language === "pt" ? "#153462" : "#f3f4f6",
                color: language === "pt" ? "white" : "black",
                cursor: "pointer",
              }}
            >
              Português
            </button>
            <button
              onClick={() => setLang("en")}
              style={{
                padding: "8px 16px",
                borderRadius: "4px",
                border: "1px solid #d1d5db",
                backgroundColor: language === "en" ? "#153462" : "#f3f4f6",
                color: language === "en" ? "white" : "black",
                cursor: "pointer",
              }}
            >
              English
            </button>
          </div>
        </div>

        {/* Logo */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              width: "180px",
              height: "60px",
              position: "relative",
            }}
          >
            <img
              src="/images/logo.png"
              alt="InovaLog"
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
              }}
            />
          </div>
        </div>

        {/* Formulário */}
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "16px", boxSizing: "border-box", width: "100%" }}>
            <input
              type="email"
              placeholder={translations[language].user}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "4px",
                border: "1px solid #d1d5db",
                fontSize: "16px",
                boxSizing: "border-box",
              }}
              required
            />
          </div>

          <div style={{ marginBottom: "24px", boxSizing: "border-box", width: "100%" }}>
            <input
              type="password"
              placeholder={translations[language].pass}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "4px",
                border: "1px solid #d1d5db",
                fontSize: "16px",
                boxSizing: "border-box",
              }}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#153462",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: isLoading ? "not-allowed" : "pointer",
              marginBottom: "16px",
              boxSizing: "border-box",
            }}
          >
            {isLoading ? "..." : translations[language].login}
          </button>
        </form>

        {/* Link para recuperar senha */}
        <div
          style={{
            textAlign: "center",
          }}
        >
          <button
            style={{
              background: "none",
              border: "none",
              color: "#153462",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            {translations[language].forgot}
          </button>
        </div>
      </div>
    </div>
  )
}
