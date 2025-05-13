import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Middleware para adicionar cabeçalhos CORS a todas as respostas
export function middleware(request: NextRequest) {
  // Verificar se é uma requisição para a API
  if (request.nextUrl.pathname.startsWith("/api/")) {
    console.log(`Middleware: Requisição ${request.method} para ${request.nextUrl.pathname}`)

    // Para requisições OPTIONS, retornar 204 No Content com cabeçalhos CORS
    if (request.method === "OPTIONS") {
      return new NextResponse(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          "Access-Control-Max-Age": "86400",
        },
      })
    }

    // Para outras requisições, continuar com a resposta normal
    const response = NextResponse.next()

    // Adicionar cabeçalhos CORS à resposta
    response.headers.set("Access-Control-Allow-Origin", "*")
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")

    return response
  }

  // Para requisições não-API, continuar normalmente
  return NextResponse.next()
}

// Configurar o middleware para ser executado em rotas específicas
export const config = {
  matcher: "/api/:path*",
}
