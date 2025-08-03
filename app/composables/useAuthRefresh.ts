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

  const refresh = async () => {
    try {
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
        return res;
      } else {
        throw new Error("Invalid refresh response");
      }
    } catch (e) {
      if (userSession.loggedIn) {
        authStore.clearSession();
        await navigateTo("/login");
      } else {
        console.error(e);
      }
      throw e;
    }
  };

  // Função para refresh manual quando necessário
  const manualRefresh = async () => {
    return await refresh();
  };

  watch(userSession.ready, (newVal) => {
    if (newVal) {
      refresh(); // Initial refresh on mount
    }
  });

  onMounted(() => {
    intervalId = setInterval(refresh, 5 * 60 * 1000); // Every 5 minutes
  });

  onUnmounted(() => {
    if (intervalId) clearInterval(intervalId);
  });

  return {
    refresh: manualRefresh,
  };
}
