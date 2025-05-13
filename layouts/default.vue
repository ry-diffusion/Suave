<script setup lang="ts">
const route = useRoute();

// Compute title based on the current route
const pageTitle = computed(() => {
    const path = route.path;
    if (path === '/') return 'Suave';
    if (path === '/perfil') return 'Perfil';
    if (path === '/ferramentas') return 'Ferramentas';
    if (path === '/ferramentas/moodles') return 'Moodles Disponíveis';
    if (path === '/ferramentas/desempenho') return 'Desempenho Acadêmico';
    return '';
});

// Determine if back button should be shown
const showBackButton = computed(() => {
    return route.path !== '/';
});

// Determine if large title should be used (iOS style)
const useLargeTitle = computed(() => {
    return route.path === '/' || route.path === '/ferramentas';
});

// Add padding to content based on page
const contentClass = computed(() => {
    return {
        'pt-4': !useLargeTitle.value,
        'pt-0': useLargeTitle.value
    };
});
</script>

<template>
    <div>
        <AppHeader :title="pageTitle" :show-back="showBackButton" :large-title="useLargeTitle" />
        <AppNavBar />
        <div :class="contentClass">
            <slot />
        </div>
    </div>
</template>
