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
  // Performance images
  performanceImages?: {
    excellent: string[];
    good: string[];
    average: string[];
    poor: string[];
  };
  // Performance messages
  performanceMessages: {
    titles: {
      excellent: string;
      good: string;
      average: string;
      poor: string;
    };
    messages: {
      excellent: string;
      good: string;
      average: string;
      poor: string;
    };
    bestSubject: {
      title: string;
      messages: {
        excellent: string;
        good: string;
        average: string;
      };
    };
    worstSubject: {
      title: string;
      messages: {
        poor: string;
        average: string;
        good: string;
      };
    };
    attendance: {
      title: string;
      messages: {
        excellent: string;
        good: string;
        average: string;
        poor: string;
        veryPoor: string;
        terrible: string;
      };
    };
    mostAbsent: {
      title: string;
      messages: {
        good: string;
        average: string;
        poor: string;
      };
    };
  };
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
    performanceImages: {
      excellent: ["/mascots/default/performance/good.jpg"],
      good: ["/mascots/default/performance/good.jpg"],
      average: ["/mascots/default/performance/good.jpg"],
      poor: ["/mascots/default/performance/poor.webp"],
    },
    performanceMessages: {
      titles: {
        excellent: "Mandou bem!",
        good: "Tá no caminho!",
        average: "Foco na missão!",
        poor: "Alerta de estudo!",
      },
      messages: {
        excellent: "Seu desempenho foi incrível! Continue brilhando!",
        good: "Ótimo trabalho! Você está mostrando um progresso fantástico.",
        average:
          "Você está se saindo bem, mas um pouco mais de foco te levará longe!",
        poor: "Sei que pode parecer difícil, mas não desista! A dedicação é a chave.",
      },
      bestSubject: {
        title: "😃 Sua melhor disciplina",
        messages: {
          excellent: "Uau, você realmente domina {subject}! É seu ponto forte!",
          good: "Você tem um talento especial para {subject}! Continue assim.",
          average:
            "Seu esforço em {subject} está valendo a pena. Bom trabalho!",
        },
      },
      worstSubject: {
        title: "😔 Sua pior disciplina",
        messages: {
          poor: "Parece que {subject} é um desafio. Que tal um plano de estudos para virar o jogo?",
          average:
            "Com um pouco mais de atenção em {subject}, você vai ver a diferença.",
          good: "{subject} está quase lá! Não deixe os detalhes te escaparem.",
        },
      },
      attendance: {
        title: "⏰ Frequência Média",
        messages: {
          excellent: "Sua presença é impecável! Pontualidade é tudo!",
          good: "Você raramente perde uma aula. Isso faz toda a diferença!",
          average: "Boa frequência! Manter a constância é importante.",
          poor: "Cuidado com as faltas! Sua presença é fundamental.",
          veryPoor: "Está faltando bastante... Não deixe o conteúdo acumular!",
          terrible: "Sua ausência foi notada. Vamos reverter isso?",
        },
      },
      mostAbsent: {
        title: "😅 Disciplina que mais faltou",
        messages: {
          good: "Deu uma escapada das aulas de {subject}, né? Acontece!",
          average: "Tente não faltar tanto em {subject}, ok? Cada aula conta.",
          poor: "Você realmente não curte {subject}, hein? Mas é importante comparecer.",
        },
      },
    },
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
    performanceImages: {
      excellent: ["/mascots/rimuru/performance/good.jpg"],
      good: ["/mascots/rimuru/performance/good.jpg"],
      average: ["/mascots/rimuru/performance/good.jpg"],
      poor: ["/mascots/rimuru/performance/poor.webp"],
    },
    performanceMessages: {
      titles: {
        excellent: "Grande Sábio aprova!",
        good: "Evolução em progresso!",
        average: "Potencial detectado!",
        poor: "Precisa de mais Pontos de Experiência!",
      },
      messages: {
        excellent:
          "Com a habilidade [Grande Sábio], analisei seu progresso e o resultado é impressionante! Digno de um verdadeiro aliado de Tempest!",
        good: "Sua evolução é notável! Continue absorvendo conhecimento como eu absorvo meus inimigos.",
        average:
          "Detectei um grande potencial em você. Com mais treino, se tornará um recurso valioso para nossa nação.",
        poor: "Análise completa: seus status estão baixos. É hora de farmar mais conhecimento para subir de nível!",
      },
      bestSubject: {
        title: "💙 Sua Habilidade Suprema",
        messages: {
          excellent:
            "Sua maestria em {subject} é como uma Habilidade Suprema! Ninguém pode te parar!",
          good: "Você usa a [Predação] com maestria em {subject}. Continue devorando esse conhecimento!",
          average:
            "Você está evoluindo bem em {subject}. Continue se fortalecendo!",
        },
      },
      worstSubject: {
        title: "💧 Seu Ponto Fraco",
        messages: {
          poor: "{subject} parece ser sua fraqueza. Use a [Análise] para entender o problema e superá-lo!",
          average:
            "Este desafio em {subject} é apenas um teste. Um futuro lorde demônio não desistiria!",
          good: "Mesmo um slime poderoso tem desafios. Não se preocupe, com esforço você domina {subject}.",
        },
      },
      attendance: {
        title: "💙 Sua Presença em Tempest",
        messages: {
          excellent:
            "Sua presença é total, como a de um verdadeiro governante em seu domínio!",
          good: "Você quase não perde uma reunião do conselho. Continue assim, sua lealdade é notável!",
          average:
            "Sua frequência é boa, mas um líder não pode se ausentar muito das suas responsabilidades.",
          poor: "Faltar tanto assim? Nem os gobelins que eu nomeei são tão relaxados!",
          veryPoor:
            "Está tentando se esconder de mim? Minha [Percepção Mágica] vê tudo!",
          terrible:
            "Desapareceu completamente... Está tentando se tornar um espectro? Isso não vai te dar mais poder!",
        },
      },
      mostAbsent: {
        title: "💧 A Missão que Você Evitou",
        messages: {
          good: "Faltou muito em {subject}, hein? Estava em alguma missão secreta ou só dormindo como o Veldora?",
          average:
            "Evitar as aulas de {subject} não vai fazer o desafio desaparecer. Encare-o de frente!",
          poor: "Você parece ter uma aversão a {subject}. Lembre-se, todo conhecimento é uma arma em potencial.",
        },
      },
    },
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
    performanceImages: {
      excellent: ["/mascots/billie/performance/good.png"],
      good: ["/mascots/billie/performance/good.png"],
      average: ["/mascots/billie/performance/good.png"],
      poor: ["/mascots/billie/performance/poor.jpeg"],
    },
    performanceMessages: {
      titles: {
        excellent: "you should see me in a crown",
        good: "my strange addiction",
        average: "when the party's over",
        poor: "bury a friend",
      },
      messages: {
        excellent:
          "'you should see me in a crown'... e você está usando uma. Seu desempenho é uma obra de arte, sério.",
        good: "Seu esforço é 'my strange addiction'. Continue assim, é autêntico e tá funcionando.",
        average:
          "'when the party's over', é hora de focar. Você tá quase lá, não se perde agora.",
        poor: "Precisa se esforçar mais ou vai acabar 'burying a friend'... seu boletim. Acorda.",
      },
      bestSubject: {
        title: "🖤 a track que você domina",
        messages: {
          excellent:
            "Em {subject}, você não é o 'bad guy', você é o chefe. Dominou total.",
          good: "Você tem um flow diferente em {subject}. É 'everything i wanted' de ver.",
          average: "{subject} tá ficando interessante. Continue nessa vibe.",
        },
      },
      worstSubject: {
        title: "😔 a que te deixa 'ocean eyes'",
        messages: {
          poor: "{subject} tá te deixando 'bluer than I've ever been'. Precisa encontrar seu ritmo, sua voz.",
          average:
            "A melodia de {subject} tá meio desafinada. Acha o tom certo.",
          good: "Não deixa {subject} te dar um 'bellyache'. Você consegue mais que isso.",
        },
      },
      attendance: {
        title: "🖤 sua frequência no show",
        messages: {
          excellent:
            "Sempre aqui, observando tudo. 'all the good girls go to hell', mas você vai direto pro topo.",
          good: "Sua presença é constante, gosto disso. Mostra que você tá dentro.",
          average: "Frequência ok, mas não some. A gente sente falta.",
          poor: "Tá se escondendo? 'where do we go when we all fall asleep?' Pra aula, é claro.",
          veryPoor:
            "Some mais um pouco e vou achar que você é só uma miragem, tipo 'ocean eyes' na multidão.",
          terrible: "Você virou um fantasma. 'i love you', mas tipo, aparece.",
        },
      },
      mostAbsent: {
        title: "😔 a aula que você pulou",
        messages: {
          good: "Matando aula de {subject}? 'i don't wanna be you anymore' na hora dessa matéria?",
          average:
            "Pelo menos apareceu em {subject} às vezes. Mas não é o suficiente.",
          poor: "Você odeia {subject} ou algo assim? Porque tá parecendo.",
        },
      },
    },
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
    performanceImages: {
      excellent: ["/mascots/dean_winchester/performance/good.jpeg"],
      good: ["/mascots/dean_winchester/performance/good.jpeg"],
      average: ["/mascots/dean_winchester/performance/good.jpeg"],
      poor: ["/mascots/dean_winchester/performance/poor.gif"],
    },
    performanceMessages: {
      titles: {
        excellent: "Awesome!",
        good: "That's how we do it!",
        average: "Get back to work, soldier!",
        poor: "Son of a Bitch!",
      },
      messages: {
        excellent:
          "Awesome! Você caçou esse conhecimento como um profissional. O Baby ficaria orgulhoso. Torta pra comemorar!",
        good: "Bom trabalho, caçador. Continue afiando suas lâminas... e seus lápis. 'That's how we do it!'",
        average:
          "A caçada não acabou. Volte aos livros, soldado. 'We've got work to do.'",
        poor: "Son of a bitch! Os demônios... digo, as notas baixas... estão te pegando. Hora de exorcizar essa preguiça.",
      },
      bestSubject: {
        title: "🚗 Sua Caçada de Sucesso",
        messages: {
          excellent:
            "Você detonou em {subject}. Foi uma caçada fácil, hein? 'Piece of cake!'",
          good: "Mandou bem em {subject}. Tá virando um Homem de Letras de verdade.",
          average:
            "Você tá pegando o jeito de {subject}. Continue na trilha certa.",
        },
      },
      worstSubject: {
        title: "😔 O Monstro da Semana",
        messages: {
          poor: "{subject} tá sendo um osso duro de roer, tipo um leviatã. Precisa de mais pesquisa no diário do John.",
          average:
            "Não deixe {subject} te derrubar. Pega o sal e a água benta e vai pra cima.",
          good: "Até os melhores caçadores têm um dia ruim. {subject} foi o seu, mas você vira o jogo.",
        },
      },
      attendance: {
        title: "🚗 Sua Dedicação à Caçada",
        messages: {
          excellent:
            "Sempre na estrada, sempre na luta. Você não perde uma caçada, impressionante!",
          good: "Frequência de um verdadeiro Homem de Letras. Bom trabalho, soldado.",
          average:
            "Não relaxe na vigia. Um caçador precisa estar sempre alerta e presente.",
          poor: "Faltando muito, hein? Deixando o Sam cuidar de tudo sozinho?",
          veryPoor: "Onde você se meteu? Caçando um fantasma ou virando um?",
          terrible:
            "Seu nível de ausência é apocalíptico. Nem o Castiel some tanto assim!",
        },
      },
      mostAbsent: {
        title: "😔 A Caçada que Você Perdeu",
        messages: {
          good: "Matando muita aula de {subject}, hein? O que foi, um ninho de vampiros apareceu no campus?",
          average:
            "Sei que a estrada chama, mas as aulas de {subject} são importantes. Não dá pra pular a pesquisa.",
          poor: "Você basicamente abandonou a missão em {subject}. O Bobby não ia gostar nada disso.",
        },
      },
    },
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

  // Performance message utility functions
  function getPerformanceTitle(average: number): string {
    const mascot = currentMascot.value;
    const messages = mascot.performanceMessages.titles;

    if (average >= 9) return messages.excellent;
    if (average >= 7) return messages.good;
    if (average >= 5) return messages.average;
    return messages.poor;
  }

  function getPerformanceMessage(average: number, attendance: number): string {
    const mascot = currentMascot.value;
    const messages = mascot.performanceMessages.messages;

    if (average >= 9 && attendance >= 90) return messages.excellent;
    if (average >= 7 && attendance >= 75) return messages.good;
    if (average >= 5 && attendance >= 60) return messages.average;
    return messages.poor;
  }

  function getBestSubjectTitle(): string {
    return currentMascot.value.performanceMessages.bestSubject.title;
  }

  function getBestSubjectMessage(average: number, subjectName: string): string {
    const mascot = currentMascot.value;
    const messages = mascot.performanceMessages.bestSubject.messages;

    if (average >= 9)
      return messages.excellent.replace("{subject}", subjectName);
    if (average >= 7) return messages.good.replace("{subject}", subjectName);
    return messages.average.replace("{subject}", subjectName);
  }

  function getWorstSubjectTitle(): string {
    return currentMascot.value.performanceMessages.worstSubject.title;
  }

  function getWorstSubjectMessage(
    average: number,
    subjectName: string
  ): string {
    const mascot = currentMascot.value;
    const messages = mascot.performanceMessages.worstSubject.messages;

    if (average < 5) return messages.poor.replace("{subject}", subjectName);
    if (average < 7) return messages.average.replace("{subject}", subjectName);
    return messages.good.replace("{subject}", subjectName);
  }

  function getAttendanceTitle(): string {
    return currentMascot.value.performanceMessages.attendance.title;
  }

  function getAttendanceMessage(attendance: number): string {
    const mascot = currentMascot.value;
    const messages = mascot.performanceMessages.attendance.messages;

    if (attendance > 98) return messages.excellent;
    if (attendance > 90) return messages.good;
    if (attendance > 80) return messages.average;
    if (attendance > 75) return messages.poor;
    if (attendance > 60) return messages.veryPoor;
    return messages.terrible;
  }

  function getMostAbsentTitle(): string {
    return currentMascot.value.performanceMessages.mostAbsent.title;
  }

  function getMostAbsentMessage(
    attendance: number,
    subjectName: string
  ): string {
    const mascot = currentMascot.value;
    const messages = mascot.performanceMessages.mostAbsent.messages;

    if (attendance > 75) return messages.good.replace("{subject}", subjectName);
    if (attendance > 60)
      return messages.average.replace("{subject}", subjectName);
    return messages.poor.replace("{subject}", subjectName);
  }

  // Performance image utility functions
  function getPerformanceImage(
    average: number,
    performanceType: "excellent" | "good" | "average" | "poor"
  ): string {
    const mascot = currentMascot.value;
    const images = mascot.performanceImages?.[performanceType];

    if (!images || images.length === 0) {
      // Fallback to a random doodle if performance images are not available
      return getRandomDoodle();
    }

    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex] || getRandomDoodle();
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
    // Performance message utilities
    getPerformanceTitle,
    getPerformanceMessage,
    getBestSubjectTitle,
    getBestSubjectMessage,
    getWorstSubjectTitle,
    getWorstSubjectMessage,
    getAttendanceTitle,
    getAttendanceMessage,
    getMostAbsentTitle,
    getMostAbsentMessage,
    // Performance image utilities
    getPerformanceImage,
  };
});
