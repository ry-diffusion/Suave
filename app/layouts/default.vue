<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed, onMounted, ref, watch } from "vue";
import { useAppHeaderStore } from "~/stores/appHeader";
import { useMascotStore } from "~/stores/mascot";

const mascotStore = useMascotStore();
// Initialize from cookie only on client side
if (import.meta.client) {
	mascotStore.initializeFromCookie();
}

const route = useRoute();

const appHeader = useAppHeaderStore();
const { title, subtitle, showBack, onBack } = storeToRefs(appHeader);

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
};

const showBackButton = computed(() => {
	return route.path !== "/";
});

useHead({
	title:
		route.path === "/"
			? "Suave | Deixando seu ensino mais suave"
			: `Suave - ${title.value || pageTitle.value}`,
	meta: [{ name: "description", content: "Deixando seu ensino mais suave" }],
});

// Determine if header should be transparent
const isTransparent = computed(() => {
	return route.path === "/";
});

// Track page transitions for animations
const isPageTransitioning = ref(false);

// Watch route changes to trigger transition effects and reset header
watch(
	() => route.path,
	(newPath, oldPath) => {
		if (newPath !== oldPath) {
			isPageTransitioning.value = true;
			setTimeout(() => {
				isPageTransitioning.value = false;
			}, 600); // Match this with transition duration
		}

		// Reset header on every route change to ensure clean state
		appHeader.resetHeader();
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

// Performance mode: 'lite' (no animation), 'slow' (12fps), 'normal' (default animation)
type PerformanceMode = "lite" | "slow" | "normal";
const performanceMode = useState<PerformanceMode>("performanceMode", () => "normal");

// FPS test to guess device performance and set performanceMode
function testFPS(durationMs = 1000): Promise<number> {
	return new Promise((resolve) => {
		let frames = 0;
		const start = performance.now();
		function frame(now: number) {
			if (now - start < durationMs) {
				frames++;
				requestAnimationFrame(frame);
			} else {
				const fps = (frames * 1000) / durationMs;
				resolve(fps);
			}
		}
		requestAnimationFrame(frame);
	});
}

// Preload all mascot loading images invisibly
const preloadMascotImages = () => {
	// Get all available mascots
	const { availableMascots } = mascotStore;

	// Collect all loading image URLs from all mascots
	const allLoadingImages: string[] = [];

	Object.values(availableMascots).forEach(mascot => {
		allLoadingImages.push(...mascot.loadingUrls);
	});

	// Preload each image invisibly
	allLoadingImages.forEach(imageUrl => {
		const img = new Image();
		img.src = imageUrl;
		// No need to append to DOM - just loading is enough
	});

	console.log(`[Suave] Preloaded ${allLoadingImages.length} mascot loading images`);
};

onMounted(async () => {
	// Only run FPS test if window is defined (client-side)
	if (typeof window !== "undefined") {
		// If accessed via the old hostname, redirect to the new hostname preserving path, query and hash
		try {
			const host = window.location.hostname;
			if (host === "suave.examflow.com.br") {
				const { protocol, pathname, search, hash } = window.location;
				const target = `${protocol}//suave.zesmoi.com.br${pathname}${search}${hash}`;
				// Use replace so the redirect doesn't create a history entry
				window.location.replace(target);
				return; // stop further client-side initialization
			}
		} catch (e) {
			// ignore errors during redirect logic but log for debugging
			console.error('[Suave] hostname redirect check failed', e);
		}
		// 	const fps = await testFPS(1000); // 1 second test

		// 	if (fps === 0) {
		// 		return;
		// 	}

		// 	if (fps < 32) {
		// 		performanceMode.value = "lite";
		// 	} else if (fps < 40) {
		// 		performanceMode.value = "slow";
		// 	} else {
		// 		performanceMode.value = "normal";
		// 	}



		// 	console.log(`%c[Suave Performance Detection]%c Target FPS: ${fps}`, "color: #000000; background-color: #ffffff; font-weight: bold;", "color: #000000; background-color: #ffffff; font-weight: bold;");

		// 	if (performanceMode.value === "lite") {
		// 		console.log("%c[Suave Performance Detection] Slowest device detected. Performance mode is lite", "color: #ff0000");
		// 	} else if (performanceMode.value === "slow") {
		// 		console.log("%c[Suave Performance Detection] Slower device detected. Performance mode is slow", "color: #ff0000");
		// 	} else {
		// 		console.log("%c[Suave Performance Detection] Fast device detected. Performance mode is normal", "color: #00ff00");
		// 	}

		// Preload all mascot loading images
		preloadMascotImages();
	}
});




</script>

<template>
	<div class="flex flex-col min-h-screen bg-gradient" :class="{ 'page-transitioning': isPageTransitioning }">
		<!-- Animated background component -->
		<AnimatedBackground />

		<!-- Mascot doodles component -->
		<MascotDoodles />

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
