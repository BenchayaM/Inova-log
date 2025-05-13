"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import type { Cliente } from "@/lib/clients";

interface VisualizarClienteProps {
  clienteId: number | null;
  aberto: boolean;
  onOpenChange: (aberto: boolean) => void;
}

export default function VisualizarCliente({
  clienteId,
  aberto,
  onOpenChange,
}: VisualizarClienteProps) {
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [carregando, setCarregando] = useState(false);
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

  if (!cliente && !carregando) return null;

  return (
    <Dialog open={aberto} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Detalhes do Cliente</DialogTitle>
        </DialogHeader>

        {carregando ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Carregando dados...</span>
          </div>
        ) : cliente ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold">Informações Gerais</h3>
                <div className="mt-2 space-y-2">
                  <p><span className="font-medium">ID:</span> {cliente.id}</p>
                  <p><span className="font-medium">Nome:</span> {cliente.nome}</p>
                  <p><span className="font-medium">Email:</span> {cliente.email}</p>
                  <p><span className="font-medium">Telefone:</span> {cliente.telefone}</p>
                  <p><span className="font-medium">Contato:</span> {cliente.contato || "Não informado"}</p>
                  <p><span className="font-medium">Status:</span> {cliente.status}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold">Endereço</h3>
                <div className="mt-2 space-y-2">
                  <p><span className="font-medium">Endereço:</span> {cliente.endereco || "Não informado"}</p>
                  <p><span className="font-medium">Cidade:</span> {cliente.cidade || "Não informada"}</p>
                  <p><span className="font-medium">Estado:</span> {cliente.estado || "Não informado"}</p>
                  <p><span className="font-medium">País:</span> {cliente.pais || "Brasil"}</p>
                  <p><span className="font-medium">CEP:</span> {cliente.cep || "Não informado"}</p>
                </div>
              </div>
            </div>
            
            {cliente.observacoes && (
              <div>
                <h3 className="text-lg font-semibold">Observações</h3>
                <p className="mt-2">{cliente.observacoes}</p>
              </div>
            )}
          </div>
        ) : null}

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
