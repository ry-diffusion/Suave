import { useDark } from "@vueuse/core";

/**
 * Composable for accessing theme colors based on the current color scheme
 * and Nuxt UI configuration
 */
export function useThemeColors() {
	const colorMode = useDark();
	const appConfig = useAppConfig();

	// Get primary and neutral colors from app config
	const { primary, neutral } = appConfig.ui.colors;

	// Get computed colors based on current theme
	const computedColors = computed(() => {
		const isDark = colorMode.value;

		return {
			// Primary colors
			primary: `var(--color-${primary}-${isDark ? "500" : "600"})`,
			primaryHover: `var(--color-${primary}-${isDark ? "400" : "700"})`,
			primaryLight: `var(--color-${primary}-${isDark ? "400" : "500"}/10)`,
			primaryFocus: `var(--color-${primary}-${isDark ? "400" : "500"}/30)`,

			// Secondary colors derived from primary
			secondary: `var(--color-${primary}-${isDark ? "600" : "300"})`,
			secondaryHover: `var(--color-${primary}-${isDark ? "700" : "400"})`,
			secondaryLight: `var(--color-${primary}-${isDark ? "700" : "300"}/10)`,

			// Neutral colors
			neutral: `var(--color-${neutral}-${isDark ? "600" : "400"})`,
			neutralHover: `var(--color-${neutral}-${isDark ? "700" : "500"})`,
			neutralBg: `var(--color-${neutral}-${isDark ? "900" : "100"})`,
			neutralBorder: `var(--color-${neutral}-${isDark ? "700" : "200"})`,

			// Background and text
			background: isDark ? "#111" : "#fff",
			surfaceBg: isDark ? "rgba(30, 30, 30, 0.8)" : "rgba(255, 255, 255, 0.8)",
			textPrimary: isDark ? "#fff" : "#111",
			textSecondary: isDark ? "#aaa" : "#555",
		};
	});

	return {
		colorMode,
		primary,
		neutral,
		colors: computedColors,
	};
}
