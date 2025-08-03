import { useAuthStore } from "~/stores/auth";

interface RefreshResponse {
  ok: boolean;
  authContext: any;
  identity: {
    name: string;
    avatarUrl: string;
    hasAlternativeIdentity?: boolean;
  };
}

/**
 * Composable que fornece uma função clientFetch com refresh token automático
 * SSR-friendly - só faz refresh no lado do cliente
 *
 * @example
 * ```typescript
 * const { clientFetch } = useClientFetch();
 * const data = await clientFetch<MyType>("/api/endpoint");
 * ```
 */
export function useClientFetch() {
  const authStore = useAuthStore();
  const cookies = useCookie("nuxt-session");
  const headers = useRequestHeaders(["cookie"]);
  const requestURL = useRequestURL();
  const enviroment = import.meta.server ? "server" : "client";
  const log = (message: string) => {
    console.log(`[${enviroment}] ${message}`);
  };

  const performRefresh = async (): Promise<void> => {
    try {
      const res = await fetch(`${requestURL.origin}/api/auth/refresh`, {
        method: "POST",
        credentials: "include",
        headers: headers,
      });

      log(`Refresh bem-sucedido: ${JSON.stringify(res)}`);

      const session = res.headers.get("set-cookie");
      if (session) {
        log(`Session: ${session}`);
        const sessionCookie = session.split(";")[0].split("=")[1];
        log(`Session: ${sessionCookie}`);
        cookies.value = sessionCookie;
      }
    } catch (e: any) {
      log(`Erro no refresh: ${e}`);
      log(`Error: ${e.data}`);

      // Se for 401, limpa a sessão e redireciona para login
      const isUnauthorized = e?.status === 401 || e?.statusCode === 401;
      if (isUnauthorized && import.meta.client) {
        authStore.clearSession();
        await navigateTo("/login");
      }

      throw e;
    }
  };

  /**
   * Função que substitui $fetch com tratamento automático de refresh token
   * Se receber 401/417 => faz refresh e refaz o fetch (apenas no cliente)
   * Se tudo der certo retorna o resultado
   */
  const clientFetch = async <T>(
    request: any,
    options: any = {}
  ): Promise<T> => {
    try {
      // Primeira tentativa
      const res = (await $fetch<T>(request, {
        ...options,
        headers: headers,
      })) as T;
      log(`Resposta: ${res}`);
      return res;
    } catch (error: any) {
      log(`Erro detectado: ${error}`);
      // Verifica se é erro 401 ou 417
      if (
        error?.statusCode === 401 ||
        error?.status === 401 ||
        error?.statusCode === 417
      ) {
        console.log("Erro 401/417 detectado, fazendo refresh token...");

        try {
          console.log("Fazendo refresh token...");
          // Faz refresh do token (só no cliente)
          await performRefresh();
          console.log("Refresh bem-sucedido");
        } catch (refreshError) {
          console.error("Erro no refresh:", refreshError);
          throw refreshError;
        }

        // Refaz o fetch após o refresh
        log("Refresh bem-sucedido, refazendo requisição...");
        return (await $fetch<T>(request, {
          ...options,
          headers: headers,
        })) as T;
      }

      // Se não for 401/417, re-lança o erro original
      throw error;
    }
  };

  return {
    clientFetch,
  };
}
