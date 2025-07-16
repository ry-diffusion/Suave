<template>
    <div class="w-full">
        <!-- Mobile Progress Header -->
        <div class="mb-6">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
                <h3 class="text-lg font-semibold text-highlighted break-words">
                    Progresso do Projeto
                </h3>
                <div class="flex items-center space-x-2 flex-shrink-0">
                    <span class="text-sm text-muted">
                        {{ completedSteps }}/{{ totalSteps }}
                    </span>
                    <div class="w-16 bg-muted rounded-full h-2">
                        <div class="bg-success h-2 rounded-full transition-all duration-500"
                            :style="{ width: `${progressPercentage}%` }"></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Mobile Progress Cards -->
        <div class="space-y-4">
            <div v-for="(meta, metaIndex) in metas" :key="meta.id"
                class="bg-default rounded-xl border border-default p-4" :class="getMetaCardClasses(meta, metaIndex)">
                <!-- Meta Header -->
                <div class="flex items-start justify-between mb-3 gap-3">
                    <div class="flex items-start space-x-3 flex-1 min-w-0">
                        <div class="w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 bg-default flex-shrink-0"
                            :class="getMetaStepClasses(meta, metaIndex)">
                            <UIcon v-if="isMetaCompleted(meta)" name="i-lucide-check" class="w-4 h-4 text-white" />
                            <span v-else class="text-xs font-semibold"
                                :class="isMetaActive(meta, metaIndex) ? 'text-neutral' : 'text-muted'">
                                {{ metaIndex + 1 }}
                            </span>
                        </div>
                        <div class="flex-1 min-w-0">
                            <h4 class="font-semibold text-highlighted text-sm leading-tight break-words">
                                {{ meta.descricao }}
                            </h4>
                            <p class="text-xs text-muted mt-1 break-words">
                                {{ getMetaStatusText(meta) }}
                            </p>
                        </div>
                    </div>
                    <UBadge :color="getMetaStatusColor(meta)" variant="soft" size="sm" class="flex-shrink-0">
                        {{ getMetaStatusText(meta) }}
                    </UBadge>
                </div>

                <!-- Meta Timeline -->
                <div v-if="meta.inicio && meta.fim" class="mb-3">
                    <div class="flex items-center text-xs text-muted">
                        <UIcon name="i-lucide-calendar" class="w-3 h-3 mr-1 flex-shrink-0" />
                        <span class="break-words">{{ formatDate(meta.inicio) }} - {{ formatDate(meta.fim) }}</span>
                    </div>
                </div>

                <!-- Etapas -->
                <div v-if="meta.etapas.length > 0" class="space-y-2">
                    <div v-for="(etapa, etapaIndex) in meta.etapas" :key="etapa.id" class="bg-muted rounded-lg p-3"
                        :class="isEtapaActive(etapa) ? 'ring-2 ring-neutral-200 dark:ring-neutral-800' : ''">
                        <div class="flex items-start justify-between mb-2 gap-2">
                            <div class="flex items-start space-x-2 flex-1 min-w-0">
                                <div class="w-3 h-3 rounded-full border-2 transition-all duration-300 bg-default flex-shrink-0 mt-0.5"
                                    :class="getEtapaStepClasses(etapa)"></div>
                                <h5 class="text-xs font-medium text-highlighted break-words">
                                    {{ etapa.descricao }}
                                </h5>
                            </div>
                            <UBadge :color="getEtapaStatusColor(etapa)" variant="soft" size="xs" class="flex-shrink-0">
                                {{ getEtapaStatusText(etapa) }}
                            </UBadge>
                        </div>

                        <div
                            class="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-muted gap-1">
                            <div class="flex items-center min-w-0">
                                <UIcon name="i-lucide-user" class="w-3 h-3 mr-1 flex-shrink-0" />
                                <span class="truncate">{{ etapa.responsavel }}</span>
                            </div>
                            <div class="flex items-center flex-shrink-0">
                                <UIcon name="i-lucide-calendar" class="w-3 h-3 mr-1" />
                                <span class="break-words">{{ formatDate(etapa.inicio_execucao) }} - {{
                                    formatDate(etapa.fim_execucao)
                                    }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Empty State for Etapas -->
                <div v-else class="text-center py-3">
                    <div class="text-muted">
                        <UIcon name="i-lucide-list-todo" class="w-6 h-6 mx-auto mb-1" />
                        <p class="text-xs">Nenhuma etapa definida</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Mobile Summary -->
        <div
            class="mt-6 p-4 bg-success-50 dark:bg-success-900/20 rounded-xl border border-success-200 dark:border-success-800">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div class="flex-1 min-w-0">
                    <h4 class="text-sm font-semibold text-success-900 dark:text-success-100 break-words">
                        Resumo do Progresso
                    </h4>
                    <p class="text-xs text-success-700 dark:text-success-200 mt-1 break-words">
                        {{ completedSteps }} de {{ totalSteps }} etapas concluídas
                    </p>
                </div>
                <div class="text-right flex-shrink-0">
                    <div class="text-xl font-bold text-success-900 dark:text-success-100">
                        {{ Math.round(progressPercentage) }}%
                    </div>
                    <div class="text-xs text-success-700 dark:text-success-200">
                        Concluído
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Meta, Etapa } from '#shared/datatypes'

interface Props {
    metas: Meta[]
}

const props = defineProps<Props>()

// Computed properties
const totalSteps = computed(() => {
    return props.metas.reduce((total, meta) => {
        return total + (meta.etapas.length > 0 ? meta.etapas.length : 1)
    }, 0)
})

const completedSteps = computed(() => {
    return props.metas.reduce((total, meta) => {
        const metaSteps = meta.etapas.length > 0 ? meta.etapas.length : 1
        const completedMetaSteps = meta.etapas.length > 0
            ? meta.etapas.filter(etapa => isEtapaCompleted(etapa)).length
            : (isMetaCompleted(meta) ? 1 : 0)
        return total + completedMetaSteps
    }, 0)
})

const progressPercentage = computed(() => {
    return totalSteps.value > 0 ? (completedSteps.value / totalSteps.value) * 100 : 0
})

// Methods
const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    })
}

const isMetaCompleted = (meta: Meta): boolean => {
    if (meta.etapas.length === 0) {
        if (!meta.inicio || !meta.fim) return false
        const now = new Date()
        const fim = new Date(meta.fim)
        return now > fim
    }
    return meta.etapas.every(etapa => isEtapaCompleted(etapa))
}

const isMetaActive = (meta: Meta, metaIndex: number): boolean => {
    const previousMetasCompleted = props.metas
        .slice(0, metaIndex)
        .every(m => isMetaCompleted(m))

    return previousMetasCompleted && !isMetaCompleted(meta)
}

const isEtapaCompleted = (etapa: Etapa): boolean => {
    const now = new Date()
    const fim = new Date(etapa.fim_execucao)
    return now > fim
}

const isEtapaActive = (etapa: Etapa): boolean => {
    const now = new Date()
    const inicio = new Date(etapa.inicio_execucao)
    const fim = new Date(etapa.fim_execucao)
    return now >= inicio && now <= fim
}

const getMetaStepClasses = (meta: Meta, metaIndex: number) => {
    if (isMetaCompleted(meta)) {
        return 'bg-success border-success'
    }
    if (isMetaActive(meta, metaIndex)) {
        return 'bg-neutral border-neutral'
    }
    return 'bg-default border-muted'
}

const getEtapaStepClasses = (etapa: Etapa) => {
    if (isEtapaCompleted(etapa)) {
        return 'bg-success border-success'
    }
    if (isEtapaActive(etapa)) {
        return 'bg-neutral border-neutral'
    }
    return 'bg-default border-muted'
}

const getMetaCardClasses = (meta: Meta, metaIndex: number) => {
    if (isMetaCompleted(meta)) {
        return 'border-success-200 dark:border-success-800 bg-success-50/50 dark:bg-success-900/10'
    }
    if (isMetaActive(meta, metaIndex)) {
        return 'border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/10'
    }
    return 'border-default'
}

const getMetaStatusColor = (meta: Meta) => {
    if (isMetaCompleted(meta)) return 'success'
    if (isMetaActive(meta, props.metas.indexOf(meta))) return 'info'
    return 'neutral'
}

const getMetaStatusText = (meta: Meta) => {
    if (isMetaCompleted(meta)) return 'Concluída'
    if (isMetaActive(meta, props.metas.indexOf(meta))) return 'Em Andamento'
    return 'Pendente'
}

const getEtapaStatusColor = (etapa: Etapa) => {
    if (isEtapaCompleted(etapa)) return 'success'
    if (isEtapaActive(etapa)) return 'info'
    return 'neutral'
}

const getEtapaStatusText = (etapa: Etapa) => {
    if (isEtapaCompleted(etapa)) return 'Concluída'
    if (isEtapaActive(etapa)) return 'Em Andamento'
    return 'Pendente'
}
</script>