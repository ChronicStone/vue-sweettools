<script setup lang="tsx">
import DataTable from "@/components/DataTable/DataTable.vue";
import { ref } from "vue";
import { NCheckbox, NConfigProvider, darkTheme } from "naive-ui";

const schema = buildTableSchema<{ firstName: string; lastName: string }>({
  remote: false,
  columns: [
    { label: "First name", key: "firstName" },
    { label: "Last name", key: "lastName" },
  ],
  datasource: async () =>
    Array.from({ length: 100 }, (_, i) => ({
      firstName: `First name ${i}`,
      lastName: `Last name ${i}`,
    })),
});

const dark = ref(false);
</script>

<template>
  <NConfigProvider
    :theme-overrides="themeOverrides"
    :theme="dark ? darkTheme : null"
  >
    <div class="p-0 lg:p-10">
      <NCheckbox v-model:checked="dark">Dark ?</NCheckbox>
      <DataTable v-bind="schema" :persistency="'localStorage'">
        Test table test
      </DataTable>
    </div>
  </NConfigProvider>
</template>
