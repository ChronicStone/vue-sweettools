<script setup lang="tsx">
import DataGrid from "@/components/DataGrid/DataGrid.vue";
import { DataGridSchema } from "@/types/datagrid";
import { computed, ref } from "vue";
import { NCard, NCheckbox, NConfigProvider, darkTheme } from "naive-ui";

type User = {
  _id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  progress: number;
  createdAt: string;
  updatedAt: string;
  someProp?: {
    data: string;
    otherProp?: {
      value?: Array<{ test: string }>;
    };
  };
  valid: true;
};

const dark = ref<boolean>(true);
const dataGridSchema = buildGridSchema<User>({
  virtualStore: {
    test: { value: "hola" },
  },
  fields: [
    {
      key: "fullName",
      fieldRowSize: "2",
      render: ({ store }) => <div>{store?.test}</div>,
    },
    { label: (data) => <div>{data.firstName}</div>, key: "firstName" },
    { label: "Last name", key: "lastName" },
    { label: "Email", key: "email" },
    { label: "Created at", key: "createdAt" },
    {
      label: "Updated at",
      key: "valid",
      render: ({ value, store }) => (
        <span
          class={`iconify ${value ? "text-green-500" : "text-red-500"}`}
          data-icon={value ? "mdi:check" : "mdi:close"}
        />
      ),
    },
  ],
});

const data: User = {
  fullName: "test",
  _id: "kadz,dqz",
  firstName: "Cyprien",
  lastName: "THAO",
  email: "cyprienthao@gmail.com",
  progress: 29,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  valid: true,
};

const enableData = ref<boolean>(true);
const user = computed(() => (enableData.value ? data : null));
</script>

<template>
  <div class="flex flex-col gap-4 p-4">
    <NCheckbox v-model:checked="enableData">Show data</NCheckbox>
    <NCheckbox v-model:checked="dark">Dark mode</NCheckbox>

    <NConfigProvider :theme="dark ? darkTheme : null">
      <NCard class="p-10 flex flex-col gap-4">
        <DataGrid v-bind="dataGridSchema" :data="user" />
      </NCard>
    </NConfigProvider>
  </div>
</template>
