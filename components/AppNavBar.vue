<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";
import { useDeviceDetection } from '~/composables/useDeviceDetection';

const route = useRoute();
const { isMobile } = useDeviceDetection();
const isDrawerOpen = ref(false);

// Function to toggle the drawer
const toggleDrawer = () => {
    isDrawerOpen.value = !isDrawerOpen.value;
};

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
    <!-- Desktop navigation -->
    <UNavigationMenu
        v-if="!isMobile"
        :items="items"
        class="w-full justify-center"
    />

    <!-- Mobile navigation -->
    <div
        v-else
        class="fixed bottom-0 left-0 right-0 bg-white/75 dark:bg-gray-900/75 border-t border-gray-200 dark:border-gray-800 backdrop-blur-lg z-40"
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
                        ? 'text-primary-500 dark:text-primary-400'
                        : 'text-gray-600 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400',
                ]"
                @click="
                    item.label === 'Ferramentas' ? toggleDrawer() : undefined
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
        :ui="{ overlay: { background: 'bg-gray-900/50' }, wrapper: { base: 'z-[60]' }, body: { background: 'bg-white/75 dark:bg-gray-900/75 backdrop-blur-lg' } }"
    >
        <template #header>
            <div class="flex items-center justify-between">
                <h3 class="text-xl font-semibold">Ferramentas</h3>
                <UButton
                    icon="i-lucide-x"
                    color="gray"
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
                    class="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                    @click="isDrawerOpen = false"
                >
                    <div class="flex items-center space-x-3">
                        <UIcon
                            :name="child.icon"
                            class="flex-shrink-0 h-6 w-6 text-primary-500"
                        />
                        <div>
                            <div class="font-medium">{{ child.label }}</div>
                            <p class="text-sm text-gray-500 dark:text-gray-400">
                                {{ child.description }}
                            </p>
                        </div>
                    </div>
                </NuxtLink>
            </div>
        </template>
    </UDrawer>
</template>
