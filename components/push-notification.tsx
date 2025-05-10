"use client"

import { useEffect, useState } from "react"
import { toast } from "@/hooks/use-toast"
import { Bell } from "lucide-react"
import { getLanguage, translations } from "@/lib/i18n"

interface PushNotificationProps {
  title: string
  body: string
  icon?: string
  onClick?: () => void
}

export function requestNotificationPermission() {
  if (!("Notification" in window)) {
    console.log("Este navegador não suporta notificações desktop")
    return false
  }

  if (Notification.permission === "granted") {
    return true
  }

  if (Notification.permission !== "denied") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        return true
      }
    })
  }

  return false
}

export function sendPushNotification({ title, body, icon, onClick }: PushNotificationProps) {
  if (!("Notification" in window)) {
    console.log("Este navegador não suporta notificações desktop")
    return
  }

  if (Notification.permission === "granted") {
    const notification = new Notification(title, {
      body,
      icon: icon || "/favicon.ico",
    })

    if (onClick) {
      notification.onclick = onClick
    }

    // Também mostrar um toast dentro da aplicação
    toast({
      title,
      description: body,
      duration: 5000,
    })
  } else {
    // Fallback para toast se as notificações não forem permitidas
    toast({
      title,
      description: body,
      duration: 5000,
    })
  }
}

export function PushNotificationButton() {
  const [language, setLanguage] = useState<"pt" | "en">("pt")
  const [permissionGranted, setPermissionGranted] = useState(false)

  useEffect(() => {
    setLanguage(getLanguage())

    if (Notification.permission === "granted") {
      setPermissionGranted(true)
    }
  }, [])

  const t = translations[language]

  const handleRequestPermission = () => {
    requestNotificationPermission()
    if (Notification.permission === "granted") {
      setPermissionGranted(true)
      toast({
        title: language === "pt" ? "Notificações ativadas" : "Notifications enabled",
        description:
          language === "pt"
            ? "Você receberá notificações sobre atualizações importantes."
            : "You will receive notifications about important updates.",
        duration: 3000,
      })
    }
  }

  return (
    <button
      onClick={handleRequestPermission}
      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
    >
      <Bell className="h-4 w-4" />
      {permissionGranted
        ? language === "pt"
          ? "Notificações ativadas"
          : "Notifications enabled"
        : language === "pt"
          ? "Ativar notificações"
          : "Enable notifications"}
    </button>
  )
}
