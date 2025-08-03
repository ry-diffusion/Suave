<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-black/80 backdrop-blur-sm">
    <div class="flex flex-col items-center justify-center">
      <GuiLoading />
      <div v-if="message" class="mt-4 text-center">
        <p class="text-white text-lg font-medium">{{ message }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  message?: string
}

withDefaults(defineProps<Props>(), {
  message: ''
})
</script>
