<template>
    <div class="flex justify-center gap-4">
        <a href="https://suap.ifgoiano.edu.br?utm_source=Suave&utm_medium=acesso-rapido&utm_campaign=home"
            target="_blank" rel="noopener"
            class="glass-card flex flex-col items-center justify-center w-20 h-20 rounded-full font-semibold text-black dark:text-white hover:bg-primary-600 hover:border-2 hover:border-primary-500 hover:scale-105 transition-all duration-200 shadow-lg">
            <UIcon name="i-lucide-building" class="w-7 h-7 mb-1" />
            <span class="text-xs">SUAP</span>
        </a>
        <a href="https://presencial.ifgoiano.edu.br?utm_source=Suave&utm_medium=acesso-rapido&utm_campaign=home"
            target="_blank" rel="noopener"
            class="glass-card flex flex-col items-center justify-center w-20 h-20 rounded-full font-semibold text-black dark:text-white hover:bg-primary-600 hover:border-2 hover:border-primary-500 hover:scale-105 transition-all duration-200 shadow-lg">
            <UIcon name="i-lucide-book" class="w-7 h-7 mb-1" />
            <span class="text-xs">Moodle</span>
        </a>
        <a href="https://ifcronos.zesmoi.com.br?utm_source=Suave&utm_medium=acesso-rapido&utm_campaign=home"
            target="_blank" rel="noopener"
            class="glass-card flex flex-col items-center justify-center w-20 h-20 rounded-full font-semibold text-black dark:text-white hover:bg-primary-600 hover:border-2 hover:border-primary-500 hover:scale-105 transition-all duration-200 shadow-lg">
            <UIcon name="i-lucide-clock" class="w-7 h-7 mb-1" />
            <span class="text-xs">Horários</span>
        </a>
    </div>
</template>

<style scoped>
.glass-card {
    background: rgba(255, 255, 255, 0.7) !important;
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.2) !important;
    box-shadow:
        0 8px 32px 0 rgba(31, 38, 135, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.dark .glass-card {
    background: rgba(0, 0, 0, 0.3) !important;
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
    box-shadow:
        0 8px 32px 0 rgba(0, 0, 0, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.glass-card:hover {
    background: rgba(255, 255, 255, 0.8) !important;
}

.dark .glass-card:hover {
    background: rgba(0, 0, 0, 0.4) !important;
}
</style>
