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
 *
 * @example
 * ```typescript
 * const { clientFetch } = useClientFetch();
 *
 * // Esta requisição será automaticamente tratada se retornar 401
 * const data = await clientFetch<MyType>("/api/endpoint");
 * ```
 */
export function useClientFetch() {
  const authStore = useAuthStore();
  let isRefreshing = false;
  let failedQueue: Array<{
    resolve: (value: any) => void;
    reject: (reason?: any) => void;
  }> = [];

  const processQueue = (error: any, token: any = null) => {
    failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve(token);
      }
    });
    failedQueue = [];
  };

  const refreshToken = async () => {
    try {
      console.log("Tentando refresh token...");
      const res = await $fetch<RefreshResponse>("/api/auth/refresh", {
        method: "POST",
      });

      if (res && res.ok) {
        authStore.setSession(
          {
            institution: authStore.user?.institution || "",
            fullName: res.identity.name,
            avatarUrl: res.identity.avatarUrl,
            hasAlternativeIdentity: res.identity.hasAlternativeIdentity,
          },
          res.authContext,
          res.identity
        );
        console.log("Refresh token bem-sucedido");
        return res;
      } else {
        throw new Error("Invalid refresh response");
      }
    } catch (error) {
      console.error("Erro no refresh token:", error);
      throw error;
    }
  };

  /**
   * Função que substitui $fetch com tratamento automático de refresh token
   *
   * @param request - URL ou configuração da requisição
   * @param options - Opções da requisição
   * @returns Promise com o resultado da requisição
   */
  const clientFetch = async <T>(
    request: any,
    options: any = {}
  ): Promise<T> => {
    try {
      return (await $fetch<T>(request, options)) as T;
    } catch (error: any) {
      // Verifica se é um erro 401
      if (error?.statusCode === 401 || error?.status === 401) {
        console.log("Detectado erro 401, tentando refresh token...");

        // Se já está fazendo refresh, adiciona à fila
        if (isRefreshing) {
          console.log("Refresh já em andamento, adicionando à fila...");
          return new Promise<T>((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(() => {
              return $fetch<T>(request, options) as T;
            })
            .catch((err) => {
              throw err;
            });
        }

        isRefreshing = true;

        try {
          await refreshToken();
          console.log("Refresh bem-sucedido, processando fila...");
          processQueue(null, null);

          // Tenta a requisição original novamente
          console.log("Repetindo requisição original...");
          return (await $fetch<T>(request, options)) as T;
        } catch (refreshError) {
          console.error("Erro no refresh, processando fila com erro...");
          processQueue(refreshError, null);
          throw refreshError;
        } finally {
          isRefreshing = false;
        }
      }

      throw error;
    }
  };

  return {
    clientFetch,
  };
}
