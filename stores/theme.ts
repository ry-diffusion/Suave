import { defineStore } from "pinia";
import { ref } from "vue";

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

const STORAGE_KEY = "app-theme";
const COLOR_MODE_KEY = "app-color-mode";

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

// Get initial theme from localStorage or default to rose
const getInitialTheme = (): ColorTheme => {
  if (typeof window === "undefined") return availableThemes.rose;

  const savedTheme = localStorage.getItem(STORAGE_KEY);
  if (savedTheme && savedTheme in availableThemes) {
    return availableThemes[savedTheme];
  }
  return availableThemes.rose;
};

// Get initial color mode
const getInitialColorMode = (): "light" | "dark" => {
  if (typeof window === "undefined") return "dark";

  const savedMode = localStorage.getItem(COLOR_MODE_KEY);
  return savedMode === "dark" || savedMode === "light" ? savedMode : "light";
};

export const useThemeStore = defineStore("theme", () => {
  const currentTheme = ref<ColorTheme>(getInitialTheme());
  const colorMode = ref<"light" | "dark">(getInitialColorMode());

  function setTheme(themeName: keyof typeof availableThemes) {
    if (themeName in availableThemes) {
      currentTheme.value = availableThemes[themeName];
      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, themeName);
      }
    }
  }

  function toggleColorMode() {
    colorMode.value = colorMode.value === "light" ? "dark" : "light";
    if (typeof window !== "undefined") {
      localStorage.setItem(COLOR_MODE_KEY, colorMode.value);
      document.documentElement.classList.toggle(
        "dark",
        colorMode.value === "dark"
      );
    }
  }

  // Initialize color mode
  if (typeof window !== "undefined") {
    document.documentElement.classList.toggle(
      "dark",
      colorMode.value === "dark"
    );
  }

  return {
    currentTheme,
    colorMode,
    setTheme,
    toggleColorMode,
    availableThemes,
    themeDisplayNames,
    getPreviewColor: (color: string) => {
      return availableThemes[color]?.preview || "#000000";
    },
  };
});
