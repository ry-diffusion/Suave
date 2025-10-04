<template>
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
        </template>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";

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

const loadingNews = ref(true);
const news = ref<NewsItem[]>([]);
const headlines = ref<HeadlineItem[]>([]);

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

function openLink(url: string) {
    if (import.meta.client && url) {
        window.open(url, '_blank');
    }
}

onMounted(() => {
    if (import.meta.client) {
        loadNews();
    }
});

// Prevent false-positive "unused" errors for variables used only in the template
/* istanbul ignore next */
void loadingNews;
/* istanbul ignore next */
void news;
/* istanbul ignore next */
void headlines;
/* istanbul ignore next */
void openLink;
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
