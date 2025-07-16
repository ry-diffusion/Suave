<script setup lang="ts">
import { useAuthRefresh } from "~/composables/useAuthRefresh";
import { storeToRefs } from 'pinia'
import { useAppHeaderStore } from '~/stores/appHeader'
import { computed } from 'vue'

const route = useRoute();

const appHeader = useAppHeaderStore()
const { title, subtitle, showBack, onBack } = storeToRefs(appHeader)

// Compute title based on the current route
const pageTitle = computed(() => {
    const path = route.path;
    if (path === "/") return "Suave";
    if (path === "/perfil") return "Perfil";
    if (path === "/ferramentas") return "Ferramentas";
    if (path === "/ferramentas/moodles") return "Moodles Disponíveis";
    if (path === "/ferramentas/desempenho") return "Desempenho Acadêmico";
    if (path === "/projetos") return "Meus Projetos";
    return "";
});

const fallbackOnBack = () => {
    // fallback para router.back()
    const router = useRouter();
    router.back();
}

const showBackButton = computed(() => {
    return route.path !== "/";
});

useHead({
    title: route.path === "/" ? "Suave | Deixando seu ensino mais suave" : `Suave - ${title.value || pageTitle.value}`,
    meta: [
        { name: "description", content: "Deixando seu ensino mais suave" },
    ],
})

// Determine if header should be transparent
const isTransparent = computed(() => {
    return route.path === "/";
});

// Track page transitions for animations
const isPageTransitioning = ref(false);

// Watch route changes to trigger transition effects
watch(
    () => route.path,
    (newPath, oldPath) => {
        if (newPath !== oldPath) {
            isPageTransitioning.value = true;
            setTimeout(() => {
                isPageTransitioning.value = false;
            }, 600); // Match this with transition duration
        }
    },
);

// Determine if large title should be used (iOS style)
const useLargeTitle = computed(() => {
    return route.path === "/" || route.path === "/ferramentas";
});

// Add padding to content based on page
const contentClass = computed(() => {
    return {
        "pt-4": !useLargeTitle.value,
        "pt-0": useLargeTitle.value,
    };
});

useAuthRefresh();
</script>

<template>
    <div class="flex flex-col min-h-screen bg-gradient" :class="{ 'page-transitioning': isPageTransitioning }">
        <!-- Animated background component -->
        <AnimatedBackground />

        <AppShell :title="title || pageTitle" :subtitle="subtitle" :show-back="showBack || showBackButton"
            :onBack="onBack || fallbackOnBack" :large-title="useLargeTitle" :transparent="isTransparent">
            <main class="grow relative z-10" :class="contentClass">
                <div class="container mx-auto px-4">
                    <slot />
                </div>
            </main>
        </AppShell>
    </div>
</template>

<style scoped>
/* Add overlay styles to ensure UI elements have enough contrast against the background */
:deep(.glass-effect) {
    backdrop-filter: blur(10px) !important;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

/* Background gradient */
.bg-gradient {
    background: radial-gradient(circle at center,
            rgba(var(--color-primary-500-rgb), 0.08) 0%,
            rgba(var(--color-primary-500-rgb), 0.01) 60%,
            transparent 100%);
}

/* Make content cards have glass effect */
:deep(.card),
:deep(.u-card) {
    backdrop-filter: blur(8px);
    background-color: rgba(255, 255, 255, 0.7) !important;
}

:deep(.dark .card),
:deep(.dark .u-card) {
    background-color: rgba(30, 30, 30, 0.7) !important;
}

/* Page transition animations */
:deep(.page-enter-active),
:deep(.page-leave-active) {
    transition: all 0.5s cubic-bezier(0.33, 1, 0.68, 1);
}

:deep(.page-enter-from) {
    opacity: 0;
    transform: translateY(20px);
}

:deep(.page-leave-to) {
    opacity: 0;
    transform: translateY(-20px);
}

/* Extra transition effects when navigating */
.page-transitioning :deep(.animated-background) {
    transform: scale(1.05);
    filter: blur(8px);
    transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.page-transitioning :deep(.shape) {
    opacity: 0.3 !important;
    transition: opacity 0.6s ease-out;
}
</style>
