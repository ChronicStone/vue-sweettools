<script setup lang="tsx">
import DataTable from "@/components/DataTable/DataTable.vue";
import { ref } from "vue";
import { NCheckbox, NConfigProvider, darkTheme } from "naive-ui";
import { booleanFilter, textFilter } from "..";

const schema = buildTableSchema<{
  firstName: string;
  lastName: string;
  valid: boolean;
  user?: {
    test: string;
    haha: { hehe: string };
  } | null;
}>({
  tableKey: "someKey",
  persistency: "localStorage",
  remote: true,
  filters: [
    booleanFilter("valid", "Valid"),
    textFilter("firstName", "First name", "contains"),
  ],
  searchQuery: ["firstName", "lastName"],
  columns: [
    {
      label: "User",
      children: [
        {
          label: "First name",
          key: "firstName",
        },
        { label: "Last name", key: "lastName" },
      ],
    },
    {
      label: "Valid",
      key: "valid",
      render: (value) => value.toString(),
    },
  ],
  datasource: async (t) => {
    console.info("run resolver", t);
    await new Promise((r) => setTimeout(r, 2000));
    return {
      totalDocs: 5000,
      totalPages: 10,
      docs: Array.from({ length: 64 }, (_, i) => ({
        firstName: `First name ${i}`,
        lastName: `Last name ${i}`,
        valid: i % 2 === 0,
      })),
    };
  },
});

const dark = ref(false);
</script>

<template>
  <NConfigProvider
    :theme-overrides="dark ? DarkThemeOverrides : LightThemeOverrides"
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
