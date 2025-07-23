<script setup lang="ts">
import { useThemeStore, getServerTheme } from "~/stores/theme";
import { useAppConfig, useHead } from "#imports";

const themeStore = useThemeStore();
const appConfig = useAppConfig();

// Get server theme values
const { theme, mode } = getServerTheme();

// Set initial theme in app config
appConfig.ui.colors = {
	primary: theme.primary,
	secondary: theme.secondary,
	success: theme.success,
	info: theme.info,
	warning: theme.warning,
	error: theme.error,
	neutral: theme.neutral,
};

// Set dark mode class during SSR and client-side
useHead({
	htmlAttrs: {
		class: mode === "dark" ? "dark" : "",
	},
});

// Function to update theme configuration
const updateThemeConfig = () => {
	appConfig.ui.colors = {
		primary: themeStore.currentTheme.primary,
		secondary: themeStore.currentTheme.secondary,
		success: themeStore.currentTheme.success,
		info: themeStore.currentTheme.info,
		warning: themeStore.currentTheme.warning,
		error: themeStore.currentTheme.error,
		neutral: themeStore.currentTheme.neutral,
	};
};

// Watch for theme changes
watch(
	() => themeStore.currentTheme,
	() => {
		updateThemeConfig();
	},
	{ deep: true },
);

// Initialize theme on component mount
onMounted(() => {
	// Initialize store with server values
	themeStore.initializeFromServer(theme, mode as "light" | "dark");
});
</script>

<template>
    <slot />
</template>