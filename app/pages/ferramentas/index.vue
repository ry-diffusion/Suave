<template>
    <div class="px-4">
        <UCard class="mb-4">
            <template #header>
                <div class="flex items-center">
                    <UIcon name="i-lucide-book-open" class="mr-2 h-5 w-5" />
                    <h2 class="font-medium">Moodles Disponíveis</h2>
                </div>
            </template>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">
                Acesse os ambientes de aprendizagem disponíveis para você.
            </p>
            <template #footer>
                <UButton to="/ferramentas/moodles" color="primary" variant="soft" icon="i-lucide-chevron-right"
                    trailing>
                    Acessar
                </UButton>
            </template>
        </UCard>

        <UCard>
            <template #header>
                <div class="flex items-center">
                    <UIcon name="i-lucide-bar-chart-2" class="mr-2 h-5 w-5" />
                    <h2 class="font-medium">Desempenho Acadêmico</h2>
                </div>
            </template>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">
                Visualize suas notas, frequência e outros indicadores
                acadêmicos.
            </p>
            <template #footer>
                <UButton to="/ferramentas/desempenho" color="primary" variant="soft" icon="i-lucide-chevron-right"
                    trailing>
                    Visualizar
                </UButton>
            </template>
        </UCard>

        <UCard>
            <template #header>
                <div class="flex items-center">
                    <UIcon name="i-lucide-folder" class="mr-2 h-5 w-5" />
                    <h2 class="font-medium">Meus Projetos</h2>
                </div>
            </template>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">
                Acompanhe o progresso dos seus projetos de extensão, pesquisa e ensino.
            </p>
            <template #footer>
                <UButton to="/projetos" color="primary" variant="soft" icon="i-lucide-chevron-right" trailing>
                    Visualizar
                </UButton>
            </template>
        </UCard>
    </div>
</template>
