<script setup lang="ts">
import { NButton, NCard } from "naive-ui";
import ExcelReader from "@/components/ExcelReader/ExcelReader.vue";
const schema = buildExcelSchema([
  {
    key: "firstName",
    label: "First name",
    validation: { required: true },
    format: { trim: true },
    example: "JOHN",
  },
  {
    key: "lastName",
    label: "Last name",
    validation: { required: true },
    format: { trim: true, uppercase: true },
    example: "DOE",
  },
  {
    key: "otherName",
    label: "Last name",
    validation: { required: false },
    format: { trim: true },
    example: "POE",
  },
  {
    key: "email",
    label: "Email adress",
    validation: { required: true },
    format: { trim: true },
    example: "john.doe@mail.com",
  },
  {
    key: "gender",
    label: "Gender",
    validation: {
      required: true,
      enum: [...(["male", "female", "other"] as const)],
    },
    format: { trim: true, lowercase: true },
    example: "male",
  },
  {
    key: "country",
    label: "Country",
    validation: { required: true },
    format: { trim: true },
    example: "France",
  },
  {
    key: "candidateCustomerId",
    label: "Candidate customer ID",
    validation: { required: false },
    format: { trim: true },
    example: "23JDJ2ADDZD",
  },
  {
    key: "birthDate",
    label: "Birth date",
    validation: {
      required: false,
      rule: /^(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])-(\d{4})$/,
    },
    format: { trim: true },
    example: "05-30-1999",
  },
  {
    key: "mobilePhoneNumber",
    label: "Mobile phone number",
    validation: { required: false },
    format: { trim: true },
    example: "(+33)781338578",
  },
  {
    key: "otherPhoneNumber",
    label: "Other phone number",
    validation: { required: false },
    format: { trim: true },
    example: "(+33)781338578",
  },
  {
    key: "address",
    label: "Address",
    validation: { required: false },
    format: { trim: true },
    example: "55 avenue des Champs Elysées",
  },
]);

const readerRef = ref<InstanceType<typeof ExcelReader>>();
const { validRows, invalidRows, exportInvalidRows } = useExcelReader(
  readerRef,
  schema
);
</script>

<template>
  <NCard class="m-4">
    <ExcelReader ref="readerRef" :schema="schema">
      <template #actions>
        <NButton
          secondary
          type="error"
          :disabled="!invalidRows.length"
          @click="exportInvalidRows"
        >
          <template #icon>
            <NIcon>
              <mdi:export />
            </NIcon>
          </template>
          EXPORT INVALID
        </NButton>

        <NButton secondary type="primary" :disabled="!validRows.length">
          <template #icon>
            <NIcon>
              <mdi:import />
            </NIcon>
          </template>
          IMPORT VALID
        </NButton>
      </template>
    </ExcelReader>
  </NCard>
</template>
