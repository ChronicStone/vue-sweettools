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

<style>
@import url("https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap");
</style>
