<script setup lang="tsx">
import DataTable from "@/components/DataTable/DataTable.vue";
import { ref } from "vue";
import { NCheckbox, NConfigProvider, darkTheme } from "naive-ui";
import { booleanFilter } from "..";

const schema = buildTableSchema<{
  firstName: string;
  lastName: string;
  valid: boolean;
}>({
  tableKey: "someKey",
  persistency: "localStorage",
  remote: true,
  filters: [booleanFilter("valid", "Valid")],
  searchQuery: ["firstName", "lastName"],
  columns: [
    {
      label: "First name",
      key: "firstName",
    },
    { label: "Last name", key: "lastName" },
    {
      label: "Valid",
      key: "valid",
      render: (value) => value.toString(),
    },
  ],
  datasource: async (t) => {
    console.log("searchPareams", t);
    return Array.from({ length: 10 }, (_, i) => ({
      firstName: `First name ${i}`,
      lastName: `Last name ${i}`,
      valid: i % 2 === 0,
    }));
  },
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
