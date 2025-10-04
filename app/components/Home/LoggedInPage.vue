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
            <HomeQuickAccess />

            <!-- Bento Layout - Flex Wrap with 2 Columns -->
            <div class="flex flex-wrap gap-6">
                <!-- Moodles Section -->
                <HomeMoodleActivities />

                <!-- Right Column: Notícias (Headlines + Recentes) -->
                <HomeNewsSection />
            </div>

            <!-- Personalização Section Below -->
            <HomePersonalizationSection />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useThemeStore } from "~/stores/theme";

const { user } = useUserSession();
const themeStore = useThemeStore();

const firstName = computed(() => {
    const fullName = user.value?.fullName || '';
    return fullName.split(' ')[0] || fullName;
});

// Prevent false-positive "unused" errors for variables used only in the template
/* istanbul ignore next */
void user;
/* istanbul ignore next */
void firstName;
/* istanbul ignore next */
void themeStore;
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
