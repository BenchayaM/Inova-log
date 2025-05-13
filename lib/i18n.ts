export const getLanguage = () => {
  if (typeof window === "undefined") {
    return "pt" // Default to Portuguese on the server-side
  }

  // Check for a language preference stored by the login page
  // This could be in localStorage, cookies, or another storage mechanism used by your app
  const storedLanguage =
    localStorage.getItem("selectedLanguage") ||
    sessionStorage.getItem("selectedLanguage") ||
    document.documentElement.getAttribute("data-language") ||
    document.documentElement.lang

  if (storedLanguage === "en" || storedLanguage === "pt") {
    return storedLanguage
  }

  // Fall back to browser language
  const language = navigator.language || navigator.languages[0] || "pt"
  return language.startsWith("en") ? "en" : "pt"
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

// Function to listen for language changes
export const setupLanguageListener = (callback: (lang: string) => void) => {
  if (typeof window === "undefined") return () => {}

  // Create a MutationObserver to watch for changes to the html element's attributes
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (
        mutation.type === "attributes" &&
        (mutation.attributeName === "lang" || mutation.attributeName === "data-language")
      ) {
        const newLang = getLanguage()
        callback(newLang)
      }
    })
  })

  // Start observing the document with the configured parameters
  observer.observe(document.documentElement, { attributes: true })

  // Also check for storage events (in case language is stored in localStorage)
  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === "selectedLanguage") {
      const newLang = getLanguage()
      callback(newLang)
    }
  }

  window.addEventListener("storage", handleStorageChange)

  // Return a cleanup function
  return () => {
    observer.disconnect()
    window.removeEventListener("storage", handleStorageChange)
  }
}
