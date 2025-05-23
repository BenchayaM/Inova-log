"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Cliente } from "@/lib/clients"

interface VisualizarClienteProps {
  clienteId: number | null
  aberto: boolean
  onOpenChange: (aberto: boolean) => void
}

export default function VisualizarCliente({ clienteId, aberto, onOpenChange }: VisualizarClienteProps) {
  const [cliente, setCliente] = useState<Cliente | null>(null)
  const [carregando, setCarregando] = useState(false)
  const [tabAtiva, setTabAtiva] = useState("informacoes")
  const { toast } = useToast()

  // Carregar dados do cliente quando o ID mudar
  useEffect(() => {
    if (clienteId && aberto) {
      carregarCliente(clienteId)
    }
  }, [clienteId, aberto])

  // Carregar dados do cliente
  const carregarCliente = async (id: number) => {
    setCarregando(true)
    try {
      const response = await fetch(`/api/clientes/${id}`)

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        setCliente(data.cliente)
      } else {
        toast({
          title: "Erro",
          description: data.message || "Erro ao carregar dados do cliente",
          variant: "destructive",
        })
        onOpenChange(false)
      }
    } catch (error) {
      console.error("Erro ao carregar cliente:", error)
      toast({
        title: "Erro",
        description: "Erro ao conectar ao servidor",
        variant: "destructive",
      })
      onOpenChange(false)
    } finally {
      setCarregando(false)
    }
  }

  return (
    <Dialog open={aberto} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Detalhes do Cliente</DialogTitle>
          <DialogDescription>Informações completas do cliente.</DialogDescription>
        </DialogHeader>

        {carregando ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Carregando dados...</span>
          </div>
        ) : cliente ? (
          <>
            <div className="mb-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{cliente.nome}</h3>
                <Badge variant={cliente.status === "Ativo" ? "success" : "secondary"}>{cliente.status}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                ID: {cliente.id} | Cadastrado em: {new Date(cliente.data_cadastro!).toLocaleDateString()}
              </p>
            </div>

            <Tabs value={tabAtiva} onValueChange={setTabAtiva} className="w-full">
              <TabsList className="grid grid-cols-4">
                <TabsTrigger value="informacoes">Informações</TabsTrigger>
                <TabsTrigger value="fiscal">Fiscal</TabsTrigger>
                <TabsTrigger value="endereco">Endereço</TabsTrigger>
                <TabsTrigger value="comercial">Comercial</TabsTrigger>
              </TabsList>

              <TabsContent value="informacoes" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium">Email</h4>
                    <p className="text-sm">{cliente.email || "-"}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Telefone</h4>
                    <p className="text-sm">{cliente.telefone || "-"}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium">Pessoa de Contato</h4>
                    <p className="text-sm">{cliente.contato || "-"}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Cargo do Contato</h4>
                    <p className="text-sm">{cliente.cargo_contato || "-"}</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="fiscal" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium">CNPJ/CPF</h4>
                    <p className="text-sm">{cliente.cnpj_cpf || "-"}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Inscrição Estadual</h4>
                    <p className="text-sm">{cliente.inscricao_estadual || "-"}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium">Segmento</h4>
                  <p className="text-sm">{cliente.segmento || "-"}</p>
                </div>
              </TabsContent>

              <TabsContent value="endereco" className="space-y-4 mt-4">
                <div>
                  <h4 className="text-sm font-medium">Endereço Completo</h4>
                  <p className="text-sm">{cliente.endereco || "-"}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium">Cidade</h4>
                    <p className="text-sm">{cliente.cidade || "-"}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Estado</h4>
                    <p className="text-sm">{cliente.estado || "-"}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium">País</h4>
                    <p className="text-sm">{cliente.pais || "Brasil"}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">CEP</h4>
                    <p className="text-sm">{cliente.cep || "-"}</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="comercial" className="space-y-4 mt-4">
                <div>
                  <h4 className="text-sm font-medium">Status</h4>
                  <p className="text-sm">{cliente.status || "Ativo"}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium">Data de Cadastro</h4>
                  <p className="text-sm">
                    {cliente.data_cadastro ? new Date(cliente.data_cadastro).toLocaleDateString() : "-"}
                  </p>
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter className="mt-6">
              <Button onClick={() => onOpenChange(false)}>Fechar</Button>
            </DialogFooter>
          </>
        ) : (
          <div className="py-4 text-center">Cliente não encontrado.</div>
        )}
      </DialogContent>
    </Dialog>
  )
}
