<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed, onMounted, ref, watch } from "vue";
import { useMascotStore } from "~/stores/mascot";

const mascotStore = useMascotStore();
const { currentMascot } = storeToRefs(mascotStore);

// Initialize from cookie on mount
onMounted(() => {
  mascotStore.initializeFromCookie();
});

// State for doodle display
const visibleDoodles = ref<Array<{
  id: number;
  url: string;
  x: number;
  y: number;
  opacity: number;
  scale: number;
  rotation: number;
}>>([]);

const nextDoodleId = ref(1);

// Configuration
const maxDoodles = 3;
const doodleLifetime = 8000; // 8 seconds
const spawnInterval = 4000; // 4 seconds between spawns

// Spawn a new doodle
const spawnDoodle = () => {
  const doodleUrl = mascotStore.getRandomDoodle();
  if (!doodleUrl) return; // No doodles available

  // Remove old doodles if we have too many
  if (visibleDoodles.value.length >= maxDoodles) {
    visibleDoodles.value.shift();
  }

  // Random position (avoiding edges)
  const x = Math.random() * 60 + 20; // 20% to 80% of viewport width
  const y = Math.random() * 60 + 20; // 20% to 80% of viewport height

  const newDoodle = {
    id: nextDoodleId.value++,
    url: doodleUrl,
    x,
    y,
    opacity: 0,
    scale: 0.8 + Math.random() * 0.4, // 0.8 to 1.2
    rotation: Math.random() * 360, // Random rotation
  };

  visibleDoodles.value.push(newDoodle);

  // Animate in
  setTimeout(() => {
    const doodle = visibleDoodles.value.find(d => d.id === newDoodle.id);
    if (doodle) {
      doodle.opacity = 1;
    }
  }, 100);

  // Remove after lifetime
  setTimeout(() => {
    const doodle = visibleDoodles.value.find(d => d.id === newDoodle.id);
    if (doodle) {
      doodle.opacity = 0;
      setTimeout(() => {
        visibleDoodles.value = visibleDoodles.value.filter(d => d.id !== newDoodle.id);
      }, 500);
    }
  }, doodleLifetime);
};

// Start spawning doodles
let spawnTimer: NodeJS.Timeout | null = null;

const startSpawning = () => {
  if (spawnTimer) clearInterval(spawnTimer);

  // Spawn first doodle after a short delay
  setTimeout(() => {
    spawnDoodle();
  }, 1000);

  // Then spawn periodically
  spawnTimer = setInterval(() => {
    spawnDoodle();
  }, spawnInterval);
};

const stopSpawning = () => {
  if (spawnTimer) {
    clearInterval(spawnTimer);
    spawnTimer = null;
  }
};

// Watch for mascot changes
watch(() => currentMascot.value, (newMascot) => {
  // Clear existing doodles when mascot changes
  visibleDoodles.value = [];
  stopSpawning();

  // Only start spawning if the mascot has doodles and we're on the client
  if (newMascot.doodleUrls.length > 0 && import.meta.client) {
    startSpawning();
  }
}, { immediate: true });

// Cleanup on unmount
onUnmounted(() => {
  stopSpawning();
});

// Only show doodles if the current mascot has them
const shouldShowDoodles = computed(() => {
  return currentMascot.value.doodleUrls.length > 0;
});
</script>

<template>
  <div v-if="shouldShowDoodles" class="mascot-doodles" aria-hidden="true">
    <TransitionGroup name="doodle" tag="div" class="doodles-container">
      <div v-for="doodle in visibleDoodles" :key="doodle.id" class="doodle" :style="{
        left: `${doodle.x}%`,
        top: `${doodle.y}%`,
        opacity: doodle.opacity,
        transform: `scale(${doodle.scale}) rotate(${doodle.rotation}deg)`,
      }">
        <img :src="doodle.url" :alt="`${currentMascot.name} doodle`" class="doodle-image" />
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.mascot-doodles {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 1;
  /* Above AnimatedBackground but below content */
  overflow: hidden;
}

.doodles-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.doodle {
  position: absolute;
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.5s ease-in-out;
  background: radial-gradient(circle, rgba(0, 0, 0, 0.1) 0%, transparent 70%);
  border-radius: 50%;
}

.doodle-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter:
    drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1)) brightness(0.85) contrast(0.9) saturate(0.8);
  opacity: 0.4;
  transition: all 0.3s ease;
}

.doodle:hover .doodle-image {
  opacity: 0.6;
  transform: scale(1.05);
  filter:
    drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15)) brightness(0.9) contrast(0.95) saturate(0.9);
}

/* Doodle transition animations */
.doodle-enter-active {
  transition: all 0.5s ease-out;
}

.doodle-leave-active {
  transition: all 0.5s ease-in;
}

.doodle-enter-from {
  opacity: 0;
  transform: scale(0.5) rotate(180deg);
}

.doodle-leave-to {
  opacity: 0;
  transform: scale(0.5) rotate(-180deg);
}

/* Subtle floating animation */
.doodle {
  animation: float 6s ease-in-out infinite;
}

@keyframes float {

  0%,
  100% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(-10px);
  }
}

/* Dark mode adjustments */
:deep(.dark) .doodle-image {
  filter:
    drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3)) brightness(0.7) contrast(0.8) saturate(0.6);
  opacity: 0.3;
}

:deep(.dark) .doodle {
  background: radial-gradient(circle, rgba(0, 0, 0, 0.2) 0%, transparent 70%);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .doodle {
    width: 80px;
    height: 80px;
  }
}

@media (max-width: 480px) {
  .doodle {
    width: 60px;
    height: 60px;
  }
}
</style>
