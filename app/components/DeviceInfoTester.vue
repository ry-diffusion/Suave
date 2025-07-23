<script setup lang="ts">
import { useDeviceDetection } from "~/composables/useDeviceDetection";

const { isMobile } = useDeviceDetection();

// Format current device information
const deviceType = computed(() => (isMobile.value ? "Mobile" : "Desktop"));
const windowDimensions = ref({ width: 0, height: 0 });

onMounted(() => {
	if (import.meta.client) {
		// Update dimensions on mount
		updateDimensions();

		// Set up listener for window resize
		window.addEventListener("resize", updateDimensions);

		// Clean up on unmount
		onUnmounted(() => {
			window.removeEventListener("resize", updateDimensions);
		});
	}
});

function updateDimensions() {
	windowDimensions.value = {
		width: window.innerWidth,
		height: window.innerHeight,
	};
}
</script>

<template>
  <div class="p-4 m-4 border rounded-lg">
    <h2 class="text-xl font-bold mb-4">Device Detection Test</h2>
    
    <div class="space-y-4">
      <div class="p-3 bg-gray-100 dark:bg-gray-800 rounded">
        <p><strong>Detected Device:</strong> {{ deviceType }}</p>
        <p class="text-xs text-gray-500">
          This is detected on both server and client side using user agent and viewport width.
        </p>
      </div>
      
      <div v-if="import.meta.client" class="p-3 bg-gray-100 dark:bg-gray-800 rounded">
        <p><strong>Current Viewport:</strong> {{ windowDimensions.width }}px × {{ windowDimensions.height }}px</p>
        <p class="text-xs text-gray-500">
          Resize your browser window to see this value change.
        </p>
      </div>
      
      <div class="p-3" :class="isMobile ? 'bg-blue-100 dark:bg-blue-900' : 'bg-green-100 dark:bg-green-900'">
        <p class="font-medium">
          You're seeing the {{ isMobile ? 'mobile' : 'desktop' }} version of the UI!
        </p>
        <p class="text-xs text-gray-500">
          This component is rendered differently based on your device.
        </p>
      </div>
    </div>
  </div>
</template>