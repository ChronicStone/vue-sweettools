<script setup lang="ts">
import { NCard, useMessage } from "naive-ui";
import ExcelReader from "@/components/ExcelReader/ExcelReader.vue";

const readerRef = ref<InstanceType<typeof ExcelReader>>();
const { validRows, invalidRows, exportInvalidRows } = useExcelReader(
  readerRef,
  candidateImportSchema()
);

function importCandidates() {
  //   if (!validRows.value.length) messageApi.error("No valid rows available");
  try {
    console.log(validRows.value[0]?.gender);
  } catch (err) {
    console.error(err);
  }
}

function candidateImportSchema() {
  return buildExcelSchema([
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
        enum2: ["haha"],
        enum: ["male", "female", "other"] as Array<"male" | "female">,
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
    {
      key: "address2",
      label: "Address 2",
      validation: { required: false },
      format: { trim: true },
      example: "Bat. B",
    },
    {
      key: "zipCode",
      label: "ZIP Code",
      validation: { required: false },
      format: { trim: true },
      example: "75008",
    },
    {
      key: "city",
      label: "City",
      validation: { required: false },
      format: { trim: true, uppercase: true },
      example: "PARIS",
    },
    {
      key: "nationality",
      label: "Nationality",
      validation: { required: false },
      format: { trim: true },
      example: "French",
    },
  ]);
}
</script>

<template>
  <div class="p-12">
    <NCard>
      <ExcelReader
        ref="readerRef"
        title="Import candidates"
        :schema="candidateImportSchema()"
      >
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

          <NButton
            secondary
            type="primary"
            :disabled="!validRows.length"
            @click="importCandidates"
          >
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
  </div>
</template>
