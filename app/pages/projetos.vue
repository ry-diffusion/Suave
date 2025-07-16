<template>
    <div class="p-4">
        <!-- Loading State -->
        <div v-if="loading" class="flex items-center justify-center py-12">
            <UISpinner size="lg" />
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-12">
            <div class="mx-auto h-12 w-12 text-gray-400">
                <UIcon name="i-lucide-alert-circle" class="h-full w-full" />
            </div>
            <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Erro ao carregar projetos</h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ error }}</p>
            <div class="mt-6">
                <UButton color="primary" @click="fetchProjetos">
                    Tentar novamente
                </UButton>
            </div>
        </div>

        <!-- Projects Content -->
        <Transition name="fade" mode="out-in">
            <div v-if="!selectedProjeto && projetos" key="projects-list" class="space-y-6">
                <!-- Statistics Cards -->
                <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <UCard class="p-4 sm:p-5">
                        <div class="flex items-center">
                            <div class="flex-shrink-0">
                                <div
                                    class="w-10 h-10 bg-blue-500/10 dark:bg-blue-500/20 rounded-xl flex items-center justify-center">
                                    <UIcon name="i-lucide-folder" class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                            </div>
                            <div class="ml-3 sm:ml-4 min-w-0 flex-1">
                                <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">Total</p>
                                <p class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white leading-none">{{
                                    totalProjetos }}</p>
                            </div>
                        </div>
                    </UCard>

                    <UCard class="p-4 sm:p-5">
                        <div class="flex items-center">
                            <div class="flex-shrink-0">
                                <div
                                    class="w-10 h-10 bg-green-500/10 dark:bg-green-500/20 rounded-xl flex items-center justify-center">
                                    <UIcon name="i-lucide-check-circle"
                                        class="w-5 h-5 text-green-600 dark:text-green-400" />
                                </div>
                            </div>
                            <div class="ml-3 sm:ml-4 min-w-0 flex-1">
                                <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">Concluídos
                                </p>
                                <p class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white leading-none">{{
                                    projetosConcluidos }}</p>
                            </div>
                        </div>
                    </UCard>

                    <UCard class="p-4 sm:p-5">
                        <div class="flex items-center">
                            <div class="flex-shrink-0">
                                <div
                                    class="w-10 h-10 bg-amber-500/10 dark:bg-amber-500/20 rounded-xl flex items-center justify-center">
                                    <UIcon name="i-lucide-clock" class="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                </div>
                            </div>
                            <div class="ml-3 sm:ml-4 min-w-0 flex-1">
                                <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">Em Andamento
                                </p>
                                <p class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white leading-none">{{
                                    projetosEmAndamento }}</p>
                            </div>
                        </div>
                    </UCard>

                    <UCard class="p-4 sm:p-5">
                        <div class="flex items-center">
                            <div class="flex-shrink-0">
                                <div
                                    class="w-10 h-10 bg-purple-500/10 dark:bg-purple-500/20 rounded-xl flex items-center justify-center">
                                    <UIcon name="i-lucide-target"
                                        class="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                </div>
                            </div>
                            <div class="ml-3 sm:ml-4 min-w-0 flex-1">
                                <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">Metas</p>
                                <p class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white leading-none">{{
                                    totalMetas }}</p>
                            </div>
                        </div>
                    </UCard>
                </div>

                <!-- Project Categories -->
                <div class="space-y-6">
                    <!-- Extensão -->
                    <div v-if="projetos.Extensao.length > 0">
                        <UCard>
                            <template #header>
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center">
                                        <UIcon name="i-lucide-users" class="mr-2 h-5 w-5" />
                                        <h2 class="font-medium">Projetos de Extensão</h2>
                                        <UBadge color="warning" variant="soft" class="ml-2">{{ projetos.Extensao.length
                                            }}
                                        </UBadge>
                                    </div>
                                    <UButton color="neutral" variant="ghost" icon="i-lucide-refresh-cw" size="sm"
                                        @click="fetchProjetos" />
                                </div>
                            </template>

                            <div class="space-y-3">
                                <UCard v-for="projeto in projetos.Extensao" :key="projeto.id"
                                    class="group hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer border-0 shadow-sm"
                                    @click="openProjectDetail(projeto)">
                                    <div class="p-5 sm:p-6">
                                        <div class="flex items-start justify-between mb-4">
                                            <h3
                                                class="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white leading-tight break-words flex-1 mr-3">
                                                {{ projeto.titulo }}
                                            </h3>
                                            <UBadge :color="getStatusColor(projeto.status)" variant="soft" size="sm"
                                                class="flex-shrink-0">
                                                {{ getStatusText(projeto.status) }}
                                            </UBadge>
                                        </div>

                                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                            <div class="space-y-3">
                                                <div class="flex items-center gap-2">
                                                    <UIcon name="i-lucide-calendar"
                                                        class="w-4 h-4 text-gray-400 flex-shrink-0" />
                                                    <div class="min-w-0 flex-1">
                                                        <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                                            Período</p>
                                                        <p class="text-sm font-medium text-gray-900 dark:text-white">{{
                                                            formatDate(projeto.inicio_execucao) }} - {{
                                                                formatDate(projeto.fim_execucao)
                                                            }}</p>
                                                    </div>
                                                </div>

                                                <div class="flex items-center gap-2">
                                                    <UIcon name="i-lucide-target"
                                                        class="w-4 h-4 text-gray-400 flex-shrink-0" />
                                                    <div class="min-w-0 flex-1">
                                                        <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                                            Metas</p>
                                                        <p class="text-sm font-medium text-gray-900 dark:text-white">{{
                                                            projeto.metas.length }}
                                                            metas</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="space-y-3">
                                                <div v-if="'area_conhecimento' in projeto"
                                                    class="flex items-center gap-2">
                                                    <UIcon name="i-lucide-book-open"
                                                        class="w-4 h-4 text-gray-400 flex-shrink-0" />
                                                    <div class="min-w-0 flex-1">
                                                        <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                                            Área</p>
                                                        <p
                                                            class="text-sm font-medium text-gray-900 dark:text-white break-words">
                                                            {{
                                                                projeto.area_conhecimento }}</p>
                                                    </div>
                                                </div>

                                                <div class="flex items-center gap-2">
                                                    <UIcon name="i-lucide-users"
                                                        class="w-4 h-4 text-gray-400 flex-shrink-0" />
                                                    <div class="min-w-0 flex-1">
                                                        <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                                            Participantes</p>
                                                        <div class="flex items-center gap-2">
                                                            <p
                                                                class="text-sm font-medium text-gray-900 dark:text-white">
                                                                {{
                                                                    projeto.participacao.length }}</p>
                                                            <div v-if="projeto.participacao.length > 0"
                                                                class="flex -space-x-1">
                                                                <div v-for="(participante, index) in projeto.participacao.slice(0, 3)"
                                                                    :key="participante.id"
                                                                    class="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-xs text-white font-medium border-2 border-white dark:border-gray-900 shadow-sm">
                                                                    {{ participante.nome.charAt(0).toUpperCase() }}
                                                                </div>
                                                                <div v-if="projeto.participacao.length > 3"
                                                                    class="w-6 h-6 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center text-xs text-white font-medium border-2 border-white dark:border-gray-900 shadow-sm">
                                                                    +{{ projeto.participacao.length - 3 }}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </UCard>
                            </div>
                        </UCard>
                    </div>

                    <!-- Pesquisa -->
                    <div v-if="projetos.Pesquisa.length > 0">
                        <UCard>
                            <template #header>
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center">
                                        <UIcon name="i-lucide-microscope" class="mr-2 h-5 w-5" />
                                        <h2 class="font-medium">Projetos de Pesquisa</h2>
                                        <UBadge color="info" variant="soft" class="ml-2">{{ projetos.Pesquisa.length }}
                                        </UBadge>
                                    </div>
                                    <UButton color="neutral" variant="ghost" icon="i-lucide-refresh-cw" size="sm"
                                        @click="fetchProjetos" />
                                </div>
                            </template>

                            <div class="space-y-3">
                                <UCard v-for="projeto in projetos.Pesquisa" :key="projeto.id"
                                    class="group hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer border-0 shadow-sm"
                                    @click="openProjectDetail(projeto)">
                                    <div class="p-5 sm:p-6">
                                        <div class="flex items-start justify-between mb-3">
                                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                                                {{ projeto.titulo }}
                                            </h3>
                                            <UBadge :color="getStatusColor(projeto.status)" variant="soft" size="sm">
                                                {{ getStatusText(projeto.status) }}
                                            </UBadge>
                                        </div>

                                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <p class="text-sm text-gray-500 dark:text-gray-400">Período</p>
                                                <p class="font-medium">{{ formatDate(projeto.inicio_execucao) }} - {{
                                                    formatDate(projeto.fim_execucao) }}</p>
                                            </div>

                                            <div>
                                                <p class="text-sm text-gray-500 dark:text-gray-400">Metas</p>
                                                <p class="font-medium">{{ projeto.metas.length }} metas</p>
                                            </div>

                                            <div>
                                                <p class="text-sm text-gray-500 dark:text-gray-400">Participantes</p>
                                                <div class="flex items-center gap-1">
                                                    <p class="font-medium">{{ projeto.participacao.length }}
                                                        participantes
                                                    </p>
                                                    <div v-if="projeto.participacao.length > 0"
                                                        class="flex -space-x-1 ml-2">
                                                        <div v-for="(participante, index) in projeto.participacao.slice(0, 3)"
                                                            :key="participante.id"
                                                            class="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center text-xs text-white font-medium border-2 border-white dark:border-gray-900">
                                                            {{ participante.nome.charAt(0).toUpperCase() }}
                                                        </div>
                                                        <div v-if="projeto.participacao.length > 3"
                                                            class="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center text-xs text-white font-medium border-2 border-white dark:border-gray-900">
                                                            +{{ projeto.participacao.length - 3 }}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </UCard>
                            </div>
                        </UCard>
                    </div>

                    <!-- Ensino -->
                    <div v-if="projetos.Ensino.length > 0">
                        <UCard>
                            <template #header>
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center">
                                        <UIcon name="i-lucide-graduation-cap" class="mr-2 h-5 w-5" />
                                        <h2 class="font-medium">Projetos de Ensino</h2>
                                        <UBadge color="success" variant="soft" class="ml-2">{{ projetos.Ensino.length }}
                                        </UBadge>
                                    </div>
                                    <UButton color="neutral" variant="ghost" icon="i-lucide-refresh-cw" size="sm"
                                        @click="fetchProjetos" />
                                </div>
                            </template>

                            <div class="space-y-3">
                                <UCard v-for="projeto in projetos.Ensino" :key="projeto.id"
                                    class="group hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer border-0 shadow-sm"
                                    @click="openProjectDetail(projeto)">
                                    <div class="p-5 sm:p-6">
                                        <div class="flex items-start justify-between mb-3">
                                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                                                {{ projeto.titulo }}
                                            </h3>
                                            <UBadge :color="getStatusColor(projeto.status)" variant="soft" size="sm">
                                                {{ getStatusText(projeto.status) }}
                                            </UBadge>
                                        </div>

                                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <p class="text-sm text-gray-500 dark:text-gray-400">Período</p>
                                                <p class="font-medium">{{ formatDate(projeto.inicio_execucao) }} - {{
                                                    formatDate(projeto.fim_execucao) }}</p>
                                            </div>

                                            <div>
                                                <p class="text-sm text-gray-500 dark:text-gray-400">Metas</p>
                                                <p class="font-medium">{{ projeto.metas.length }} metas</p>
                                            </div>

                                            <div>
                                                <p class="text-sm text-gray-500 dark:text-gray-400">Participantes</p>
                                                <div class="flex items-center gap-1">
                                                    <p class="font-medium">{{ projeto.participacao.length }}
                                                        participantes
                                                    </p>
                                                    <div v-if="projeto.participacao.length > 0"
                                                        class="flex -space-x-1 ml-2">
                                                        <div v-for="(participante, index) in projeto.participacao.slice(0, 3)"
                                                            :key="participante.id"
                                                            class="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center text-xs text-white font-medium border-2 border-white dark:border-gray-900">
                                                            {{ participante.nome.charAt(0).toUpperCase() }}
                                                        </div>
                                                        <div v-if="projeto.participacao.length > 3"
                                                            class="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center text-xs text-white font-medium border-2 border-white dark:border-gray-900">
                                                            +{{ projeto.participacao.length - 3 }}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </UCard>
                            </div>
                        </UCard>
                    </div>

                    <!-- Empty State -->
                    <div v-if="totalProjetos === 0" class="text-center py-12">
                        <div class="mx-auto h-12 w-12 text-gray-400">
                            <UIcon name="i-lucide-folder-open" class="h-full w-full" />
                        </div>
                        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Nenhum projeto encontrado
                        </h3>
                        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Você ainda não possui projetos cadastrados.
                        </p>
                    </div>
                </div>
            </div>

            <!-- Project Detail View -->
            <div v-else-if="selectedProjeto" key="project-detail" class="space-y-6">
                <!-- Back Button -->
                <div class="flex items-start gap-4">
                    <UButton color="neutral" variant="ghost" icon="i-lucide-arrow-left" @click="closeProjectDetail"
                        class="flex-shrink-0 mt-1">
                        <span class="hidden sm:inline">Voltar aos Projetos</span>
                    </UButton>
                    <div class="flex-1 min-w-0">
                        <h1
                            class="text-xl sm:text-2xl lg:text-3xl font-bold text-highlighted break-words leading-tight">
                            {{ selectedProjeto.titulo }}
                        </h1>
                        <p class="text-muted text-sm sm:text-base mt-2 break-words">
                            {{ getProjetoType(selectedProjeto) }}
                        </p>
                    </div>
                </div>

                <!-- Project Info -->
                <div class="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
                    <div class="space-y-4">
                        <h4 class="font-medium text-highlighted">Informações do Projeto</h4>
                        <div class="space-y-3 text-sm">
                            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                                <span class="text-muted">Status:</span>
                                <UBadge :color="getStatusColor(selectedProjeto.status)" variant="soft" size="sm"
                                    class="break-words">
                                    {{ getStatusText(selectedProjeto.status) }}
                                </UBadge>
                            </div>
                            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                                <span class="text-muted">Início:</span>
                                <span class="text-default font-medium break-words">{{
                                    formatDate(selectedProjeto.inicio_execucao)
                                    }}</span>
                            </div>
                            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                                <span class="text-muted">Término:</span>
                                <span class="text-default font-medium break-words">{{
                                    formatDate(selectedProjeto.fim_execucao)
                                    }}</span>
                            </div>
                            <div v-if="'area_conhecimento' in selectedProjeto"
                                class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                                <span class="text-muted">Área:</span>
                                <span class="text-default font-medium break-words">{{ selectedProjeto.area_conhecimento
                                }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="space-y-4">
                        <h4 class="font-medium text-highlighted">Participantes</h4>
                        <div class="space-y-4 max-h-64 overflow-y-auto">
                            <!-- Responsáveis primeiro -->
                            <div v-if="responsaveis.length > 0" class="space-y-2">
                                <h5 class="text-sm font-medium text-muted flex items-center gap-2">
                                    <UIcon name="i-lucide-star" class="w-4 h-4 flex-shrink-0" />
                                    <span class="break-words">Responsáveis ({{ responsaveis.length }})</span>
                                </h5>
                                <div class="space-y-2">
                                    <div v-for="participante in responsaveis" :key="participante.id"
                                        class="flex items-center justify-between p-3 bg-elevated rounded-lg border border-primary-200 dark:border-primary-800 hover:bg-default/50 transition-colors">
                                        <div class="min-w-0 flex-1 mr-3">
                                            <p class="font-medium text-sm text-default break-words">{{ participante.nome
                                            }}</p>
                                            <p class="text-xs text-muted break-words">{{ participante.vinculo }}</p>
                                        </div>
                                        <UBadge color="primary" variant="soft" size="sm" class="flex-shrink-0">
                                            Responsável
                                        </UBadge>
                                    </div>
                                </div>
                            </div>

                            <!-- Outros participantes -->
                            <div v-if="outrosParticipantes.length > 0" class="space-y-2">
                                <h5 class="text-sm font-medium text-muted flex items-center gap-2">
                                    <UIcon name="i-lucide-users" class="w-4 h-4 flex-shrink-0" />
                                    <span class="break-words">Participantes ({{ outrosParticipantes.length }})</span>
                                </h5>
                                <div class="space-y-2">
                                    <div v-for="participante in outrosParticipantes" :key="participante.id"
                                        class="flex items-center justify-between p-3 bg-elevated rounded-lg border border-default hover:bg-default/50 transition-colors">
                                        <div class="min-w-0 flex-1 mr-3">
                                            <p class="font-medium text-sm text-default break-words">{{ participante.nome
                                            }}</p>
                                            <p class="text-xs text-muted break-words">{{ participante.vinculo }}</p>
                                        </div>
                                        <UBadge color="neutral" variant="soft" size="sm" class="flex-shrink-0">
                                            Participante
                                        </UBadge>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="text-xs text-muted text-center pt-2 border-t border-default break-words">
                            {{ selectedProjeto.participacao.length }} participante{{ selectedProjeto.participacao.length
                                !== 1 ? 's' : '' }} no total
                        </div>
                    </div>
                </div>

                <!-- Project Progress -->
                <div class="space-y-4">
                    <h4 class="font-medium text-highlighted">Progresso do Projeto</h4>
                    <div class="w-full overflow-x-auto">
                        <MobileProjectStepper :metas="selectedProjeto.metas" />
                    </div>
                </div>
            </div>
        </Transition>
    </div>


</template>

<script setup lang="ts">
import type { Projetos, Extensao, Pesquisa, Ensino } from '#shared/datatypes'
import MobileProjectStepper from '~/components/MobileProjectStepper.vue'

// Page meta
definePageMeta({
    middleware: ['auth']
})

// Reactive data
const loading = ref(false)
const error = ref<string | null>(null)
const projetos = ref<Projetos | null>(null)
const selectedProjeto = ref<Extensao | Pesquisa | Ensino | null>(null)

// Computed properties
const totalProjetos = computed(() => {
    if (!projetos.value) return 0
    return projetos.value.Extensao.length + projetos.value.Pesquisa.length + projetos.value.Ensino.length
})

const projetosConcluidos = computed(() => {
    if (!projetos.value) return 0
    const allProjetos = [
        ...projetos.value.Extensao,
        ...projetos.value.Pesquisa,
        ...projetos.value.Ensino
    ]
    return allProjetos.filter((p: Extensao | Pesquisa | Ensino) => p.status === 'Concluído').length
})

const projetosEmAndamento = computed(() => {
    if (!projetos.value) return 0
    const allProjetos = [
        ...projetos.value.Extensao,
        ...projetos.value.Pesquisa,
        ...projetos.value.Ensino
    ]
    return allProjetos.filter((p: Extensao | Pesquisa | Ensino) => p.status === 'Em execução').length
})

const totalMetas = computed(() => {
    if (!projetos.value) return 0
    const allProjetos = [
        ...projetos.value.Extensao,
        ...projetos.value.Pesquisa,
        ...projetos.value.Ensino
    ]
    return allProjetos.reduce((total, projeto) => total + projeto.metas.length, 0)
})

// Computed properties for participants organization
const responsaveis = computed(() => {
    if (!selectedProjeto.value) return []
    return selectedProjeto.value.participacao.filter(p => p.responsavel)
})

const outrosParticipantes = computed(() => {
    if (!selectedProjeto.value) return []
    return selectedProjeto.value.participacao.filter(p => !p.responsavel)
})

// Methods
const fetchProjetos = async () => {
    loading.value = true
    error.value = null

    try {
        const response = await $fetch('/api/suap/meus-projetos')
        projetos.value = response.data
    } catch (err: any) {
        error.value = err.data?.message || 'Erro ao carregar projetos'
    } finally {
        loading.value = false
    }
}

const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('pt-BR')
}

const getProjetoType = (projeto: Extensao | Pesquisa | Ensino) => {
    if ('area_conhecimento' in projeto) return 'Projeto de Extensão'
    if ('titulo' in projeto && projetos.value) {
        if (projetos.value.Pesquisa.some(p => p.id === projeto.id)) return 'Projeto de Pesquisa'
        if (projetos.value.Ensino.some(p => p.id === projeto.id)) return 'Projeto de Ensino'
    }
    return 'Projeto'
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'Não selecionado':
            return 'neutral'
        case 'Em execução':
            return 'info'
        case 'Concluído':
            return 'success'
        case 'Em Seleção':
            return 'warning'
        case 'Não Enviado':
            return 'error'
        default:
            return 'neutral'
    }
}

const getStatusText = (status: string) => {
    switch (status) {
        case 'Não selecionado':
            return 'Não Selecionado'
        case 'Em execução':
            return 'Em Execução'
        case 'Concluído':
            return 'Concluído'
        case 'Em Seleção':
            return 'Em Seleção'
        case 'Não Enviado':
            return 'Não Enviado'
        default:
            return status
    }
}

const openProjectDetail = (projeto: Extensao | Pesquisa | Ensino) => {
    selectedProjeto.value = projeto
}

const closeProjectDetail = () => {
    selectedProjeto.value = null
}

// Fetch data on mount
onMounted(() => {
    fetchProjetos()
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.fade-enter-from {
    opacity: 0;
    transform: translateY(30px) scale(0.98);
}

.fade-leave-to {
    opacity: 0;
    transform: translateY(-30px) scale(0.98);
}

/* Hover effects for cards */
.group:hover {
    transform: translateY(-2px);
}

/* Smooth scrolling */
* {
    scroll-behavior: smooth;
}

/* Custom scrollbar */
::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

::-webkit-scrollbar-track {
    background: transparent;
}

::-webkit-scrollbar-thumb {
    background: rgba(156, 163, 175, 0.3);
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
    background: rgba(156, 163, 175, 0.5);
}

/* Dark mode scrollbar */
.dark ::-webkit-scrollbar-thumb {
    background: rgba(75, 85, 99, 0.3);
}

.dark ::-webkit-scrollbar-thumb:hover {
    background: rgba(75, 85, 99, 0.5);
}
</style>