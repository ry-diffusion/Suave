<template>
    <div class="min-h-screen p-4 sm:p-6 lg:p-8">
        <div class="max-w-7xl mx-auto space-y-8">
            <!-- Welcome Section -->
            <div class="glass-card rounded-3xl p-8 sm:p-10 text-center">
                <h1 class="text-4xl font-bangers bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent mb-4">
                    Bem vindo ao Suave
                </h1>
                <h2 class="text-md text-gray-600 dark:text-gray-400 mb-6">
                    Você precisa estar autenticado para continuar
                </h2>
                <UButton to="/login" size="xl">Entrar</UButton>
            </div>

            <!-- Acesso rápido -->
            <div>
                <h2 class="text-2xl font-bold mb-4 text-center">Acesso Rápido</h2>
                <HomeQuickAccess />
            </div>

            <!-- Notícias IF -->
            <div class="flex justify-center">
                <HomeNewsSection />
            </div>
        </div>
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
