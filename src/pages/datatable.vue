<script setup lang="tsx">
import { DataTableSchema } from "@/types/table";
import { generateUUID } from "@/utils/generateUUID";
import DataTable from "@/components/DataTable/DataTable.vue";
import { ref } from "vue";
import {
  GlobalThemeOverrides,
  NCheckbox,
  NConfigProvider,
  darkTheme,
  NProgress,
} from "naive-ui";

type User = {
  _id: string;
  firstName: string;
  lastName: string;
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

function generateRandomDate(): Date {
  const today = new Date();
  const yearAgo = new Date(
    today.getFullYear() - 1,
    today.getMonth(),
    today.getDate()
  );
  const randomTimestamp =
    yearAgo.getTime() + Math.random() * (today.getTime() - yearAgo.getTime());
  return new Date(randomTimestamp);
}

function generateRandomNumber(): number {
  return Math.floor(Math.random() * 100) + 1;
}

const schema: DataTableSchema<User> = {
  remote: true,
  tableKey: "test",
  searchQuery: ["firstName", "lastName", "email"],
  columns: [
    { label: "ID", key: "_id" },
    {
      label: "First name",
      key: "firstName",
    },
    { label: "Last name", key: "lastName" },
    {
      key: "progress",
      label: "Progress",
      render: (value: number) => <NProgress percentage={value} />,
    },
    { label: "Email", key: "email" },
    { label: "Created at", key: "createdAt" },
    { label: "Updated at", key: "updatedAt" },
  ],
  filters: [
    {
      label: "First name",
      type: "text",
      key: "firstName",
      matchMode: "contains",
      size: "8 md:4",
    },
    {
      label: "Last name",
      type: "select",
      key: "lastName",
      options: [{ label: "Lastname name 2", value: "Lastname name 2" }],
      matchMode: "arrayContains",
      size: "8 md:4",
    },
    {
      key: "createdAt",
      label: "Creation date",
      type: "daterange",
      transform: (value: any[]) => {
        return !Array.isArray(value) || value.some((value) => !value)
          ? null
          : value.map((date) => new Date(date).toISOString());
      },
      preformat: (value: any) =>
        value?.length ? value.map((date: string) => new Date(date)) : null,
      matchMode: "between",
      params: { dateMode: true },
    },
    {
      key: "progress",
      matchMode: "between",
      type: "slider",
      label: "Progress",
      fieldParams: {
        range: true,
        min: 0,
        max: 100,
      },
      default: [0, 100],
    },
  ],
  datasource: async () => {
    const docs = Array.from({ length: 500 }, (_, index) => ({
      _id: generateUUID(),
      firstName: `First name ${index}`,
      lastName: `Lastname name ${index}`,
      email: `user${index}@mail.com`,
      createdAt: generateRandomDate().toISOString(),
      updatedAt: generateRandomDate().toISOString(),
      progress: generateRandomNumber(),
    }));

    return {
      docs,
      totalDocs: 5000,
      totalPages: 10,
    };
  },
  actions: [
    {
      label: "Create user",
      icon: "mdi:user",
      action: ({ tableApi }) => tableApi.refreshData(),
    },
  ],
  rowActions: [
    {
      tooltip: "Hello",
      icon: "mdi:trash",
      link: (params) => "/test",
    },
    {
      tooltip: "Hello",
      icon: "mdi:trash",
      action: () => console.log("trigger"),
    },
    {
      tooltip: "Hello",
      icon: "mdi:trash",
      action: () => console.log("trigger"),
    },
    {
      tooltip: "Hello",
      icon: "mdi:trash",
      action: () => console.log("trigger"),
    },
  ],
};

const dark = ref<boolean>(true);
const themeOverrides: GlobalThemeOverrides = {
  common: {
    borderRadius: "6px",
    primaryColor: "#319795FF",
    primaryColorHover: "#3BB3B1FF",
    primaryColorPressed: "#2A807EFF",
    primaryColorSuppl: "#3B918FFF",
    heightTiny: "26px",
    heightSmall: "32px",
    heightMedium: "38px",
    heightLarge: "44px",
    heightHuge: "50px",
  },
  DataTable: {
    borderRadius: "6px",
  },
  Alert: {
    padding: "5px 8px",
  },
  Tag: {
    borderRadius: "6px",
  },
};
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
