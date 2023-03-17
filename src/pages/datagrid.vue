<script setup lang="tsx">
import DataGrid from "@/components/DataGrid/DataGrid.vue";
import { DataGridSchema } from "@/types/datagrid";
import { computed, ref } from "vue";
import { NCheckbox, NAvatar } from "naive-ui";

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
};

const dataGridSchema: DataGridSchema<User> = {
  virtualStore: {
    test: { value: "hola" },
  },
  fields: [
    {
      key: "fullName",
      fieldRowSize: "2",
      render: ({ store }) => <div>{store?.test}</div>,
    },
    { label: "First name", key: "firstName" },
    { label: "Last name", key: "lastName" },
    { label: "Email", key: "email" },
    { label: "Created at", key: "createdAt" },
    { label: "Updated at", key: "updatedAt" },
  ],
};

const data: User = {
  fullName: "test",
  _id: "kadz,dqz",
  firstName: "Cyprien",
  lastName: "THAO",
  email: "cyprienthao@gmail.com",
  progress: 29,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const enableData = ref<boolean>(false);
const user = computed(() => (enableData.value ? data : null));
</script>

<template>
  <div class="p-10 flex flex-col gap-4">
    <NCheckbox v-model:checked="enableData">Show data</NCheckbox>
    <DataGrid v-bind="dataGridSchema" :data="user" />
  </div>
</template>
