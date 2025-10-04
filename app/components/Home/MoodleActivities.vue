<template>
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
                                <UBadge :color="getModuleBadgeColor(event.course?.fullname)" variant="soft" size="sm">
                                    {{ simplifyCourseName(event.course?.fullname || 'Curso') }}
                                </UBadge>
                                <UBadge v-if="event.overdue" color="error" variant="soft" size="sm">
                                    <UIcon name="i-lucide-alert-circle" class="w-3 h-3 mr-1" />
                                    Atrasado
                                </UBadge>
                            </div>
                            <h3 class="font-semibold text-lg group-hover:text-primary-500 transition-colors">
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
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useMoodleApi } from "~/composables/useMoodleApi";
import { simplifyCourseName } from "~/utils/course";
import type { MoodleCalendarEvent } from "~~/shared/moodle.d";

const { getUpcomingEvents } = useMoodleApi();

const loadingMoodles = ref(true);
const upcomingEvents = ref<MoodleCalendarEvent[]>([]);

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

function getModuleBadgeColor(courseName?: string): "primary" | "neutral" | "secondary" | "success" | "info" | "warning" | "error" {
    if (!courseName) return 'primary';
    const colors: Array<"primary" | "neutral" | "secondary" | "success" | "info" | "warning" | "error"> = ['primary', 'success', 'info', 'warning'];
    const hash = courseName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length] || 'primary';
}

function openMoodleLink(url: string) {
    if (import.meta.client && url) {
        window.open(url, '_blank');
    }
}

onMounted(() => {
    if (import.meta.client) {
        loadRecentMoodles();
    }
});

// Prevent false-positive "unused" errors for variables used only in the template
/* istanbul ignore next */
void recentMoodles;
/* istanbul ignore next */
void formatMoodleDate;
/* istanbul ignore next */
void getModuleBadgeColor;
/* istanbul ignore next */
void openMoodleLink;
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
