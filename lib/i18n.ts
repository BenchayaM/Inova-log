// lib/i18n.ts
// Função para obter o idioma do usuário
export const getLanguage = () => {
  if (typeof window === "undefined") {
    return "pt" // Default to Portuguese on the server-side
  }

  const language = navigator.language || navigator.languages[0] || "pt"
  return language.startsWith("en") ? "en" : "pt"
}

// Definições de traduções
export const translations = {
  pt: {
    clientManagement: "Gerenciamento de Clientes",
    newClient: "Novo Cliente",
    addClient: "Adicionar Cliente",
    clientData: "Preencha os dados do cliente abaixo:",
    generalInfo: "Informações Gerais",
    addressInfo: "Informações de Endereço",
    companyName: "Nome da Empresa",
    contactPerson: "Pessoa de Contato",
    cancel: "Cancelar",
    active: "Ativo",
    inactive: "Inativo",
    actions: "Ações",
    search: "Buscar",
    clear: "Limpar",
    loading: "Carregando...",
    noClientsFound: "Nenhum cliente encontrado",
    save: "Salvar",
    close: "Fechar",
    saving: "Salvando...",
    clientUpdated: "Cliente atualizado",
    clientAdded: "Cliente adicionado",
    clientDeleted: "Cliente excluído",
    error: "Erro",
    success: "Sucesso",
  },
  en: {
    clientManagement: "Client Management",
    newClient: "New Client",
    addClient: "Add Client",
    clientData: "Fill in the client data below:",
    generalInfo: "General Information",
    addressInfo: "Address Information",
    companyName: "Company Name",
    contactPerson: "Contact Person",
    cancel: "Cancel",
    active: "Active",
    inactive: "Inactive",
    actions: "Actions",
    search: "Search",
    clear: "Clear",
    loading: "Loading...",
    noClientsFound: "No clients found",
    save: "Save",
    close: "Close",
    saving: "Saving...",
    clientUpdated: "Client updated",
    clientAdded: "Client added",
    clientDeleted: "Client deleted",
    error: "Error",
    success: "Success",
  },
}

// Tipo para as chaves de idioma suportadas
export type SupportedLanguage = "pt" | "en"
