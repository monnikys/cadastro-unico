// O @lovable.dev/vite-tanstack-config já inclui o seguinte — NÃO adicione manualmente,
// ou o app quebra com plugins duplicados:
//   - TanStack devtools (só em dev, primeiro), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (só no build, usando cloudflare como alvo padrão), injeção de env VITE_*, alias de path @,
//     dedupe de React/TanStack, plugins de log de erro e detecção de sandbox (port/host/strictPort).
// É possível passar configuração adicional via defineConfig({ vite: { ... }, etc... }) se necessário.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  // A build para o GitHub Pages não precisa de um runtime Nitro/SSR.
  nitro: false,
  vite: {
    // GitHub Pages publica este repositório em /cadastro-unico/.
    base: "/cadastro-unico/",
  },
  tanstackStart: {
    // Redireciona o entrypoint de servidor embutido do TanStack Start para
    // src/server.ts (nosso wrapper de erro de SSR). É a partir daqui que o
    // nitro/vite constrói o build.
    server: { entry: "server" },
    // O GitHub Pages é um host estático: gere HTML para cada rota do painel.
    prerender: {
      enabled: true,
    },
  },
});
