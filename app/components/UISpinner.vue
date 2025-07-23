<template>
    <svg :width="size" :height="size" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg"
        :class="['spinner', 'animate-spin', customClass]" :style="{ color }">
        <circle class="opacity-20" cx="22" cy="22" r="18" stroke="currentColor" stroke-width="4" />
        <path d="M40 22c0-9.94-8.06-18-18-18" stroke="currentColor" stroke-width="4" stroke-linecap="round" />
    </svg>
</template>

<script setup lang="ts">
defineProps({
	size: {
		type: [String, Number],
		default: 44,
	},
	color: {
		type: String,
		default: "currentColor",
	},
	customClass: {
		type: String,
		default: "",
	},
});
</script>

<style scoped>
.spinner {
    /* iOS spinner spins a bit slower than default Tailwind spin */
    animation-duration: 0.9s;
    animation-timing-function: linear;
}
</style>