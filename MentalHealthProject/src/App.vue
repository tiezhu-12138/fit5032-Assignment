<script setup>
import { RouterLink, RouterView } from 'vue-router'
import BHeader from './components/BHeader.vue'
</script>

<template>
  <header>
    <BHeader />
  </header>

  <main>
    <RouterView />
  </main>
</template>

<style scoped></style>
