<template>
    <div class="min-h-screen p-4 sm:p-6 lg:p-8">
        <div class="max-w-7xl mx-auto space-y-8">
            <!-- Hero Section with Welcome -->
            <div class="glass-card rounded-3xl p-8 sm:p-10">
                <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div class="space-y-3">
                        <h1
                            class="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent">
                            Olá, {{ firstName }}! 👋
                        </h1>
                        <p class="text-lg text-gray-600 dark:text-gray-400">
                            Bem-vindo de volta. Veja suas atividades recentes e personalize sua experiência.
                        </p>
                    </div>

                    <div class="flex items-center gap-3">
                        <UButton :icon="themeStore.colorMode === 'dark' ? 'i-lucide-moon' : 'i-lucide-sun'"
                            color="neutral" variant="soft" size="lg" @click="themeStore.toggleColorMode"
                            aria-label="Alternar tema" />
                    </div>
                </div>
            </div>
            <!-- Acesso rápido -->
            <div class="flex justify-center gap-4 mt-4">
                <a href="https://suap.ifgoiano.edu.br?utm_source=Suave&utm_medium=acesso-rapido&utm_campaign=home"
                    target="_blank" rel="noopener"
                    class="glass-card flex flex-col items-center justify-center w-20 h-20 rounded-full font-semibold text-black dark:text-white hover:bg-primary-600 hover:border-2 hover:border-primary-500 hover:scale-105 transition-all duration-200 shadow-lg">
                    <UIcon name="i-lucide-building" class="w-7 h-7 mb-1" />
                    <span class="text-xs">SUAP</span>
                </a>
                <a href="https://presencial.ifgoiano.edu.br?utm_source=Suave&utm_medium=acesso-rapido&utm_campaign=home"
                    target="_blank" rel="noopener"
                    class="glass-card flex flex-col items-center justify-center w-20 h-20 rounded-full font-semibold text-black dark:text-white hover:bg-primary-600 hover:border-2 hover:border-primary-500 hover:scale-105 transition-all duration-200 shadow-lg">
                    <UIcon name="i-lucide-book" class="w-7 h-7 mb-1" />
                    <span class="text-xs">Moodle</span>
                </a>
                <a href="https://ifcronos.zesmoi.com.br?utm_source=Suave&utm_medium=acesso-rapido&utm_campaign=home"
                    target="_blank" rel="noopener"
                    class="glass-card flex flex-col items-center justify-center w-20 h-20 rounded-full font-semibold text-black dark:text-white hover:bg-primary-600 hover:border-2 hover:border-primary-500 hover:scale-105 transition-all duration-200 shadow-lg">
                    <UIcon name="i-lucide-clock" class="w-7 h-7 mb-1" />
                    <span class="text-xs">Horários</span>
                </a>
            </div>

            <!-- Bento Layout - Flex Wrap with 2 Columns -->
            <div class="flex flex-wrap gap-6">
                <!-- Moodles Section -->
                <div class="flex-1 min-w-[min(100%,400px)] space-y-4">
                    <h2 class="text-2xl font-bold flex items-center gap-2">
                        <UIcon name="i-lucide-calendar-check" class="w-6 h-6 text-primary-500" />
                        Próximas Atividades
                    </h2>

                    <template v-if="loadingMoodles">
                        <div class="space-y-4">
                            <div v-for="i in 3" :key="i" class="glass-card rounded-2xl p-6 animate-pulse">
                                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
                                <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                            </div>
                        </div>
                    </template>

                    <template v-else-if="recentMoodles.length > 0">
                        <div class="space-y-4">
                            <div v-for="event in recentMoodles" :key="event.id"
                                class="glass-card rounded-2xl p-6 hover:scale-[1.02] transition-all duration-200 cursor-pointer group"
                                @click="openMoodleLink(event.url)">
                                <div class="flex items-start justify-between gap-4">
                                    <div class="flex-1 space-y-2">
                                        <div class="flex items-center gap-2">
                                            <UBadge :color="getModuleBadgeColor(event.course?.shortname)" variant="soft"
                                                size="sm">
                                                {{ event.course?.shortname || 'Curso' }}
                                            </UBadge>
                                            <UBadge v-if="event.overdue" color="error" variant="soft" size="sm">
                                                <UIcon name="i-lucide-alert-circle" class="w-3 h-3 mr-1" />
                                                Atrasado
                                            </UBadge>
                                        </div>
                                        <h3
                                            class="font-semibold text-lg group-hover:text-primary-500 transition-colors">
                                            {{ event.name }}
                                        </h3>
                                        <div class="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                            <span class="flex items-center gap-1">
                                                <UIcon name="i-lucide-calendar" class="w-4 h-4" />
                                                {{ formatMoodleDate(event.timestart) }}
                                            </span>
                                            <span v-if="event.modulename" class="flex items-center gap-1">
                                                <UIcon name="i-lucide-bookmark" class="w-4 h-4" />
                                                {{ event.modulename }}
                                            </span>
                                        </div>
                                    </div>
                                    <UIcon name="i-lucide-external-link"
                                        class="w-5 h-5 text-gray-400 group-hover:text-primary-500 transition-colors" />
                                </div>
                            </div>
                        </div>

                        <!-- Ver todos os moodles -->
                        <NuxtLink to="/ferramentas/moodles">
                            <div
                                class="glass-card rounded-2xl p-4 hover:scale-[1.01] transition-all duration-200 cursor-pointer group text-center">
                                <div
                                    class="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 group-hover:text-primary-500 transition-colors">
                                    <span class="font-medium">Ver todos os moodles</span>
                                    <UIcon name="i-lucide-ellipsis" class="w-5 h-5" />
                                </div>
                            </div>
                        </NuxtLink>
                    </template>

                    <template v-else>
                        <div class="glass-card rounded-2xl p-12 text-center">
                            <UIcon name="i-lucide-book-open" class="w-16 h-16 mx-auto mb-4 text-gray-400" />
                            <p class="text-gray-500 dark:text-gray-400">
                                Nenhuma atividade recente encontrada
                            </p>
                        </div>
                    </template>
                    <!-- Notícias Recentes -->
                    <div v-if="news.length > 0" class="space-y-4 py-8">
                        <h3 class="text-lg font-semibold flex items-center gap-2">
                            <UIcon name="i-lucide-newspaper" class="w-5 h-5 text-primary-500" />
                            Notícias Recentes
                        </h3>
                        <div v-for="item in news" :key="item.url"
                            class="glass-card rounded-2xl p-4 hover:scale-[1.01] transition-all duration-200 cursor-pointer group"
                            @click="openLink(item.url)">
                            <div class="flex items-start justify-between gap-4">
                                <div class="flex-1 space-y-1">
                                    <h4 class="font-medium group-hover:text-primary-500 transition-colors">
                                        {{ item.title }}
                                    </h4>
                                    <p class="text-xs text-gray-500 dark:text-gray-400">
                                        {{ item.date }}
                                    </p>
                                </div>
                                <UIcon name="i-lucide-external-link"
                                    class="w-4 h-4 text-gray-400 group-hover:text-primary-500 transition-colors flex-shrink-0" />
                            </div>
                        </div>
                    </div>

                    <!-- Empty State for News -->
                    <div v-if="headlines.length === 0 && news.length === 0"
                        class="glass-card rounded-2xl p-12 text-center">
                        <UIcon name="i-lucide-newspaper" class="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <p class="text-gray-500 dark:text-gray-400">
                            Nenhuma notícia disponível no momento
                        </p>
                    </div>
                </div>

                <!-- Right Column: Notícias (Headlines + Recentes) -->
                <div class="flex-1 min-w-[min(100%,400px)] space-y-4">
                    <h2 class="text-2xl font-bold flex items-center gap-2">
                        <UIcon name="i-lucide-newspaper" class="w-6 h-6 text-primary-500" />
                        Notícias IF
                    </h2>

                    <!-- Loading State for News -->
                    <template v-if="loadingNews">
                        <div class="space-y-4">
                            <div v-for="i in 3" :key="i" class="glass-card rounded-2xl p-6 animate-pulse">
                                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
                                <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                            </div>
                        </div>
                    </template>

                    <template v-else>
                        <!-- Manchetes em Destaque (várias, ocupando o espaço disponível) -->
                        <div v-if="headlines.length > 0" class="space-y-4">
                            <div v-for="headline in headlines" :key="headline.url"
                                class="glass-card rounded-2xl hover:scale-[1.01] transition-all duration-200 cursor-pointer group overflow-hidden"
                                @click="openLink(headline.url)">
                                <div v-if="headline.image"
                                    class="w-full overflow-hidden bg-gray-100 dark:bg-gray-800 rounded-t-2xl h-40 sm:h-44 lg:h-52">
                                    <img :src="headline.image" :alt="headline.title"
                                        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                </div>
                                <div class="p-6">
                                    <div class="flex items-center gap-2 mb-2">
                                        <UBadge v-if="headline.type === 'main'" color="primary" variant="soft"
                                            size="sm">
                                            Principal
                                        </UBadge>
                                    </div>
                                    <h4
                                        class="font-semibold text-base sm:text-lg mb-2 group-hover:text-primary-500 transition-colors">
                                        {{ headline.title }}
                                    </h4>
                                    <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                                        {{ headline.description }}
                                    </p>
                                </div>
                            </div>
                        </div>


                    </template>


                </div>

            </div>

            <!-- Personalização Section Below -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Theme Color Picker -->
                <UCard class="glass-card">
                    <template #header>
                        <div class="flex items-center gap-2">
                            <UIcon name="i-lucide-palette" class="w-5 h-5" />
                            <h3 class="font-semibold">Cor do Tema</h3>
                        </div>
                    </template>

                    <div class="grid grid-cols-3 gap-3">
                        <button v-for="(theme, name) in themeStore.availableThemes" :key="name"
                            @click="handleSetTheme(name)"
                            class="group relative flex flex-col items-center gap-2 transition-all duration-200 hover:scale-105">
                            <div class="relative">
                                <div class="size-12 rounded-full transition-all duration-200" :class="[
                                    themeStore.currentTheme.primary === name
                                        ? 'ring-2 ring-offset-2 ring-primary-500'
                                        : 'ring-1 ring-gray-200 dark:ring-gray-700',
                                    'hover:ring-2 hover:ring-offset-2 hover:ring-primary-500'
                                ]" :style="{ backgroundColor: themeStore.getPreviewColor(name) }" />
                                <div v-if="themeStore.currentTheme.primary === name"
                                    class="absolute inset-0 flex items-center justify-center">
                                    <UIcon name="i-lucide-check" class="size-6 text-white drop-shadow-sm" />
                                </div>
                            </div>
                            <span class="text-xs font-medium text-center">
                                {{ themeStore.themeDisplayNames[name] }}
                            </span>
                        </button>
                    </div>
                </UCard>

                <!-- Mascot Picker -->
                <UCard class="glass-card">
                    <template #header>
                        <div class="flex items-center gap-2">
                            <UIcon name="i-lucide-smile" class="w-5 h-5" />
                            <h3 class="font-semibold">Mascote</h3>
                        </div>
                    </template>

                    <div class="space-y-3">
                        <button v-for="(mascot, name) in mascotStore.availableMascots" :key="name"
                            @click="selectMascot(name)"
                            class="group w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800/50 border-2"
                            :class="[
                                mascotStore.currentMascot.name === mascot.name
                                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                                    : 'border-transparent hover:border-gray-200 dark:hover:border-gray-700'
                            ]">
                            <img :src="mascot.previewUrl" :alt="mascot.name"
                                class="size-12 rounded-lg object-cover ring-1" :class="[
                                    mascotStore.currentMascot.name === mascot.name
                                        ? 'ring-primary-500'
                                        : 'ring-gray-200 dark:ring-gray-700'
                                ]" />
                            <div class="flex-1 text-left">
                                <p class="font-medium text-sm">
                                    {{ mascotStore.mascotDisplayNames[name] }}
                                </p>
                            </div>
                            <UIcon v-if="mascotStore.currentMascot.name === mascot.name" name="i-lucide-check"
                                class="w-5 h-5 text-primary-500" />
                        </button>
                    </div>
                </UCard>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useMascotStore } from "~/stores/mascot";
import { useThemeStore } from "~/stores/theme";
import { useMoodleApi } from "~~/shared/composables/useMoodleApi";
import type { MoodleCalendarEvent } from "~~/shared/moodle.d";

const { user } = useUserSession();
const themeStore = useThemeStore();
const mascotStore = useMascotStore();
const { getUpcomingEvents } = useMoodleApi();

const loadingMoodles = ref(true);
const loadingNews = ref(true);
const upcomingEvents = ref<MoodleCalendarEvent[]>([]);

type NewsItem = {
    title: string;
    url: string;
    date: string;
    timestamp: Date | null;
    image: string | null;
};

type HeadlineItem = {
    type: "main" | "secondary";
    title: string;
    url: string;
    description: string;
    image: string | null;
};

const news = ref<NewsItem[]>([]);
const headlines = ref<HeadlineItem[]>([]);

const firstName = computed(() => {
    const fullName = user.value?.fullName || '';
    return fullName.split(' ')[0] || fullName;
});

const recentMoodles = computed(() => {
    // Eventos já vêm filtrados (quiz e assign) do servidor
    return upcomingEvents.value
        .filter(event => !event.overdue)
        .slice(0, 5);
});

async function loadRecentMoodles() {
    try {
        loadingMoodles.value = true;

        const eventsResult = await getUpcomingEvents();
        if (eventsResult.error) {
            console.error("Erro ao carregar eventos:", eventsResult.data);
            return;
        }

        upcomingEvents.value = eventsResult.data.events as MoodleCalendarEvent[];
    } catch (error) {
        console.error("Erro ao carregar eventos do calendário:", error);
    } finally {
        loadingMoodles.value = false;
    }
}

async function loadNews() {
    try {
        loadingNews.value = true;

        const response = await $fetch<{ news: NewsItem[]; headlines: HeadlineItem[] }>("/api/if-news");
        news.value = response.news;
        headlines.value = response.headlines;
    } catch (error) {
        console.error("Erro ao carregar notícias:", error);
    } finally {
        loadingNews.value = false;
    }
}

function formatMoodleDate(timestamp?: number) {
    if (!timestamp) return "Sem data";
    const date = new Date(timestamp * 1000);
    if (Number.isNaN(date.getTime())) return "Sem data";

    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Hoje";
    if (diffDays === 1) return "Amanhã";
    if (diffDays > 1 && diffDays <= 7) return `Em ${diffDays} dias`;

    return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
    });
}

function getModuleBadgeColor(courseName?: string) {
    if (!courseName) return 'primary';
    const colors = ['primary', 'blue', 'green', 'purple', 'orange', 'pink'];
    const hash = courseName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
}

function openMoodleLink(url: string) {
    if (import.meta.client && url) {
        window.open(url, '_blank');
    }
}

function openLink(url: string) {
    if (import.meta.client && url) {
        window.open(url, '_blank');
    }
}

function handleSetTheme(name: string) {
    themeStore.setTheme(name);
}

function selectMascot(mascotName: keyof typeof mascotStore.availableMascots) {
    mascotStore.setMascot(mascotName);
    const mascot = mascotStore.availableMascots[mascotName];
    if (mascot?.preferredTheme) {
        handleSetTheme(mascot.preferredTheme);
    }
}

onMounted(() => {
    if (import.meta.client) {
        loadRecentMoodles();
        loadNews();
    }
});

// Prevent false-positive "unused" errors for variables used only in the template
/* istanbul ignore next */
void user;
/* istanbul ignore next */
void firstName;
/* istanbul ignore next */
void recentMoodles;
/* istanbul ignore next */
void loadingNews;
/* istanbul ignore next */
void news;
/* istanbul ignore next */
void headlines;
/* istanbul ignore next */
void formatMoodleDate;
/* istanbul ignore next */
void getModuleBadgeColor;
/* istanbul ignore next */
void openMoodleLink;
/* istanbul ignore next */
void openLink;
/* istanbul ignore next */
void selectMascot;
</script>

<style scoped>
.glass-card {
    background: rgba(255, 255, 255, 0.7) !important;
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.2) !important;
    box-shadow:
        0 8px 32px 0 rgba(31, 38, 135, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.dark .glass-card {
    background: rgba(0, 0, 0, 0.3) !important;
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
    box-shadow:
        0 8px 32px 0 rgba(0, 0, 0, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.glass-card:hover {
    background: rgba(255, 255, 255, 0.8) !important;
}

.dark .glass-card:hover {
    background: rgba(0, 0, 0, 0.4) !important;
}
</style>
