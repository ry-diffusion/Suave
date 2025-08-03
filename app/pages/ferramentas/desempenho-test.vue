<template>
  <div class="min-h-screen p-4">
    <UCard class="glass-card mb-6">
      <div class="flex items-center space-x-4">
        <h1 class="text-2xl font-bold">Sistema de Mascotes - Teste</h1>
        <USelect v-model="selectedMascot" :items="mascotOptions" placeholder="Selecionar mascote" class="w-48" />
      </div>
    </UCard>

    <!-- Simulação de Dados -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <UCard class="glass-card">
        <h3 class="text-lg font-semibold mb-4">Simular Desempenho</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2">Média Geral</label>
            <UInput v-model="simulatedAverage" type="number" min="0" max="10" step="0.1" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Frequência (%)</label>
            <UInput v-model="simulatedAttendance" type="number" min="0" max="100" step="1" />
          </div>
        </div>
      </UCard>

      <UCard class="glass-card">
        <h3 class="text-lg font-semibold mb-4">Mascote Atual</h3>
        <div class="flex items-center space-x-4">
          <img :src="currentMascot.previewUrl" :alt="currentMascot.name" class="w-16 h-16 rounded-full object-cover" />
          <div>
            <h4 class="font-semibold">{{ currentMascot.name }}</h4>
            <p class="text-sm text-neutral-600">{{ currentMascot.personality }}</p>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Demonstração das Mensagens -->
    <div class="space-y-6">
      <!-- Performance Geral -->
      <UCard class="glass-card">
        <div class="flex items-center space-x-6">
          <div class="flex-shrink-0">
            <img :src="performanceImage" :alt="currentMascot.name" class="w-24 h-24 rounded-full object-cover border-4"
              :class="performanceBorderClass" />
          </div>
          <div class="flex-1">
            <h3 class="text-xl font-bold mb-2" :class="performanceTextClass">
              {{ performanceTitle }}
            </h3>
            <p class="text-lg" :class="performanceTextClass">
              {{ performanceMessage }}
            </p>
          </div>
        </div>
      </UCard>

      <!-- Melhor Disciplina -->
      <UCard class="glass-card">
        <h3 class="text-lg font-semibold mb-2">{{ bestSubjectTitle }}</h3>
        <p class="text-neutral-700 dark:text-neutral-300">
          {{ bestSubjectMessage }}
        </p>
      </UCard>

      <!-- Pior Disciplina -->
      <UCard class="glass-card">
        <h3 class="text-lg font-semibold mb-2">{{ worstSubjectTitle }}</h3>
        <p class="text-neutral-700 dark:text-neutral-300">
          {{ worstSubjectMessage }}
        </p>
      </UCard>

      <!-- Frequência -->
      <UCard class="glass-card">
        <h3 class="text-lg font-semibold mb-2">{{ attendanceTitle }}</h3>
        <p class="text-neutral-700 dark:text-neutral-300">
          {{ attendanceMessage }}
        </p>
      </UCard>
    </div>
  </div>
</template>

<script setup>
import { useMascotStore } from "~/stores/mascot";

// Page metadata
definePageMeta({
  middleware: "auth",
});

// Composables
const mascotStore = useMascotStore();

// Reactive data
const selectedMascot = ref("default");
const simulatedAverage = ref(8.5);
const simulatedAttendance = ref(85);

// Computed properties
const mascotOptions = computed(() => {
  return Object.entries(mascotStore.mascotDisplayNames).map(([key, name]) => ({
    label: name,
    value: key
  }));
});

const currentMascot = computed(() => {
  return mascotStore.availableMascots[selectedMascot.value] || mascotStore.availableMascots.default;
});

// Simular dados de desempenho
const averageGrade = computed(() => parseFloat(simulatedAverage.value) || 0);
const averageAttendance = computed(() => parseFloat(simulatedAttendance.value) || 0);

// Mensagens personalizadas (usando as funções do store)
const performanceTitle = computed(() => {
  return mascotStore.getPerformanceTitle(averageGrade.value);
});

const performanceMessage = computed(() => {
  return mascotStore.getPerformanceMessage(averageGrade.value, averageAttendance.value);
});

const bestSubjectTitle = computed(() => {
  return mascotStore.getBestSubjectTitle();
});

const bestSubjectMessage = computed(() => {
  const name = "Programação"; // Disciplina de exemplo
  return mascotStore.getBestSubjectMessage(averageGrade.value, name);
});

const worstSubjectTitle = computed(() => {
  return mascotStore.getWorstSubjectTitle();
});

const worstSubjectMessage = computed(() => {
  const name = "Matemática"; // Disciplina de exemplo
  return mascotStore.getWorstSubjectMessage(averageGrade.value, name);
});

const attendanceTitle = computed(() => {
  return mascotStore.getAttendanceTitle();
});

const attendanceMessage = computed(() => {
  return mascotStore.getAttendanceMessage(averageAttendance.value);
});

const performanceImage = computed(() => {
  const average = averageGrade.value;
  const attendance = averageAttendance.value;

  // Determina o nível de desempenho
  let performanceLevel = 'average';

  if (average >= 9 && attendance >= 90) {
    performanceLevel = 'excellent';
  } else if (average >= 7 && attendance >= 75) {
    performanceLevel = 'good';
  } else if (average >= 5 && attendance >= 60) {
    performanceLevel = 'average';
  } else {
    performanceLevel = 'poor';
  }

  // Usa a função do store para obter a imagem apropriada
  const performanceImage = mascotStore.getPerformanceImage(average, performanceLevel);

  // Se a função retornou uma imagem, usa ela
  if (performanceImage) {
    return performanceImage;
  }

  // Fallback para preview do mascote
  return currentMascot.value.previewUrl || "/mascots/default/preview.png";
});

const performanceBorderClass = computed(() => {
  const average = averageGrade.value;
  const attendance = averageAttendance.value;

  if (average >= 9 && attendance >= 90) return "border-green-500";
  if (average >= 7 && attendance >= 75) return "border-blue-500";
  if (average >= 5 && attendance >= 60) return "border-yellow-500";
  return "border-red-500";
});

const performanceTextClass = computed(() => {
  const mascot = currentMascot.value;
  const average = averageGrade.value;

  switch (mascot.name) {
    case "Rimuru Tempest":
      if (average >= 9) return "text-green-500";
      if (average >= 7) return "text-blue-500";
      if (average >= 5) return "text-purple-500";
      return "text-neutral-500";

    case "Billie Eilish - Don't Smile at Me":
      if (average >= 9) return "text-red-500";
      if (average >= 7) return "text-blue-500";
      if (average >= 5) return "text-purple-500";
      return "text-neutral-500";

    case "Dean Winchester":
      if (average >= 9) return "text-green-500";
      if (average >= 7) return "text-blue-500";
      if (average >= 5) return "text-purple-500";
      return "text-neutral-500";

    default:
      if (average >= 9) return "text-green-500";
      if (average >= 7) return "text-blue-500";
      if (average >= 5) return "text-purple-500";
      return "text-neutral-500";
  }
});

// Watch para atualizar o mascote quando selecionado
watch(selectedMascot, (newMascot) => {
  if (newMascot && newMascot in mascotStore.availableMascots) {
    mascotStore.setMascot(newMascot);
  }
});
</script>

<style scoped>
.glass-card {
  background: rgba(255, 255, 255, 0.08) !important;
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.125) !important;
  box-shadow:
    0 8px 32px 0 rgba(31, 38, 135, 0.37),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.dark .glass-card {
  background: rgba(0, 0, 0, 0.12) !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  box-shadow:
    0 8px 32px 0 rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}
</style>