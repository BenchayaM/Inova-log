"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export default function TestePage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const testConnection = async () => {
    setLoading(true)
    setError(null)

    try {
      // Usar caminho relativo para a API
      const response = await fetch("/api/teste", {
        method: "GET",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      })

      console.log("Status da resposta:", response.status)

      const text = await response.text()
      console.log("Resposta (texto):", text)

      try {
        const data = JSON.parse(text)
        console.log("Resposta (JSON):", data)
        setResult(data)
      } catch (parseError) {
        console.error("Erro ao fazer parse do JSON:", parseError)
        setError("Resposta inválida do servidor")
      }
    } catch (fetchError) {
      console.error("Erro ao conectar:", fetchError)
      setError("Erro ao conectar ao servidor")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Página de Teste de Conexão</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Teste de Conexão com o Banco de Dados</CardTitle>
          <CardDescription>
            Use este teste para verificar se a aplicação consegue se conectar ao banco de dados.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={testConnection} disabled={loading} className="mb-4">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testando...
              </>
            ) : (
              "Testar Conexão"
            )}
          </Button>

          {error && <div className="p-4 mb-4 bg-red-50 border border-red-200 rounded-md text-red-600">{error}</div>}

          {result && (
            <div className="mt-4">
              <h3 className="text-lg font-medium mb-2">Resultado do Teste:</h3>
              <div
                className={`p-4 rounded-md ${result.connected ? "bg-green-50 border border-green-200 text-green-700" : "bg-red-50 border border-red-200 text-red-600"}`}
              >
                <p className="font-medium">{result.message}</p>

                {result.env && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-1">Variáveis de Ambiente:</h4>
                    <ul className="text-sm">
                      <li>Host: {result.env.host}</li>
                      <li>Porta: {result.env.port}</li>
                      <li>Usuário: {result.env.user}</li>
                      <li>Banco de Dados: {result.env.database}</li>
                      <li>Senha: {result.env.password}</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 text-yellow-700">
        <h3 className="font-medium mb-2">Instruções:</h3>
        <ol className="list-decimal pl-5 space-y-1">
          <li>Clique no botão "Testar Conexão" acima</li>
          <li>Verifique se a conexão com o banco de dados foi bem-sucedida</li>
          <li>Se houver falha, verifique as variáveis de ambiente no Vercel</li>
          <li>Certifique-se de que o banco de dados está acessível a partir do Vercel</li>
        </ol>
      </div>
    </div>
  )
}
