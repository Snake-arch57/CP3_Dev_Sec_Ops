import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ["framer-motion"],
  },
  async redirects() {
    // As rotas da versão anterior continuam válidas: /ameacas virou o quiz de
    // reconhecimento e /prevencao virou o checklist acionável.
    return [
      { source: "/ameacas", destination: "/golpe", permanent: true },
      { source: "/prevencao", destination: "/agora", permanent: true },
    ];
  },
};

export default nextConfig;
