<template>
    <HomeLoggedInPage v-if="loggedIn" />
    <HomeGuestPage v-else />
</template>

<script setup lang="ts">
const { loggedIn } = useUserSession();
</script>
