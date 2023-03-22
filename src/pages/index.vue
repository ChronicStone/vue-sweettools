<script setup lang="ts">
import { NButton } from "naive-ui";
</script>

<template>
  <div class="h-screen w-screen grid place-items-center gap-4">
    <div class="flex gap-4 items-center">
      <NButton type="primary" @click="$router.push('/datatable')">
        DATA-TABLE SANDBOX
      </NButton>
      <NButton type="primary" @click="$router.push('/form')"
        >FORM SANDBOX</NButton
      >
      <NButton type="primary" @click="$router.push('/datagrid')"
        >DATAGRID SANDBOX</NButton
      >
      <NButton type="primary" @click="$router.push('/excelreader')"
        >EXCEL READER SANDBOX</NButton
      >
    </div>
  </div>
</template>
