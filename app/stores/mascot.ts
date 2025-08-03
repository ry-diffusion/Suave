import { defineStore } from "pinia";
import { ref } from "vue";
import { useCookie } from "#imports";

type Mascot = {
  name: string;
  description: string;
  previewUrl: string;
  preferredColorScheme?: string;
  preferredTheme?: string;
  colorProfile?: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  personality?: string;
  doodleUrls: string[];
  loadingUrls: string[];
};

const MASCOT_COOKIE = "app-mascot";

const availableMascots: Record<string, Mascot> = {
  default: {
    name: "Default Mascot",
    description:
      "🎭 O básico que nunca falha! Para quem gosta de simplicidade com estilo. 'Simples, mas eficaz!'",
    previewUrl: "/mascots/default/preview.png",
    preferredColorScheme: "light",
    preferredTheme: "rose",
    colorProfile: {
      primary: "#f43f5e", // rose-500
      secondary: "#fda4af", // rose-300
      accent: "#e11d48", // rose-600
      background: "#fff1f2", // rose-50
      text: "#881337", // rose-900
    },
    personality: "🎯 Confiável e direto ao ponto. Sem frescura, só resultados!",
    // disabled doodles
    doodleUrls: [],
    loadingUrls: [
      "/mascots/default/loading-image1.png",
      "/mascots/default/loading-image2.png",
      "/mascots/default/loading-image3.png",
      "/mascots/default/loading-image4.png",
      "/mascots/default/loading-image5.png",
      "/mascots/default/loading-image6.png",
      "/mascots/default/loading-image7.png",
      "/mascots/default/loading-image8.png",
    ],
  },

  rimuru: {
    name: "Rimuru Tempest",
    description:
      "💙 O slime mais OP do multiverso! 'Eu sou o mais forte!' - e ele realmente é! De slimezinho a rei demônio em tempo recorde!",
    previewUrl: "/mascots/rimuru/preview.jpg",
    preferredColorScheme: "light",
    preferredTheme: "cyan",
    colorProfile: {
      primary: "#0891b2", // cyan-600
      secondary: "#67e8f9", // cyan-300
      accent: "#0e7490", // cyan-700
      background: "#ecfeff", // cyan-50
      text: "#164e63", // cyan-900
    },
    personality:
      "🌟 Carismático, inteligente e sempre evoluindo! Transforma qualquer situação em vantagem. 'Analyze!'",
    doodleUrls: [
      "/mascots/rimuru/loading-image1.png",
      "/mascots/rimuru/loading-image2.png",
      "/mascots/rimuru/loading-image3.png",
      "/mascots/rimuru/loading-image4.webp",
      "/mascots/rimuru/loading-image5.webp",
      "/mascots/rimuru/loading-image6.png",
    ],
    loadingUrls: [
      "/mascots/rimuru/loading-image1.png",
      "/mascots/rimuru/loading-image2.png",
      "/mascots/rimuru/loading-image3.png",
      "/mascots/rimuru/loading-image4.webp",
      "/mascots/rimuru/loading-image5.webp",
      "/mascots/rimuru/loading-image6.png",
    ],
  },

  billie: {
    name: "Billie Eilish - Don't Smile at Me",
    description:
      "🖤 'I'm the bad guy, duh!' A rainha do dark pop que revolucionou a música. Voz única, estilo único, atitude única!",
    previewUrl: "/mascots/billie/preview.jpg",
    preferredColorScheme: "dark",
    preferredTheme: "yellow",
    colorProfile: {
      primary: "#eab308", // yellow-500
      secondary: "#fde047", // yellow-300
      accent: "#ca8a04", // yellow-600
      background: "#1a1a1a", // dark background
      text: "#fefce8", // yellow-50
    },
    personality:
      "🎤 Misteriosa, autêntica e sem filtros! Faz o que quer, quando quer, como quer. 'Everything I wanted!'",
    doodleUrls: [
      "/mascots/billie/loading-image1.png",
      "/mascots/billie/loading-image2.png",
      "/mascots/billie/loading-image3.png",
      "/mascots/billie/loading-image4.png",
    ],
    loadingUrls: [
      "/mascots/billie/loading-image1.png",
      "/mascots/billie/loading-image2.png",
      "/mascots/billie/loading-image3.png",
      "/mascots/billie/loading-image4.png",
    ],
  },

  dean_winchester: {
    name: "Dean Winchester",
    description:
      "🚗 'Driver picks the music, shotgun shuts his cakehole!' O caçador mais carismático do universo! Salva pessoas, caça coisas, família business!",
    previewUrl: "/mascots/dean_winchester/preview.png",
    preferredColorScheme: "light",
    preferredTheme: "monochrome",
    colorProfile: {
      primary: "#2563eb", // blue-600
      secondary: "#93c5fd", // blue-300
      accent: "#1d4ed8", // blue-700
      background: "#eff6ff", // blue-50
      text: "#1e3a8a", // blue-900
    },
    personality:
      "🛡️ Protetor, leal e com senso de humor afiado! 'Saving people, hunting things, the family business!'",
    doodleUrls: [
      "/mascots/dean_winchester/image1.webp",
      "/mascots/dean_winchester/image2.webp",
      "/mascots/dean_winchester/image3.webp",
      "/mascots/dean_winchester/image4.webp",
      "/mascots/dean_winchester/image5.webp",
    ],
    loadingUrls: [
      "/mascots/dean_winchester/image1.webp",
      "/mascots/dean_winchester/image2.webp",
      "/mascots/dean_winchester/image3.webp",
      "/mascots/dean_winchester/image4.webp",
      "/mascots/dean_winchester/image5.webp",
    ],
  },
};

const mascotDisplayNames: Record<string, string> = {
  default: "Padrão",
  rimuru: "Rimuru Tempest",
  billie: "Billie Eilish",
  dean_winchester: "Dean Winchester",
};

// Universal function to get mascot by name
export const getMascotByName = (name: string): Mascot | undefined => {
  return availableMascots[name];
};

// Server-side mascot initialization
export const getServerMascot = () => {
  const mascotCookie = useCookie(MASCOT_COOKIE);

  return {
    mascot:
      mascotCookie.value && mascotCookie.value in availableMascots
        ? availableMascots[mascotCookie.value]
        : availableMascots.default,
  };
};

export const useMascotStore = defineStore("mascot", () => {
  // Initialize with default values, will be updated on client mount
  const currentMascot = ref<Mascot>(availableMascots.default!);

  function setMascot(mascotName: keyof typeof availableMascots) {
    if (mascotName in availableMascots) {
      currentMascot.value = availableMascots[mascotName]!;
      // Save to cookie
      const mascotCookie = useCookie(MASCOT_COOKIE);
      mascotCookie.value = mascotName;
    }
  }

  function getRandomDoodle(): string {
    const doodles = currentMascot.value.doodleUrls;
    if (doodles.length === 0) return "";
    return doodles[Math.floor(Math.random() * doodles.length)] || "";
  }

  function getRandomLoading(): string {
    const loadings = currentMascot.value.loadingUrls;
    if (loadings.length === 0) return "";
    return loadings[Math.floor(Math.random() * loadings.length)] || "";
  }

  // Initialize store with server values
  function initializeFromServer(serverMascot: Mascot) {
    currentMascot.value = serverMascot;
  }

  function initializeFromCookie() {
    const mascotCookie = useCookie(MASCOT_COOKIE);
    if (mascotCookie.value && mascotCookie.value in availableMascots) {
      currentMascot.value = availableMascots[mascotCookie.value]!;
    }
  }

  return {
    currentMascot,
    setMascot,
    getRandomDoodle,
    getRandomLoading,
    initializeFromServer,
    initializeFromCookie,
    availableMascots,
    mascotDisplayNames,
  };
});
