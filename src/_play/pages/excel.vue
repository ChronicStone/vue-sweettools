<script setup lang="ts">
import { ExcelReader, buildExcelSchema, useExcelReader } from '@/index'

async function getItems() {
  return await Promise.resolve([
    {
      firstName: 'John',
      lastName: 'Doe',
      email: '',
      examDate: '2021-12-31',
    },
    {
      firstName: 'Jane',
      lastName: 'Doe',
      email: '',
      examDate: '2021-12-31',
    },
  ])
}

const schema = buildExcelSchema({
  fields: [
    {
      key: 'firstName',
      label: 'First Name',
      example: 'John',
      enum: () => getItems().then(items => items.map(item => item.firstName)).catch(() => [] as string[]),
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
      enum: ['Jakarta', 'Bandung', 'Surabaya'],
      example: 'Jakarta',
      required: true,
    },
    {
      key: 'examStatus',
      label: 'Exam Status',
      example: 'Passed',
      required: false,
    },
    {
      key: 'testTransfo',
      label: 'Test Transform',
      required: true,
      transform: (value) => {
        const val = (value?.toString() ?? '').split('|').map(v => v.trim()).map((v) => {
          const [key, value] = v.split(':')
          return { key, value }
        })
        return JSON.stringify(val)
      },
      example: 'firstName:Cyp | lastName:THAO',
    },
    {
      key: `affiliation:GROUP`,
      required: false,
      label: `Affiliation`,
      example: 'Item 1, Item 2',
      caseInsensitive: true,
      multiple: true,
      enum: ['Item 1', 'Item 2', 'Item 3'],
      format: ['trim' as const],
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
