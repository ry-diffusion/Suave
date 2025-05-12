<template>
  <div class="p-4">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Profile Card -->
      <div class="md:col-span-1">
        <UCard>
          <div class="flex flex-col items-center">
            <div class="relative mb-4">
              <img 
                src="https://i.pravatar.cc/150?img=11" 
                alt="Foto de perfil"
                class="w-32 h-32 rounded-full object-cover border-4 border-primary-100"
              />
              <UButton
                color="primary"
                variant="soft"
                icon="i-lucide-camera"
                size="xs"
                class="absolute bottom-0 right-0 rounded-full"
              />
            </div>
            
            <h2 class="text-xl font-medium">Ana Luíza Martins</h2>
            <p class="text-gray-500 dark:text-gray-400 mb-3">Estudante</p>
            
            <div class="flex space-x-2 mb-4">
              <UBadge color="primary" variant="soft">Engenharia</UBadge>
              <UBadge color="gray" variant="soft">2º Semestre</UBadge>
            </div>
            
            <UButton
              color="primary"
              variant="outline"
              icon="i-lucide-edit"
              class="w-full"
            >
              Editar Perfil
            </UButton>
          </div>
        </UCard>
      </div>
      
      <!-- Main Content -->
      <div class="md:col-span-2">
        <!-- Personal Information -->
        <UCard class="mb-6">
          <template #header>
            <div class="flex items-center justify-between">
              <h2 class="font-medium">Informações Pessoais</h2>
              <UButton
                color="gray"
                variant="ghost"
                icon="i-lucide-edit-3"
                size="sm"
              />
            </div>
          </template>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Nome Completo</p>
              <p class="font-medium">Ana Luíza Martins</p>
            </div>
            
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Matrícula</p>
              <p class="font-medium">20230142</p>
            </div>
            
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">E-mail</p>
              <p class="font-medium">ana.martins@estudante.edu.br</p>
            </div>
            
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Telefone</p>
              <p class="font-medium">(11) 98765-4321</p>
            </div>
            
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Data de Nascimento</p>
              <p class="font-medium">15/03/1999</p>
            </div>
            
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">CPF</p>
              <p class="font-medium">123.456.789-00</p>
            </div>
          </div>
        </UCard>
        
        <!-- Academic Information -->
        <UCard class="mb-6">
          <template #header>
            <div class="flex items-center justify-between">
              <h2 class="font-medium">Informações Acadêmicas</h2>
              <UButton
                color="gray"
                variant="ghost"
                icon="i-lucide-edit-3"
                size="sm"
              />
            </div>
          </template>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Curso</p>
              <p class="font-medium">Engenharia de Software</p>
            </div>
            
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Campus</p>
              <p class="font-medium">Campus Central</p>
            </div>
            
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Período</p>
              <p class="font-medium">Matutino</p>
            </div>
            
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Coordenador</p>
              <p class="font-medium">Prof. Dr. Carlos Eduardo Santos</p>
            </div>
            
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">CR (Coeficiente de Rendimento)</p>
              <p class="font-medium text-green-600">8.7</p>
            </div>
            
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Situação</p>
              <UBadge color="green" variant="soft">Regular</UBadge>
            </div>
          </div>
        </UCard>
        
        <!-- Notification Settings -->
        <UCard>
          <template #header>
            <h2 class="font-medium">Configurações de Notificações</h2>
          </template>
          
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium">Avisos do Moodle</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">Receba avisos sobre novas atividades e prazos</p>
              </div>
              <UToggle v-model="notifMoodle" />
            </div>
            
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium">Notas e Avaliações</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">Receba notificações quando suas notas forem publicadas</p>
              </div>
              <UToggle v-model="notifGrades" />
            </div>
            
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium">Calendário Acadêmico</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">Receba lembretes sobre eventos importantes</p>
              </div>
              <UToggle v-model="notifCalendar" />
            </div>
            
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium">E-mails institucionais</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">Receba cópias dos e-mails no seu endereço pessoal</p>
              </div>
              <UToggle v-model="notifEmails" />
            </div>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>

<script setup>
const notifMoodle = ref(true);
const notifGrades = ref(true);
const notifCalendar = ref(false);
const notifEmails = ref(true);
</script>