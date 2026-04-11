<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useApp } from './composables/useApp'

useApp()
</script>

<template>
  <RouterView />
</template>
