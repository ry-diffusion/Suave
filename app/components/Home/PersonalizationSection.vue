<template>
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
</template>

<script setup lang="ts">
import { useMascotStore } from "~/stores/mascot";
import { useThemeStore } from "~/stores/theme";

const themeStore = useThemeStore();
const mascotStore = useMascotStore();

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

// Prevent false-positive "unused" errors for variables used only in the template
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
