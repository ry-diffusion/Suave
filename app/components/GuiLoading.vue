<template>
  <div class="flex justify-center items-center">
    <img
      :key="currentImageIndex"
      :src="currentLoadingImage"
      loading="eager"
      decoding="sync"
      :alt="`Loading image ${currentImageIndex + 1}`"
      width="100"
      height="100"
      class="loading-animation w-32 h-32"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useMascotStore } from '~/stores/mascot'

const mascotStore = useMascotStore()
const currentImageIndex = ref(0)
const interval = ref<NodeJS.Timeout | null>(null)

const currentLoadingImage = computed(() => {
  const loadingUrls = mascotStore.currentMascot.loadingUrls
  if (loadingUrls.length === 0) return ''
  return loadingUrls[currentImageIndex.value] || loadingUrls[0]
})

onMounted(() => {
  const loadingUrls = mascotStore.currentMascot.loadingUrls
  if (loadingUrls.length > 0) {
    interval.value = setInterval(() => {
      currentImageIndex.value = (currentImageIndex.value + 1) % loadingUrls.length
    }, 1000) // Change image every second
  }
})

onUnmounted(() => {
  if (interval.value) {
    clearInterval(interval.value)
  }
})
</script>

<style scoped>
@keyframes loadingAnimation {
  0% {
    opacity: 0;
    transform: translateY(20px) rotate(0deg);
  }
  20% {
    opacity: 1;
    transform: translateY(-80px) rotate(0deg);
  }
  50% {
    transform: translateY(-100px) translateX(-50px) rotate(-20deg);
  }
  100% {
    opacity: 0;
    transform: translateY(-120px) translateX(80px) rotate(30deg);
  }
}

.loading-animation {
  animation: loadingAnimation 1.2s cubic-bezier(0.6, -0.28, 0.735, 0.045) infinite;
}
</style> 