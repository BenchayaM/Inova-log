export const getLanguage = () => {
  if (typeof window === "undefined") {
    return "pt" // Default to Portuguese on the server-side
  }

  // Try to get language from various sources
  try {
    // Check for a language preference stored by the login page
    const storedLanguage =
      localStorage.getItem("selectedLanguage") ||
      sessionStorage.getItem("selectedLanguage") ||
      document.documentElement.getAttribute("data-language") ||
      document.documentElement.lang

    if (storedLanguage === "en" || storedLanguage === "pt") {
      return storedLanguage
    }
  } catch (e) {
    console.log("Error accessing storage:", e)
    // Continue to fallback
  }

  // Fall back to browser language if available
  try {
    const language = navigator.language || (navigator.languages && navigator.languages[0]) || "pt"
    return language.startsWith("en") ? "en" : "pt"
  } catch (e) {
    console.log("Error accessing navigator language:", e)
    // Final fallback
    return "pt"
  }
}

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

// Simplified language change detection
export const setupLanguageListener = (callback: (lang: string) => void) => {
  if (typeof window === "undefined") return () => {}

  // Check for language changes periodically
  const interval = setInterval(() => {
    const newLang = getLanguage()
    callback(newLang)
  }, 2000)

  // Return cleanup function
  return () => {
    clearInterval(interval)
  }
}
