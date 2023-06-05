<script setup lang="ts">
import FormProvider from "@/components/Form/Provider/FormProvider.vue";
import {
  NDialogProvider,
  NConfigProvider,
  NNotificationProvider,
} from "naive-ui";
import { RouterView } from "vue-router";
</script>

<template>
  <NConfigProvider :theme-overrides="themeOverrides">
    <NNotificationProvider>
      <FormProvider>
        <NDialogProvider>
          <router-view />
        </NDialogProvider>
      </FormProvider>
    </NNotificationProvider>
  </NConfigProvider>
</template>
