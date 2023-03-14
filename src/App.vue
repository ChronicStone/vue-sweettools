<script setup lang="ts">
import FormProvider from "@chronicstone/vue-sweetforms/src/components/FormProvider.vue";
import { NDialogProvider, NConfigProvider } from "naive-ui";
import { RouterView } from "vue-router";
</script>

<template>
  <NConfigProvider :theme-overrides="themeOverrides">
    <FormProvider>
      <NDialogProvider>
        <router-view />
      </NDialogProvider>
    </FormProvider>
  </NConfigProvider>
</template>
