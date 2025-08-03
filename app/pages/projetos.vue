<template>
    <div class="p-4">
        <!-- Tabs para filtrar projetos -->
        <div v-if="!selectedProjeto && projetos" class="mb-4">
            <UTabs v-model="selectedTab" :items="tabItems" :content="false" color="primary" variant="pill"
                class="w-full" />
        </div>
        <!-- Estatísticas visuais -->
        <div v-if="!selectedProjeto && projetos" class="mb-6">
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <UCard
                    class="flex flex-1 flex-col items-center justify-center text-center py-4 shadow-none border-0 bg-primary/10 dark:bg-primary/20">
                    <div class="flex flex-col flex-1 items-center justify-center h-full w-full">
                        <UIcon name="i-lucide-folder" class="w-8 h-8 sm:w-10 sm:h-10 text-primary mb-1" />
                        <div class="text-4xl sm:text-5xl font-extrabold text-primary">{{ totalProjetos }}</div>
                        <div class="text-xs sm:text-base text-primary/80 font-medium mt-1">Total</div>
                    </div>
                </UCard>
                <UCard
                    class="flex flex-1 flex-col items-center justify-center text-center py-4 shadow-none border-0 bg-success/10 dark:bg-success/20">
                    <div class="flex flex-col flex-1 items-center justify-center h-full w-full">
                        <UIcon name="i-lucide-check-circle" class="w-8 h-8 sm:w-10 sm:h-10 text-success mb-1" />
                        <div class="text-4xl sm:text-5xl font-extrabold text-success">{{ projetosConcluidos }}</div>
                        <div class="text-xs sm:text-base text-success/80 font-medium mt-1">Concluídos</div>
                    </div>
                </UCard>
                <UCard
                    class="flex flex-1 flex-col items-center justify-center text-center py-4 shadow-none border-0 bg-info/10 dark:bg-info/20">
                    <div class="flex flex-col flex-1 items-center justify-center h-full w-full">
                        <UIcon name="i-lucide-clock" class="w-8 h-8 sm:w-10 sm:h-10 text-info mb-1" />
                        <div class="text-4xl sm:text-5xl font-extrabold text-info">{{ projetosEmAndamento }}</div>
                        <div class="text-xs sm:text-base text-info/80 font-medium mt-1">Em Andamento</div>
                    </div>
                </UCard>
                <UCard
                    class="flex flex-1 flex-col items-center justify-center text-center py-4 shadow-none border-0 bg-purple-500/10 dark:bg-purple-500/20">
                    <div class="flex flex-col flex-1 items-center justify-center h-full w-full">
                        <UIcon name="i-lucide-target"
                            class="w-8 h-8 sm:w-10 sm:h-10 text-purple-500 dark:text-purple-400 mb-1" />
                        <div class="text-4xl sm:text-5xl font-extrabold text-purple-500 dark:text-purple-400">{{
                            totalMetas }}</div>
                        <div class="text-xs sm:text-base text-purple-500/80 dark:text-purple-400/80 font-medium mt-1">
                            Metas</div>
                    </div>
                </UCard>
            </div>
        </div>
        <!-- Loading State -->
        <div v-if="loading" class="flex flex-col gap-6 items-center justify-center py-12 w-full">
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-4xl mb-6">
                <USkeleton v-for="i in 4" :key="i" class="h-32 w-full rounded-xl" />
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-5xl">
                <USkeleton v-for="i in 6" :key="'card-' + i" class="h-40 w-full rounded-xl" />
            </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-12">
            <div class="mx-auto h-12 w-12 text-gray-400">
                <UIcon name="i-lucide-alert-circle" class="h-full w-full" />
            </div>
            <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Erro ao carregar projetos</h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ error }}</p>
            <div class="mt-6">
                <UButton color="primary" @click="fetchProjetos">
                    Tentar novamente
                </UButton>
            </div>
        </div>

        <!-- Projects Content -->
        <Transition name="fade" mode="out-in">
            <div v-if="!selectedProjeto && projetos" key="projects-list" class="space-y-6">
                <!-- Lista de projetos filtrada pela tab -->
                <div class="mt-6">
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                        v-if="filteredProjetos.length > 0">
                        <UCard v-for="projeto in filteredProjetos" :key="projeto.id"
                            class="group cursor-pointer border-0 shadow-none bg-elevated/60 hover:bg-elevated/80 transition-all duration-200 focus-within:ring-2 focus-within:ring-primary/60"
                            @click="openProjectDetail(projeto)" tabindex="0">
                            <div class="p-6 flex flex-col gap-4 h-full">
                                <div class="flex items-start justify-between mb-2">
                                    <h3
                                        class="text-lg sm:text-xl font-bold text-default leading-tight break-words flex-1 mr-3 group-hover:text-primary transition-colors">
                                        {{ projeto.titulo }}</h3>
                                    <UBadge :color="getStatusColor(projeto.status)" variant="soft" size="sm"
                                        class="flex-shrink-0">
                                        {{ getStatusText(projeto.status) }}
                                    </UBadge>
                                </div>
                                <div class="flex flex-col gap-2 text-sm">
                                    <div class="flex items-center gap-2">
                                        <UIcon name="i-lucide-calendar" class="w-4 h-4 text-gray-400 flex-shrink-0" />
                                        <span class="text-muted">{{ formatDate(projeto.inicio_execucao) }} - {{
                                            formatDate(projeto.fim_execucao) }}</span>
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <UIcon name="i-lucide-target" class="w-4 h-4 text-gray-400 flex-shrink-0" />
                                        <span class="text-muted">{{ projeto.metas.length }} metas</span>
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <UIcon name="i-lucide-users" class="w-4 h-4 text-gray-400 flex-shrink-0" />
                                        <span class="text-muted">{{ projeto.participacao.length }}
                                            participantes</span>
                                        <div v-if="projeto.participacao.length > 0" class="flex -space-x-2 ml-2">
                                            <div v-for="(participante, idx) in projeto.participacao.slice(0, 3)"
                                                :key="participante.id"
                                                class="w-7 h-7 rounded-full bg-primary/80 text-white flex items-center justify-center text-xs font-bold border-2 border-white dark:border-gray-900 shadow">
                                                {{ participante.nome.charAt(0).toUpperCase() }}
                                            </div>
                                            <div v-if="projeto.participacao.length > 3"
                                                class="w-7 h-7 rounded-full bg-gray-400 text-white flex items-center justify-center text-xs font-bold border-2 border-white dark:border-gray-900 shadow">
                                                +{{ projeto.participacao.length - 3 }}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </UCard>
                    </div>
                    <div v-else class="text-center py-12">
                        <div class="mx-auto h-12 w-12 text-gray-400">
                            <UIcon name="i-lucide-folder-open" class="h-full w-full" />
                        </div>
                        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Nenhum projeto encontrado
                        </h3>
                        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Você ainda não possui projetos cadastrados deste tipo.
                        </p>
                    </div>
                </div>
            </div>

            <!-- Project Detail View - Redesigned -->
            <div v-else-if="selectedProjeto" key="project-detail">
                <div
                    :class="isMobile ? 'inset-0 z-50 bg-background flex flex-col' : 'flex justify-center items-center min-h-screen bg-background/80'">
                    <div class="h-full w-full flex flex-col">

                        <!-- Scrollable Content -->
                        <div class="flex-1 overflow-y-auto p-4 space-y-6">
                            <!-- Info Card -->
                            <UCard class="p-4">
                                <div class="space-y-2">
                                    <div class="flex justify-between items-center flex-wrap">
                                        <span class="text-muted">Status</span>
                                        <UBadge :color="getStatusColor(selectedProjeto.status)" variant="soft"
                                            size="sm">
                                            {{ getStatusText(selectedProjeto.status) }}
                                        </UBadge>
                                    </div>
                                    <div class="flex justify-between items-center flex-wrap">
                                        <span class="text-muted">Início</span>
                                        <span class="font-medium">{{ formatDate(selectedProjeto.inicio_execucao)
                                            }}</span>
                                    </div>
                                    <div class="flex justify-between items-center flex-wrap">
                                        <span class="text-muted">Término</span>
                                        <span class="font-medium">{{ formatDate(selectedProjeto.fim_execucao)
                                            }}</span>
                                    </div>
                                    <div v-if="'area_conhecimento' in selectedProjeto"
                                        class="flex justify-between items-start flex-wrap">
                                        <span class="text-muted">Área</span>
                                        <span class="font-medium text-right break-words max-w-[70%]">{{
                                            selectedProjeto.area_conhecimento }}</span>
                                    </div>
                                </div>
                            </UCard>
                            <!-- Resumo do Progresso Card (logo após info) -->
                            <UCard
                                class="relative flex flex-col items-center justify-center text-center p-6 border-2 border-success shadow-none bg-gradient-to-br from-success/10 to-background/80 transition-all duration-500"
                                :class="{ 'animate-pulse border-emerald-400': progressoPercentual === 100 }">
                                <div v-if="progressoPercentual === 100" class="absolute top-3 right-3 text-success">
                                    <UIcon name="i-lucide-party-popper" class="w-7 h-7 animate-bounce" />
                                </div>
                                <div class="font-bold text-success text-lg mb-1">Resumo do Progresso</div>
                                <div class="text-success/80 text-base mb-2">{{ metasConcluidas }} de {{
                                    totalMetasProjeto }} metas concluídas</div>
                                <div class="text-5xl font-extrabold text-success mb-1 transition-all duration-500">
                                    {{ progressoPercentual }}%</div>
                                <div class="text-success/80 text-base font-medium mb-2">{{ progressoStatus }}</div>
                                <div v-if="progressoPercentual === 100" class="text-success font-semibold mt-2">
                                    Parabéns! Projeto concluído 🎉</div>
                                <div v-else-if="progressoPercentual >= 75" class="text-success/70 font-medium mt-2">
                                    Quase lá, continue assim!</div>
                                <div v-else-if="progressoPercentual >= 50" class="text-success/60 font-medium mt-2">
                                    Ótimo progresso, mantenha o ritmo!</div>
                            </UCard>
                            <!-- Progresso Card (detalhado) -->
                            <UCard class="p-4">
                                <div class="mb-2 text-muted font-medium">Progresso Detalhado</div>
                                <MobileProjectStepper :metas="selectedProjeto.metas" />
                            </UCard>
                            <!-- Participantes Card (no final) -->
                            <UCard class="p-4">
                                <div class="mb-2 text-muted font-medium">Participantes</div>
                                <div class="flex flex-wrap gap-3 md:grid md:grid-cols-2 lg:grid-cols-3">
                                    <div v-for="p in selectedProjeto.participacao" :key="p.id"
                                        class="flex items-center gap-2">
                                        <div
                                            class="w-8 h-8 rounded-full bg-primary/80 text-white flex items-center justify-center font-bold flex-shrink-0">
                                            {{ p.nome.charAt(0).toUpperCase() }}
                                        </div>
                                        <div class="min-w-0 flex-1">
                                            <div class="font-medium text-default break-words">{{ p.nome }}</div>
                                            <div class="text-xs text-muted break-words">{{ p.vinculo }} <span
                                                    v-if="p.responsavel">(Responsável)</span></div>
                                        </div>
                                    </div>
                                </div>
                            </UCard>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
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

watch(projetos, () => {
    console.log(projetos.value);
});

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

// Computed properties for participants organization
const responsaveis = computed(() => {
    if (!selectedProjeto.value) return [];
    return selectedProjeto.value.participacao.filter((p) => p.responsavel);
});

const outrosParticipantes = computed(() => {
    if (!selectedProjeto.value) return [];
    return selectedProjeto.value.participacao.filter((p) => !p.responsavel);
});

const { isMobile } = useDeviceDetection();
const appHeader = useAppHeaderStore();
const { clientFetch } = useClientFetch();

// Methods
const fetchProjetos = async () => {
    loading.value = true;
    error.value = null;

    try {
        // Usa clientFetch que trata refresh token automaticamente
        const response = await clientFetch<Projetos>("/api/suap/meus-projetos");
        projetos.value = response;
    } catch (err: any) {
        // Se chegou aqui, significa que o refresh falhou ou é outro erro
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

const getProjetoType = (projeto: Extensao | Pesquisa | Ensino) => {
    if ("area_conhecimento" in projeto) return "Projeto de Extensão";
    if ("titulo" in projeto && projetos.value) {
        if (projetos.value.Pesquisa.some((p) => p.id === projeto.id))
            return "Projeto de Pesquisa";
        if (projetos.value.Ensino.some((p) => p.id === projeto.id))
            return "Projeto de Ensino";
    }
    return "Projeto";
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
        title: "Meus Projetos",
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

// Computed properties for progress summary
// Uma meta é considerada concluída se todas as suas etapas possuem fim_execucao preenchido
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

// Fetch data on mount e setar header padrão
onMounted(() => {
    appHeader.setHeader({
        title: "Meus Projetos",
        subtitle: "",
        showBack: false,
        onBack: null,
    });
    fetchProjetos();
});

onUnmounted(() => {
    appHeader.resetHeader();
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.fade-enter-from {
    opacity: 0;
    transform: translateY(30px) scale(0.98);
}

.fade-leave-to {
    opacity: 0;
    transform: translateY(-30px) scale(0.98);
}

/* Hover effects for cards */
.group:hover {
    transform: translateY(-2px);
}

/* Smooth scrolling */
* {
    scroll-behavior: smooth;
}

/* Custom scrollbar */
::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

::-webkit-scrollbar-track {
    background: transparent;
}

::-webkit-scrollbar-thumb {
    background: rgba(156, 163, 175, 0.3);
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
    background: rgba(156, 163, 175, 0.5);
}

/* Dark mode scrollbar */
.dark ::-webkit-scrollbar-thumb {
    background: rgba(75, 85, 99, 0.3);
}

.dark ::-webkit-scrollbar-thumb:hover {
    background: rgba(75, 85, 99, 0.5);
}
</style>