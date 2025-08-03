import { defineStore } from "pinia";
import { ref } from "vue";
import { useCookie } from "#imports";

type ColorTheme = {
  primary: string;
  neutral: string;
  secondary: string;
  success: string;
  info: string;
  warning: string;
  error: string;
  preview: string;
};

const THEME_COOKIE = "app-theme";
const COLOR_MODE_COOKIE = "app-color-mode";

const availableThemes: Record<string, ColorTheme> = {
  monochrome: {
    primary: "zinc",
    neutral: "zinc",
    secondary: "zinc",
    success: "zinc",
    info: "zinc",
    warning: "zinc",
    error: "zinc",
    preview: "#71717a",
  },
  rose: {
    primary: "rose",
    neutral: "zinc",
    secondary: "rose",
    success: "green",
    info: "blue",
    warning: "yellow",
    error: "red",
    preview: "#f43f5e",
  },
  green: {
    primary: "green",
    neutral: "zinc",
    secondary: "emerald",
    success: "green",
    info: "teal",
    warning: "amber",
    error: "red",
    preview: "#22c55e",
  },
  blue: {
    primary: "blue",
    neutral: "zinc",
    secondary: "cyan",
    success: "emerald",
    info: "blue",
    warning: "amber",
    error: "rose",
    preview: "#3b82f6",
  },
  red: {
    primary: "red",
    neutral: "zinc",
    secondary: "rose",
    success: "emerald",
    info: "blue",
    warning: "amber",
    error: "red",
    preview: "#ef4444",
  },
  purple: {
    primary: "purple",
    neutral: "zinc",
    secondary: "fuchsia",
    success: "emerald",
    info: "indigo",
    warning: "amber",
    error: "rose",
    preview: "#a855f7",
  },
  yellow: {
    primary: "yellow",
    neutral: "zinc",
    secondary: "amber",
    success: "emerald",
    info: "blue",
    warning: "yellow",
    error: "rose",
    preview: "#eab308",
  },
  orange: {
    primary: "orange",
    neutral: "zinc",
    secondary: "amber",
    success: "emerald",
    info: "blue",
    warning: "orange",
    error: "rose",
    preview: "#f97316",
  },
  teal: {
    primary: "teal",
    neutral: "zinc",
    secondary: "cyan",
    success: "emerald",
    info: "teal",
    warning: "amber",
    error: "rose",
    preview: "#14b8a6",
  },
  cyan: {
    primary: "cyan",
    neutral: "zinc",
    secondary: "sky",
    success: "emerald",
    info: "cyan",
    warning: "amber",
    error: "rose",
    preview: "#06b6d4",
  },
  emerald: {
    primary: "emerald",
    neutral: "zinc",
    secondary: "green",
    success: "emerald",
    info: "teal",
    warning: "amber",
    error: "rose",
    preview: "#10b981",
  },
};

const themeDisplayNames: Record<string, string> = {
  monochrome: "Monocromático",
  rose: "Rosé",
  green: "Verde",
  blue: "Azul",
  red: "Vermelho",
  purple: "Roxo",
  yellow: "Amarelo",
  orange: "Tangerina",
  teal: "Turquesa",
  cyan: "Ciano",
  emerald: "Esmeralda",
};

// Universal function to get theme by name
export const getThemeByName = (name: string): ColorTheme | undefined => {
  return availableThemes[name];
};

// Server-side theme initialization
export const getServerTheme = () => {
  const themeCookie = useCookie(THEME_COOKIE);
  const modeCookie = useCookie(COLOR_MODE_COOKIE);

  return {
    theme:
      themeCookie.value && themeCookie.value in availableThemes
        ? availableThemes[themeCookie.value]
        : availableThemes.rose,
    mode:
      modeCookie.value === "dark" || modeCookie.value === "light"
        ? modeCookie.value
        : "light",
  };
};

// Function to set CSS variables for theme
const setThemeCSSVariables = (theme: ColorTheme) => {
  if (import.meta.client) {
    document.documentElement.style.setProperty(
      "--color-primary",
      `var(--color-${theme.primary}-500)`
    );
    document.documentElement.style.setProperty(
      "--color-secondary",
      `var(--color-${theme.secondary}-500)`
    );
    document.documentElement.style.setProperty(
      "--color-success",
      `var(--color-${theme.success}-500)`
    );
    document.documentElement.style.setProperty(
      "--color-info",
      `var(--color-${theme.info}-500)`
    );
    document.documentElement.style.setProperty(
      "--color-warning",
      `var(--color-${theme.warning}-500)`
    );
    document.documentElement.style.setProperty(
      "--color-error",
      `var(--color-${theme.error}-500)`
    );
    document.documentElement.style.setProperty(
      "--color-neutral",
      `var(--color-${theme.neutral}-500)`
    );
  }
};

export const useThemeStore = defineStore("theme", () => {
  // Initialize with default values, will be updated on client mount
  const currentTheme = ref<ColorTheme>(availableThemes.rose!);
  const colorMode = ref<"light" | "dark">("dark");

  function setTheme(themeName: keyof typeof availableThemes) {
    if (themeName in availableThemes) {
      currentTheme.value = availableThemes[themeName]!;
      // Save to cookie
      const themeCookie = useCookie(THEME_COOKIE);
      themeCookie.value = themeName;
      // Update CSS variables
      setThemeCSSVariables(currentTheme.value);
    }
  }

  function toggleColorMode() {
    // Add a small delay to ensure the transition is visible
    setTimeout(() => {
      colorMode.value = colorMode.value === "light" ? "dark" : "light";
      const modeCookie = useCookie(COLOR_MODE_COOKIE);
      modeCookie.value = colorMode.value;

      if (import.meta.client) {
        document.documentElement.classList.toggle(
          "dark",
          colorMode.value === "dark"
        );
      }
    }, 50);
  }

  function setColorMode(mode: "light" | "dark") {
    colorMode.value = mode;
    const modeCookie = useCookie(COLOR_MODE_COOKIE);
    modeCookie.value = mode;
    if (import.meta.client) {
      document.documentElement.classList.toggle("dark", mode === "dark");
    }
  }

  // Initialize store with server values
  function initializeFromServer(
    serverTheme: ColorTheme,
    serverMode: "light" | "dark"
  ) {
    currentTheme.value = serverTheme;
    colorMode.value = serverMode;

    if (import.meta.client) {
      document.documentElement.classList.toggle("dark", serverMode === "dark");
      // Set initial CSS variables
      setThemeCSSVariables(serverTheme);
    }
  }

  return {
    currentTheme,
    colorMode,
    setTheme,
    setColorMode,
    toggleColorMode,
    initializeFromServer,
    availableThemes,
    themeDisplayNames,
    getPreviewColor: (color: string) => {
      return availableThemes[color]?.preview || "#000000";
    },
  };
});
