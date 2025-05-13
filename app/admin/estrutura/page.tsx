"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function EstruturaPage() {
  const [estrutura, setEstrutura] = useState<any>(null)
  const [amostra, setAmostra] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    carregarEstrutura()
  }, [])

  const carregarEstrutura = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/estrutura", {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      })

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        setEstrutura(data.structure)
        setAmostra(data.sample)
      } else {
        setError(data.message || "Erro ao carregar estrutura da tabela")
      }
    } catch (error) {
      console.error("Erro ao carregar estrutura:", error)
      setError("Erro ao conectar ao servidor")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Estrutura da Tabela Clientes</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Estrutura da Tabela</CardTitle>
          <CardDescription>Detalhes da estrutura da tabela clientes no banco de dados.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Carregando dados...</span>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-600">{error}</div>
          ) : (
            <>
              <h3 className="text-lg font-medium mb-4">Campos da Tabela:</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campo</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Nulo</TableHead>
                    <TableHead>Chave</TableHead>
                    <TableHead>Padrão</TableHead>
                    <TableHead>Extra</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {estrutura &&
                    estrutura.map((campo: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{campo.Field}</TableCell>
                        <TableCell>{campo.Type}</TableCell>
                        <TableCell>{campo.Null}</TableCell>
                        <TableCell>{campo.Key}</TableCell>
                        <TableCell>{campo.Default === null ? "NULL" : campo.Default}</TableCell>
                        <TableCell>{campo.Extra}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>

              {amostra && amostra.length > 0 && (
                <>
                  <h3 className="text-lg font-medium mt-8 mb-4">Amostra de Dados:</h3>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {Object.keys(amostra[0]).map((key) => (
                            <TableHead key={key}>{key}</TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {amostra.map((registro: any, index: number) => (
                          <TableRow key={index}>
                            {Object.values(registro).map((valor: any, i) => (
                              <TableCell key={i}>{valor === null ? "NULL" : String(valor)}</TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </>
              )}

              <div className="mt-6">
                <Button onClick={carregarEstrutura}>Atualizar Dados</Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
