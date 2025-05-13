"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import type { Cliente } from "@/lib/clients";

interface EditarClienteProps {
  clienteId: number | null;
  aberto: boolean;
  onOpenChange: (aberto: boolean) => void;
  onClienteAtualizado: () => void;
}

export default function EditarCliente({
  clienteId,
  aberto,
  onOpenChange,
  onClienteAtualizado,
}: EditarClienteProps) {
  const [cliente, setCliente] = useState<Partial<Cliente>>({});
  const [carregando, setCarregando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [tabAtiva, setTabAtiva] = useState("informacoes");
  const { toast } = useToast();

  // Carregar dados do cliente quando o ID mudar
  useEffect(() => {
    if (clienteId && aberto) {
      carregarCliente(clienteId);
    }
  }, [clienteId, aberto]);

  // Carregar dados do cliente
  const carregarCliente = async (id: number) => {
    setCarregando(true);
    try {
      const response = await fetch(`/api/clientes/${id}`);
      const data = await response.json();

      if (data.success) {
        setCliente(data.cliente);
      } else {
        toast({
          title: "Erro",
          description: data.message || "Erro ao carregar dados do cliente",
          variant: "destructive",
        });
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Erro ao carregar cliente:", error);
      toast({
        title: "Erro",
        description: "Erro ao conectar ao servidor",
        variant: "destructive",
      });
      onOpenChange(false);
    } finally {
      setCarregando(false);
    }
  };

  // Manipular mudanças no formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCliente((prev) => ({ ...prev, [name]: value }));
  };

  // Atualizar cliente
  const atualizarCliente = async () => {
    if (!clienteId) return;
    
    setSalvando(true);
    try {
      const response = await fetch(`/api/clientes/${clienteId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cliente),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Cliente atualizado",
          description: "Os dados do cliente foram atualizados com sucesso",
        });
        onClienteAtualizado();
        onOpenChange(false);
      } else {
        toast({
          title: "Erro",
          description: data.message || "Erro ao atualizar cliente",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
      toast({
        title: "Erro",
        description: "Erro ao conectar ao servidor",
        variant: "destructive",
      });
    } finally {
      setSalvando(false);
    }
  };

  return (
    <Dialog open={aberto} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Editar Cliente</DialogTitle>
          <DialogDescription>Atualize os dados do cliente abaixo:</DialogDescription>
        </DialogHeader>

        {carregando ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Carregando dados...</span>
          </div>
        ) : (
          <>
            <Tabs value={tabAtiva} onValueChange={setTabAtiva} className="w-full mt-4">
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="informacoes">Informações Gerais</TabsTrigger>
                <TabsTrigger value="endereco">Informações de Endereço</TabsTrigger>
              </TabsList>

              <TabsContent value="informacoes" className="space-y-4 mt-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="nome">Nome da Empresa</Label>
                    <Input
                      id="nome"
                      name="nome"
                      value={cliente.nome || ""}
                      onChange={handleChange}
                      placeholder="Nome da empresa"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={cliente.email || ""}
                        onChange={handleChange}
                        placeholder="contato@empresa.com"
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
                    <Label htmlFor="status">Status</Label>
                    <select
                      id="status"
                      name="status"
                      value={cliente.status || "Ativo"}
                      onChange={(e) => setCliente({ ...cliente, status: e.target.value as "Ativo" | "Inativo" })}
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <Input
                        id="cep"
                        name="cep"
                        value={cliente.cep || ""}
                        onChange={handleChange}
                        placeholder="CEP"
                      />
                    </div>
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
  );
}
