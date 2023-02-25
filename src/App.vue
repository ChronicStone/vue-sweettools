<script setup lang="ts">
import { NDialogProvider } from "naive-ui";
import { RouterView } from "vue-router";
</script>

<template>
  <NDialogProvider>
    <router-view />
  </NDialogProvider>
</template>
