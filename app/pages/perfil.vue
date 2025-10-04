<template>
  <div class="p-4">
    <FullscreenGuiLoading v-if="pending" />

    <FullscreenGuiError v-else-if="error" :error-message="error?.message || 'Erro ao carregar dados do perfil'"
      :show-try-again="true" :loading="false" @retry="refresh" />

    <div v-else-if="userData" class="grid grid-cols-1 lg:grid-cols-3 gap-6">

      <!-- Profile Card -->
      <div class="md:col-span-1">
        <UCard class="glass-card">
          <div class="flex flex-col items-center">
            <div class="relative mb-4">
              <img :src="userData?.url_foto_150x200 || 'https://i.pravatar.cc/150?img=11'" alt="Foto de perfil"
                class="w-32 h-32 rounded-full object-cover border-4 border-primary-100" />
              <UButton color="primary" variant="soft" icon="i-lucide-camera" size="xs"
                class="absolute bottom-0 right-0 rounded-full" />
            </div>

            <h2 class="text-xl font-medium">{{ userData?.nome_usual || userData?.vinculo?.nome }}</h2>
            <p class="text-gray-500 dark:text-gray-400 mb-3">{{ userData?.tipo_vinculo }}</p>

            <div class="flex space-x-2 mb-4">
              <UBadge color="primary" variant="soft">{{ userData?.vinculo?.curso }}</UBadge>
              <UBadge color="neutral" variant="soft">{{ userData?.vinculo?.campus }}</UBadge>
            </div>


          </div>
        </UCard>

        <!-- Theme Settings -->
        <UCard class="mt-6 glass-card">
          <template #header>
            <div class="flex items-center justify-between">
              <h2 class="font-medium">Aparência</h2>
              <UButton :icon="themeStore.colorMode === 'dark' ? 'i-lucide-moon' : 'i-lucide-sun'" color="neutral"
                variant="ghost" size="sm" @click="themeStore.toggleColorMode" aria-label="Alternar tema" />
            </div>
          </template>

          <div class="space-y-4">
            <div>
              <p>Cor Principal</p>
              <div class="mt-4 grid grid-cols-4 gap-4">
                <button v-for="(theme, name) in themeStore.availableThemes" :key="name" @click="handleSetTheme(name)"
                  class="group relative flex flex-col items-center gap-2 transition-all duration-200 hover:scale-105">
                  <div class="relative">
                    <div class="size-12 rounded-full transition-all duration-200" :class="[
                      themeStore.currentTheme.primary === name ? 'ring-2 ring-offset-2 ring-primary-500' : 'ring-1 ring-gray-200 dark:ring-gray-800',
                      'hover:ring-2 hover:ring-offset-2 hover:ring-primary-500'
                    ]" :style="{ backgroundColor: themeStore.getPreviewColor(name) }" />
                    <div v-if="themeStore.currentTheme.primary === name"
                      class="absolute inset-0 flex items-center justify-center">
                      <UIcon name="i-lucide-check"
                        class="size-6 text-white drop-shadow-sm transition-transform duration-200 group-hover:scale-110" />
                    </div>
                  </div>
                  <span class="text-xs font-medium text-gray-600 dark:text-gray-400">
                    {{ themeStore.themeDisplayNames[name] }}
                  </span>
                </button>
              </div>
            </div>

            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-500 dark:text-gray-400">Modo Escuro</span>
              <USwitch v-model="isDarkMode" />
            </div>
          </div>
        </UCard>

        <!-- Mascot Settings -->
        <UCard class="mt-6 glass-card">
          <template #header>
            <div class="flex items-center justify-between">
              <div>
                <h2 class="font-medium">Mascote</h2>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Personalize sua experiência</p>
              </div>
            </div>
          </template>

          <div class="space-y-6">
            <div>
              <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
                Escolha sua mascote
              </p>
              <div class="grid grid-cols-1 gap-3">
                <button v-for="(mascot, name) in mascotStore.availableMascots" :key="name" @click="selectMascot(name)"
                  class="group relative w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800/50 border-2"
                  :class="[
                    mascotStore.currentMascot.name === mascot.name
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  ]">
                  <div class="relative flex-shrink-0">
                    <img :src="mascot.previewUrl" :alt="mascot.name"
                      class="size-16 rounded-xl object-cover transition-all duration-200" :class="[
                        mascotStore.currentMascot.name === mascot.name
                          ? 'ring-2 ring-primary-500 ring-offset-2'
                          : 'ring-1 ring-gray-200 dark:ring-gray-700'
                      ]" />
                    <div v-if="mascotStore.currentMascot.name === mascot.name"
                      class="absolute -top-1 -right-1 size-6 bg-primary-500 rounded-full flex items-center justify-center">
                      <UIcon name="i-lucide-check" class="size-4 text-white" />
                    </div>
                  </div>

                  <div class="flex-1 text-left">
                    <h3 class="font-medium text-gray-900 dark:text-gray-100">
                      {{ mascotStore.mascotDisplayNames[name] }}
                    </h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {{ mascot.description }}
                    </p>
                  </div>

                  <div class="flex-shrink-0">
                    <UIcon name="i-lucide-chevron-right"
                      class="size-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                  </div>
                </button>
              </div>
            </div>

            <div v-if="mascotStore.currentMascot.name !== 'Default Mascot'"
              class="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
              <div class="flex items-start gap-3">
                <UIcon name="i-lucide-info" class="size-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 class="font-medium text-blue-900 dark:text-blue-100 text-sm">
                    Preferências aplicadas
                  </h4>
                  <p class="text-sm text-blue-700 dark:text-blue-300 mt-1">
                    As configurações de tema foram ajustadas para combinar com sua mascote escolhida.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Main Content -->
      <div class="md:col-span-2">
        <!-- Personal Information -->
        <UCard class="mb-6 glass-card">
          <template #header>
            <div class="flex items-center justify-between">
              <h2 class="font-medium">Informações Pessoais</h2>
            </div>
          </template>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Nome Completo</p>
              <p class="font-medium break-words">{{ userData?.vinculo?.nome }}</p>
            </div>

            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Matrícula</p>
              <p class="font-medium break-words">{{ userData?.matricula }}</p>
            </div>

            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">E-mail</p>
              <p class="font-medium break-all">{{ userData?.email }}</p>
            </div>

            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">CPF</p>
              <p class="font-medium break-words">{{ userData?.cpf }}</p>
            </div>

            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Data de Nascimento</p>
              <p class="font-medium break-words">{{ formatDate(userData?.data_nascimento || '') }}</p>
            </div>

            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Naturalidade</p>
              <p class="font-medium break-words">{{ userData?.naturalidade }}</p>
            </div>
          </div>
        </UCard>

        <!-- Academic Information -->
        <UCard class="mb-6 glass-card">
          <template #header>
            <div class="flex items-center justify-between">
              <h2 class="font-medium">Informações Acadêmicas</h2>
            </div>
          </template>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Curso</p>
              <p class="font-medium break-words">{{ userData?.vinculo?.curso }}</p>
            </div>

            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Campus</p>
              <p class="font-medium break-words">{{ userData?.vinculo?.campus }}</p>
            </div>

            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Tipo de Vínculo</p>
              <p class="font-medium break-words">{{ userData?.tipo_vinculo }}</p>
            </div>

            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Matrícula Regular</p>
              <p class="font-medium break-words">{{ userData?.vinculo?.matricula_regular ? 'Sim' : 'Não' }}</p>
            </div>

            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Situação</p>
              <UBadge :color="userData?.vinculo?.situacao === 'Regular' ? 'success' : 'warning'" variant="soft">
                {{ userData?.vinculo?.situacao }}
              </UBadge>
            </div>

            <div v-if="userData?.vinculo?.linha_pesquisa">
              <p class="text-sm text-gray-500 dark:text-gray-400">Linha de Pesquisa</p>
              <p class="font-medium break-words">{{ userData?.vinculo?.linha_pesquisa }}</p>
            </div>
          </div>
        </UCard>

        <GuiLoading class="block md:hidden" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import GuiLoading from "~/components/GuiLoading.vue";
import MascotDoodles from "~/components/MascotDoodles.vue";
import { useMascotStore } from "~/stores/mascot";
import { useThemeStore } from "~/stores/theme";

const themeStore = useThemeStore();
const mascotStore = useMascotStore();
const { userData, pending, error, refresh } = useMyData();


const { proxy: rybbit } = useScriptRybbitAnalytics();



const isDarkMode = computed({
  get: () => themeStore.colorMode === "dark",
  set: (value) => {
    themeStore.setColorMode(value ? "dark" : "light");
    try {
      rybbit.event("theme_color_mode_changed", {
        mode: value ? "dark" : "light",
      });
    } catch (_) {
      // fail silently if analytics not available
    }
  },
});

const notifMoodle = ref(true);
const notifGrades = ref(true);
const notifCalendar = ref(false);
const notifEmails = ref(true);

// Handler para alterar o tema (paleta)
function handleSetTheme(name: string) {
  themeStore.setTheme(name);
  try {
    rybbit.event("theme_selected", {
      theme: name,
    });
  } catch (_) {
    // ignore
  }
}

// Função para selecionar mascote e aplicar suas preferências
const selectMascot = (
  mascotName: keyof typeof mascotStore.availableMascots,
) => {
  mascotStore.setMascot(mascotName);

  // Aplicar preferências da mascote se definidas
  const mascot = mascotStore.availableMascots[mascotName];

  if (mascot?.preferredTheme) {
    handleSetTheme(mascot.preferredTheme);
  }

  if (mascot?.preferredColorScheme) {
    isDarkMode.value = mascot.preferredColorScheme === "dark";
    // themeStore.setColorMode already called by isDarkMode setter
  }

  try {
    rybbit.event("mascot_selected", {
      mascot: mascotName,
    });
  } catch (_) {
    // ignore
  }
};

// Watchers para preferências de notificação
watch(notifMoodle, (val) => {
  try {
    rybbit.event("notification_pref_changed", {
      channel: "moodle",
      enabled: Boolean(val),
    });
  } catch (_) {
    // ignore
  }
});

watch(notifGrades, (val) => {
  try {
    rybbit.event("notification_pref_changed", {
      channel: "grades",
      enabled: Boolean(val),
    });
  } catch (_) {
    // ignore
  }
});

watch(notifCalendar, (val) => {
  try {
    rybbit.event("notification_pref_changed", {
      channel: "calendar",
      enabled: Boolean(val),
    });
  } catch (_) {
    // ignore
  }
});

watch(notifEmails, (val) => {
  try {
    rybbit.event("notification_pref_changed", {
      channel: "emails",
      enabled: Boolean(val),
    });
  } catch (_) {
    // ignore
  }
});

// Função para formatar data
const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR");
};

// Prevent false-positive "unused" errors for variables used only in the template
/* istanbul ignore next */
void userData;
/* istanbul ignore next */
void pending;
/* istanbul ignore next */
void error;
/* istanbul ignore next */
void refresh;
/* istanbul ignore next */
void selectMascot;
/* istanbul ignore next */
void formatDate;

// Add middleware to protect this page
definePageMeta({
  middleware: ["auth"],
});
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

/* Hover effects for better interactivity */
.glass-card:hover {
  background: rgba(255, 255, 255, 0.12) !important;
  transform: translateY(-1px);
  transition: all 0.2s ease-in-out;
}

.dark .glass-card:hover {
  background: rgba(0, 0, 0, 0.16) !important;
}

/* Ensure proper contrast for text readability */
.glass-card * {
  position: relative;
  z-index: 1;
}
</style>