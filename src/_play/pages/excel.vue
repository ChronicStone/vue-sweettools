<script setup lang="ts">
import { ExcelReader, buildExcelSchema, useExcelReader } from '@/index'

const schema = buildExcelSchema({
  fields: [
    {
      key: 'firstName',
      label: 'First Name',
      example: 'John',
    },
    {
      key: 'lastName',
      label: 'Last Name',
      example: 'Doe',
    },
    {
      key: 'email',
      label: 'Email',
      example: 'john.doe@gmail.com',
    },
    {
      label: 'Exam Date',
      key: 'examDuration',
      transformKey: 'duration',
      example: '30:00',
    },
    {
      key: 'examDate',
      label: 'Exam Date',
      example: '2021-12-31',
      format: ['number'],
      transform: (value) => {
        return new Date(value as string).toISOString().split('T')[0]
      },
    },
    {
      key: 'examTime',
      label: 'Exam Time',
      example: '09:00',
    },
    {
      key: 'examDuration',
      label: 'Exam Duration',
      example: '30:00',
    },
    {
      key: 'examType',
      label: 'Exam Type',
      example: 'IELTS',
    },
    {
      key: 'examLocation',
      label: 'Exam Location',
      example: 'Jakarta',
    },
    {
      key: 'examStatus',
      label: 'Exam Status',
      example: 'Passed',
    },
  ],
})

const readerRef = ref<InstanceType<typeof ExcelReader>>()
const { validRows, invalidRows, exportInvalidRows } = useExcelReader(readerRef, schema)
</script>

<template>
  <NCard :segmented="{ content: true }" embedded>
    <template #header>
      <div class="font-medium text-xl flex items-center gap-2">
        <mdi:import />
        IMPORT ITEMS
      </div>
    </template>
    <ExcelReader ref="readerRef" title="Import candidates" v-bind="{ ...schema }">
      <template #actions>
        <NButton secondary type="error" :disabled="!invalidRows.length" @click="exportInvalidRows">
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
