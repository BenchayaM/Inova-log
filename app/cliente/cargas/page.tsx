"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Truck, Calendar, Package } from "lucide-react"
import { Progress } from "@/components/ui/progress"

// Dados de exemplo
const cargas = [
  {
    id: "CARGA-2025-001",
    pedidoId: "PED-2025-001",
    dataEmbarque: "10/05/2025",
    previsaoChegada: "25/05/2025",
    transportadora: "Express Shipping",
    status: "Em trânsito",
    progresso: 65,
    rastreamento: "ES12345678",
  },
  {
    id: "CARGA-2025-002",
    pedidoId: "PED-2025-002",
    dataEmbarque: "12/05/2025",
    previsaoChegada: "27/05/2025",
    transportadora: "Global Logistics",
    status: "Preparando embarque",
    progresso: 20,
    rastreamento: "GL87654321",
  },
]

export default function CargasPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Acompanhamento de Cargas</h1>

      <div className="grid gap-6">
        {cargas.map((carga) => (
          <Card key={carga.id}>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle className="text-xl">{carga.id}</CardTitle>
                  <CardDescription>Pedido: {carga.pedidoId}</CardDescription>
                </div>
                <Badge className="w-fit" variant={carga.status === "Em trânsito" ? "default" : "outline"}>
                  {carga.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <div className="flex justify-between text-sm">
                    <span>Progresso da entrega</span>
                    <span>{carga.progresso}%</span>
                  </div>
                  <Progress value={carga.progresso} className="h-2" />

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div className="flex flex-col gap-1">
                      <div className="text-sm font-medium text-muted-foreground flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Data de Embarque
                      </div>
                      <div>{carga.dataEmbarque}</div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="text-sm font-medium text-muted-foreground flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Previsão de Chegada
                      </div>
                      <div>{carga.previsaoChegada}</div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="text-sm font-medium text-muted-foreground flex items-center">
                        <Truck className="h-4 w-4 mr-1" />
                        Transportadora
                      </div>
                      <div>{carga.transportadora}</div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="text-sm font-medium text-muted-foreground flex items-center">
                        <Package className="h-4 w-4 mr-1" />
                        Código de Rastreamento
                      </div>
                      <div>{carga.rastreamento}</div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button>
                    <Eye className="h-4 w-4 mr-2" />
                    Detalhes Completos
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
