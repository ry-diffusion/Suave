<script setup lang="ts">
interface Props {
    title?: string;
    showBack?: boolean;
    transparent?: boolean;
    largeTitle?: boolean;
}

defineProps<Props>();

const router = useRouter();

function goBack() {
    router.back();
}
</script>

<template>
    <div class="sticky top-0 z-50 px-4 py-3 h-16 flex flex-col justify-center" :class="[
        transparent
            ? ''
            : 'bg-white/75 dark:bg-gray-900/75 border-b border-gray-200 dark:border-gray-800 backdrop-blur-lg',
    ]">
        <div class="flex items-center h-10 relative">
            <!-- Back button -->
            <div class="absolute left-0">
                <transition name="fade" mode="out-in">
                    <button v-if="showBack" class="flex items-center text-primary-500 dark:text-primary-400 font-medium"
                        aria-label="Go back" @click="goBack">
                        <UIcon name="i-lucide-chevron-left" class="h-5 w-5 mr-1" />
                        <span>Voltar</span>
                    </button>
                </transition>
            </div>

            <!-- Title -->
            <transition name="fade" mode="out-in">
                <span v-if="largeTitle" class="text-3xl font-semibold absolute inset-x-0 text-center">
                    {{ title }}
                </span>

                <span v-else class="text-lg font-semibold flex-grow text-center mx-auto">
                    {{ title }}
                </span>
            </transition>
        </div>
    </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: all 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateX(-5px);
}

/* iOS-like animation for page transitions */
:deep(.page-enter-active),
:deep(.page-leave-active) {
    transition: all 0.3s ease-out;
}

:deep(.page-enter-from) {
    opacity: 0;
    transform: translateX(20px);
}

:deep(.page-leave-to) {
    opacity: 0;
    transform: translateX(-20px);
}
</style>
