import { useUserSession } from "#imports";
export default defineNuxtRouteMiddleware(() => {
  if (import.meta.server) {
    return;
  }
  const nuxtApp = useNuxtApp();
  if (
    import.meta.client &&
    nuxtApp.isHydrating &&
    nuxtApp.payload.serverRendered
  ) {
    return;
  }

  const { loggedIn } = useUserSession();

  // If user is not logged in, redirect to login page
  if (!loggedIn.value) {
    return navigateTo("/login");
  }
});
