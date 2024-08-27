<script setup>
import { RouterLink, RouterView } from 'vue-router'
import BHeader from './components/Bheader.vue'
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
