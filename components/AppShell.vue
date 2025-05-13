<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";
import { useDeviceDetection } from "~/composables/useDeviceDetection";

interface Props {
    title?: string;
    showBack?: boolean;
    transparent?: boolean;
    largeTitle?: boolean;
}

defineProps<Props>();

const route = useRoute();
const router = useRouter();
const { isMobile } = useDeviceDetection();
const isDrawerOpen = ref(false);

// Function to toggle the drawer
const toggleDrawer = () => {
    isDrawerOpen.value = !isDrawerOpen.value;
};

// Function to go back in navigation history
function goBack() {
    router.back();
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
            class="sticky top-0 z-50 px-4 py-3 h-16 flex items-center"
            :class="[
                transparent
                    ? ''
                    : 'glass-effect bg-white/60 dark:bg-gray-900/60 border-b border-gray-200/80 dark:border-gray-800/80 backdrop-blur-lg',
            ]"
        >
            <!-- Mobile Layout -->
            <template v-if="isMobile">
                <!-- Back button (Only on mobile) -->
                <div class="absolute left-4 z-10">
                    <transition name="fade" mode="out-in">
                        <button
                            v-if="showBack"
                            class="flex items-center text-primary font-medium"
                            aria-label="Go back"
                            @click="goBack"
                        >
                            <UIcon
                                name="i-lucide-chevron-left"
                                class="h-5 w-5 mr-1"
                            />
                            <span>Voltar</span>
                        </button>
                    </transition>
                </div>

                <!-- Title (centered on mobile) -->
                <div class="w-full text-center">
                    <transition name="fade" mode="out-in">
                        <h1
                            v-if="title"
                            :key="title"
                            :class="{
                                'text-3xl font-semibold': largeTitle,
                                'text-lg font-semibold': !largeTitle,
                            }"
                        >
                            {{ title }}
                        </h1>
                    </transition>
                </div>
            </template>

            <!-- Desktop Layout -->
            <template v-else>
                <!-- Title (left-aligned on desktop) -->
                <div>
                    <transition name="fade" mode="out-in">
                        <h1
                            v-if="title"
                            :key="title"
                            :class="{
                                'text-3xl font-semibold': largeTitle,
                                'text-lg font-semibold': !largeTitle,
                            }"
                        >
                            {{ title }}
                        </h1>
                    </transition>
                </div>

                <!-- Desktop Navigation -->
                <div class="ml-auto">
                    <UNavigationMenu :items="items" />
                </div>
            </template>
        </header>

        <!-- Mobile Bottom Navigation -->
        <div
            v-if="isMobile"
            class="fixed bottom-0 left-0 right-0 glass-effect bg-white/60 dark:bg-gray-900/60 border-t border-gray-200/80 dark:border-gray-800/80 backdrop-blur-lg z-40"
        >
            <div class="grid grid-cols-3 h-16">
                <NuxtLink
                    v-for="item in mobileItems"
                    :key="item.label"
                    :to="item.label === 'Ferramentas' ? undefined : item.to"
                    :class="[
                        'flex flex-col items-center justify-center',
                        route.path === item.to ||
                    (item.label === 'Ferramentas' &&
                        route.path.startsWith('/ferramentas'))
                        ? 'text-primary'
                        : 'text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary',
                    ]"
                    @click="
                        item.label === 'Ferramentas'
                            ? toggleDrawer()
                            : undefined
                    "
                >
                    <UIcon :name="item.icon" class="h-6 w-6" />
                    <span class="text-xs mt-1">{{ item.label }}</span>
                </NuxtLink>
            </div>
        </div>

        <!-- Ferramentas Drawer -->
        <UDrawer
            v-model:open="isDrawerOpen"
            class="glass-effect bg-white/60 dark:bg-gray-900/60 backdrop-blur-lg"
            overlay-class="bg-gray-900/60"
        >
            <template #header>
                <div class="flex items-center justify-between">
                    <h3 class="text-xl font-semibold">Ferramentas</h3>
                    <UButton
                        icon="i-lucide-x"
                        color="neutral"
                        variant="ghost"
                        @click="isDrawerOpen = false"
                    />
                </div>
            </template>
            <template #content>
                <div class="space-y-4 p-4">
                    <NuxtLink
                        v-for="child in items.find(
                            (item) => item.label === 'Ferramentas',
                        )?.children"
                        :key="child.label"
                        :to="child.to"
                        class="block p-3 rounded-lg hover:bg-gray-100/70 dark:hover:bg-gray-800/70 hover-lift"
                        @click="isDrawerOpen = false"
                    >
                        <div class="flex items-center space-x-3">
                            <UIcon
                                :name="child.icon"
                                class="flex-shrink-0 h-6 w-6 text-primary"
                            />
                            <div>
                                <div class="font-medium">{{ child.label }}</div>
                                <p
                                    class="text-sm text-gray-500 dark:text-gray-400"
                                >
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
    transition: all 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateX(-5px);
}

/* iOS-like animation for page transitions */
:deep(.page-enter-active),
:deep(.page-leave-active) {
    transition: all 0.3s ease-out;
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
    transition: all 0.3s ease;
}
</style>
