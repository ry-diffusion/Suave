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

export function useAuthRefresh() {
  const authStore = useAuthStore();
  let intervalId: ReturnType<typeof setInterval> | null = null;
  const userSession = useUserSession();

  // Retry configuration
  const maxRetries = 3;
  const baseDelay = 1000; // 1 second
  let retryCount = 0;

  const refresh = async (isRetry = false): Promise<RefreshResponse> => {
    try {
      const res = await $fetch<RefreshResponse>("/api/auth/refresh", {
        method: "POST",
      });

      if (res && res.ok) {
        // Reset retry count on successful refresh
        retryCount = 0;

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
        return res;
      } else {
        throw new Error("Invalid refresh response");
      }
    } catch (e: any) {
      // Check if it's a 401 status code
      const isUnauthorized = e?.status === 401 || e?.statusCode === 401;

      if (isUnauthorized && userSession.loggedIn) {
        // Only logout on 401 status
        authStore.clearSession();
        await navigateTo("/login");
        throw e;
      } else if (!isRetry && retryCount < maxRetries) {
        // Retry with exponential backoff
        retryCount++;
        const delay = baseDelay * 2 ** (retryCount - 1);

        console.warn(
          `Refresh failed, retrying in ${delay}ms (attempt ${retryCount}/${maxRetries})`
        );

        await new Promise((resolve) => setTimeout(resolve, delay));
        return await refresh(true);
      } else {
        // Max retries reached or not a retry attempt
        if (retryCount >= maxRetries) {
          console.error(`Refresh failed after ${maxRetries} retries:`, e);
        } else {
          console.error("Refresh failed:", e);
        }
        throw e;
      }
    }
  };

  // Função para refresh manual quando necessário
  const manualRefresh = async () => {
    retryCount = 0; // Reset retry count for manual refresh
    return await refresh();
  };

  watch(userSession.ready, (newVal) => {
    if (newVal) {
      retryCount = 0; // Reset retry count for initial refresh
      refresh(); // Initial refresh on mount
    }
  });

  onMounted(() => {
    intervalId = setInterval(() => {
      retryCount = 0; // Reset retry count for interval refresh
      refresh();
    }, 5 * 60 * 1000); // Every 5 minutes
  });

  onUnmounted(() => {
    if (intervalId) clearInterval(intervalId);
  });

  return {
    refresh: manualRefresh,
  };
}
