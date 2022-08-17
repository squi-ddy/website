<template>
    <v-app theme="dark">
        <v-app-bar app density="compact">
            <v-app-bar-title class="justify-center d-flex ma-0">
                {{ $route.name }}
            </v-app-bar-title>
        </v-app-bar>

        <v-main>
            <router-view />
        </v-main>
    </v-app>
</template>

<style lang="scss">
    @import "./assets/main";
</style>
