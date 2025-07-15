<template>
    <div>
        <div class="px-4">
            <div class="max-w-4xl mx-auto">
                <!-- Welcome Card -->
                <UCard class="mb-6">
                    <template #header>
                        <div class="flex items-center">
                            <UIcon name="i-lucide-home" class="mr-2 h-5 w-5" />
                            <h2 class="font-medium">Bem-vindo(a), Ana!</h2>
                        </div>
                    </template>

                    <p class="text-gray-500 dark:text-gray-400 mb-4">
                        Acompanhe suas atividades acadêmicas e gerencie seu
                        progresso diretamente pelo nosso aplicativo.
                    </p>

                    <UAlert
                        title="Aviso importante"
                        description="Provas finais começam em 2 semanas. Não se esqueça de verificar o calendário acadêmico."
                        color="yellow"
                        variant="soft"
                        icon="i-lucide-alert-triangle"
                        class="mb-4"
                    />
                </UCard>

                <!-- Quick Access -->
                <h2 class="text-xl font-semibold mb-4">Acesso Rápido</h2>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                    <UCard
                        to="/ferramentas/moodles"
                        class="text-center hover:shadow-md transition-shadow cursor-pointer"
                    >
                        <UIcon
                            name="i-lucide-book-open"
                            class="h-10 w-10 mx-auto mb-2 text-primary-500"
                        />
                        <h3 class="font-medium">Moodles</h3>
                    </UCard>

                    <UCard
                        to="/ferramentas/desempenho"
                        class="text-center hover:shadow-md transition-shadow cursor-pointer"
                    >
                        <UIcon
                            name="i-lucide-bar-chart-2"
                            class="h-10 w-10 mx-auto mb-2 text-primary-500"
                        />
                        <h3 class="font-medium">Desempenho</h3>
                    </UCard>

                    <UCard
                        to="/perfil"
                        class="text-center hover:shadow-md transition-shadow cursor-pointer"
                    >
                        <UIcon
                            name="i-lucide-user"
                            class="h-10 w-10 mx-auto mb-2 text-primary-500"
                        />
                        <h3 class="font-medium">Perfil</h3>
                    </UCard>
                </div>

                <!-- Upcoming Activities -->
                <h2 class="text-xl font-semibold mb-4">Próximas Atividades</h2>
                <UCard class="mb-8">
                    <UTable :columns="activityColumns" :rows="activityRows">
                        <template #status-cell="{ row }">
                            <UBadge
                                :color="
                                    row.status === 'Pendente'
                                        ? 'yellow'
                                        : 'blue'
                                "
                                variant="soft"
                                size="sm"
                            >
                                {{ row.status }}
                            </UBadge>
                        </template>
                    </UTable>
                </UCard>

                <!-- News & Announcements -->
                <h2 class="text-xl font-semibold mb-4">
                    Notícias e Comunicados
                </h2>
                <div class="space-y-4">
                    <UCard>
                        <template #header>
                            <div class="flex justify-between items-center">
                                <h3 class="font-medium">
                                    Calendário de Provas Publicado
                                </h3>
                                <UBadge color="blue" size="sm">Novo</UBadge>
                            </div>
                        </template>
                        <p class="text-sm text-gray-500 dark:text-gray-400">
                            O calendário de provas finais já está disponível.
                            Confira as datas e prepare-se com antecedência.
                        </p>
                        <template #footer>
                            <div
                                class="flex items-center justify-between text-xs text-gray-500"
                            >
                                <span>05/06/2023</span>
                                <UButton size="xs" variant="ghost"
                                    >Ler mais</UButton
                                >
                            </div>
                        </template>
                    </UCard>

                    <UCard>
                        <template #header>
                            <div class="flex justify-between items-center">
                                <h3 class="font-medium">
                                    Biblioteca: Horário Estendido
                                </h3>
                                <UBadge color="gray" size="sm"
                                    >2 dias atrás</UBadge
                                >
                            </div>
                        </template>
                        <p class="text-sm text-gray-500 dark:text-gray-400">
                            A biblioteca estará funcionando em horário estendido
                            durante o período de provas finais.
                        </p>
                        <template #footer>
                            <div
                                class="flex items-center justify-between text-xs text-gray-500"
                            >
                                <span>03/06/2023</span>
                                <UButton size="xs" variant="ghost"
                                    >Ler mais</UButton
                                >
                            </div>
                        </template>
                    </UCard>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
// Define table columns with proper IDs
const activityColumns = [
    { key: "date", label: "Data", id: "date" },
    { key: "course", label: "Disciplina", id: "course" },
    { key: "activity", label: "Atividade", id: "activity" },
    { key: "status", label: "Status", id: "status" },
];

// Define table rows
const activityRows = [
    {
        date: "15/06",
        course: "Cálculo III",
        activity: "Prova Final",
        status: "Pendente",
    },
    {
        date: "12/06",
        course: "Física Quântica",
        activity: "Trabalho em Grupo",
        status: "Pendente",
    },
    {
        date: "10/06",
        course: "Programação Avançada",
        activity: "Projeto Final",
        status: "Em andamento",
    },
    {
        date: "08/06",
        course: "Biologia Celular",
        activity: "Relatório de Laboratório",
        status: "Em andamento",
    },
];
</script>
