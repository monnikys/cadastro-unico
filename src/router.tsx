import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();
  const basepath = import.meta.env.BASE_URL.replace(/\/$/, "");

  const router = createRouter({
    routeTree,
    context: { queryClient },
    // Mantém os links internos dentro de /cadastro-unico/ no GitHub Pages.
    // A chave só é incluída quando há um prefixo real: com
    // exactOptionalPropertyTypes, passar `basepath: undefined` explicitamente
    // não é a mesma coisa que omitir a chave.
    ...(basepath ? { basepath } : {}),
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return router;
};
