<template>
    <UApp>
        <ThemeProvider>
            <NuxtLayout>
                <NuxtLoadingIndicator color="#348feb" />
                <NuxtPage />
            </NuxtLayout>
        </ThemeProvider>
    </UApp>
</template>

<script setup lang="ts">
useHead({
    link: [
        { rel: "icon", type: "image/png", href: "/favicon-96x96.png", sizes: "96x96" },
        { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
        { rel: "shortcut icon", href: "/favicon.ico" },
        { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
        { rel: "manifest", href: "/site.webmanifest" }
    ],
    meta: [
        { name: "apple-mobile-web-app-title", content: "Suave" }
    ]
});
</script>
