<script setup lang="ts">
import FormProvider from "@/components/Form/Provider/FormProvider.vue";
import {
  NDialogProvider,
  NConfigProvider,
  NNotificationProvider,
  darkTheme,
} from "naive-ui";
import { ComponentInternalInstance } from "vue";
import { RouterView } from "vue-router";

const { isDark } = useDarkMode();

const providerRef = ref<InstanceType<typeof FormProvider>>();
providerRef.value?.destroyAll();
</script>

<template>
  <NConfigProvider
    :theme-overrides="themeOverrides"
    :theme="isDark ? darkTheme : null"
  >
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
