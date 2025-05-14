/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Adicione esta configuração para desativar a pré-renderização estática
  experimental: {
    // Isso fará com que as páginas sejam renderizadas no momento da solicitação
    appDir: true,
  },
  // Configurar páginas específicas para serem renderizadas no lado do cliente
  unstable_runtimeJS: true,
}

export default nextConfig
