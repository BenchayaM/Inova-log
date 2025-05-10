"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Save,
  User,
  Lock,
  Bell,
  Database,
  FileText,
  Plus,
  Trash2,
  Edit,
  RefreshCw,
  Download,
  Upload,
  Search,
  DollarSign,
  Ship,
  Folder,
} from "lucide-react"
import { getLanguage, translations } from "@/lib/i18n"
import { useToast } from "@/hooks/use-toast"
import { Textarea } from "@/components/ui/textarea"

// Dados de exemplo para usuários administradores
const adminUsers = [
  {
    id: 1,
    nome: "Admin Principal",
    email: "admin@inova-log.com",
    ultimoAcesso: "09/05/2025 14:30",
    status: "ativo",
  },
]

// Dados de exemplo para logs do sistema
const systemLogs = [
  {
    id: 1,
    data: "09/05/2025 15:45",
    usuario: "admin@inova-log.com",
    acao: "login",
    detalhes: "Login bem-sucedido",
  },
  {
    id: 2,
    data: "09/05/2025 16:10",
    usuario: "admin@inova-log.com",
    acao: "pedido_atualizado",
    detalhes: "Pedido atualizado para status 'Em produção'",
  },
  {
    id: 3,
    data: "09/05/2025 16:30",
    usuario: "admin@inova-log.com",
    acao: "documento_gerado",
    detalhes: "Proforma Invoice gerada para AMAZON TEMPER MANAUS",
  },
  {
    id: 4,
    data: "09/05/2025 17:15",
    usuario: "admin@inova-log.com",
    acao: "usuario_criado",
    detalhes: "Novo usuário cliente criado: cliente@inova-log.com",
  },
  {
    id: 5,
    data: "09/05/2025 17:45",
    usuario: "admin@inova-log.com",
    acao: "logout",
    detalhes: "Logout do sistema",
  },
]

// Dados de exemplo para tipos de pagamento
const tiposPagamento = [
  {
    id: 1,
    nome: "Carta de Crédito",
    descricao: "Pagamento via carta de crédito internacional",
    ativo: true,
  },
  {
    id: 2,
    nome: "Transferência Bancária",
    descricao: "Pagamento via transferência bancária internacional",
    ativo: true,
  },
  {
    id: 3,
    nome: "Pagamento Antecipado",
    descricao: "Pagamento 100% antecipado antes da produção",
    ativo: true,
  },
  {
    id: 4,
    nome: "Pagamento Parcelado",
    descricao: "Pagamento em parcelas conforme cronograma acordado",
    ativo: false,
  },
]

// Dados de exemplo para modalidades de embarque
const modalidadesEmbarque = [
  {
    id: 1,
    codigo: "FOB",
    nome: "Free On Board",
    descricao: "Vendedor é responsável até o embarque da mercadoria no navio",
    ativo: true,
  },
  {
    id: 2,
    codigo: "CIF",
    nome: "Cost, Insurance and Freight",
    descricao: "Vendedor paga custo, seguro e frete até o porto de destino",
    ativo: true,
  },
  {
    id: 3,
    codigo: "CFR",
    nome: "Cost and Freight",
    descricao: "Vendedor paga custo e frete até o porto de destino, sem seguro",
    ativo: true,
  },
  {
    id: 4,
    codigo: "EXW",
    nome: "Ex Works",
    descricao: "Comprador assume todos os custos e riscos desde a origem",
    ativo: false,
  },
]

// Dados de exemplo para grupos de produtos
const gruposProdutos = [
  {
    id: 1,
    nome: "Vidros",
    descricao: "Produtos de vidro para construção civil",
    ativo: true,
    subgrupos: [
      { id: 101, nome: "Vidro Temperado", ativo: true },
      { id: 102, nome: "Vidro Laminado", ativo: true },
      { id: 103, nome: "Vidro Comum", ativo: false },
    ],
  },
  {
    id: 2,
    nome: "Ferragens",
    descricao: "Ferragens para instalação de vidros",
    ativo: true,
    subgrupos: [
      { id: 201, nome: "Puxadores", ativo: true },
      { id: 202, nome: "Dobradiças", ativo: true },
      { id: 203, nome: "Fechaduras", ativo: true },
    ],
  },
  {
    id: 3,
    nome: "Acessórios",
    descricao: "Acessórios para acabamento",
    ativo: true,
    subgrupos: [
      { id: 301, nome: "Perfis de Alumínio", ativo: true },
      { id: 302, nome: "Borrachas de Vedação", ativo: true },
    ],
  },
]

export default function ConfiguracoesPage() {
  const [language, setLanguage] = useState<"pt" | "en">("pt")
  const [activeTab, setActiveTab] = useState("conta")
  const [notificacoesEmail, setNotificacoesEmail] = useState(true)
  const [notificacoesPush, setNotificacoesPush] = useState(true)
  const [notificacoesOrcamentos, setNotificacoesOrcamentos] = useState(true)
  const [notificacoesPedidos, setNotificacoesPedidos] = useState(true)
  const [notificacoesDocumentos, setNotificacoesDocumentos] = useState(true)
  const [notificacoesPagamentos, setNotificacoesPagamentos] = useState(true)
  const [backupAutomatico, setBackupAutomatico] = useState(true)
  const [frequenciaBackup, setFrequenciaBackup] = useState("diario")
  const [senhaAtual, setSenhaAtual] = useState("")
  const [novaSenha, setNovaSenha] = useState("")
  const [confirmarSenha, setConfirmarSenha] = useState("")
  const [novoUsuarioNome, setNovoUsuarioNome] = useState("")
  const [novoUsuarioEmail, setNovoUsuarioEmail] = useState("")
  const [novoUsuarioSenha, setNovoUsuarioSenha] = useState("")

  // Estados para novos tipos de pagamento
  const [novoTipoPagamento, setNovoTipoPagamento] = useState({ nome: "", descricao: "" })
  const [tiposPagamentoLista, setTiposPagamentoLista] = useState(tiposPagamento)

  // Estados para novas modalidades de embarque
  const [novaModalidadeEmbarque, setNovaModalidadeEmbarque] = useState({ codigo: "", nome: "", descricao: "" })
  const [modalidadesEmbarqueLista, setModalidadesEmbarqueLista] = useState(modalidadesEmbarque)

  // Estados para grupos e subgrupos
  const [gruposLista, setGruposLista] = useState(gruposProdutos)
  const [novoGrupo, setNovoGrupo] = useState({ nome: "", descricao: "" })
  const [grupoSelecionado, setGrupoSelecionado] = useState<number | null>(null)
  const [novoSubgrupo, setNovoSubgrupo] = useState({ nome: "" })

  const { toast } = useToast()

  useEffect(() => {
    setLanguage(getLanguage())
  }, [])

  const t = translations[language]

  // Salvar configurações de conta
  const salvarConfiguracoesConta = () => {
    if (novaSenha !== confirmarSenha) {
      toast({
        title: language === "pt" ? "Erro" : "Error",
        description: language === "pt" ? "As senhas não coincidem" : "Passwords do not match",
        variant: "destructive",
      })
      return
    }

    if (novaSenha && novaSenha.length < 8) {
      toast({
        title: language === "pt" ? "Erro" : "Error",
        description:
          language === "pt"
            ? "A senha deve ter pelo menos 8 caracteres"
            : "Password must be at least 8 characters long",
        variant: "destructive",
      })
      return
    }

    // Aqui seria implementada a lógica para salvar as configurações de conta
    toast({
      title: language === "pt" ? "Sucesso" : "Success",
      description:
        language === "pt" ? "Configurações de conta atualizadas com sucesso" : "Account settings updated successfully",
    })

    // Limpar campos de senha
    setSenhaAtual("")
    setNovaSenha("")
    setConfirmarSenha("")
  }

  // Salvar configurações de notificações
  const salvarConfiguracoesNotificacoes = () => {
    // Aqui seria implementada a lógica para salvar as configurações de notificações
    toast({
      title: language === "pt" ? "Sucesso" : "Success",
      description:
        language === "pt"
          ? "Configurações de notificações atualizadas com sucesso"
          : "Notification settings updated successfully",
    })
  }

  // Salvar configurações de sistema
  const salvarConfiguracoesSistema = () => {
    // Aqui seria implementada a lógica para salvar as configurações de sistema
    toast({
      title: language === "pt" ? "Sucesso" : "Success",
      description:
        language === "pt" ? "Configurações de sistema atualizadas com sucesso" : "System settings updated successfully",
    })
  }

  // Adicionar novo usuário administrador
  const adicionarNovoUsuario = () => {
    if (!novoUsuarioNome || !novoUsuarioEmail || !novoUsuarioSenha) {
      toast({
        title: language === "pt" ? "Erro" : "Error",
        description: language === "pt" ? "Preencha todos os campos obrigatórios" : "Fill in all required fields",
        variant: "destructive",
      })
      return
    }

    if (novoUsuarioSenha.length < 8) {
      toast({
        title: language === "pt" ? "Erro" : "Error",
        description:
          language === "pt"
            ? "A senha deve ter pelo menos 8 caracteres"
            : "Password must be at least 8 characters long",
        variant: "destructive",
      })
      return
    }

    // Aqui seria implementada a lógica para adicionar um novo usuário administrador
    toast({
      title: language === "pt" ? "Sucesso" : "Success",
      description:
        language === "pt"
          ? `Usuário ${novoUsuarioNome} adicionado com sucesso`
          : `User ${novoUsuarioNome} added successfully`,
    })

    // Limpar campos
    setNovoUsuarioNome("")
    setNovoUsuarioEmail("")
    setNovoUsuarioSenha("")
  }

  // Realizar backup do sistema
  const realizarBackup = () => {
    // Aqui seria implementada a lógica para realizar o backup do sistema
    toast({
      title: language === "pt" ? "Sucesso" : "Success",
      description:
        language === "pt"
          ? "Backup do sistema iniciado. Você será notificado quando estiver concluído."
          : "System backup started. You will be notified when it's complete.",
    })
  }

  // Restaurar backup
  const restaurarBackup = () => {
    // Aqui seria implementada a lógica para restaurar um backup
    toast({
      title: language === "pt" ? "Atenção" : "Attention",
      description:
        language === "pt"
          ? "Funcionalidade de restauração disponível apenas para administradores de sistema."
          : "Restore functionality available only for system administrators.",
    })
  }

  // Adicionar novo tipo de pagamento
  const adicionarTipoPagamento = () => {
    if (!novoTipoPagamento.nome) {
      toast({
        title: "Erro",
        description: "O nome do tipo de pagamento é obrigatório",
        variant: "destructive",
      })
      return
    }

    const novoTipo = {
      id: tiposPagamentoLista.length + 1,
      nome: novoTipoPagamento.nome,
      descricao: novoTipoPagamento.descricao,
      ativo: true,
    }

    setTiposPagamentoLista([...tiposPagamentoLista, novoTipo])
    setNovoTipoPagamento({ nome: "", descricao: "" })

    toast({
      title: "Tipo de pagamento adicionado",
      description: `${novoTipoPagamento.nome} foi adicionado com sucesso.`,
    })
  }

  // Alternar status do tipo de pagamento
  const alternarStatusTipoPagamento = (id: number) => {
    setTiposPagamentoLista(tiposPagamentoLista.map((tipo) => (tipo.id === id ? { ...tipo, ativo: !tipo.ativo } : tipo)))
  }

  // Remover tipo de pagamento
  const removerTipoPagamento = (id: number) => {
    setTiposPagamentoLista(tiposPagamentoLista.filter((tipo) => tipo.id !== id))

    toast({
      title: "Tipo de pagamento removido",
      description: "O tipo de pagamento foi removido com sucesso.",
    })
  }

  // Adicionar nova modalidade de embarque
  const adicionarModalidadeEmbarque = () => {
    if (!novaModalidadeEmbarque.codigo || !novaModalidadeEmbarque.nome) {
      toast({
        title: "Erro",
        description: "O código e o nome da modalidade de embarque são obrigatórios",
        variant: "destructive",
      })
      return
    }

    const novaModalidade = {
      id: modalidadesEmbarqueLista.length + 1,
      codigo: novaModalidadeEmbarque.codigo,
      nome: novaModalidadeEmbarque.nome,
      descricao: novaModalidadeEmbarque.descricao,
      ativo: true,
    }

    setModalidadesEmbarqueLista([...modalidadesEmbarqueLista, novaModalidade])
    setNovaModalidadeEmbarque({ codigo: "", nome: "", descricao: "" })

    toast({
      title: "Modalidade de embarque adicionada",
      description: `${novaModalidadeEmbarque.codigo} - ${novaModalidadeEmbarque.nome} foi adicionada com sucesso.`,
    })
  }

  // Alternar status da modalidade de embarque
  const alternarStatusModalidadeEmbarque = (id: number) => {
    setModalidadesEmbarqueLista(
      modalidadesEmbarqueLista.map((modalidade) =>
        modalidade.id === id ? { ...modalidade, ativo: !modalidade.ativo } : modalidade,
      ),
    )
  }

  // Remover modalidade de embarque
  const removerModalidadeEmbarque = (id: number) => {
    setModalidadesEmbarqueLista(modalidadesEmbarqueLista.filter((modalidade) => modalidade.id !== id))

    toast({
      title: "Modalidade de embarque removida",
      description: "A modalidade de embarque foi removida com sucesso.",
    })
  }

  // Adicionar novo grupo
  const adicionarGrupo = () => {
    if (!novoGrupo.nome) {
      toast({
        title: "Erro",
        description: "O nome do grupo é obrigatório",
        variant: "destructive",
      })
      return
    }

    const grupo = {
      id: gruposLista.length + 1,
      nome: novoGrupo.nome,
      descricao: novoGrupo.descricao,
      ativo: true,
      subgrupos: [],
    }

    setGruposLista([...gruposLista, grupo])
    setNovoGrupo({ nome: "", descricao: "" })

    toast({
      title: "Grupo adicionado",
      description: `${novoGrupo.nome} foi adicionado com sucesso.`,
    })
  }

  // Alternar status do grupo
  const alternarStatusGrupo = (id: number) => {
    setGruposLista(gruposLista.map((grupo) => (grupo.id === id ? { ...grupo, ativo: !grupo.ativo } : grupo)))
  }

  // Remover grupo
  const removerGrupo = (id: number) => {
    setGruposLista(gruposLista.filter((grupo) => grupo.id !== id))

    toast({
      title: "Grupo removido",
      description: "O grupo foi removido com sucesso.",
    })
  }

  // Adicionar novo subgrupo
  const adicionarSubgrupo = () => {
    if (!novoSubgrupo.nome || grupoSelecionado === null) {
      toast({
        title: "Erro",
        description: "O nome do subgrupo é obrigatório e um grupo deve estar selecionado",
        variant: "destructive",
      })
      return
    }

    setGruposLista(
      gruposLista.map((grupo) => {
        if (grupo.id === grupoSelecionado) {
          const novoId =
            grupo.subgrupos.length > 0 ? Math.max(...grupo.subgrupos.map((sg) => sg.id)) + 1 : grupo.id * 100 + 1

          return {
            ...grupo,
            subgrupos: [...grupo.subgrupos, { id: novoId, nome: novoSubgrupo.nome, ativo: true }],
          }
        }
        return grupo
      }),
    )

    setNovoSubgrupo({ nome: "" })

    toast({
      title: "Subgrupo adicionado",
      description: `${novoSubgrupo.nome} foi adicionado com sucesso.`,
    })
  }

  // Alternar status do subgrupo
  const alternarStatusSubgrupo = (grupoId: number, subgrupoId: number) => {
    setGruposLista(
      gruposLista.map((grupo) => {
        if (grupo.id === grupoId) {
          return {
            ...grupo,
            subgrupos: grupo.subgrupos.map((subgrupo) =>
              subgrupo.id === subgrupoId ? { ...subgrupo, ativo: !subgrupo.ativo } : subgrupo,
            ),
          }
        }
        return grupo
      }),
    )
  }

  // Remover subgrupo
  const removerSubgrupo = (grupoId: number, subgrupoId: number) => {
    setGruposLista(
      gruposLista.map((grupo) => {
        if (grupo.id === grupoId) {
          return {
            ...grupo,
            subgrupos: grupo.subgrupos.filter((subgrupo) => subgrupo.id !== subgrupoId),
          }
        }
        return grupo
      }),
    )

    toast({
      title: "Subgrupo removido",
      description: "O subgrupo foi removido com sucesso.",
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t.settings}</h1>
        <p className="text-muted-foreground">
          {language === "pt"
            ? "Gerencie as configurações do sistema e da sua conta."
            : "Manage system and account settings."}
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-8 mb-4">
          <TabsTrigger value="conta">
            <User className="h-4 w-4 mr-2" />
            {language === "pt" ? "Conta" : "Account"}
          </TabsTrigger>
          <TabsTrigger value="usuarios">
            <User className="h-4 w-4 mr-2" />
            {language === "pt" ? "Usuários" : "Users"}
          </TabsTrigger>
          <TabsTrigger value="notificacoes">
            <Bell className="h-4 w-4 mr-2" />
            {language === "pt" ? "Notificações" : "Notifications"}
          </TabsTrigger>
          <TabsTrigger value="sistema">
            <Database className="h-4 w-4 mr-2" />
            {language === "pt" ? "Sistema" : "System"}
          </TabsTrigger>
          <TabsTrigger value="pagamentos">
            <DollarSign className="h-4 w-4 mr-2" />
            {language === "pt" ? "Pagamentos" : "Payments"}
          </TabsTrigger>
          <TabsTrigger value="embarque">
            <Ship className="h-4 w-4 mr-2" />
            {language === "pt" ? "Embarque" : "Shipping"}
          </TabsTrigger>
          <TabsTrigger value="categorias">
            <Folder className="h-4 w-4 mr-2" />
            {language === "pt" ? "Categorias" : "Categories"}
          </TabsTrigger>
          <TabsTrigger value="logs">
            <FileText className="h-4 w-4 mr-2" />
            {language === "pt" ? "Logs" : "Logs"}
          </TabsTrigger>
        </TabsList>

        {/* Aba de Conta */}
        <TabsContent value="conta">
          <Card>
            <CardHeader>
              <CardTitle>{language === "pt" ? "Configurações de Conta" : "Account Settings"}</CardTitle>
              <CardDescription>
                {language === "pt"
                  ? "Gerencie as configurações da sua conta de administrador."
                  : "Manage your administrator account settings."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">
                  {language === "pt" ? "Informações Pessoais" : "Personal Information"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">{language === "pt" ? "Nome" : "Name"}</Label>
                    <Input id="nome" defaultValue="Admin Principal" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="admin@inova-log.com" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">{language === "pt" ? "Alterar Senha" : "Change Password"}</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="senha-atual">{language === "pt" ? "Senha Atual" : "Current Password"}</Label>
                    <Input
                      id="senha-atual"
                      type="password"
                      value={senhaAtual}
                      onChange={(e) => setSenhaAtual(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nova-senha">{language === "pt" ? "Nova Senha" : "New Password"}</Label>
                    <Input
                      id="nova-senha"
                      type="password"
                      value={novaSenha}
                      onChange={(e) => setNovaSenha(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmar-senha">
                      {language === "pt" ? "Confirmar Nova Senha" : "Confirm New Password"}
                    </Label>
                    <Input
                      id="confirmar-senha"
                      type="password"
                      value={confirmarSenha}
                      onChange={(e) => setConfirmarSenha(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">
                  {language === "pt" ? "Preferências de Idioma" : "Language Preferences"}
                </h3>
                <div className="space-y-2">
                  <Label htmlFor="idioma">{language === "pt" ? "Idioma Padrão" : "Default Language"}</Label>
                  <Select defaultValue={language}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt">Português</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="cn">中文</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={salvarConfiguracoesConta}>
                <Save className="h-4 w-4 mr-2" />
                {language === "pt" ? "Salvar Alterações" : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Aba de Usuários */}
        <TabsContent value="usuarios">
          <Card>
            <CardHeader>
              <CardTitle>{language === "pt" ? "Gerenciamento de Usuários" : "User Management"}</CardTitle>
              <CardDescription>
                {language === "pt"
                  ? "Gerencie os usuários administradores do sistema."
                  : "Manage system administrator users."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">{language === "pt" ? "Adicionar Novo Usuário" : "Add New User"}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="novo-nome">{language === "pt" ? "Nome" : "Name"}</Label>
                    <Input
                      id="novo-nome"
                      value={novoUsuarioNome}
                      onChange={(e) => setNovoUsuarioNome(e.target.value)}
                      placeholder={language === "pt" ? "Nome completo" : "Full name"}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="novo-email">Email</Label>
                    <Input
                      id="novo-email"
                      type="email"
                      value={novoUsuarioEmail}
                      onChange={(e) => setNovoUsuarioEmail(e.target.value)}
                      placeholder={language === "pt" ? "email@inova-log.com" : "email@inova-log.com"}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="novo-senha">{language === "pt" ? "Senha Inicial" : "Initial Password"}</Label>
                    <Input
                      id="novo-senha"
                      type="password"
                      value={novoUsuarioSenha}
                      onChange={(e) => setNovoUsuarioSenha(e.target.value)}
                      placeholder={language === "pt" ? "Mínimo 8 caracteres" : "Minimum 8 characters"}
                    />
                  </div>
                </div>
                <Button onClick={adicionarNovoUsuario}>
                  <Plus className="h-4 w-4 mr-2" />
                  {language === "pt" ? "Adicionar Usuário" : "Add User"}
                </Button>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">{language === "pt" ? "Usuários Existentes" : "Existing Users"}</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>{language === "pt" ? "Nome" : "Name"}</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>{language === "pt" ? "Último Acesso" : "Last Access"}</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>{language === "pt" ? "Ações" : "Actions"}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {adminUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.id}</TableCell>
                        <TableCell>{user.nome}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.ultimoAcesso}</TableCell>
                        <TableCell>
                          <Badge variant={user.status === "ativo" ? "success" : "secondary"}>
                            {user.status === "ativo"
                              ? language === "pt"
                                ? "Ativo"
                                : "Active"
                              : language === "pt"
                                ? "Inativo"
                                : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Lock className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba de Notificações */}
        <TabsContent value="notificacoes">
          <Card>
            <CardHeader>
              <CardTitle>{language === "pt" ? "Configurações de Notificações" : "Notification Settings"}</CardTitle>
              <CardDescription>
                {language === "pt"
                  ? "Gerencie como e quando você recebe notificações do sistema."
                  : "Manage how and when you receive system notifications."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">
                  {language === "pt" ? "Canais de Notificação" : "Notification Channels"}
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>{language === "pt" ? "Notificações por Email" : "Email Notifications"}</Label>
                      <p className="text-sm text-muted-foreground">
                        {language === "pt" ? "Receber notificações por email" : "Receive notifications by email"}
                      </p>
                    </div>
                    <Switch checked={notificacoesEmail} onCheckedChange={setNotificacoesEmail} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>{language === "pt" ? "Notificações Push" : "Push Notifications"}</Label>
                      <p className="text-sm text-muted-foreground">
                        {language === "pt"
                          ? "Receber notificações no navegador"
                          : "Receive notifications in the browser"}
                      </p>
                    </div>
                    <Switch checked={notificacoesPush} onCheckedChange={setNotificacoesPush} />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">
                  {language === "pt" ? "Tipos de Notificação" : "Notification Types"}
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>{language === "pt" ? "Orçamentos" : "Quotes"}</Label>
                      <p className="text-sm text-muted-foreground">
                        {language === "pt"
                          ? "Notificações sobre novos orçamentos e alterações"
                          : "Notifications about new quotes and changes"}
                      </p>
                    </div>
                    <Switch checked={notificacoesOrcamentos} onCheckedChange={setNotificacoesOrcamentos} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>{language === "pt" ? "Pedidos" : "Orders"}</Label>
                      <p className="text-sm text-muted-foreground">
                        {language === "pt"
                          ? "Notificações sobre novos pedidos e alterações de status"
                          : "Notifications about new orders and status changes"}
                      </p>
                    </div>
                    <Switch checked={notificacoesPedidos} onCheckedChange={setNotificacoesPedidos} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>{language === "pt" ? "Documentos" : "Documents"}</Label>
                      <p className="text-sm text-muted-foreground">
                        {language === "pt"
                          ? "Notificações sobre novos documentos e aprovações"
                          : "Notifications about new documents and approvals"}
                      </p>
                    </div>
                    <Switch checked={notificacoesDocumentos} onCheckedChange={setNotificacoesDocumentos} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>{language === "pt" ? "Pagamentos" : "Payments"}</Label>
                      <p className="text-sm text-muted-foreground">
                        {language === "pt"
                          ? "Notificações sobre pagamentos e alterações financeiras"
                          : "Notifications about payments and financial changes"}
                      </p>
                    </div>
                    <Switch checked={notificacoesPagamentos} onCheckedChange={setNotificacoesPagamentos} />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={salvarConfiguracoesNotificacoes}>
                <Save className="h-4 w-4 mr-2" />
                {language === "pt" ? "Salvar Alterações" : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Aba de Sistema */}
        <TabsContent value="sistema">
          <Card>
            <CardHeader>
              <CardTitle>{language === "pt" ? "Configurações do Sistema" : "System Settings"}</CardTitle>
              <CardDescription>
                {language === "pt" ? "Gerencie as configurações gerais do sistema." : "Manage general system settings."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">
                  {language === "pt" ? "Backup e Restauração" : "Backup and Restore"}
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>{language === "pt" ? "Backup Automático" : "Automatic Backup"}</Label>
                      <p className="text-sm text-muted-foreground">
                        {language === "pt"
                          ? "Realizar backup automático do sistema"
                          : "Perform automatic system backup"}
                      </p>
                    </div>
                    <Switch checked={backupAutomatico} onCheckedChange={setBackupAutomatico} />
                  </div>

                  {backupAutomatico && (
                    <div className="space-y-2">
                      <Label htmlFor="frequencia-backup">
                        {language === "pt" ? "Frequência de Backup" : "Backup Frequency"}
                      </Label>
                      <Select value={frequenciaBackup} onValueChange={setFrequenciaBackup}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="diario">{language === "pt" ? "Diário" : "Daily"}</SelectItem>
                          <SelectItem value="semanal">{language === "pt" ? "Semanal" : "Weekly"}</SelectItem>
                          <SelectItem value="mensal">{language === "pt" ? "Mensal" : "Monthly"}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <Button variant="outline" onClick={realizarBackup}>
                      <Download className="h-4 w-4 mr-2" />
                      {language === "pt" ? "Realizar Backup Agora" : "Perform Backup Now"}
                    </Button>
                    <Button variant="outline" onClick={restaurarBackup}>
                      <Upload className="h-4 w-4 mr-2" />
                      {language === "pt" ? "Restaurar Backup" : "Restore Backup"}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">
                  {language === "pt" ? "Manutenção do Sistema" : "System Maintenance"}
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="limpar-cache">
                      {language === "pt" ? "Limpar Cache do Sistema" : "Clear System Cache"}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {language === "pt"
                        ? "Limpar arquivos temporários e cache do sistema"
                        : "Clear temporary files and system cache"}
                    </p>
                    <Button variant="outline">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      {language === "pt" ? "Limpar Cache" : "Clear Cache"}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">
                  {language === "pt" ? "Configurações Avançadas" : "Advanced Settings"}
                </h3>
                <div className="space-y-2">
                  <Label htmlFor="timeout-sessao">
                    {language === "pt" ? "Timeout de Sessão (minutos)" : "Session Timeout (minutes)"}
                  </Label>
                  <Input id="timeout-sessao" type="number" defaultValue="30" min="5" max="120" />
                  <p className="text-sm text-muted-foreground">
                    {language === "pt"
                      ? "Tempo de inatividade até o logout automático"
                      : "Inactivity time until automatic logout"}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={salvarConfiguracoesSistema}>
                <Save className="h-4 w-4 mr-2" />
                {language === "pt" ? "Salvar Alterações" : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Aba de Pagamentos */}
        <TabsContent value="pagamentos">
          <Card>
            <CardHeader>
              <CardTitle>{language === "pt" ? "Tipos de Pagamento" : "Payment Types"}</CardTitle>
              <CardDescription>
                {language === "pt"
                  ? "Gerencie os tipos de pagamento disponíveis para proformas e pedidos."
                  : "Manage payment types available for proformas and orders."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">
                  {language === "pt" ? "Adicionar Novo Tipo de Pagamento" : "Add New Payment Type"}
                </h3>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="nome-pagamento">{language === "pt" ? "Nome" : "Name"}</Label>
                    <Input
                      id="nome-pagamento"
                      value={novoTipoPagamento.nome}
                      onChange={(e) => setNovoTipoPagamento({ ...novoTipoPagamento, nome: e.target.value })}
                      placeholder={language === "pt" ? "Ex: Carta de Crédito" : "Ex: Letter of Credit"}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="descricao-pagamento">{language === "pt" ? "Descrição" : "Description"}</Label>
                    <Textarea
                      id="descricao-pagamento"
                      value={novoTipoPagamento.descricao}
                      onChange={(e) => setNovoTipoPagamento({ ...novoTipoPagamento, descricao: e.target.value })}
                      placeholder={language === "pt" ? "Descreva este tipo de pagamento" : "Describe this payment type"}
                      rows={3}
                    />
                  </div>
                  <Button onClick={adicionarTipoPagamento}>
                    <Plus className="h-4 w-4 mr-2" />
                    {language === "pt" ? "Adicionar Tipo de Pagamento" : "Add Payment Type"}
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">
                  {language === "pt" ? "Tipos de Pagamento Existentes" : "Existing Payment Types"}
                </h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>{language === "pt" ? "Nome" : "Name"}</TableHead>
                      <TableHead>{language === "pt" ? "Descrição" : "Description"}</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>{language === "pt" ? "Ações" : "Actions"}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tiposPagamentoLista.map((tipo) => (
                      <TableRow key={tipo.id}>
                        <TableCell>{tipo.id}</TableCell>
                        <TableCell>{tipo.nome}</TableCell>
                        <TableCell className="max-w-xs truncate">{tipo.descricao}</TableCell>
                        <TableCell>
                          <Badge variant={tipo.ativo ? "success" : "secondary"}>
                            {tipo.ativo
                              ? language === "pt"
                                ? "Ativo"
                                : "Active"
                              : language === "pt"
                                ? "Inativo"
                                : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => alternarStatusTipoPagamento(tipo.id)}>
                              {tipo.ativo
                                ? language === "pt"
                                  ? "Desativar"
                                  : "Deactivate"
                                : language === "pt"
                                  ? "Ativar"
                                  : "Activate"}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removerTipoPagamento(tipo.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba de Modalidades de Embarque */}
        <TabsContent value="embarque">
          <Card>
            <CardHeader>
              <CardTitle>{language === "pt" ? "Modalidades de Embarque" : "Shipping Terms"}</CardTitle>
              <CardDescription>
                {language === "pt"
                  ? "Gerencie as modalidades de embarque disponíveis para proformas e pedidos."
                  : "Manage shipping terms available for proformas and orders."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">
                  {language === "pt" ? "Adicionar Nova Modalidade de Embarque" : "Add New Shipping Term"}
                </h3>
                <div className="grid gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="codigo-embarque">{language === "pt" ? "Código" : "Code"}</Label>
                      <Input
                        id="codigo-embarque"
                        value={novaModalidadeEmbarque.codigo}
                        onChange={(e) =>
                          setNovaModalidadeEmbarque({ ...novaModalidadeEmbarque, codigo: e.target.value })
                        }
                        placeholder="Ex: FOB, CIF, CFR"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="nome-embarque">{language === "pt" ? "Nome" : "Name"}</Label>
                      <Input
                        id="nome-embarque"
                        value={novaModalidadeEmbarque.nome}
                        onChange={(e) => setNovaModalidadeEmbarque({ ...novaModalidadeEmbarque, nome: e.target.value })}
                        placeholder={language === "pt" ? "Ex: Free On Board" : "Ex: Free On Board"}
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="descricao-embarque">{language === "pt" ? "Descrição" : "Description"}</Label>
                    <Textarea
                      id="descricao-embarque"
                      value={novaModalidadeEmbarque.descricao}
                      onChange={(e) =>
                        setNovaModalidadeEmbarque({ ...novaModalidadeEmbarque, descricao: e.target.value })
                      }
                      placeholder={
                        language === "pt" ? "Descreva esta modalidade de embarque" : "Describe this shipping term"
                      }
                      rows={3}
                    />
                  </div>
                  <Button onClick={adicionarModalidadeEmbarque}>
                    <Plus className="h-4 w-4 mr-2" />
                    {language === "pt" ? "Adicionar Modalidade de Embarque" : "Add Shipping Term"}
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">
                  {language === "pt" ? "Modalidades de Embarque Existentes" : "Existing Shipping Terms"}
                </h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>{language === "pt" ? "Código" : "Code"}</TableHead>
                      <TableHead>{language === "pt" ? "Nome" : "Name"}</TableHead>
                      <TableHead>{language === "pt" ? "Descrição" : "Description"}</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>{language === "pt" ? "Ações" : "Actions"}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {modalidadesEmbarqueLista.map((modalidade) => (
                      <TableRow key={modalidade.id}>
                        <TableCell>{modalidade.id}</TableCell>
                        <TableCell className="font-medium">{modalidade.codigo}</TableCell>
                        <TableCell>{modalidade.nome}</TableCell>
                        <TableCell className="max-w-xs truncate">{modalidade.descricao}</TableCell>
                        <TableCell>
                          <Badge variant={modalidade.ativo ? "success" : "secondary"}>
                            {modalidade.ativo
                              ? language === "pt"
                                ? "Ativo"
                                : "Active"
                              : language === "pt"
                                ? "Inativo"
                                : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => alternarStatusModalidadeEmbarque(modalidade.id)}
                            >
                              {modalidade.ativo
                                ? language === "pt"
                                  ? "Desativar"
                                  : "Deactivate"
                                : language === "pt"
                                  ? "Ativar"
                                  : "Activate"}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removerModalidadeEmbarque(modalidade.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba de Categorias (Grupos e Subgrupos) */}
        <TabsContent value="categorias">
          <Card>
            <CardHeader>
              <CardTitle>{language === "pt" ? "Categorias de Produtos" : "Product Categories"}</CardTitle>
              <CardDescription>
                {language === "pt"
                  ? "Gerencie os grupos e subgrupos para categorização de produtos."
                  : "Manage groups and subgroups for product categorization."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">{language === "pt" ? "Adicionar Novo Grupo" : "Add New Group"}</h3>
                <div className="grid gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="nome-grupo">{language === "pt" ? "Nome do Grupo" : "Group Name"}</Label>
                      <Input
                        id="nome-grupo"
                        value={novoGrupo.nome}
                        onChange={(e) => setNovoGrupo({ ...novoGrupo, nome: e.target.value })}
                        placeholder={language === "pt" ? "Ex: Vidros" : "Ex: Glass"}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="descricao-grupo">{language === "pt" ? "Descrição" : "Description"}</Label>
                      <Input
                        id="descricao-grupo"
                        value={novoGrupo.descricao}
                        onChange={(e) => setNovoGrupo({ ...novoGrupo, descricao: e.target.value })}
                        placeholder={language === "pt" ? "Descrição do grupo" : "Group description"}
                      />
                    </div>
                  </div>
                  <Button onClick={adicionarGrupo}>
                    <Plus className="h-4 w-4 mr-2" />
                    {language === "pt" ? "Adicionar Grupo" : "Add Group"}
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">
                  {language === "pt" ? "Adicionar Novo Subgrupo" : "Add New Subgroup"}
                </h3>
                <div className="grid gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="grupo-pai">{language === "pt" ? "Grupo" : "Group"}</Label>
                      <Select
                        value={grupoSelecionado?.toString() || ""}
                        onValueChange={(value) => setGrupoSelecionado(value ? Number.parseInt(value) : null)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={language === "pt" ? "Selecione um grupo" : "Select a group"} />
                        </SelectTrigger>
                        <SelectContent>
                          {gruposLista.map((grupo) => (
                            <SelectItem key={grupo.id} value={grupo.id.toString()}>
                              {grupo.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="nome-subgrupo">{language === "pt" ? "Nome do Subgrupo" : "Subgroup Name"}</Label>
                      <Input
                        id="nome-subgrupo"
                        value={novoSubgrupo.nome}
                        onChange={(e) => setNovoSubgrupo({ ...novoSubgrupo, nome: e.target.value })}
                        placeholder={language === "pt" ? "Ex: Vidro Temperado" : "Ex: Tempered Glass"}
                      />
                    </div>
                  </div>
                  <Button onClick={adicionarSubgrupo} disabled={!grupoSelecionado}>
                    <Plus className="h-4 w-4 mr-2" />
                    {language === "pt" ? "Adicionar Subgrupo" : "Add Subgroup"}
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">
                  {language === "pt" ? "Grupos e Subgrupos Existentes" : "Existing Groups and Subgroups"}
                </h3>

                {gruposLista.map((grupo) => (
                  <Card key={grupo.id} className="mb-4">
                    <CardHeader className="py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-base flex items-center">
                            {grupo.nome}
                            <Badge variant={grupo.ativo ? "success" : "secondary"} className="ml-2">
                              {grupo.ativo
                                ? language === "pt"
                                  ? "Ativo"
                                  : "Active"
                                : language === "pt"
                                  ? "Inativo"
                                  : "Inactive"}
                            </Badge>
                          </CardTitle>
                          <CardDescription>{grupo.descricao}</CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => alternarStatusGrupo(grupo.id)}>
                            {grupo.ativo
                              ? language === "pt"
                                ? "Desativar"
                                : "Deactivate"
                              : language === "pt"
                                ? "Ativar"
                                : "Activate"}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removerGrupo(grupo.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="py-2">
                      <h4 className="text-sm font-medium mb-2">{language === "pt" ? "Subgrupos" : "Subgroups"}</h4>
                      {grupo.subgrupos.length > 0 ? (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>ID</TableHead>
                              <TableHead>{language === "pt" ? "Nome" : "Name"}</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>{language === "pt" ? "Ações" : "Actions"}</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {grupo.subgrupos.map((subgrupo) => (
                              <TableRow key={subgrupo.id}>
                                <TableCell>{subgrupo.id}</TableCell>
                                <TableCell>{subgrupo.nome}</TableCell>
                                <TableCell>
                                  <Badge variant={subgrupo.ativo ? "success" : "secondary"}>
                                    {subgrupo.ativo
                                      ? language === "pt"
                                        ? "Ativo"
                                        : "Active"
                                      : language === "pt"
                                        ? "Inativo"
                                        : "Inactive"}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => alternarStatusSubgrupo(grupo.id, subgrupo.id)}
                                    >
                                      {subgrupo.ativo
                                        ? language === "pt"
                                          ? "Desativar"
                                          : "Deactivate"
                                        : language === "pt"
                                          ? "Ativar"
                                          : "Activate"}
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => removerSubgrupo(grupo.id, subgrupo.id)}
                                      className="text-destructive"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          {language === "pt" ? "Nenhum subgrupo cadastrado." : "No subgroups registered."}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba de Logs */}
        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>{language === "pt" ? "Logs do Sistema" : "System Logs"}</CardTitle>
              <CardDescription>
                {language === "pt" ? "Visualize os logs de atividade do sistema." : "View system activity logs."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">
                    {language === "pt" ? "Atividades Recentes" : "Recent Activities"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {language === "pt"
                      ? "Últimas atividades registradas no sistema"
                      : "Latest activities recorded in the system"}
                  </p>
                </div>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  {language === "pt" ? "Exportar Logs" : "Export Logs"}
                </Button>
              </div>

              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder={language === "pt" ? "Buscar nos logs..." : "Search logs..."}
                      className="pl-8"
                    />
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{language === "pt" ? "Todas as ações" : "All actions"}</SelectItem>
                      <SelectItem value="login">Login / Logout</SelectItem>
                      <SelectItem value="pedido">{language === "pt" ? "Pedidos" : "Orders"}</SelectItem>
                      <SelectItem value="documento">{language === "pt" ? "Documentos" : "Documents"}</SelectItem>
                      <SelectItem value="usuario">{language === "pt" ? "Usuários" : "Users"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>{language === "pt" ? "Data/Hora" : "Date/Time"}</TableHead>
                      <TableHead>{language === "pt" ? "Usuário" : "User"}</TableHead>
                      <TableHead>{language === "pt" ? "Ação" : "Action"}</TableHead>
                      <TableHead>{language === "pt" ? "Detalhes" : "Details"}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {systemLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>{log.id}</TableCell>
                        <TableCell>{log.data}</TableCell>
                        <TableCell>{log.usuario}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {log.acao === "login"
                              ? "Login/Logout"
                              : log.acao === "pedido_atualizado"
                                ? language === "pt"
                                  ? "Pedido Atualizado"
                                  : "Order Updated"
                                : log.acao === "documento_gerado"
                                  ? language === "pt"
                                    ? "Documento Gerado"
                                    : "Document Generated"
                                  : log.acao === "usuario_criado"
                                    ? language === "pt"
                                      ? "Usuário Criado"
                                      : "User Created"
                                    : log.acao === "logout"
                                      ? "Logout"
                                      : log.acao}
                          </Badge>
                        </TableCell>
                        <TableCell>{log.detalhes}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
