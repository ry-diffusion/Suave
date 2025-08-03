<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";
import { useDeviceDetection } from "~/composables/useDeviceDetection";

interface Props {
    title?: string;
    showBack?: boolean;
    transparent?: boolean;
    largeTitle?: boolean;
    subtitle?: string; // Adicionando prop opcional subtitle
    onBack?: () => void; // Nova prop opcional para handler customizado
}

const props = defineProps<Props>();
const route = useRoute();
const { progress } = useLoadingIndicator({
    duration: 2000,
});

// Smooth progress transition
const smoothProgress = ref(0);
const showProgress = ref(false);
let progressAnimationFrame: number;

watch(progress, (newValue) => {
    if (newValue > 0) {
        showProgress.value = true;
    }

    const startValue = smoothProgress.value;
    const endValue = newValue;
    const duration = 300; // 300ms transition
    const startTime = performance.now();

    const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease in-out function
        const easeProgress =
            progress < 0.5
                ? 2 * progress * progress
                : 1 - (-2 * progress + 2) ** 2 / 2;

        smoothProgress.value = startValue + (endValue - startValue) * easeProgress;

        if (progress < 1) {
            progressAnimationFrame = requestAnimationFrame(animate);
        } else if (endValue === 100) {
            // When progress reaches 100%, wait a bit then fade out
            setTimeout(() => {
                showProgress.value = false;
            }, 200);
        }
    };

    cancelAnimationFrame(progressAnimationFrame);
    progressAnimationFrame = requestAnimationFrame(animate);
});

// Cleanup animation frame on component unmount
onUnmounted(() => {
    cancelAnimationFrame(progressAnimationFrame);
});

// Determine if we're on the homepage
const isHomePage = computed(() => route.path === "/");

const router = useRouter();
const { isMobile } = useDeviceDetection();
const isDrawerOpen = ref(false);

// Function to toggle the drawer
const toggleDrawer = () => {
    isDrawerOpen.value = !isDrawerOpen.value;
};

// Function to go back in navigation history
function goBack() {
    if (typeof props.onBack === "function") {
        props.onBack();
    } else {
        router.back();
    }
}

const items = ref<NavigationMenuItem[]>([
    {
        label: "Home",
        icon: "i-lucide-home",
        to: "/",
    },
    {
        label: "Ferramentas",
        icon: "i-lucide-wrench",
        to: "/ferramentas",
        children: [
            {
                label: "Moodles Disponiveis",
                description: "Visualize os Moodles disponíveis",
                icon: "i-lucide-book-open",
                to: "/ferramentas/moodles",
            },
            {
                label: "Desempenho Acadêmico",
                description: "Acompanhe seu desempenho acadêmico",
                icon: "i-lucide-bar-chart-2",
                to: "/ferramentas/desempenho",
            },
            {
                label: "Meus Projetos",
                description: "Visualize seus projetos acadêmicos",
                icon: "i-lucide-folder",
                to: "/projetos",
            },
        ],
    },
    {
        label: "Perfil",
        icon: "i-lucide-user",
        to: "/perfil",
    },
]);

// Navigation items specifically for mobile bottom navigation
const mobileItems = computed(() => [
    {
        label: "Home",
        icon: "i-lucide-home",
        to: "/",
    },
    {
        label: "Ferramentas",
        icon: "i-lucide-wrench",
        to: "/ferramentas",
    },
    {
        label: "Perfil",
        icon: "i-lucide-user",
        to: "/perfil",
    },
]);
</script>

<template>
    <div>
        <!-- Header Component -->
        <header
            class="sticky top-0 z-50 px-4 py-3 h-16 flex flex-col justify-center transition-all duration-500 outline-neutral-200/80 dark:outline-neutral-800/80"
            :class="[
                isHomePage
                    ? 'bg-transparent border-none'
                    : transparent
                        ? 'bg-transparent backdrop-blur-sm shadow-sm'
                        : 'outline glass-effect bg-neutral-100/60 dark:bg-neutral-900/60 backdrop-blur-lg shadow-md',
            ]">
            <!-- Loading Bar -->
            <Transition name="fade">
                <div v-if="showProgress"
                    class="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-primary/50 via-primary to-primary/50 animate-loading-bar"
                    :style="{ width: `${smoothProgress}%` }" />
            </Transition>

            <!-- Mobile Layout -->
            <template v-if="isMobile">
                <div class="flex items-center justify-center w-full relative">
                    <!-- Back button (Only on mobile) -->
                    <div class="absolute left-0 z-10">
                        <transition name="fade" mode="out-in">
                            <button v-if="showBack" class="flex items-center text-primary font-medium"
                                aria-label="Go back" @click="goBack">
                                <UIcon name="i-lucide-chevron-left" class="h-5 w-5 mr-1" />
                                <span>Voltar</span>
                            </button>
                        </transition>
                    </div>
                    <!-- Title (centered on mobile) -->
                    <div class="flex flex-col items-center w-full">
                        <transition name="fade" mode="out-in">
                            <h1 v-if="title" :key="title" :class="{
                                'text-3xl font-semibold': largeTitle,
                                'text-lg font-semibold': !largeTitle,
                                'font-bangers text-4xl tracking-wider text-primary drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)] hover:drop-shadow-[0_4px_4px_rgba(0,0,0,0.4)] transition-all duration-300': isHomePage,
                            }">
                                {{ title }}
                            </h1>
                        </transition>
                        <span v-if="subtitle"
                            class="text-xs text-muted mt-0.5 font-normal text-center truncate max-w-full">{{ subtitle
                            }}</span>
                    </div>
                </div>
            </template>

            <!-- Desktop Layout -->
            <template v-else>
                <div class="flex items-center min-h-[4.5rem] py-2 w-full">
                    <div class="flex flex-col justify-center items-start">
                        <transition name="fade" mode="out-in">
                            <h1 v-if="title" :key="title" :class="{
                                'text-3xl font-semibold': largeTitle,
                                'text-lg font-semibold': !largeTitle,
                            }">
                                {{ title }}
                            </h1>
                        </transition>
                        <span v-if="subtitle" class="text-sm text-muted font-normal mt-1 truncate max-w-full">{{
                            subtitle }}</span>
                    </div>
                    <div class="ml-auto flex items-center">
                        <UNavigationMenu :items="items" :ui="{ childList: 'flex flex-col' }" />
                    </div>
                </div>
            </template>
        </header>

        <!-- Mobile Bottom Navigation -->
        <div v-if="isMobile"
            class="fixed bottom-0 left-0 right-0 glass-effect bg-neutral-100/60 dark:bg-neutral-900/60 z-40 shadow-[0_-1px_3px_rgba(0,0,0,0.1)]">
            <div class="grid grid-cols-3 h-16 border-t border-neutral-300 dark:border-neutral-800">
                <NuxtLink v-for="item in mobileItems" :key="item.label"
                    :to="item.label === 'Ferramentas' ? undefined : item.to" :class="[
                        'flex flex-col items-center justify-center relative',
                        route.path === item.to ||
                            (item.label === 'Ferramentas' &&
                                (route.path.startsWith('/ferramentas') || route.path === '/projetos'))
                            ? 'text-primary after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-1/3 after:h-0.5 after:bg-primary after:rounded-full'
                            : 'text-neutral-600 hover:text-primary dark:text-neutral-400 dark:hover:text-primary',
                    ]" @click="
                        item.label === 'Ferramentas'
                            ? toggleDrawer()
                            : undefined
                        ">
                    <UIcon :name="item.icon" class="h-6 w-6" />
                    <span class="text-xs mt-1 break-words text-center">{{ item.label }}</span>
                </NuxtLink>
            </div>
        </div>

        <!-- Ferramentas Drawer -->
        <UDrawer v-model:open="isDrawerOpen"
            class="glass-effect bg-neutral-100/60 dark:bg-neutral-900/60 backdrop-blur-lg shadow-lg"
            overlay-class="bg-neutral-900/60">
            <template #header>
                <div
                    class="flex items-center justify-between border-b border-neutral-200/80 dark:border-neutral-800/80 pb-3">
                    <h3 class="text-xl font-semibold">Ferramentas</h3>
                    <UButton icon="i-lucide-x" color="neutral" variant="ghost" @click="isDrawerOpen = false" />
                </div>
            </template>
            <template #content>
                <div class="space-y-2 p-4 flex flex-col">
                    <NuxtLink v-for="child in items.find(
                        (item) => item.label === 'Ferramentas',
                    )?.children" :key="child.label" :to="child.to"
                        class="block p-3 rounded-xl hover:bg-neutral-100/70 dark:hover:bg-neutral-800/70 hover-lift border border-neutral-200/50 dark:border-neutral-800/50 shadow-sm"
                        @click="isDrawerOpen = false">
                        <div class="flex items-center space-x-3">
                            <UIcon :name="child.icon" class="flex-shrink-0 h-6 w-6 text-primary" />
                            <div class="min-w-0 flex-1">
                                <div class="font-medium break-words">{{ child.label }}</div>
                                <p class="text-sm text-neutral-500 dark:text-neutral-400 break-words">
                                    {{ child.description }}
                                </p>
                            </div>
                        </div>
                    </NuxtLink>
                </div>
            </template>
        </UDrawer>

        <!-- Main content -->
        <slot />
    </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition-property: opacity, transform;
    transition-duration: 0.2s;
    transition-timing-function: ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateX(-5px);
}

/* iOS-like animation for page transitions */
:deep(.page-enter-active),
:deep(.page-leave-active) {
    transition-property: opacity, transform;
    transition-duration: 0.3s;
    transition-timing-function: ease-out;
}

:deep(.page-enter-from) {
    opacity: 0;
    transform: translateX(20px);
}

:deep(.page-leave-to) {
    opacity: 0;
    transform: translateX(-20px);
}

/* Additional styles for glass-effect elements */
:deep(.glass-effect) {
    transition-property: opacity, transform, backdrop-filter, box-shadow;
    /* Removed border-color from transition-property */
    transition-duration: 0.5s;
    transition-timing-function: ease;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    border-color: transparent;
}

/* Header blur */
header {
    backdrop-filter: blur(0);
    box-shadow: none;
    transition-property: opacity, transform, backdrop-filter, box-shadow;
    /* Removed border-bottom from transition-property */
    transition-duration: 0.5s;
    transition-timing-function: ease;
}

header.backdrop-blur-sm {
    backdrop-filter: blur(4px);
}

header.backdrop-blur-lg {
    backdrop-filter: blur(12px);
}

header.shadow-sm {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

header.shadow-md {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Loading bar animation */
@keyframes loading-bar {
    0% {
        background-position: 0% 50%;
    }

    50% {
        background-position: 100% 50%;
    }

    100% {
        background-position: 0% 50%;
    }
}

.animate-loading-bar {
    background-size: 200% 100%;
    animation: loading-bar 2s ease infinite;
}

/* Progress bar fade transition */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

/* iOS-style hover lift effect */
.hover-lift {
    transition:
        transform 0.2s ease,
        box-shadow 0.2s ease;
}

.hover-lift:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* iOS-style drawer animation */
:deep(.drawer-enter-active),
:deep(.drawer-leave-active) {
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

:deep(.drawer-enter-from),
:deep(.drawer-leave-to) {
    transform: translateX(100%);
}

/* iOS-style button press effect */
:deep(.u-button) {
    transition: transform 0.1s ease;
}

:deep(.u-button:active) {
    transform: scale(0.98);
}
</style>
