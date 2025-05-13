"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle, XCircle, Database } from "lucide-react"

export default function DiagnosticoPage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const runDiagnostic = async () => {
    setLoading(true)
    setError(null)

    try {
      // Usar caminho relativo para a API
      const response = await fetch("/api/diagnostico", {
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
      <h1 className="text-2xl font-bold mb-6">Diagnóstico de Conexão com Banco de Dados</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Diagnóstico Avançado</CardTitle>
          <CardDescription>Esta ferramenta realiza testes detalhados na conexão com o banco de dados.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={runDiagnostic} disabled={loading} className="mb-4">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Executando diagnóstico...
              </>
            ) : (
              <>
                <Database className="mr-2 h-4 w-4" />
                Executar Diagnóstico
              </>
            )}
          </Button>

          {error && <div className="p-4 mb-4 bg-red-50 border border-red-200 rounded-md text-red-600">{error}</div>}

          {result && (
            <div className="mt-4 space-y-4">
              <h3 className="text-lg font-medium">Resultados do Diagnóstico:</h3>

              {/* Conexão com Pool */}
              <div
                className={`p-4 rounded-md ${result.poolConnection.connected ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}
              >
                <div className="flex items-center">
                  {result.poolConnection.connected ? (
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600 mr-2" />
                  )}
                  <h4 className="font-medium">Conexão com Pool</h4>
                </div>
                <p className={`mt-1 ${result.poolConnection.connected ? "text-green-700" : "text-red-700"}`}>
                  {result.poolConnection.message}
                </p>
              </div>

              {/* Conexão Direta */}
              <div
                className={`p-4 rounded-md ${result.directConnection.connected ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}
              >
                <div className="flex items-center">
                  {result.directConnection.connected ? (
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600 mr-2" />
                  )}
                  <h4 className="font-medium">Conexão Direta</h4>
                </div>
                <p className={`mt-1 ${result.directConnection.connected ? "text-green-700" : "text-red-700"}`}>
                  {result.directConnection.message}
                </p>
                {result.directConnection.error && (
                  <p className="mt-2 text-red-600 text-sm bg-red-50 p-2 rounded">
                    Erro: {result.directConnection.error}
                  </p>
                )}
              </div>

              {/* Tabelas (se disponível) */}
              {result.directConnection.connected && result.tables && result.tables.length > 0 && (
                <div className="p-4 rounded-md bg-blue-50 border border-blue-200">
                  <h4 className="font-medium text-blue-800">Tabelas Encontradas:</h4>
                  <ul className="mt-2 list-disc pl-5 text-blue-700">
                    {result.tables.map((table: any, index: number) => (
                      <li key={index}>{Object.values(table)[0]}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Variáveis de Ambiente */}
              <div className="p-4 rounded-md bg-gray-50 border border-gray-200">
                <h4 className="font-medium">Variáveis de Ambiente:</h4>
                <ul className="mt-2 text-sm space-y-1">
                  <li>
                    <span className="font-medium">Host:</span> {result.env.host}
                  </li>
                  <li>
                    <span className="font-medium">Porta:</span> {result.env.port}
                  </li>
                  <li>
                    <span className="font-medium">Usuário:</span> {result.env.user}
                  </li>
                  <li>
                    <span className="font-medium">Banco de Dados:</span> {result.env.database}
                  </li>
                  <li>
                    <span className="font-medium">Senha:</span> {result.env.password}
                  </li>
                </ul>
              </div>

              {/* Dicas */}
              {!result.directConnection.connected && (
                <div className="p-4 rounded-md bg-yellow-50 border border-yellow-200">
                  <h4 className="font-medium text-yellow-800">Dicas para resolver problemas:</h4>
                  <ul className="mt-2 list-disc pl-5 text-yellow-700">
                    {result.tips.map((tip: string, index: number) => (
                      <li key={index}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
