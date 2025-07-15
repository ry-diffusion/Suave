<template>
  <div class="p-4">

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 mb-8">
      <UCard class="bg-green-50 dark:bg-green-900/20">
        <div class="flex flex-col items-center">
          <UIcon name="i-lucide-award" class="h-8 w-8 text-green-500 mb-2" />
          <div class="text-sm text-gray-500 dark:text-gray-400">Média Geral</div>
          <div class="text-2xl font-bold text-green-600 dark:text-green-400">8.5</div>
        </div>
      </UCard>
      
      <UCard class="bg-blue-50 dark:bg-blue-900/20">
        <div class="flex flex-col items-center">
          <UIcon name="i-lucide-check-circle" class="h-8 w-8 text-blue-500 mb-2" />
          <div class="text-sm text-gray-500 dark:text-gray-400">Disciplinas Aprovadas</div>
          <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">18</div>
        </div>
      </UCard>
      
      <UCard class="bg-amber-50 dark:bg-amber-900/20">
        <div class="flex flex-col items-center">
          <UIcon name="i-lucide-book" class="h-8 w-8 text-amber-500 mb-2" />
          <div class="text-sm text-gray-500 dark:text-gray-400">Disciplinas em Curso</div>
          <div class="text-2xl font-bold text-amber-600 dark:text-amber-400">5</div>
        </div>
      </UCard>
      
      <UCard class="bg-purple-50 dark:bg-purple-900/20">
        <div class="flex flex-col items-center">
          <UIcon name="i-lucide-calendar" class="h-8 w-8 text-purple-500 mb-2" />
          <div class="text-sm text-gray-500 dark:text-gray-400">Taxa de Frequência</div>
          <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">92%</div>
        </div>
      </UCard>
    </div>

    <!-- Semester Progress -->
    <UCard class="mb-8">
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-medium">Progresso no Semestre</h2>
          <UBadge color="blue" variant="soft">2023.2</UBadge>
        </div>
      </template>
      
      <div class="mb-6">
        <div class="flex justify-between text-sm mb-1">
          <span>Completado</span>
          <span class="font-medium">65%</span>
        </div>
        <UProgress color="primary" :value="65" />
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 class="text-sm font-medium mb-2">Dias restantes</h3>
          <div class="flex items-center">
            <UIcon name="i-lucide-calendar-days" class="mr-2 text-gray-500" />
            <span class="font-medium">42 dias</span>
          </div>
        </div>
        <div>
          <h3 class="text-sm font-medium mb-2">Próxima avaliação</h3>
          <div class="flex items-center">
            <UIcon name="i-lucide-file-text" class="mr-2 text-gray-500" />
            <span class="font-medium">15/06 - Cálculo III</span>
          </div>
        </div>
      </div>
    </UCard>

    <!-- Current Subjects -->
    <UCard class="mb-8">
      <template #header>
        <h2 class="text-lg font-medium">Disciplinas Atuais</h2>
      </template>
      
      <UTable :columns="columns" :rows="currentSubjects">
        <template #status-cell="{ row }">
          <UBadge
            :color="getStatusColor(row.status)"
            variant="soft"
            size="sm"
          >
            {{ row.status }}
          </UBadge>
        </template>
        
        <template #grade-cell="{ row }">
          <div class="font-medium" :class="getGradeColor(row.grade)">
            {{ row.grade }}
          </div>
        </template>
      </UTable>
    </UCard>

    <!-- Grade History Chart -->
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-medium">Histórico de Notas</h2>
          <USelect
            v-model="selectedSemester"
            :options="semesters"
            placeholder="Selecionar semestre"
            class="w-40"
          />
        </div>
      </template>
      
      <div class="h-64 flex items-center justify-center">
        <p class="text-gray-500 italic">Gráfico de desempenho acadêmico seria renderizado aqui</p>
      </div>
    </UCard>
  </div>
</template>

<script setup>
const columns = [
  {
    key: 'code',
    label: 'Código',
    id: 'code'
  },
  {
    key: 'name',
    label: 'Disciplina',
    id: 'name'
  },
  {
    key: 'teacher',
    label: 'Professor',
    id: 'teacher'
  },
  {
    key: 'grade',
    label: 'Nota',
    id: 'grade'
  },
  {
    key: 'status',
    label: 'Situação',
    id: 'status'
  }
];

const currentSubjects = ref([
  { 
    code: 'MAT135',
    name: 'Cálculo III',
    teacher: 'Dra. Maria Silva',
    grade: '8.5',
    status: 'Em andamento'
  },
  {
    code: 'FIS221',
    name: 'Física Quântica',
    teacher: 'Dr. Paulo Mendes',
    grade: '7.0',
    status: 'Em andamento'
  },
  {
    code: 'BIO110',
    name: 'Biologia Celular',
    teacher: 'Dra. Ana Ferreira',
    grade: '9.5',
    status: 'Em andamento'
  },
  {
    code: 'ENG301',
    name: 'Programação Avançada',
    teacher: 'Dr. Roberto Santos',
    grade: 'N/A',
    status: 'Não iniciado'
  },
  {
    code: 'HUM202',
    name: 'História da Arte',
    teacher: 'Dr. João Costa',
    grade: '6.5',
    status: 'Atenção'
  }
]);

const selectedSemester = ref('2023.2');

const semesters = [
  '2023.2',
  '2023.1',
  '2022.2',
  '2022.1',
  '2021.2'
];

function getStatusColor(status) {
  switch (status) {
    case 'Em andamento':
      return 'blue';
    case 'Atenção':
      return 'yellow';
    case 'Não iniciado':
      return 'gray';
    default:
      return 'gray';
  }
}

function getGradeColor(grade) {
  if (grade === 'N/A') return 'text-gray-400';
  const numGrade = parseFloat(grade);
  if (numGrade >= 7) return 'text-green-600 dark:text-green-400';
  if (numGrade >= 5) return 'text-yellow-600 dark:text-yellow-400';
  return 'text-red-600 dark:text-red-400';
}
</script>