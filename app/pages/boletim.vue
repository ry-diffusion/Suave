<template>
  <div class="container mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6">Boletim Acadêmico</h1>

    <!-- Seletor de Período -->
    <div class="mb-6 p-4 bg-white rounded-lg shadow">
      <h2 class="text-xl font-semibold mb-4">Selecionar Período</h2>
      <div class="flex gap-4 items-end">
        <div>
          <label class="block text-sm font-medium mb-2">Ano Letivo</label>
          <select v-model="selectedAno"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Selecione um ano</option>
            <option v-for="periodo in periodosLetivos" :key="`${periodo.ano_letivo}-${periodo.periodo_letivo}`"
              :value="periodo.ano_letivo.toString()">
              {{ periodo.ano_letivo }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">Período</label>
          <select v-model="selectedPeriodo"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Selecione um período</option>
            <option v-for="periodo in periodosFiltrados" :key="periodo.periodo_letivo"
              :value="periodo.periodo_letivo.toString()">
              {{ periodo.periodo_letivo }}º Período
            </option>
          </select>
        </div>
        <button @click="carregarBoletim" :disabled="!selectedAno || !selectedPeriodo || loading"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
          {{ loading ? "Carregando..." : "Carregar Boletim" }}
        </button>
      </div>
    </div>

    <!-- Lista de Disciplinas -->
    <div v-if="disciplinas.length > 0" class="space-y-4">
      <div v-for="disciplina in disciplinas" :key="disciplina.codigo_diario" class="bg-white rounded-lg shadow p-6">
        <div class="flex justify-between items-start mb-4">
          <div>
            <h3 class="text-lg font-semibold">{{ disciplina.disciplina }}</h3>
            <p class="text-sm text-gray-600">Código: {{ disciplina.codigo_diario }}</p>
          </div>
          <div class="text-right">
            <span :class="{
              'bg-green-100 text-green-800': disciplina.situacao === 'Aprovado',
              'bg-red-100 text-red-800': disciplina.situacao === 'Reprovado',
              'bg-yellow-100 text-yellow-800': disciplina.situacao === 'Prova Final',
              'bg-blue-100 text-blue-800': disciplina.situacao === 'Cursando',
              'bg-gray-100 text-gray-800': disciplina.situacao === 'Dispensado',
            }" class="px-2 py-1 rounded-full text-xs font-medium">
              {{ disciplina.situacao }}
            </span>
          </div>
        </div>

        <!-- Informações da Disciplina -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div>
            <p class="text-sm text-gray-600">Carga Horária</p>
            <p class="font-medium">{{ disciplina.carga_horaria }}h</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Cumprida</p>
            <p class="font-medium">{{ disciplina.carga_horaria_cumprida }}h</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Faltas</p>
            <p class="font-medium">{{ disciplina.numero_faltas }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Frequência</p>
            <p class="font-medium">{{ disciplina.percentual_carga_horaria_frequentada }}%</p>
          </div>
        </div>

        <!-- Notas por Etapa -->
        <div class="border-t pt-4">
          <h4 class="font-medium mb-3">Notas por Etapa</h4>
          <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div v-if="disciplina.nota_etapa_1">
              <p class="text-sm text-gray-600">1ª Etapa</p>
              <p class="font-medium">{{ disciplina.nota_etapa_1.nota }}</p>
              <p class="text-xs text-gray-500">{{ disciplina.nota_etapa_1.faltas }} faltas</p>
            </div>
            <div v-if="disciplina.nota_etapa_2">
              <p class="text-sm text-gray-600">2ª Etapa</p>
              <p class="font-medium">{{ disciplina.nota_etapa_2.nota }}</p>
              <p class="text-xs text-gray-500">{{ disciplina.nota_etapa_2.faltas }} faltas</p>
            </div>
            <div v-if="disciplina.nota_etapa_3">
              <p class="text-sm text-gray-600">3ª Etapa</p>
              <p class="font-medium">{{ disciplina.nota_etapa_3.nota }}</p>
              <p class="text-xs text-gray-500">{{ disciplina.nota_etapa_3.faltas }} faltas</p>
            </div>
            <div v-if="disciplina.nota_etapa_4">
              <p class="text-sm text-gray-600">4ª Etapa</p>
              <p class="font-medium">{{ disciplina.nota_etapa_4.nota }}</p>
              <p class="text-xs text-gray-500">{{ disciplina.nota_etapa_4.faltas }} faltas</p>
            </div>
            <div v-if="disciplina.nota_avaliacao_final">
              <p class="text-sm text-gray-600">Final</p>
              <p class="font-medium">{{ disciplina.nota_avaliacao_final.nota }}</p>
              <p class="text-xs text-gray-500">{{ disciplina.nota_avaliacao_final.faltas }} faltas</p>
            </div>
          </div>
        </div>

        <!-- Médias -->
        <div v-if="disciplina.media_disciplina || disciplina.media_final_disciplina" class="border-t pt-4 mt-4">
          <div class="grid grid-cols-2 gap-4">
            <div v-if="disciplina.media_disciplina">
              <p class="text-sm text-gray-600">Média da Disciplina</p>
              <p class="font-medium text-lg">{{ disciplina.media_disciplina }}</p>
            </div>
            <div v-if="disciplina.media_final_disciplina">
              <p class="text-sm text-gray-600">Média Final</p>
              <p class="font-medium text-lg">{{ disciplina.media_final_disciplina }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Estado de Carregamento -->
    <div v-if="loading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <p class="mt-2 text-gray-600">Carregando boletim...</p>
    </div>

    <!-- Estado de Erro -->
    <div v-if="error" class="text-center py-8">
      <p class="text-red-600">{{ error }}</p>
    </div>

    <!-- Estado Vazio -->
    <div v-if="!loading && !error && disciplinas.length === 0 && selectedAno && selectedPeriodo"
      class="text-center py-8">
      <p class="text-gray-600">Nenhuma disciplina encontrada para o período selecionado.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Disciplina, PeriodoLetivo } from "~~/shared/boletim";

const { getPeriodosLetivos, getBoletim } = useBoletim();

// Estado reativo
const periodosLetivos = ref<PeriodoLetivo[]>([]);
const disciplinas = ref<Disciplina[]>([]);
const selectedAno = ref("");
const selectedPeriodo = ref("");
const loading = ref(false);
const error = ref("");

// Computed para filtrar períodos por ano selecionado
const periodosFiltrados = computed(() => {
  if (!selectedAno.value) return [];
  return periodosLetivos.value.filter(p => p.ano_letivo.toString() === selectedAno.value);
});

// Carregar períodos letivos ao montar o componente
onMounted(async () => {
  try {
    loading.value = true;
    periodosLetivos.value = await getPeriodosLetivos();
  } catch (err) {
    error.value = "Erro ao carregar períodos letivos";
    console.error(err);
  } finally {
    loading.value = false;
  }
});

// Função para carregar o boletim
const carregarBoletim = async () => {
  if (!selectedAno.value || !selectedPeriodo.value) return;

  try {
    loading.value = true;
    error.value = "";
    disciplinas.value = await getBoletim(selectedAno.value, selectedPeriodo.value);
  } catch (err) {
    error.value = "Erro ao carregar boletim";
    console.error(err);
  } finally {
    loading.value = false;
  }
};

// Resetar disciplinas quando mudar a seleção
watch([selectedAno, selectedPeriodo], () => {
  disciplinas.value = [];
  error.value = "";
});
</script>