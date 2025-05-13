<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useUserSession } from '#imports'
import { useRouter } from 'vue-router'
import { useMediaQuery } from '@vueuse/core'

definePageMeta({ layout: false })

const { fetch: refreshSession } = useUserSession()
const router = useRouter()

const step = ref(0)
const loading = ref(false)
const error = ref('')

const isDesktop = useMediaQuery('(min-width: 768px)')

// Only one institution for now, but keep as array for future
const institutions = [
    { label: 'IF Goiano - Presencial', value: 'ifgoiano-presencial' }
]

const form = reactive({
    institution: null,
    username: '',
    password: ''
})

const steps = [
    { title: 'Instituição', description: 'Selecione a instituição', icon: 'i-lucide-building' },
    { title: 'Usuário', description: 'Informe seu usuário', icon: 'i-lucide-user' },
    { title: 'Senha', description: 'Informe sua senha', icon: 'i-lucide-lock' }
]

async function submitLogin() {
    error.value = ''
    if (!form.password || form.password.length < 1) {
        error.value = 'Campo obrigatório'
        return
    }
    loading.value = true
    try {
        await $fetch('/api/auth/signin', {
            method: 'POST',
            body: {
                institution: form.institution,
                username: form.username,
                password: form.password
            }
        })
        await refreshSession()
        router.push('/')
    } catch (e: unknown) {
        if (
            typeof e === 'object' &&
            e !== null &&
            'data' in e &&
            typeof (e as Record<string, unknown>).data === 'object' &&
            (e as { data?: { message?: unknown } }).data?.message &&
            typeof (e as { data: { message: unknown } }).data.message === 'string'
        ) {
            error.value = (e as { data: { message: string } }).data.message
        } else {
            error.value = 'Credenciais inválidas'
        }
    } finally {
        loading.value = false
    }
}

function nextStep() {
    if (step.value === 0 && !form.institution) {
        error.value = 'Selecione a instituição.'
        return
    }
    if (step.value === 1 && (!form.username || form.username.length < 1)) {
        error.value = 'Campo obrigatório'
        return
    }
    error.value = ''
    step.value++
}

function prevStep() {
    error.value = ''
    step.value--
}
</script>

<template>
    <div
        class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-900 via-gray-900 to-gray-800 dark:from-gray-950 dark:via-gray-900 dark:to-primary-900 px-2 pb-20">
        <div
            class="w-full max-w-md md:max-w-lg mx-auto rounded-xl shadow-lg p-4 md:p-8 bg-background/80 dark:bg-background/80 backdrop-blur-lg">
            <UStepper v-model="step" :items="steps" :orientation="isDesktop ? 'horizontal' : 'vertical'" class="mb-8" />

            <div v-if="step === 0">
                <USelect v-model="form.institution" :items="institutions" placeholder="Selecione a instituição"
                    size="lg" class="w-full mb-4" />
            </div>
            <div v-else-if="step === 1">
                <UInput v-model="form.username" placeholder="Usuário" size="lg" class="w-full mb-4" autofocus />
            </div>
            <div v-else-if="step === 2">
                <UInput v-model="form.password" type="password" placeholder="Senha" size="lg" class="w-full mb-4"
                    @keyup.enter="submitLogin" autofocus />
            </div>

            <div v-if="error" class="text-red-600 mb-4 text-sm md:text-base">{{ error }}</div>

            <div class="flex flex-col md:flex-row gap-2 justify-between">
                <UButton v-if="step > 0" color="gray" variant="soft" class="w-full md:w-auto" @click="prevStep">Voltar
                </UButton>
                <div class="flex-1 hidden md:block"></div>
                <UButton v-if="step < 2" color="primary" class="w-full md:w-auto" @click="nextStep">Próximo</UButton>
                <UButton v-else color="primary" class="w-full md:w-auto" :loading="loading" @click="submitLogin">Entrar
                </UButton>
            </div>
        </div>
    </div>
</template>