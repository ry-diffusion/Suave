<template>
    <div class="min-h-screen bg-background">
        <!-- Main Content -->
        <main class="px-4 pb-6 pt-4">
            <!-- Loading State -->
            <FullscreenGuiLoading v-if="loading" />

            <!-- Error State -->
            <div v-else-if="error" class="flex flex-col items-center justify-center py-16">
                <div class="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mb-4">
                    <UIcon name="i-lucide-alert-circle" class="w-8 h-8 text-red-500" />
                </div>
                <h3 class="text-lg font-semibold text-default mb-2">Erro ao carregar projetos</h3>
                <p class="text-sm text-muted text-center mb-6">{{ error }}</p>
                <UButton color="primary" @click="fetchProjetos">
                    Tentar novamente
                </UButton>
            </div>

            <!-- Projects Content -->
            <Transition name="slide" mode="out-in">
                <div v-if="!selectedProjeto && projetos" key="projects-list" class="space-y-6">
                    <!-- Tabs -->
                    <div class="mt-4">
                        <UTabs v-model="selectedTab" :items="tabItems" :content="false" color="primary" variant="pill"
                            class="w-full" />
                    </div>

                    <!-- Progress Bar with Statistics -->
                    <div class="space-y-3">
                        <div class="flex justify-between items-center text-sm">
                            <span class="text-muted">Status dos Projetos</span>
                            <span class="font-medium">{{ totalProjetos }} total</span>
                        </div>
                        <div class="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div class="absolute inset-0 flex">
                                <div class="bg-success h-full transition-all duration-300"
                                    :style="{ width: (projetosConcluidos / totalProjetos * 100) + '%' }"></div>
                                <div class="bg-info h-full transition-all duration-300"
                                    :style="{ width: (projetosEmAndamento / totalProjetos * 100) + '%' }"></div>
                                <div class="bg-warning h-full transition-all duration-300"
                                    :style="{ width: (projetosEmSelecao / totalProjetos * 100) + '%' }"></div>
                                <div class="bg-neutral h-full transition-all duration-300"
                                    :style="{ width: (projetosNaoSelecionados / totalProjetos * 100) + '%' }"></div>
                                <div class="bg-error h-full transition-all duration-300"
                                    :style="{ width: (projetosNaoEnviados / totalProjetos * 100) + '%' }"></div>
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-2 text-xs text-muted">
                            <div class="flex items-center gap-1">
                                <div class="w-2 h-2 bg-success rounded-full"></div>
                                <span>Concluídos ({{ projetosConcluidos }})</span>
                            </div>
                            <div class="flex items-center gap-1">
                                <div class="w-2 h-2 bg-info rounded-full"></div>
                                <span>Em Execução ({{ projetosEmAndamento }})</span>
                            </div>
                            <div class="flex items-center gap-1">
                                <div class="w-2 h-2 bg-warning rounded-full"></div>
                                <span>Em Seleção ({{ projetosEmSelecao }})</span>
                            </div>
                            <div class="flex items-center gap-1">
                                <div class="w-2 h-2 bg-neutral rounded-full"></div>
                                <span>Não Selecionados ({{ projetosNaoSelecionados }})</span>
                            </div>
                            <div class="flex items-center gap-1">
                                <div class="w-2 h-2 bg-error rounded-full"></div>
                                <span>Não Enviados ({{ projetosNaoEnviados }})</span>
                            </div>
                        </div>
                    </div>

                    <!-- Projects List -->
                    <div class="space-y-3">
                        <div v-if="filteredProjetos.length > 0"
                            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <UCard v-for="projeto in filteredProjetos" :key="projeto.id"
                                class="p-4 cursor-pointer border-0 shadow-sm hover:shadow-md transition-all duration-200 glass-card"
                                @click="openProjectDetail(projeto)">
                                <div class="flex items-start justify-between mb-3">
                                    <h3 class="text-base font-semibold text-default leading-tight flex-1 mr-3">
                                        {{ projeto.titulo }}
                                    </h3>
                                    <UBadge :color="getStatusColor(projeto.status)" variant="soft" size="sm">
                                        {{ getStatusText(projeto.status) }}
                                    </UBadge>
                                </div>

                                <div class="space-y-2 text-sm">
                                    <div class="flex items-center gap-2">
                                        <UIcon name="i-lucide-calendar" class="w-4 h-4 text-muted" />
                                        <span class="text-muted">{{ formatDate(projeto.inicio_execucao) }} - {{
                                            formatDate(projeto.fim_execucao) }}</span>
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <UIcon name="i-lucide-target" class="w-4 h-4 text-muted" />
                                        <span class="text-muted">{{ projeto.metas.length }} metas</span>
                                    </div>
                                </div>
                            </UCard>
                        </div>
                        <div v-else class="text-center py-12">
                            <div
                                class="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4 mx-auto">
                                <UIcon name="i-lucide-folder-open" class="w-8 h-8 text-muted" />
                            </div>
                            <h3 class="text-lg font-semibold text-default mb-2">Nenhum projeto encontrado</h3>
                            <p class="text-sm text-muted">Você ainda não possui projetos cadastrados deste tipo.</p>
                        </div>
                    </div>
                </div>

                <!-- Project Detail View -->
                <div v-else-if="selectedProjeto" key="project-detail" class="space-y-6">
                    <!-- Project Info -->
                    <UCard class="p-4 glass-card">
                        <h2 class="text-lg font-semibold text-default mb-4">{{ selectedProjeto.titulo }}</h2>
                        <div class="space-y-3">
                            <div class="flex justify-between items-center">
                                <span class="text-sm text-muted">Início</span>
                                <span class="text-sm font-medium">{{ formatDate(selectedProjeto.inicio_execucao)
                                    }}</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-sm text-muted">Término</span>
                                <span class="text-sm font-medium">{{ formatDate(selectedProjeto.fim_execucao) }}</span>
                            </div>
                            <div v-if="'area_conhecimento' in selectedProjeto" class="flex justify-between items-start">
                                <span class="text-sm text-muted">Área</span>
                                <span class="text-sm font-medium text-right max-w-[60%]">{{
                                    selectedProjeto.area_conhecimento }}</span>
                            </div>
                        </div>
                    </UCard>

                    <!-- Progress Summary -->
                    <UCard class="p-4 glass-card bg-gradient-to-br from-success/10 to-background">
                        <div class="text-center">
                            <div class="text-sm text-success font-medium mb-1">
                                {{ metasConcluidas }} de {{ totalMetasProjeto }} metas concluídas
                            </div>
                            <div class="text-3xl font-bold text-success mb-2">{{ progressoPercentual }}%</div>
                            <div class="text-sm text-muted">{{ progressoStatus }}</div>
                            <div v-if="progressoPercentual === 100" class="text-sm text-success font-medium mt-2">
                                Parabéns! Projeto concluído 🎉
                            </div>
                            <div v-else-if="progressoPercentual >= 75" class="text-sm text-success/70 mt-2">
                                Quase lá, continue assim!
                            </div>
                        </div>
                    </UCard>

                    <!-- Compact Progress Indicator -->
                    <UCard class="p-4 glass-card">
                        <h3 class="text-base font-semibold text-default mb-4">Progresso Detalhado</h3>
                        <div class="space-y-3">
                            <div v-for="(meta, index) in selectedProjeto.metas" :key="meta.id"
                                class="flex items-start gap-3 p-3 rounded-xl"
                                :class="getMetaStatus(meta) === 'completed' ? 'bg-success/10' : 'bg-gray-50 dark:bg-gray-800/50'">
                                <div class="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
                                    :class="getMetaStatus(meta) === 'completed' ? 'bg-success text-white' : 'bg-gray-300 dark:bg-gray-600'">
                                    <UIcon v-if="getMetaStatus(meta) === 'completed'" name="i-lucide-check"
                                        class="w-3 h-3" />
                                    <span v-else class="text-xs font-medium text-gray-600 dark:text-gray-400">
                                        {{ index + 1 }}
                                    </span>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <div class="text-sm font-medium text-default leading-tight mb-1">
                                        {{ meta.descricao }}
                                    </div>
                                    <div class="text-xs text-muted mb-2">
                                        {{ formatDate(meta.inicio || '') }} - {{ formatDate(meta.fim || '') }}
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <div class="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                                            <div class="bg-success h-1.5 rounded-full transition-all duration-300"
                                                :style="{ width: getMetaProgress(meta) + '%' }"></div>
                                        </div>
                                        <span class="text-xs text-muted">{{ getMetaProgress(meta) }}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </UCard>

                    <!-- Participants -->
                    <UCard class="p-4 glass-card">
                        <h3 class="text-base font-semibold text-default mb-4">Participantes</h3>
                        <div class="space-y-3">
                            <div v-for="participante in selectedProjeto.participacao" :key="participante.id"
                                class="flex items-center gap-3">
                                <div
                                    class="w-10 h-10 rounded-full bg-primary/80 text-white flex items-center justify-center font-semibold">
                                    {{ participante.nome.charAt(0).toUpperCase() }}
                                </div>
                                <div class="flex-1 min-w-0">
                                    <div class="font-medium text-default">{{ participante.nome }}</div>
                                    <div class="text-sm text-muted">
                                        {{ participante.vinculo }}
                                        <span v-if="participante.responsavel" class="text-primary font-medium"> •
                                            Responsável</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </UCard>
                </div>
            </Transition>
        </main>
    </div>
</template>

<script setup lang="ts">
import type { TabsItem } from "@nuxt/ui";
import { computed, onMounted, onUnmounted, ref } from "vue";
import type { Ensino, Extensao, Pesquisa, Projetos } from "#shared/datatypes";
import { useDeviceDetection } from "~/composables/useDeviceDetection";
import { useAppHeaderStore } from "~/stores/appHeader";
import { useClientFetch } from "~~/shared/composables/useClientFetch";

// Page meta
definePageMeta({
    middleware: ["auth"],
});

// Reactive data
const loading = ref(false);
const error = ref<string | null>(null);
const projetos = ref<Projetos | null>(null);
const selectedProjeto = ref<Extensao | Pesquisa | Ensino | null>(null);

// Tabs para tipos de projeto
const tabItems = ref<TabsItem[]>([
    { label: "Extensão", icon: "i-lucide-users", value: "Extensao" },
    { label: "Pesquisa", icon: "i-lucide-microscope", value: "Pesquisa" },
    { label: "Ensino", icon: "i-lucide-graduation-cap", value: "Ensino" },
]);
const selectedTab = ref("Extensao");

// Computed properties
const totalProjetos = computed(() => {
    if (!projetos.value) return 0;
    return (
        projetos.value.Extensao.length +
        projetos.value.Pesquisa.length +
        projetos.value.Ensino.length
    );
});

const projetosConcluidos = computed(() => {
    if (!projetos.value) return 0;
    const allProjetos = [
        ...projetos.value.Extensao,
        ...projetos.value.Pesquisa,
        ...projetos.value.Ensino,
    ];
    return allProjetos.filter(
        (p: Extensao | Pesquisa | Ensino) => p.status === "Concluído",
    ).length;
});

const projetosEmAndamento = computed(() => {
    if (!projetos.value) return 0;
    const allProjetos = [
        ...projetos.value.Extensao,
        ...projetos.value.Pesquisa,
        ...projetos.value.Ensino,
    ];
    return allProjetos.filter(
        (p: Extensao | Pesquisa | Ensino) => p.status === "Em execução",
    ).length;
});

const projetosEmSelecao = computed(() => {
    if (!projetos.value) return 0;
    const allProjetos = [
        ...projetos.value.Extensao,
        ...projetos.value.Pesquisa,
        ...projetos.value.Ensino,
    ];
    return allProjetos.filter(
        (p: Extensao | Pesquisa | Ensino) => p.status === "Em Seleção",
    ).length;
});

const projetosNaoSelecionados = computed(() => {
    if (!projetos.value) return 0;
    const allProjetos = [
        ...projetos.value.Extensao,
        ...projetos.value.Pesquisa,
        ...projetos.value.Ensino,
    ];
    return allProjetos.filter(
        (p: Extensao | Pesquisa | Ensino) => p.status === "Não selecionado",
    ).length;
});

const projetosNaoEnviados = computed(() => {
    if (!projetos.value) return 0;
    const allProjetos = [
        ...projetos.value.Extensao,
        ...projetos.value.Pesquisa,
        ...projetos.value.Ensino,
    ];
    return allProjetos.filter(
        (p: Extensao | Pesquisa | Ensino) => p.status === "Não Enviado",
    ).length;
});

const totalMetas = computed(() => {
    if (!projetos.value) return 0;
    const allProjetos = [
        ...projetos.value.Extensao,
        ...projetos.value.Pesquisa,
        ...projetos.value.Ensino,
    ];
    return allProjetos.reduce(
        (total, projeto) => total + projeto.metas.length,
        0,
    );
});

const filteredProjetos = computed(() => {
    if (!projetos.value) return [];
    if (selectedTab.value === "Extensao") return projetos.value.Extensao;
    if (selectedTab.value === "Pesquisa") return projetos.value.Pesquisa;
    if (selectedTab.value === "Ensino") return projetos.value.Ensino;
    return [];
});

// Computed properties for progress summary
const metasConcluidas = computed(() =>
    selectedProjeto.value
        ? selectedProjeto.value.metas.filter(
            (meta) =>
                meta.etapas.length > 0 &&
                meta.etapas.every((etapa) => !!etapa.fim_execucao),
        ).length
        : 0,
);

const totalMetasProjeto = computed(() =>
    selectedProjeto.value ? selectedProjeto.value.metas.length : 0,
);

const progressoPercentual = computed(() =>
    totalMetasProjeto.value > 0
        ? Math.round((metasConcluidas.value / totalMetasProjeto.value) * 100)
        : 0,
);

const progressoStatus = computed(() =>
    progressoPercentual.value === 100 ? "Concluído" : "Em andamento",
);

// Methods for compact progress indicator
const getMetaStatus = (meta: any) => {
    if (meta.etapas.length === 0) return 'pending';
    return meta.etapas.every((etapa: any) => !!etapa.fim_execucao) ? 'completed' : 'in-progress';
};

const getMetaProgress = (meta: any) => {
    if (meta.etapas.length === 0) return 0;
    const completedEtapas = meta.etapas.filter((etapa: any) => !!etapa.fim_execucao).length;
    return Math.round((completedEtapas / meta.etapas.length) * 100);
};

const { isMobile } = useDeviceDetection();
const appHeader = useAppHeaderStore();
const { clientFetch } = useClientFetch();

// Methods
const fetchProjetos = async () => {
    loading.value = true;
    error.value = null;

    try {
        const response = await clientFetch<Projetos>("/api/suap/meus-projetos");
        projetos.value = response;
    } catch (err: any) {
        if (err?.statusCode === 401 || err?.status === 401) {
            error.value = "Sessão expirada. Faça login novamente.";
        } else {
            error.value = err.data?.message || "Erro ao carregar projetos";
        }
    } finally {
        loading.value = false;
    }
};

const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("pt-BR");
};

const getStatusColor = (status: string) => {
    switch (status) {
        case "Não selecionado":
            return "neutral";
        case "Em execução":
            return "info";
        case "Concluído":
            return "success";
        case "Em Seleção":
            return "warning";
        case "Não Enviado":
            return "error";
        default:
            return "neutral";
    }
};

const getStatusText = (status: string) => {
    switch (status) {
        case "Não selecionado":
            return "Não Selecionado";
        case "Em execução":
            return "Em Execução";
        case "Concluído":
            return "Concluído";
        case "Em Seleção":
            return "Em Seleção";
        case "Não Enviado":
            return "Não Enviado";
        default:
            return status;
    }
};

const openProjectDetail = (projeto: Extensao | Pesquisa | Ensino) => {
    selectedProjeto.value = projeto;
    appHeader.setHeader({
        title: "Detalhes do Projeto",
        subtitle: projeto.titulo,
        showBack: true,
        onBack: () => closeProjectDetail(),
    });
};

const closeProjectDetail = () => {
    selectedProjeto.value = null;
    appHeader.setHeader({
        title: "Meus Projetos",
        subtitle: "",
        showBack: false,
        onBack: null,
    });
};

// Fetch data on mount
onMounted(() => {
    appHeader.setHeader({
        title: "Meus Projetos",
        subtitle: "",
        showBack: false,
        onBack: null,
    });
    fetchProjetos();
});
</script>

<style scoped>
/* Apple HIG inspired transitions */
.slide-enter-active,
.slide-leave-active {
    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.slide-enter-from {
    opacity: 0;
    transform: translateX(20px);
}

.slide-leave-to {
    opacity: 0;
    transform: translateX(-20px);
}

/* iOS-style safe area padding */
@supports (padding: max(0px)) {
    .min-h-screen {
        padding-bottom: max(1.5rem, env(safe-area-inset-bottom));
    }
}

/* Smooth scrolling for iOS */
* {
    -webkit-overflow-scrolling: touch;
}

/* Custom scrollbar for webkit browsers */
::-webkit-scrollbar {
    width: 0;
    background: transparent;
}

/* Haptic feedback simulation */
@media (hover: hover) {
    .cursor-pointer:hover {
        transform: scale(0.98);
    }
}

/* Dark mode optimizations */
.dark {
    color-scheme: dark;
}

/* Glass effect following Apple's Human Interface Guidelines */
.glass-card {
    background: rgba(255, 255, 255, 0.08) !important;
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.125) !important;
    box-shadow:
        0 8px 32px 0 rgba(31, 38, 135, 0.37),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

/* Dark mode adjustments */
.dark .glass-card {
    background: rgba(0, 0, 0, 0.12) !important;
    border: 1px solid rgba(255, 255, 255, 0.08) !important;
    box-shadow:
        0 8px 32px 0 rgba(0, 0, 0, 0.4),
        inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

/* Hover effects for better interactivity */
.glass-card:hover {
    background: rgba(255, 255, 255, 0.12) !important;
    transform: translateY(-1px);
    transition: all 0.2s ease-in-out;
}

.dark .glass-card:hover {
    background: rgba(0, 0, 0, 0.16) !important;
}

/* Ensure proper contrast for text readability */
.glass-card * {
    position: relative;
    z-index: 1;
}
</style>