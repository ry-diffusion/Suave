<template>
  <div class="min-h-screen">
    <!-- Loading State -->
    <FullscreenGuiLoading v-if="loading" message="Carregando dados acadêmicos..." />

    <!-- Error State -->
    <div v-else-if="error" class="flex items-center justify-center min-h-screen p-4">
      <UCard class="max-w-md w-full glass-card">
        <div class="text-center">
          <UIcon name="i-lucide-alert-circle" class="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 class="text-lg font-semibold mb-2 text-neutral-900 dark:text-white">Erro ao carregar dados</h3>
          <p class="text-neutral-600 dark:text-neutral-400 mb-6">{{ error }}</p>
          <UButton @click="loadData" color="primary" size="lg" class="w-full">
            <UIcon name="i-lucide-refresh-cw" class="mr-2" />
            Tentar novamente
          </UButton>
        </div>
      </UCard>
    </div>

    <!-- Main Content -->
    <div v-else class="p-4 space-y-6">
      <!-- Header Section -->
      <div class="space-y-4">
        <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-neutral-900 dark:text-white">Desempenho Acadêmico</h1>
            <p class="text-neutral-600 dark:text-neutral-400 mt-1">Acompanhe seu progresso acadêmico</p>
          </div>
          <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <USelect v-model="selectedPeriod" :items="periodOptions" value-key="value" placeholder="Selecionar período"
              class="w-full sm:w-48" size="lg" />
            <UButton @click="loadData" :loading="loading" color="primary" size="lg" class="w-full sm:w-auto">
              <UIcon name="i-lucide-refresh-cw" class="mr-2" />
              Atualizar
            </UButton>
          </div>
        </div>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <UCard class="glass-card">
          <div class="flex flex-col items-center text-center">
            <div class="p-3 bg-green-100 dark:bg-green-800/30 rounded-full mb-3">
              <UIcon name="i-lucide-trophy" class="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div class="text-sm font-medium text-green-700 dark:text-green-300">Média Geral</div>
            <div class="text-2xl font-bold text-green-800 dark:text-green-200">
              {{ averageGrade.toFixed(1) }}
            </div>
          </div>
        </UCard>

        <UCard class="glass-card">
          <div class="flex flex-col items-center text-center">
            <div class="p-3 bg-blue-100 dark:bg-blue-800/30 rounded-full mb-3">
              <UIcon name="i-lucide-check-circle" class="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div class="text-sm font-medium text-blue-700 dark:text-blue-300">Aprovadas</div>
            <div class="text-2xl font-bold text-blue-800 dark:text-blue-200">
              {{ approvedCount }}
            </div>
          </div>
        </UCard>

        <UCard class="glass-card">
          <div class="flex flex-col items-center text-center">
            <div class="p-3 bg-amber-100 dark:bg-amber-800/30 rounded-full mb-3">
              <UIcon name="i-lucide-book-open" class="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div class="text-sm font-medium text-amber-700 dark:text-amber-300">Em Curso</div>
            <div class="text-2xl font-bold text-amber-800 dark:text-amber-200">
              {{ inProgressCount }}
            </div>
          </div>
        </UCard>

        <UCard class="glass-card">
          <div class="flex flex-col items-center text-center">
            <div class="p-3 bg-purple-100 dark:bg-purple-800/30 rounded-full mb-3">
              <UIcon name="i-lucide-calendar" class="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div class="text-sm font-medium text-purple-700 dark:text-purple-300">Frequência Média</div>
            <div class="text-2xl font-bold text-purple-800 dark:text-purple-200">
              {{ averageAttendance.toFixed(0) }}%
            </div>
          </div>
        </UCard>
      </div>

      <!-- Info Cards Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Best Subject Card -->
        <UCard class="glass-card">
          <div class="flex items-start space-x-4">
            <div class="p-3 bg-emerald-100 dark:bg-emerald-800/30 rounded-full">
              <UIcon name="i-lucide-star" class="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-emerald-800 dark:text-emerald-200 mb-2">
                😃 Sua melhor disciplina
              </h3>
              <p class="text-emerald-700 dark:text-emerald-300 mb-3">
                Wow, você parece ser bom em <span class="font-bold">{{ sanitizarNomeDisciplina(bestSubject?.name) ||
                  'N/A' }}</span>!
                Parabéns 😉
              </p>
              <div class="text-sm text-emerald-600 dark:text-emerald-400">
                Média: {{ bestSubject?.average ? bestSubject.average.toFixed(1) : 'N/A' }}
              </div>
            </div>
          </div>
        </UCard>

        <!-- Worst Subject Card -->
        <UCard class="glass-card">
          <div class="flex items-start space-x-4">
            <div class="p-3 bg-orange-100 dark:bg-orange-800/30 rounded-full">
              <UIcon name="i-lucide-alert-triangle" class="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-orange-800 dark:text-orange-200 mb-2">
                😔 Sua pior disciplina
              </h3>
              <p class="text-orange-700 dark:text-orange-300 mb-3">
                Ops, parece que você não foi muito bem em <span class="font-bold">{{
                  sanitizarNomeDisciplina(worstSubject?.name) || 'N/A'
                  }}</span>...
              </p>
              <div class="text-sm text-orange-600 dark:text-orange-400">
                Média: {{ worstSubject?.average ? worstSubject.average.toFixed(1) : 'N/A' }}
              </div>
            </div>
          </div>
        </UCard>

        <!-- Attendance Card -->
        <UCard class="glass-card">
          <div class="flex items-start space-x-4">
            <div class="p-3 bg-blue-100 dark:bg-blue-800/30 rounded-full">
              <UIcon name="i-lucide-clock" class="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
                ⏰ Frequência Média
              </h3>
              <p class="text-blue-700 dark:text-blue-300 mb-3">
                {{ attendanceMessage }}
              </p>
              <div class="text-sm text-blue-600 dark:text-blue-400">
                Frequência: {{ averageAttendance.toFixed(0) }}%
              </div>
            </div>
          </div>
        </UCard>

        <!-- Most Absent Subject Card -->
        <UCard class="glass-card">
          <div class="flex items-start space-x-4">
            <div class="p-3 bg-red-100 dark:bg-red-800/30 rounded-full">
              <UIcon name="i-lucide-user-x" class="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
                😅 Disciplina que mais faltou
              </h3>
              <p class="text-red-700 dark:text-red-300 mb-3">
                {{ mostAbsentMessage }}
              </p>
              <div class="text-sm text-red-600 dark:text-red-400">
                Frequência: {{ mostAbsentSubject?.percentual_carga_horaria_frequentada ?
                  mostAbsentSubject.percentual_carga_horaria_frequentada.toFixed(0) : 'N/A' }}%
              </div>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Grade Distribution Chart -->
        <UCard class="glass-card">
          <template #header>
            <div class="flex items-center space-x-2">
              <UIcon name="i-lucide-pie-chart" class="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
              <h2 class="text-lg font-semibold text-neutral-900 dark:text-white">Distribuição de Notas</h2>
            </div>
          </template>
          <div class="h-80">
            <VChart :option="gradeDistributionOption" />
          </div>
        </UCard>

        <!-- Attendance Chart -->
        <UCard class="glass-card">
          <template #header>
            <div class="flex items-center space-x-2">
              <UIcon name="i-lucide-bar-chart-3" class="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
              <h2 class="text-lg font-semibold text-neutral-900 dark:text-white">Frequência por Disciplina</h2>
            </div>
          </template>
          <div class="h-80">
            <VChart :option="attendanceOption" />
          </div>
        </UCard>
      </div>

      <!-- Performance Trend Chart -->
      <UCard class="glass-card">
        <template #header>
          <div class="flex items-center space-x-2">
            <UIcon name="i-lucide-trending-up" class="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
            <h2 class="text-lg font-semibold text-neutral-900 dark:text-white">Evolução do Desempenho</h2>
          </div>
        </template>
        <div class="h-80">
          <VChart :option="performanceTrendOption" />
        </div>
      </UCard>

      <!-- Subjects Table -->
      <UCard class="glass-card">
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <UIcon name="i-lucide-list" class="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
              <h2 class="text-lg font-semibold text-neutral-900 dark:text-white">Disciplinas do Período</h2>
            </div>
            <USelect v-model="sortMethod" :items="sortOptions" placeholder="Ordenar por" class="w-48" size="sm" />
          </div>
        </template>

        <div v-if="disciplinas.length === 0" class="text-center py-12">
          <UIcon name="i-lucide-book-open" class="h-16 w-16 text-neutral-400 mx-auto mb-4" />
          <p class="text-neutral-500 dark:text-neutral-400 text-lg">Nenhuma disciplina encontrada para este período</p>
        </div>

        <div v-else class="space-y-4">
          <div v-for="disciplina in sortedDisciplinas" :key="disciplina.codigo_diario"
            class="p-4 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors glass-item">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
              <div class="flex-1">
                <div class="flex items-start space-x-3">
                  <div class="flex-shrink-0">
                    <div class="w-12 h-12 rounded-full flex items-center justify-center"
                      :class="getSubjectColorClass(disciplina)">
                      <UIcon name="i-lucide-book" class="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <h3 class="text-lg font-semibold text-neutral-900 dark:text-white truncate">
                      {{ sanitizarNomeDisciplina(disciplina.disciplina) }}
                    </h3>
                    <p class="text-sm text-neutral-500 dark:text-neutral-400">
                      Código: {{ disciplina.codigo_diario }}
                    </p>
                  </div>
                </div>
              </div>

              <div class="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-6">
                <!-- Grade -->
                <div class="text-center">
                  <div class="text-sm text-neutral-500 dark:text-neutral-400">Média</div>
                  <div class="text-xl font-bold" :class="getGradeColor(calculateAverage(disciplina))">
                    {{ calculateAverage(disciplina) ? calculateAverage(disciplina).toFixed(1) : 'N/A' }}
                  </div>
                </div>

                <!-- Attendance -->
                <div class="text-center">
                  <div class="text-sm text-neutral-500 dark:text-neutral-400">Frequência</div>
                  <div class="text-xl font-bold"
                    :class="getAttendanceColor(disciplina.percentual_carga_horaria_frequentada)">
                    {{ disciplina.percentual_carga_horaria_frequentada.toFixed(0) }}%
                  </div>
                  <div class="w-20 h-2 bg-neutral-200 rounded-full mt-1">
                    <div class="h-2 rounded-full transition-all duration-300"
                      :class="getAttendanceBarColor(disciplina.percentual_carga_horaria_frequentada)"
                      :style="{ width: `${disciplina.percentual_carga_horaria_frequentada}%` }">
                    </div>
                  </div>
                </div>

                <!-- Status -->
                <div class="text-center">
                  <div class="text-sm text-neutral-500 dark:text-neutral-400">Situação</div>
                  <UBadge :color="getStatusColor(disciplina.situacao)" variant="soft" size="lg">
                    {{ disciplina.situacao }}
                  </UBadge>
                </div>
              </div>
            </div>

            <!-- Progress Bar -->
            <div class="mt-4">
              <div class="flex justify-between text-sm text-neutral-500 dark:text-neutral-400 mb-1">
                <span>Progresso</span>
                <span>{{ disciplina.carga_horaria_cumprida }}/{{ disciplina.carga_horaria }}h</span>
              </div>
              <div class="w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full">
                <div class="h-2 rounded-full transition-all duration-300"
                  :class="getProgressBarColor(disciplina.carga_horaria_cumprida / disciplina.carga_horaria)"
                  :style="{ width: `${(disciplina.carga_horaria_cumprida / disciplina.carga_horaria) * 100}%` }">
                </div>
              </div>
            </div>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup>
// Import clientFetch for API calls
import { useClientFetch } from "~~/shared/composables/useClientFetch";

// Page metadata
definePageMeta({
  middleware: "auth",
});

// Composables
const { clientFetch } = useClientFetch();

// Reactive data
const loading = ref(false);
const error = ref("");
const periodosLetivos = ref([]);
const disciplinas = ref([]);
const selectedPeriod = ref("");
const sortMethod = ref("cargaHoraria");

// Computed properties
const periodOptions = computed(() => {
  return periodosLetivos.value.map(period => ({
    label: `${period.ano_letivo}.${period.periodo_letivo}`,
    value: `${period.ano_letivo}.${period.periodo_letivo}`,
  }));
});

const sortOptions = computed(() => [
  { label: "Carga Horária", value: "cargaHoraria" },
  { label: "Nota", value: "nota" },
  { label: "Frequência", value: "frequencia" },
  { label: "Nome", value: "nome" }
]);

const averageGrade = computed(() => {
  const grades = disciplinas.value
    .map(d => calculateAverage(d))
    .filter(grade => grade !== undefined && grade !== null);

  if (grades.length === 0) return 0;
  return grades.reduce((sum, grade) => sum + grade, 0) / grades.length;
});

const approvedCount = computed(() => {
  return disciplinas.value.filter(d => d.situacao === "Aprovado").length;
});

const inProgressCount = computed(() => {
  return disciplinas.value.filter(d => d.situacao === "Cursando").length;
});

const averageAttendance = computed(() => {
  const attendances = disciplinas.value
    .map(d => d.percentual_carga_horaria_frequentada)
    .filter(att => att !== undefined && att !== null);

  if (attendances.length === 0) return 0;
  return attendances.reduce((sum, att) => sum + att, 0) / attendances.length;
});

const bestSubject = computed(() => {
  const subjectsWithGrades = disciplinas.value
    .map(d => ({
      name: d.disciplina,
      average: calculateAverage(d)
    }))
    .filter(s => s.average !== null && s.average !== undefined);

  if (subjectsWithGrades.length === 0) return null;

  return subjectsWithGrades.reduce((best, current) =>
    current.average > best.average ? current : best
  );
});

const worstSubject = computed(() => {
  const subjectsWithGrades = disciplinas.value
    .map(d => ({
      name: d.disciplina,
      average: calculateAverage(d)
    }))
    .filter(s => s.average !== null && s.average !== undefined);

  if (subjectsWithGrades.length === 0) return null;

  return subjectsWithGrades.reduce((worst, current) =>
    current.average < worst.average ? current : worst
  );
});

const mostAbsentSubject = computed(() => {
  if (disciplinas.value.length === 0) return null;

  return disciplinas.value.reduce((mostAbsent, current) =>
    current.percentual_carga_horaria_frequentada < mostAbsent.percentual_carga_horaria_frequentada
      ? current
      : mostAbsent
  );
});

const attendanceMessage = computed(() => {
  const freq = averageAttendance.value;
  if (freq > 98) return "Você é onipresente! Como faz isso? 😱";
  if (freq > 90) return "Incrível! Você está sempre presente! 🌟";
  if (freq > 80) return "Ótimo trabalho! Continue assim! 👍";
  if (freq > 75) return "Bem no limite! 😐";
  if (freq > 60) return "Você um turista? 🤔";
  if (freq > 50) return "Eai, turista, por onde andou? 😅";
  return "Você não é um turista mano.. É um fantasma 😱";
});

const mostAbsentMessage = computed(() => {
  if (!mostAbsentSubject.value) return "N/A";

  const freq = mostAbsentSubject.value.percentual_carga_horaria_frequentada;
  const name = sanitizarNomeDisciplina(mostAbsentSubject.value.disciplina);

  if (freq > 75) {
    return `As vezes deu preguiça de ir na aula de ${name}, né?`;
  } else if (freq > 60) {
    return `Pelo menos, você foi em alguma aula de ${name}...`;
  } else {
    return `Você odeia ${name}?`;
  }
});

const sortedDisciplinas = computed(() => {
  const sorted = [...disciplinas.value];

  switch (sortMethod.value) {
    case "cargaHoraria":
      return sorted.sort((a, b) =>
        (b.carga_horaria_cumprida / b.carga_horaria) - (a.carga_horaria_cumprida / a.carga_horaria)
      );
    case "nota":
      return sorted.sort((a, b) => {
        const avgA = calculateAverage(a) || 0;
        const avgB = calculateAverage(b) || 0;
        return avgB - avgA;
      });
    case "frequencia":
      return sorted.sort((a, b) =>
        b.percentual_carga_horaria_frequentada - a.percentual_carga_horaria_frequentada
      );
    case "nome":
      return sorted.sort((a, b) => sanitizarNomeDisciplina(a.disciplina).localeCompare(sanitizarNomeDisciplina(b.disciplina)));
    default:
      return sorted;
  }
});

// Chart options
const gradeDistributionOption = computed(() => ({
  title: {
    text: 'Distribuição de Notas',
    left: 'center',
    textStyle: {
      fontSize: 16,
      fontWeight: 'normal',
      color: '#374151'
    }
  },
  tooltip: {
    trigger: 'item',
    formatter: '{b}: {c} ({d}%)'
  },
  legend: {
    orient: 'vertical',
    left: 'left',
    top: 'middle',
    textStyle: {
      color: '#6b7280'
    }
  },
  series: [
    {
      name: 'Notas',
      type: 'pie',
      radius: '50%',
      data: [
        {
          value: disciplinas.value.filter(d => calculateAverage(d) && calculateAverage(d) >= 9).length,
          name: '9.0-10.0',
          itemStyle: { color: '#10b981' }
        },
        {
          value: disciplinas.value.filter(d => calculateAverage(d) && calculateAverage(d) >= 7 && calculateAverage(d) < 9).length,
          name: '7.0-8.9',
          itemStyle: { color: '#3b82f6' }
        },
        {
          value: disciplinas.value.filter(d => calculateAverage(d) && calculateAverage(d) >= 5 && calculateAverage(d) < 7).length,
          name: '5.0-6.9',
          itemStyle: { color: '#f59e0b' }
        },
        {
          value: disciplinas.value.filter(d => calculateAverage(d) && calculateAverage(d) < 5).length,
          name: '0.0-4.9',
          itemStyle: { color: '#ef4444' }
        },
        {
          value: disciplinas.value.filter(d => !calculateAverage(d)).length,
          name: 'N/A',
          itemStyle: { color: '#6b7280' }
        }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
}));

const attendanceOption = computed(() => ({
  title: {
    text: 'Frequência por Disciplina',
    left: 'center',
    textStyle: {
      fontSize: 16,
      fontWeight: 'normal',
      color: '#374151'
    }
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '15%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: disciplinas.value.map(d => sanitizarNomeDisciplina(d.disciplina).substring(0, 12) + '...'),
    axisLabel: {
      rotate: 45,
      color: '#6b7280'
    },
    axisLine: {
      lineStyle: {
        color: '#d1d5db'
      }
    }
  },
  yAxis: {
    type: 'value',
    min: 0,
    max: 100,
    axisLabel: {
      formatter: '{value}%',
      color: '#6b7280'
    },
    axisLine: {
      lineStyle: {
        color: '#d1d5db'
      }
    },
    splitLine: {
      lineStyle: {
        color: '#e5e7eb'
      }
    }
  },
  series: [
    {
      name: 'Frequência',
      type: 'bar',
      data: disciplinas.value.map(d => ({
        value: d.percentual_carga_horaria_frequentada,
        itemStyle: {
          color: d.percentual_carga_horaria_frequentada >= 75 ? '#10b981' :
            d.percentual_carga_horaria_frequentada >= 50 ? '#f59e0b' : '#ef4444'
        }
      }))
    }
  ]
}));

const performanceTrendOption = computed(() => {
  const subjects = disciplinas.value.filter(d => calculateAverage(d));
  const grades = subjects.map(d => calculateAverage(d));
  const labels = subjects.map(d => sanitizarNomeDisciplina(d.disciplina).substring(0, 10) + '...');

  return {
    title: {
      text: 'Evolução das Notas',
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'normal',
        color: '#374151'
      }
    },
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: labels,
      axisLabel: {
        rotate: 45,
        color: '#6b7280'
      },
      axisLine: {
        lineStyle: {
          color: '#d1d5db'
        }
      }
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 10,
      axisLabel: {
        formatter: '{value}',
        color: '#6b7280'
      },
      axisLine: {
        lineStyle: {
          color: '#d1d5db'
        }
      },
      splitLine: {
        lineStyle: {
          color: '#e5e7eb'
        }
      }
    },
    series: [
      {
        name: 'Nota',
        type: 'line',
        data: grades,
        smooth: true,
        lineStyle: {
          color: '#3b82f6',
          width: 3
        },
        itemStyle: {
          color: '#3b82f6'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(59, 130, 246, 0.3)' },
              { offset: 1, color: 'rgba(59, 130, 246, 0.1)' }
            ]
          }
        }
      }
    ]
  };
});

// Methods

/**
 * Sanitiza o nome da disciplina removendo padrões como "Disciplina.XXXX - " 
 * e convertendo para lowercase
 * @param {string} nome - Nome original da disciplina
 * @returns {string} - Nome sanitizado
 */
function sanitizarNomeDisciplina(nome) {
  if (!nome || typeof nome !== 'string') {
    return nome;
  }

  // Regex para remover padrão "Disciplina.XXXX - " no início
  const regex = /^Disciplina\.\d+\s*-\s*/;
  const match = nome.match(regex);

  if (match) {
    // Remove o padrão encontrado e limpa o resto
    let cleaned = nome.replace(regex, '');

    // Remove caracteres especiais como "!" e converte para lowercase
    cleaned = cleaned.replace(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g, '');

    // Converte para lowercase
    cleaned = cleaned.toLowerCase();

    return cleaned;
  }

  // Se não der match, retorna o nome como está
  return nome;
}

async function loadData() {
  console.log("loadData called");
  loading.value = true;
  error.value = "";

  try {
    // Load available periods
    console.log("Loading periods...");
    periodosLetivos.value = await clientFetch("/api/suap/periodos-letivos");
    console.log("Periods loaded:", periodosLetivos.value);

    // Set default selected period if none selected
    if (!selectedPeriod.value && periodosLetivos.value.length > 0) {
      // Try to find the most recent period with data
      for (const period of periodosLetivos.value) {
        const periodKey = `${period.ano_letivo}.${period.periodo_letivo}`;
        console.log("Testing period:", periodKey);

        try {
          const disciplinasTest = await clientFetch("/api/suap/boletim", {
            query: {
              ano: period.ano_letivo,
              periodo: period.periodo_letivo,
            },
          });

          if (disciplinasTest && disciplinasTest.length > 0) {
            selectedPeriod.value = periodKey;
            disciplinas.value = disciplinasTest;
            console.log("Found period with data:", periodKey, "with", disciplinasTest.length, "disciplines");
            break;
          }
        } catch (err) {
          console.log("Period", periodKey, "has no data or error:", err.message);
          // Continue to next period
        }
      }

      // If no period with data found, select the first one
      if (!selectedPeriod.value && periodosLetivos.value.length > 0) {
        const latestPeriod = periodosLetivos.value[0];
        selectedPeriod.value = `${latestPeriod.ano_letivo}.${latestPeriod.periodo_letivo}`;
        console.log("No period with data found, selecting first:", selectedPeriod.value);
      }
    }

    // Load boletim data if period is selected and not already loaded
    if (selectedPeriod.value && disciplinas.value.length === 0) {
      const [ano, periodo] = selectedPeriod.value.split('.');
      console.log("Loading boletim for:", ano, periodo);
      disciplinas.value = await clientFetch("/api/suap/boletim", {
        query: {
          ano,
          periodo,
        },
      });
      console.log("Disciplinas loaded:", disciplinas.value);
    }
  } catch (err) {
    console.error("Error in loadData:", err);
    // Check if it's a NOT_FOUND AppException
    if (err.code === "NOT_FOUND") {
      // Don't show error for NOT_FOUND, just log it
      console.log("Período não encontrado:", err.message);
      disciplinas.value = []; // Clear disciplines
    } else {
      // Show error for other types of errors
      error.value = err.message || "Erro ao carregar dados do boletim";
      console.error("Error loading data:", err);
    }
  } finally {
    loading.value = false;
  }
}

function getStatusColor(status) {
  switch (status) {
    case "Aprovado":
      return "green";
    case "Cursando":
      return "blue";
    case "Prova Final":
      return "yellow";
    case "Reprovado":
      return "red";
    case "Dispensado":
      return "gray";
    default:
      return "gray";
  }
}

function calculateAverage(disciplina) {
  // Se já tem média calculada, usa ela
  if (disciplina.media_disciplina !== undefined && disciplina.media_disciplina !== null) {
    return disciplina.media_disciplina;
  }

  // Calcula média baseada nas etapas disponíveis
  const etapas = [
    disciplina.nota_etapa_1?.nota,
    disciplina.nota_etapa_2?.nota,
    disciplina.nota_etapa_3?.nota,
    disciplina.nota_etapa_4?.nota,
  ].filter(nota => nota !== undefined && nota !== null);

  if (etapas.length === 0) {
    return null;
  }

  return etapas.reduce((sum, nota) => sum + nota, 0) / etapas.length;
}

function getGradeColor(grade) {
  if (!grade) return "text-neutral-400 dark:text-neutral-500";
  if (grade >= 7) return "text-green-600 dark:text-green-400";
  if (grade >= 5) return "text-yellow-600 dark:text-yellow-400";
  return "text-red-600 dark:text-red-400";
}

function getAttendanceColor(attendance) {
  if (attendance >= 75) return "text-green-600 dark:text-green-400";
  if (attendance >= 50) return "text-yellow-600 dark:text-yellow-400";
  return "text-red-600 dark:text-red-400";
}

function getAttendanceBarColor(attendance) {
  if (attendance >= 75) return "bg-green-500";
  if (attendance >= 50) return "bg-yellow-500";
  return "bg-red-500";
}

function getProgressBarColor(progress) {
  if (progress >= 0.8) return "bg-green-500";
  if (progress >= 0.6) return "bg-yellow-500";
  return "bg-red-500";
}

function getSubjectColorClass(disciplina) {
  const average = calculateAverage(disciplina);
  if (!average) return "bg-gray-500";
  if (average >= 7) return "bg-green-500";
  if (average >= 5) return "bg-yellow-500";
  return "bg-red-500";
}

// Watch for period changes
watch(selectedPeriod, (newValue, oldValue) => {
  if (newValue && newValue !== oldValue) {
    console.log("Period changed from", oldValue, "to", newValue);
    loadData();
  }
});

// Load data on mount
onMounted(() => {
  console.log("Component mounted, loading data...");
  loadData();
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

.glass-item {
  background: rgba(255, 255, 255, 0.05) !important;
  backdrop-filter: blur(10px) saturate(150%);
  -webkit-backdrop-filter: blur(10px) saturate(150%);
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  box-shadow:
    0 4px 16px 0 rgba(31, 38, 135, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

/* Dark mode adjustments */
.dark .glass-card {
  background: rgba(0, 0, 0, 0.12) !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  box-shadow:
    0 8px 32px 0 rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.dark .glass-item {
  background: rgba(0, 0, 0, 0.08) !important;
  border: 1px solid rgba(255, 255, 255, 0.05) !important;
  box-shadow:
    0 4px 16px 0 rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.03);
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

.glass-item:hover {
  background: rgba(255, 255, 255, 0.08) !important;
  transform: translateY(-1px);
  transition: all 0.2s ease-in-out;
}

.dark .glass-item:hover {
  background: rgba(0, 0, 0, 0.12) !important;
}

/* Ensure proper contrast for text readability */
.glass-card *,
.glass-item * {
  position: relative;
  z-index: 1;
}
</style>