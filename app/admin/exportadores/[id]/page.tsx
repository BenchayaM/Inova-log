"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Checkbox } from "@/components/ui/checkbox"

// Tipos para os exportadores
interface DadosBancarios {
  banco: string
  agencia: string
  conta: string
  swift: string
  iban: string
  beneficiario: string
}

interface BancoIntermediario {
  nome: string
  endereco: string
  swift: string
  conta: string
  aba: string // ABA/Routing Number
  observacoes: string
}

interface FormaPagamento {
  id: string
  nome: string
  descricao: string
  ativo: boolean
}

interface Exportador {
  id: string
  nome: string
  email: string
  telefone: string
  pais: string
  endereco: string
  contato: string
  dadosBancarios: DadosBancarios
  bancoIntermediario: BancoIntermediario | null
  formasPagamento: FormaPagamento[]
  status: "Ativo" | "Inativo"
}

// Dados de exemplo
const exportadorExemplo: Exportador = {
  id: "EXP-001",
  nome: "Baoxinsheng Industrial",
  email: "contact@baoxinsheng.com",
  telefone: "+86 755 2345 6789",
  pais: "China",
  endereco: "123 Industrial Avenue, Shenzhen, Guangdong, China",
  contato: "Gabriel Lee",
  dadosBancarios: {
    banco: "Bank of China",
    agencia: "0001",
    conta: "12345678",
    swift: "BKCHCNBJ",
    iban: "CN123456789012345",
    beneficiario: "Baoxinsheng Industrial Co., Ltd.",
  },
  bancoIntermediario: {
    nome: "HSBC Hong Kong",
    endereco: "1 Queen's Road Central, Hong Kong",
    swift: "HSBCHKHH",
    conta: "123456789",
    aba: "026009593",
    observacoes: "Para transferências em USD, utilize este banco intermediário.",
  },
  formasPagamento: [
    {
      id: "fp-001",
      nome: "Carta de Crédito",
      descricao: "Pagamento via carta de crédito internacional",
      ativo: true,
    },
    {
      id: "fp-002",
      nome: "Transferência Bancária",
      descricao: "Pagamento via transferência bancária internacional",
      ativo: true,
    },
    {
      id: "fp-003",
      nome: "Pagamento Antecipado",
      descricao: "Pagamento 100% antecipado antes da produção",
      ativo: false,
    },
  ],
  status: "Ativo",
}

export default function ExportadorDetalhesPage({ params }: { params: { id: string } }) {
  const [exportador, setExportador] = useState<Exportador>(exportadorExemplo)
  const [tabAtiva, setTabAtiva] = useState("informacoes")
  const [novaFormaPagamento, setNovaFormaPagamento] = useState({ nome: "", descricao: "" })
  const [usarBancoIntermediario, setUsarBancoIntermediario] = useState(!!exportador.bancoIntermediario)
  const router = useRouter()
  const { toast } = useToast()

  // Em um cenário real, buscaríamos os dados do exportador pelo ID
  // useEffect(() => {
  //   const fetchExportador = async () => {
  //     const response = await fetch(`/api/exportadores/${params.id}`);
  //     const data = await response.json();
  //     setExportador(data);
  //   };
  //   fetchExportador();
  // }, [params.id]);

  // Manipular mudanças no formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setExportador((prev) => ({ ...prev, [name]: value }))
  }

  // Manipular mudanças nos dados bancários
  const handleBankChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setExportador((prev) => ({
      ...prev,
      dadosBancarios: {
        ...prev.dadosBancarios,
        [name]: value,
      },
    }))
  }

  // Manipular mudanças no banco intermediário
  const handleIntermediaryBankChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setExportador((prev) => ({
      ...prev,
      bancoIntermediario: {
        ...(prev.bancoIntermediario || {
          nome: "",
          endereco: "",
          swift: "",
          conta: "",
          aba: "",
          observacoes: "",
        }),
        [name]: value,
      } as BancoIntermediario,
    }))
  }

  // Alternar uso de banco intermediário
  const toggleIntermediaryBank = (checked: boolean) => {
    setUsarBancoIntermediario(checked)
    if (!checked) {
      setExportador((prev) => ({
        ...prev,
        bancoIntermediario: null,
      }))
    } else if (!exportador.bancoIntermediario) {
      setExportador((prev) => ({
        ...prev,
        bancoIntermediario: {
          nome: "",
          endereco: "",
          swift: "",
          conta: "",
          aba: "",
          observacoes: "",
        },
      }))
    }
  }

  // Manipular mudanças na nova forma de pagamento
  const handleNovaFormaPagamentoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNovaFormaPagamento((prev) => ({ ...prev, [name]: value }))
  }

  // Adicionar nova forma de pagamento
  const adicionarFormaPagamento = () => {
    if (!novaFormaPagamento.nome) {
      toast({
        title: "Erro",
        description: "O nome da forma de pagamento é obrigatório",
        variant: "destructive",
      })
      return
    }

    const novaForma: FormaPagamento = {
      id: `fp-${Date.now()}`,
      nome: novaFormaPagamento.nome,
      descricao: novaFormaPagamento.descricao,
      ativo: true,
    }

    setExportador((prev) => ({
      ...prev,
      formasPagamento: [...prev.formasPagamento, novaForma],
    }))

    setNovaFormaPagamento({ nome: "", descricao: "" })

    toast({
      title: "Forma de pagamento adicionada",
      description: `${novaFormaPagamento.nome} foi adicionada com sucesso.`,
    })
  }

  // Remover forma de pagamento
  const removerFormaPagamento = (id: string) => {
    setExportador((prev) => ({
      ...prev,
      formasPagamento: prev.formasPagamento.filter((forma) => forma.id !== id),
    }))

    toast({
      title: "Forma de pagamento removida",
      description: "A forma de pagamento foi removida com sucesso.",
    })
  }

  // Alternar status da forma de pagamento
  const alternarStatusFormaPagamento = (id: string) => {
    setExportador((prev) => ({
      ...prev,
      formasPagamento: prev.formasPagamento.map((forma) =>
        forma.id === id ? { ...forma, ativo: !forma.ativo } : forma,
      ),
    }))
  }

  // Salvar alterações
  const salvarAlteracoes = () => {
    // Aqui seria implementada a lógica para salvar as alterações no backend
    toast({
      title: "Alterações salvas",
      description: "As informações do exportador foram atualizadas com sucesso.",
    })
  }

  // Alternar status
  const alternarStatus = () => {
    setExportador((prev) => ({
      ...prev,
      status: prev.status === "Ativo" ? "Inativo" : "Ativo",
    }))
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Detalhes do Exportador</h1>
        <Badge variant={exportador.status === "Ativo" ? "success" : "secondary"} className="ml-auto">
          {exportador.status}
        </Badge>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{exportador.nome}</CardTitle>
            <CardDescription>ID: {exportador.id}</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={tabAtiva} onValueChange={setTabAtiva} className="w-full">
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="informacoes">Informações Gerais</TabsTrigger>
                <TabsTrigger value="bancarios">Dados Bancários</TabsTrigger>
                <TabsTrigger value="pagamentos">Formas de Pagamento</TabsTrigger>
              </TabsList>

              <TabsContent value="informacoes" className="space-y-4 mt-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="nome">Nome da Empresa</Label>
                    <Input id="nome" name="nome" value={exportador.nome} onChange={handleChange} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" type="email" value={exportador.email} onChange={handleChange} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="telefone">Telefone</Label>
                      <Input id="telefone" name="telefone" value={exportador.telefone} onChange={handleChange} />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="pais">País</Label>
                    <Input id="pais" name="pais" value={exportador.pais} onChange={handleChange} />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="endereco">Endereço Completo</Label>
                    <Textarea
                      id="endereco"
                      name="endereco"
                      value={exportador.endereco}
                      onChange={handleChange}
                      rows={3}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="contato">Pessoa de Contato</Label>
                    <Input id="contato" name="contato" value={exportador.contato} onChange={handleChange} />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="bancarios" className="space-y-4 mt-4">
                <div className="grid gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Dados Bancários Principais</h3>
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="banco">Nome do Banco</Label>
                        <Input
                          id="banco"
                          name="banco"
                          value={exportador.dadosBancarios.banco}
                          onChange={handleBankChange}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="agencia">Agência/Branch</Label>
                          <Input
                            id="agencia"
                            name="agencia"
                            value={exportador.dadosBancarios.agencia}
                            onChange={handleBankChange}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="conta">Número da Conta</Label>
                          <Input
                            id="conta"
                            name="conta"
                            value={exportador.dadosBancarios.conta}
                            onChange={handleBankChange}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="swift">Código SWIFT/BIC</Label>
                          <Input
                            id="swift"
                            name="swift"
                            value={exportador.dadosBancarios.swift}
                            onChange={handleBankChange}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="iban">IBAN</Label>
                          <Input
                            id="iban"
                            name="iban"
                            value={exportador.dadosBancarios.iban}
                            onChange={handleBankChange}
                          />
                        </div>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="beneficiario">Nome do Beneficiário</Label>
                        <Input
                          id="beneficiario"
                          name="beneficiario"
                          value={exportador.dadosBancarios.beneficiario}
                          onChange={handleBankChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 border-t pt-6">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="usar-banco-intermediario"
                        checked={usarBancoIntermediario}
                        onCheckedChange={toggleIntermediaryBank}
                      />
                      <Label htmlFor="usar-banco-intermediario" className="font-medium">
                        Utilizar Banco Intermediário
                      </Label>
                    </div>

                    {usarBancoIntermediario && (
                      <div className="space-y-4 mt-4">
                        <h3 className="text-lg font-medium">Banco Intermediário</h3>
                        <p className="text-sm text-muted-foreground">
                          Estas informações aparecerão na Proforma Invoice quando selecionadas.
                        </p>

                        <div className="grid gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="nome-intermediario">Nome do Banco Intermediário</Label>
                            <Input
                              id="nome-intermediario"
                              name="nome"
                              value={exportador.bancoIntermediario?.nome || ""}
                              onChange={handleIntermediaryBankChange}
                            />
                          </div>

                          <div className="grid gap-2">
                            <Label htmlFor="endereco-intermediario">Endereço do Banco</Label>
                            <Textarea
                              id="endereco-intermediario"
                              name="endereco"
                              value={exportador.bancoIntermediario?.endereco || ""}
                              onChange={handleIntermediaryBankChange}
                              rows={2}
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                              <Label htmlFor="swift-intermediario">Código SWIFT/BIC</Label>
                              <Input
                                id="swift-intermediario"
                                name="swift"
                                value={exportador.bancoIntermediario?.swift || ""}
                                onChange={handleIntermediaryBankChange}
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="conta-intermediario">Número da Conta</Label>
                              <Input
                                id="conta-intermediario"
                                name="conta"
                                value={exportador.bancoIntermediario?.conta || ""}
                                onChange={handleIntermediaryBankChange}
                              />
                            </div>
                          </div>

                          <div className="grid gap-2">
                            <Label htmlFor="aba-intermediario">ABA/Routing Number</Label>
                            <Input
                              id="aba-intermediario"
                              name="aba"
                              value={exportador.bancoIntermediario?.aba || ""}
                              onChange={handleIntermediaryBankChange}
                            />
                          </div>

                          <div className="grid gap-2">
                            <Label htmlFor="observacoes-intermediario">Observações</Label>
                            <Textarea
                              id="observacoes-intermediario"
                              name="observacoes"
                              value={exportador.bancoIntermediario?.observacoes || ""}
                              onChange={handleIntermediaryBankChange}
                              rows={3}
                              placeholder="Informações adicionais sobre o banco intermediário"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="pagamentos" className="space-y-6 mt-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Formas de Pagamento Disponíveis</h3>
                  <div className="space-y-4">
                    {exportador.formasPagamento.length === 0 ? (
                      <p className="text-muted-foreground">Nenhuma forma de pagamento cadastrada.</p>
                    ) : (
                      exportador.formasPagamento.map((forma) => (
                        <div key={forma.id} className="flex items-start justify-between border-b pb-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Checkbox
                                id={`ativo-${forma.id}`}
                                checked={forma.ativo}
                                onCheckedChange={() => alternarStatusFormaPagamento(forma.id)}
                              />
                              <Label htmlFor={`ativo-${forma.id}`} className="font-medium">
                                {forma.nome}
                              </Label>
                              {forma.ativo ? (
                                <Badge variant="success" className="ml-2">
                                  Ativo
                                </Badge>
                              ) : (
                                <Badge variant="secondary" className="ml-2">
                                  Inativo
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{forma.descricao}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removerFormaPagamento(forma.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="space-y-4 border-t pt-6">
                  <h3 className="text-lg font-medium">Adicionar Nova Forma de Pagamento</h3>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="nome-pagamento">Nome</Label>
                      <Input
                        id="nome-pagamento"
                        name="nome"
                        value={novaFormaPagamento.nome}
                        onChange={handleNovaFormaPagamentoChange}
                        placeholder="Ex: Carta de Crédito"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="descricao-pagamento">Descrição</Label>
                      <Textarea
                        id="descricao-pagamento"
                        name="descricao"
                        value={novaFormaPagamento.descricao}
                        onChange={handleNovaFormaPagamentoChange}
                        placeholder="Descreva os detalhes desta forma de pagamento"
                        rows={3}
                      />
                    </div>
                    <Button onClick={adicionarFormaPagamento} className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Forma de Pagamento
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button variant="outline" onClick={alternarStatus}>
            {exportador.status === "Ativo" ? "Desativar Exportador" : "Ativar Exportador"}
          </Button>
          <Button onClick={salvarAlteracoes}>
            <Save className="mr-2 h-4 w-4" />
            Salvar Alterações
          </Button>
        </div>
      </div>
    </div>
  )
}
