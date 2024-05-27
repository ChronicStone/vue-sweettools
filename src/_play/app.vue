<script setup lang="ts">
import {
  NConfigProvider,
  NDialogProvider,
  NNotificationProvider,
  darkTheme,
} from 'naive-ui'
import { DarkThemeOverrides, LightThemeOverrides } from './config/themeOverrides'
import AppProvider from './appProvider.vue'
import { useDarkMode } from './composables/useDarkMode'
import { FormProvider } from '@/index'

const { isDark } = useDarkMode()
</script>

<template>
  <div :class="isDark ? 'dark' : ''">
    <NConfigProvider
      :theme-overrides="isDark ? DarkThemeOverrides : LightThemeOverrides"
      :theme="isDark ? darkTheme : null"
    >
      <NNotificationProvider>
        <FormProvider>
          <NDialogProvider>
            <AppProvider />
          </NDialogProvider>
        </FormProvider>
      </NNotificationProvider>
    </NConfigProvider>
  </div>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap");
</style>
