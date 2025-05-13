"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Cliente } from "@/lib/clients"

interface EditarClienteProps {
  clienteId: number | null
  aberto: boolean
  onOpenChange: (aberto: boolean) => void
  onClienteAtualizado: () => void
}

export default function EditarCliente({ clienteId, aberto, onOpenChange, onClienteAtualizado }: EditarClienteProps) {
  const [cliente, setCliente] = useState<Partial<Cliente>>({})
  const [carregando, setCarregando] = useState(false)
  const [salvando, setSalvando] = useState(false)
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

  // Manipular mudanças no formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setCliente((prev) => ({ ...prev, [name]: value }))
  }

  // Atualizar cliente
  const atualizarCliente = async () => {
    if (!clienteId) return

    // Validar campos obrigatórios
    if (!cliente.nome || !cliente.email) {
      toast({
        title: "Erro",
        description: "Preencha os campos obrigatórios (Nome e Email)",
        variant: "destructive",
      })
      return
    }

    setSalvando(true)
    try {
      const response = await fetch(`/api/clientes/${clienteId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cliente),
      })

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Cliente atualizado",
          description: "Os dados do cliente foram atualizados com sucesso",
        })
        onClienteAtualizado()
        onOpenChange(false)
      } else {
        toast({
          title: "Erro",
          description: data.message || "Erro ao atualizar cliente",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error)
      toast({
        title: "Erro",
        description: "Erro ao conectar ao servidor",
        variant: "destructive",
      })
    } finally {
      setSalvando(false)
    }
  }

  return (
    <Dialog open={aberto} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Editar Cliente</DialogTitle>
          <DialogDescription>
            Atualize os dados do cliente abaixo. <span className="text-red-500">*</span> Campos obrigatórios
          </DialogDescription>
        </DialogHeader>

        {carregando ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Carregando dados...</span>
          </div>
        ) : (
          <>
            <Tabs value={tabAtiva} onValueChange={setTabAtiva} className="w-full mt-4">
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="informacoes">Informações Gerais</TabsTrigger>
                <TabsTrigger value="endereco">Endereço</TabsTrigger>
                <TabsTrigger value="fiscal">Informações Fiscais</TabsTrigger>
              </TabsList>

              <TabsContent value="informacoes" className="space-y-4 mt-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="nome" className="flex items-center">
                      Nome da Empresa <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input
                      id="nome"
                      name="nome"
                      value={cliente.nome || ""}
                      onChange={handleChange}
                      placeholder="Nome da empresa"
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="email" className="flex items-center">
                      Email <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={cliente.email || ""}
                      onChange={handleChange}
                      placeholder="contato@empresa.com"
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input
                      id="telefone"
                      name="telefone"
                      value={cliente.telefone || ""}
                      onChange={handleChange}
                      placeholder="(00) 0000-0000"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="contato">Pessoa de Contato</Label>
                    <Input
                      id="contato"
                      name="contato"
                      value={cliente.contato || ""}
                      onChange={handleChange}
                      placeholder="Nome do contato principal"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="cargo_contato">Cargo do Contato</Label>
                    <Input
                      id="cargo_contato"
                      name="cargo_contato"
                      value={cliente.cargo_contato || ""}
                      onChange={handleChange}
                      placeholder="Diretor, Gerente, etc."
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <select
                      id="status"
                      name="status"
                      value={cliente.status || "Ativo"}
                      onChange={handleChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="Ativo">Ativo</option>
                      <option value="Inativo">Inativo</option>
                    </select>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="endereco" className="space-y-4 mt-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="endereco">Endereço</Label>
                    <Input
                      id="endereco"
                      name="endereco"
                      value={cliente.endereco || ""}
                      onChange={handleChange}
                      placeholder="Rua, número, complemento"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="cidade">Cidade</Label>
                      <Input
                        id="cidade"
                        name="cidade"
                        value={cliente.cidade || ""}
                        onChange={handleChange}
                        placeholder="Cidade"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="estado">Estado</Label>
                      <Input
                        id="estado"
                        name="estado"
                        value={cliente.estado || ""}
                        onChange={handleChange}
                        placeholder="Estado"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="pais">País</Label>
                      <Input
                        id="pais"
                        name="pais"
                        value={cliente.pais || "Brasil"}
                        onChange={handleChange}
                        placeholder="País"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="cep">CEP</Label>
                      <Input id="cep" name="cep" value={cliente.cep || ""} onChange={handleChange} placeholder="CEP" />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="fiscal" className="space-y-4 mt-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="cnpj_cpf">CNPJ/CPF</Label>
                    <Input
                      id="cnpj_cpf"
                      name="cnpj_cpf"
                      value={cliente.cnpj_cpf || ""}
                      onChange={handleChange}
                      placeholder="00.000.000/0000-00"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="inscricao_estadual">Inscrição Estadual</Label>
                    <Input
                      id="inscricao_estadual"
                      name="inscricao_estadual"
                      value={cliente.inscricao_estadual || ""}
                      onChange={handleChange}
                      placeholder="Inscrição Estadual"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="segmento">Segmento/Ramo de Atividade</Label>
                    <Input
                      id="segmento"
                      name="segmento"
                      value={cliente.segmento || ""}
                      onChange={handleChange}
                      placeholder="Ex: Construção Civil, Varejo, etc."
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter className="mt-6">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button onClick={atualizarCliente} disabled={salvando}>
                {salvando ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Salvar Alterações"
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
