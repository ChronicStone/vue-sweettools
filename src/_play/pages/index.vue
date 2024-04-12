<script setup lang="tsx">
import { NButton } from 'naive-ui'
import { DataTable, booleanFilter, buildTableSchema, timeRangeFilter } from '@/index'
import type { FilterBuilderProperty } from '@/data-list/utils/filters'
import { propertyBuilderFilter } from '@/data-list/utils/filters'

type TableRow = Awaited< ReturnType<typeof loadData>>[number]

async function loadData() {
  await new Promise(resolve => setTimeout(resolve, 200))
  const items = Array.from({ length: 1000 }, (_, i) => ({
    id: i,
    name: `name ${i}`,
    age: Math.floor(Math.random() * 100),
    address: `address ${i}`,
    active: Math.random() > 0.5,
    user: { id: i, name: `name ${i}` },
    productLine: i === 0 ? [{ productLine: 'Adult', id: i }, { productLine: 'Children', id: i }] : [{ id: i }],
    date: new Date().toISOString(),
    balance: Math.floor(Math.random() * 1000),
    scores: {
      math: Math.floor(Math.random() * 100),
      english: Math.floor(Math.random() * 100),
      chinese: Math.floor(Math.random() * 100),
      other: Math.floor(Math.random() * 100),
    },
  }))

  return items
}

const schema = buildTableSchema({
  rowIdKey: 'id',
  tableKey: 'table1',
  persistency: 'localStorage',
  remote: false,
  draggable: true,
  datasource: loadData,
  maxHeight: '75vh',
  staticFilters: [
    // {
    //   key: 'productLine',
    //   matchMode: 'objectMatch',
    //   value: [{ productLine: 'Adult' }],
    //   params: {
    //     operator: 'OR',
    //     properties: [{ key: 'productLine', matchMode: 'equals' }],
    //   },
    //   arrayLookup: 'OR',
    // },
  ],
  filters: [
    booleanFilter({ key: 'active', label: 'Active' }),
    timeRangeFilter({ key: 'date', label: 'Date' }),
    propertyBuilderFilter({
      key: 'scores',
      operator: 'AND',
      properties: [
        ...(['math', 'english', 'chinese', 'other'] as const).map(subject => ({
          key: subject,
          label: subject,
          field: {
            type: 'slider',
            fieldParams: {
              min: 0,
              max: 100,
              step: 1,
            },
          },
        }) satisfies FilterBuilderProperty),
      ],
    }),
  ],
  searchQuery: ['name'],
  columns: [
    ...((['math', 'english', 'chinese', 'other'] as const).map(subject => ({
      label: subject,
      key: `scores.${subject}` as const,
      // MIN MAX AVG
      summary: [
        { value: (rows: TableRow[]) => `Min: ${Math.min(...rows.map(row => row.scores[subject]))}` },
        { value: (rows: TableRow[]) => `Max: ${Math.max(...rows.map(row => row.scores[subject]))}` },
        { value: (rows: TableRow[]) => `Avg: ${rows.reduce((acc, cur) => acc + cur.scores[subject], 0) / rows.length}` },
      ],
    }))),
    { label: 'ID', key: 'id', summary: [{ value: 'Total' }] },
    { label: 'Name', key: 'name', summary: [{ value: '21 233' }] },
    { label: 'Balance', key: 'balance', summary: [{ value: rows => rows.reduce((acc, cur) => acc + cur.balance, 0) }] },
    { label: 'Active', key: 'active', render: rowData => rowData.active ? 'Yes' : 'No' },
    { label: 'Age', key: 'age', summary: [{ value: () => <NButton>Hi</NButton> }] },
    { label: 'Address', key: 'address' },
  ],
  rowActions: [
    {
      label: 'Test',
      icon: 'mdi:eye',
    },
    {
      label: 'Test',
      icon: 'mdi:eye',
    },
  ],
  actions: [
    {
      label: 'Test',
      icon: 'mdi:eye',
    },
    {
      label: 'Test',
      icon: 'mdi:eye',
    },
    {
      label: 'Test',
      icon: 'mdi:eye',
    },
    {
      label: 'Test',
      icon: 'mdi:eye',
    },
    {
      label: 'Test',
      icon: 'mdi:eye',
    },
    {
      label: 'Test',
      icon: 'mdi:eye',
    },
    {
      label: 'Test',
      icon: 'mdi:eye',
    },
    {
      label: 'Test',
      icon: 'mdi:eye',
    },
  ],
})
</script>

<template>
  <div style="padding: 2em;">
    <div class="flex items-center gap-2">
      <RouterLink to="/datalist">
        DATALIST
      </RouterLink>
    </div>
    <DataTable v-bind="schema">
      Test table
    </DataTable>
  </div>
</template>
