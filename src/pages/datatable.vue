<script setup lang="tsx">
import {
  DataTableSchema,
  FetchParams,
  RemoteTableData,
  TableFilter,
} from "@/types/table";
import DataTable from "@/components/DataTable/DataTable.vue";
import { ref } from "vue";
import { NCheckbox, NConfigProvider, darkTheme, NSpin } from "naive-ui";
import axios from "axios";
import { GenericObject } from "@/types/utils";
import { timeRangeFilter } from "@/components/DataTable/filters";
import { Assessment, AssessmentStatus } from "./types";

const API_BASE_URL = "https://api.dev-vtest.com/api/v2";

const dark = ref<boolean>(true);
const jwtToken = ref<string>();

onMounted(() => authenticate());

async function authenticate() {
  const token = await axios
    .post<{ accessToken: string }>(`${API_BASE_URL}/auth/login`, {
      email: "cyprien@vtest.com",
      password: "Trunks99",
    })
    .then((res) => res.data.accessToken);

  if (token) {
    jwtToken.value = token;
  }
}

function loadAssessmentData(params: FetchParams) {
  return axios
    .post<RemoteTableData<Assessment>>(
      API_BASE_URL + "/assessment/list",
      params,
      {
        headers: {
          Authorization: `Bearer ${jwtToken.value}`,
          "Entity-Token": "00000005b272631cc2a3a8fd",
          "Entity-Type": "testCenter",
        },
      }
    )
    .then((res) => res.data);
}

function assessmentStatusFilter<K extends string>(key: K): TableFilter {
  return {
    key,
    label: "Assessment status",
    type: "select",
    options: Object.values(AssessmentStatus),
  };
}

function statusHistoryFilter<K extends string>(key: K): TableFilter {
  return {
    key,
    label: "Status history",
    matchMode: "objectStringMap",
    type: "array-list",
    size: 8,
    headerTemplate: (_: any, index: number) =>
      `Status ${index + 1}`.toUpperCase(),
    extraProperties: true,
    fields: [assessmentStatusFilter("status"), timeRangeFilter("date", "Date")],
    params: {
      stringMap: [
        "status",
        {
          propertyName: "date",
          matchMode: "between",
          params: { dateMode: true, parseArray: true },
        } as any,
      ],
      stringMapSeparator: ">>>",
      stringMapOperator: "OR",
    },
    preformat: (
      value: string[] | Array<{ status: string; date: [string, string] }>
    ) => {
      return value?.length
        ? value.map((item) =>
            typeof item === "string"
              ? {
                  status: item.split(">>>")?.[0],
                  date: item
                    .split(">>>")?.[1]
                    .split("|")
                    .map((date) => new Date(date).getTime()),
                }
              : item
          )
        : [];
    },
    transform: (value: Array<{ status: string; date: [string, string] }>) => {
      return value.map((item) =>
        Object.values(item)
          .map((item) => (Array.isArray(item) ? item.join("|") : item))
          .join(">>>")
      );
    },
  };
}
const showAll = ref<boolean>(false);
const schema = computed(() =>
  buildTableSchema<Assessment>({
    remote: true,
    staticFilters: showAll.value
      ? []
      : [
          {
            key: "firstName",
            matchMode: "contains",
            value: "Axel",
          },
        ],
    columns: [
      { label: "First name", key: "firstName", render: (value) => value + "!" },
      { label: "Last name", key: "lastName" },
    ],
    rowActions: [
      {
        tooltip: "Test",
        icon: "mdi:plus",
        condition: ({ rowData }) => !!rowData._id,
        action: ({ rowData }) => console.log(rowData),
      },
    ],
    filters: [statusHistoryFilter("statusHistory")],
    datasource: loadAssessmentData,
    optimizeQuery: [
      { field: "candidate" },
      { field: "secureCode" },
      { field: "testStatus" },
      { field: "proctoring.status" },
      { field: "testEndDate" },
      { field: "lastName" },
      { field: "firstName" },
      { field: "email" },
      { field: "proctoring.type" },
      { field: "exam.name", externalDocument: true },
      { field: "testCenter.name", externalDocument: true },
      { field: "candidate.candidateCustomerId", externalDocument: true },
      { field: "dateMode" },
      { field: "expectedDueDate" },
      { field: "scoreReport" },
      { field: "officialCertificate" },
      { field: "evidenceReport" },
      { field: "securityReport" },
      { field: "batch.label", externalDocument: true },
      { field: "customer.name", externalDocument: true },
      { field: "requireInterview" },
      { field: "onsiteSession.name", externalDocument: true },
      { field: "customer", externalDocument: true },
      { field: "customer.name", externalDocument: true },
      { field: "codeGeneratorGroupId" },
      { field: "createdAt" },
      { field: "affiliation" },
      { field: "statusHistory" },
      { field: "_id" },
      ...["scoreReport", "officialCertificate", "evidenceReport"].map(
        (certificate) => ({
          field: `exam.config.certificates.${certificate}.generate`,
          externalDocument: true,
        })
      ),
    ],
  })
);
</script>

<template>
  <NConfigProvider
    :theme-overrides="themeOverrides"
    :theme="dark ? darkTheme : null"
  >
    <div class="p-0 lg:p-10">
      <NCheckbox v-model:checked="dark">Dark ?</NCheckbox>
      <NCheckbox v-model:checked="showAll">Show all ?</NCheckbox>
      <DataTable v-if="jwtToken" v-bind="schema" :persistency="'localStorage'">
        Test table test
      </DataTable>
      <NSpin v-else />
    </div>
  </NConfigProvider>
</template>
