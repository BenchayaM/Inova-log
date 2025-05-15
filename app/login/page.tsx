"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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
        backgroundColor: "#f5f5f5",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          padding: "40px",
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "24px",
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
                padding: "8px 16px",
                borderRadius: "6px",
                backgroundColor: language === "pt" ? "#153462" : "#f3f4f6",
                color: language === "pt" ? "white" : "#333",
                border: "1px solid #d1d5db",
                cursor: "pointer",
                fontWeight: language === "pt" ? "bold" : "normal",
                transition: "all 0.2s ease",
              }}
            >
              Português
            </button>
            <button
              onClick={() => setLang("en")}
              style={{
                padding: "8px 16px",
                borderRadius: "6px",
                backgroundColor: language === "en" ? "#153462" : "#f3f4f6",
                color: language === "en" ? "white" : "#333",
                border: "1px solid #d1d5db",
                cursor: "pointer",
                fontWeight: language === "en" ? "bold" : "normal",
                transition: "all 0.2s ease",
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
          <div style={{ width: "200px", height: "60px", position: "relative" }}>
            <img
              src="/images/logo.png"
              alt="InovaLog"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          </div>
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
                left: "16px",
                transform: "translateY(-50%)",
                pointerEvents: "none",
                zIndex: 1,
              }}
            >
              <User size={20} color="#153462" />
            </div>
            <input
              type="email"
              placeholder={translations[language].user}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "14px 14px 14px 46px",
                backgroundColor: "#f0f4f8",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                fontSize: "16px",
                outline: "none",
                transition: "border-color 0.2s ease, box-shadow 0.2s ease",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#153462")}
              onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
              required
            />
          </div>

          <div style={{ position: "relative" }}>
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "16px",
                transform: "translateY(-50%)",
                pointerEvents: "none",
                zIndex: 1,
              }}
            >
              <Lock size={20} color="#153462" />
            </div>
            <input
              type="password"
              placeholder={translations[language].pass}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "14px 14px 14px 46px",
                backgroundColor: "#f0f4f8",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                fontSize: "16px",
                outline: "none",
                transition: "border-color 0.2s ease, box-shadow 0.2s ease",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#153462")}
              onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "14px",
              fontSize: "16px",
              fontWeight: "bold",
              backgroundColor: "#153462",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: isLoading ? "not-allowed" : "pointer",
              transition: "background-color 0.2s ease",
              marginTop: "8px",
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#0c2547")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#153462")}
          >
            {isLoading ? "..." : translations[language].login}
          </button>

          <div
            style={{
              textAlign: "center",
              marginTop: "8px",
            }}
          >
            <span
              style={{
                color: "#153462",
                cursor: "pointer",
                fontSize: "14px",
              }}
              onMouseOver={(e) => (e.currentTarget.style.textDecoration = "underline")}
              onMouseOut={(e) => (e.currentTarget.style.textDecoration = "none")}
            >
              {translations[language].forgot}
            </span>
          </div>
        </form>
      </div>
    </div>
  )
}
