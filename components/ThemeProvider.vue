<script setup lang="ts">
import { useThemeStore } from '~/stores/theme';
import { useAppConfig } from '#imports';

const themeStore = useThemeStore();
const appConfig = useAppConfig();

// Function to update theme configuration
const updateThemeConfig = () => {
    appConfig.ui.colors = {
        primary: themeStore.currentTheme.primary,
        secondary: themeStore.currentTheme.secondary,
        success: themeStore.currentTheme.success,
        info: themeStore.currentTheme.info,
        warning: themeStore.currentTheme.warning,
        error: themeStore.currentTheme.error,
        neutral: themeStore.currentTheme.neutral
    };
};

// Watch for theme changes
watch(() => themeStore.currentTheme, () => {
    updateThemeConfig();
}, { deep: true });

// Initialize theme on component mount
onMounted(() => {
    // Ensure we're using the latest values from localStorage
    const savedTheme = localStorage.getItem('app-theme');
    const savedColorMode = localStorage.getItem('app-color-mode');

    if (savedTheme && savedTheme in themeStore.availableThemes) {
        themeStore.setTheme(savedTheme as keyof typeof themeStore.availableThemes);
    }

    if (savedColorMode === 'dark' || savedColorMode === 'light') {
        themeStore.colorMode = savedColorMode;
    }

    // Apply initial theme
    updateThemeConfig();

    // Apply color mode
    if (themeStore.colorMode === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
});
</script>

<template>
    <slot />
</template>