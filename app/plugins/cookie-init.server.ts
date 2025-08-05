export default defineNuxtPlugin(() => {
  const themeCookie = useCookie("app-theme");
  const modeCookie = useCookie("app-color-mode");
  const mascotCookie = useCookie("app-mascot");

  // Provide server-side cookie values to stores
  return {
    provide: {
      serverTheme: themeCookie.value || "rose",
      serverMode: modeCookie.value || "light",
      serverMascot: mascotCookie.value || "default",
    },
  };
});
