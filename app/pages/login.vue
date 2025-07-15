<script setup lang="ts">
import { ref, reactive } from "vue";
import { useUserSession } from "#imports";
import { useRouter } from "vue-router";
import UISpinner from '~/components/UISpinner.vue';

definePageMeta({ layout: false });

const { fetch: refreshSession } = useUserSession();
const router = useRouter();

const step = ref(0);
const loading = ref(false);
const error = ref("");
const direction = ref<'left' | 'right'>('right');
const success = ref(false);

// Only one institution for now, but keep as array for future
const institutions = [
    { label: "IF Goiano - Presencial", value: "ifgoiano-presencial" },
];

const form = reactive({
    institution: "",
    username: "",
    password: "",
});

const steps = [
    {
        title: "Instituição",
        description: "Selecione a instituição",
        icon: "i-lucide-building",
    },
    {
        title: "Matrícula",
        description: "Informe sua matrícula",
        icon: "i-lucide-id-card",
    },
    { title: "Senha", description: "Informe sua senha", icon: "i-lucide-lock" },
];

async function submitLogin() {
    error.value = "";
    if (!form.password || form.password.length < 1) {
        error.value = "Campo obrigatório";
        return;
    }
    loading.value = true;
    try {
        await $fetch("/api/auth/signin", {
            method: "POST",
            body: {
                institution: form.institution,
                username: form.username,
                password: form.password,
            },
        });
        await refreshSession();
        success.value = true;
        setTimeout(() => {
            router.push("/");
        }, 2000);
    } catch (e: unknown) {
        if (
            typeof e === "object" &&
            e !== null &&
            "data" in e &&
            typeof (e as Record<string, unknown>).data === "object" &&
            (e as { data?: { message?: unknown } }).data?.message &&
            typeof (e as { data: { message: unknown } }).data.message ===
            "string"
        ) {
            error.value = (e as { data: { message: string } }).data.message;
        } else {
            error.value = "Credenciais inválidas";
        }
    } finally {
        loading.value = false;
    }
}

function nextStep() {
    if (step.value === 0 && !form.institution) {
        error.value = "Selecione a instituição.";
        return;
    }
    if (step.value === 1 && (!form.username || form.username.length < 1)) {
        error.value = "Campo obrigatório";
        return;
    }
    error.value = "";
    direction.value = 'right';
    step.value++;
}

function prevStep() {
    error.value = "";
    direction.value = 'left';
    step.value--;
}
</script>

<template>
    <div class="min-h-screen flex flex-col items-center justify-center px-4">
        <AnimatedBackground />

        <div class="w-full max-w-md mx-auto relative z-10">
            <h1 class="font-bangers text-5xl text-center mb-8 text-white drop-shadow-lg">
                Suave
            </h1>

            <div
                class="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl rounded-3xl shadow-xl p-4 md:p-6  flex flex-col justify-between min-h-[320px]">
                <Transition name="fade-scale" mode="out-in">
                    <div :key="success ? 'success' : loading ? 'loading' : 'form'"
                        :class="(loading || success) ? 'flex flex-1 items-center justify-center h-full' : 'flex flex-col h-full justify-between gap-8'">
                        <div v-if="loading" class="flex flex-col items-center">
                            <UISpinner :size="48" color="var(--color-primary)" class="mb-2" />
                            <span class="text-primary-500 font-medium mt-2">Entrando...</span>
                        </div>
                        <div v-else-if="success" class="flex flex-col items-center">
                            <Icon name="lucide:check-circle" size="3em" class="mb-2 text-green-500" />
                            <span class="text-green-500 font-medium mt-2">Sucesso!</span>
                        </div>
                        <template v-else>
                            <div>
                                <!-- Progress indicator -->
                                <div class="flex justify-center gap-1 mb-8 mt-1">
                                    <div v-for="(s, i) in steps" :key="i"
                                        class="w-2 h-2 rounded-full transition-all duration-300"
                                        :class="i === step ? 'bg-primary-500 w-4' : 'bg-neutral-300 dark:bg-neutral-600'">
                                    </div>
                                </div>

                                <!-- Step icon with direction-aware transition -->
                                <div class="flex flex-col items-center mb-1">
                                    <Transition :name="direction === 'right' ? 'slide-right' : 'slide-left'"
                                        mode="out-in">
                                        <Icon size="2.2em" :key="steps[step]?.icon"
                                            :name="steps[step]?.icon.replace('i-', '')" class="mb-1 text-primary-500" />
                                    </Transition>
                                </div>

                                <h2
                                    class="text-lg font-semibold text-center text-neutral-800 dark:text-neutral-200 mb-2">
                                    {{ steps[step]?.title }}
                                </h2>
                            </div>

                            <div class="flex-1 flex flex-col justify-center">
                                <div class="space-y-2">
                                    <div v-if="step === 0">
                                        <USelect v-model="form.institution" :items="institutions"
                                            placeholder="Selecione a instituição" size="lg" class="w-full" />
                                    </div>
                                    <div v-else-if="step === 1">
                                        <UInput v-model="form.username" placeholder="Matrícula" size="lg" class="w-full"
                                            autofocus />
                                    </div>
                                    <div v-else-if="step === 2">
                                        <UInput v-model="form.password" type="password" placeholder="Senha" size="lg"
                                            class="w-full" @keyup.enter="submitLogin" autofocus />
                                    </div>
                                </div>
                                <div v-if="error" class="text-red-500 text-sm text-center mt-2">
                                    {{ error }}
                                </div>
                            </div>

                            <div class="flex gap-2 pt-2 mt-4">
                                <UButton v-if="step > 0" color="neutral" variant="soft"
                                    class="flex-1 justify-center text-center" @click="prevStep">
                                    <template #leading>
                                        <Icon name="lucide:arrow-left" class="w-5 h-5" />
                                    </template>
                                    Voltar
                                </UButton>
                                <UButton v-if="step < 2" color="primary" class="flex-1 justify-center text-center"
                                    @click="nextStep">
                                    Próximo
                                    <template #trailing>
                                        <Icon name="lucide:arrow-right" class="w-5 h-5" />
                                    </template>
                                </UButton>
                                <UButton v-else color="primary" class="flex-1 justify-center text-center"
                                    :loading="loading" @click="submitLogin">
                                    <template #leading>
                                        <Icon name="lucide:log-in" class="w-5 h-5" />
                                    </template>
                                    Entrar
                                </UButton>
                            </div>
                        </template>
                    </div>
                </Transition>
            </div>
        </div>
    </div>
</template>

<style>
/* iOS-style smooth scrolling */
html {
    scroll-behavior: smooth;
}

/* iOS-style input focus */
input:focus,
select:focus {
    outline: none;
}

/* iOS-style button press effect */
button:active {
    transform: scale(0.98);
    transition: transform 0.1s;
}

/* Slide right (next) */
.slide-right-enter-active,
.slide-right-leave-active {
    transition: all 0.3s cubic-bezier(.4, 0, .2, 1);
}

.slide-right-enter-from {
    opacity: 0;
    transform: translateX(40px) scale(0.9);
}

.slide-right-leave-to {
    opacity: 0;
    transform: translateX(-40px) scale(0.9);
}

/* Slide left (back) */
.slide-left-enter-active,
.slide-left-leave-active {
    transition: all 0.3s cubic-bezier(.4, 0, .2, 1);
}

.slide-left-enter-from {
    opacity: 0;
    transform: translateX(-40px) scale(0.9);
}

.slide-left-leave-to {
    opacity: 0;
    transform: translateX(40px) scale(0.9);
}

.fade-scale-enter-active,
.fade-scale-leave-active {
    transition: all 0.25s cubic-bezier(.4, 0, .2, 1);
}

.fade-scale-enter-from,
.fade-scale-leave-to {
    opacity: 0;
    transform: scale(0.96);
}
</style>
