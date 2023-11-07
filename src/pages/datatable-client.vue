<script setup lang="tsx">
import DataTable from "@/components/DataTable/DataTable.vue";
import { ref } from "vue";
import { NCheckbox, NConfigProvider, darkTheme } from "naive-ui";
import { booleanFilter, textFilter } from "..";

const schema = buildTableSchema({
  // tableKey: "someKey",
  // persistency: "localStorage",
  remote: true,
  // filters: [
  //   booleanFilter("valid", "Valid"),
  //   textFilter("firstName", "First name", "contains"),
  // ],
  searchQuery: ["firstName", "param.some.nested.value"],
  // searchQuery: ["firstName", "lastName"],
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
  datasource: () => ({
    docs: Array.from({ length: 64 }, (_, i) => ({
      firstName: `First name ${i}`,
      lastName: `Last name ${i}`,
      valid: i % 2 === 0,
      ...(i % 2 === 0
        ? {
            someProp: `Some prop ${i}`,
            param: { some: { nested: { value: i } } },
          }
        : {}),
    })),
    totalDocs: 64,
    totalPages: 1,
  }),
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
