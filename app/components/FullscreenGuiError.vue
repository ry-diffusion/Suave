<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center p-3 bg-neutral-50/90 dark:bg-neutral-900/90 backdrop-blur-md">
    <div class="w-full max-w-2xl mx-auto">
      <UCard class="w-full glass-card">
        <div class="text-center">
          <!-- Warning Banner as Title -->
          <div class="relative -mt-4 sm:-mt-6 -mx-4 sm:-mx-6">
            <div
              class="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-amber-400/30 to-amber-500/20 rounded-t-lg border border-amber-500/30 backdrop-blur-sm">
            </div>
            <div class="relative flex items-center justify-center space-x-2 sm:space-x-3 py-2 sm:py-3">
              <UIcon name="i-lucide-alert-triangle" size="20" sm:size="24"
                class="text-amber-500 mix-blend-multiply dark:mix-blend-screen" />
              <span class="text-amber-700 dark:text-amber-300 font-bold text-xs sm:text-sm">
                SÓ UM AVISO...
              </span>
            </div>
          </div>

          <!-- Main Content -->
          <div class="p-4 sm:p-6 md:p-8">

            <!-- Error Icon -->
            <div class="mb-4 sm:mb-6 md:mb-8 lg:mb-12">
              <UIcon name="i-lucide-heart-crack" size="64" sm:size="80" md:size="96" class="text-red-500 mx-auto" />
            </div>

            <!-- Error Title -->
            <h3
              class="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 md:mb-6 text-red-600 dark:text-red-400 leading-tight">
              O PROBLEMA NÃO É VOCÊ... SOU EU.
            </h3>

            <!-- Error Message -->
            <p
              class="text-base sm:text-lg md:text-xl lg:text-2xl text-neutral-600 dark:text-neutral-400 mb-4 sm:mb-6 md:mb-8 leading-relaxed">
              Olha, você é incrível, de verdade. O problema não está em você, está em mim. Eu tô com a cabeça confusa e
              preciso de um tempo pra me entender. É isso.
            </p>

            <!-- Specific Error Message (if provided) -->
            <p v-if="errorMessage"
              class="text-sm sm:text-base md:text-lg text-neutral-500 dark:text-neutral-500 mb-6 sm:mb-8 md:mb-12 leading-relaxed max-w-3xl mx-auto">
              E pra piorar: <strong>{{ errorMessage }}</strong>
            </p>

            <!-- Action Buttons -->
            <div class="space-y-3 sm:space-y-4 md:space-y-6 max-w-md mx-auto">
              <!-- Try Again Button (Optional) -->
              <UButton v-if="showTryAgain" @click="$emit('retry')" color="primary" size="lg" sm:size="xl"
                class="w-full text-sm sm:text-base md:text-lg" :loading="loading">
                <UIcon name="i-lucide-rotate-cw" size="16" sm:size="18" md:size="20" class="mr-2 sm:mr-3" />
                TÁ BOM, PORÉM VAMOS TENTAR MAIS UMA ÚLTIMA VEZ...
              </UButton>

              <!-- End Session Button -->
              <UButton @click="handleEndSession" color="red" size="lg" sm:size="xl"
                class="w-full text-sm sm:text-base md:text-lg">
                <UIcon name="i-lucide-door-closed" size="16" sm:size="18" md:size="20" class="mr-2 sm:mr-3" />
                É MELHOR ASSIM. POR FAVOR, ME DEIXA IR. (encerrar sessão)
              </UButton>
            </div>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup>
// Props
defineProps({
  showTryAgain: {
    type: Boolean,
    default: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  errorMessage: {
    type: String,
    default: ''
  }
});



const { clear } = useUserSession()
const authStore = useAuthStore()

// Função para encerrar sessão
const handleEndSession = async () => {
  try {
    // Chama o endpoint de logout do servidor
    await $fetch('/api/auth/logout', { method: 'GET' });

    // Limpa a sessão do usuário no cliente
    await clear();

    // Limpa o store de auth
    authStore.clearSession();

    // Navega para a página inicial
    await navigateTo('/');
  } catch (error) {
    console.error('Erro ao encerrar sessão:', error);
    // Em caso de erro, ainda tenta limpar a sessão e navegar para a página inicial
    try {
      await clear();
      authStore.clearSession();
    } catch (clearError) {
      console.error('Erro ao limpar sessão:', clearError);
    }
    await navigateTo('/');
  }
};

// Emits
defineEmits(['retry', 'endSession']);
</script>

<style scoped>
/* Glass effect following Apple's Human Interface Guidelines */
.glass-card {
  background: rgba(255, 255, 255, 0.08) !important;
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.125) !important;
  box-shadow:
    0 8px 32px 0 rgba(31, 38, 135, 0.37),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

/* Dark mode adjustments */
.dark .glass-card {
  background: rgba(0, 0, 0, 0.12) !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  box-shadow:
    0 8px 32px 0 rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}
</style>
