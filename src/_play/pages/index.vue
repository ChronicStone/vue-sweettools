<script setup lang="tsx">
import { NButton } from 'naive-ui'
import type { FetchParams } from '@/index'
import { DataTable, booleanFilter, buildTableSchema, timeRangeFilter } from '@/index'

async function loadData(params: FetchParams) {
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

  return {
    totalDocs: items.length,
    totalPages: Math.ceil(items.length / 10),
    docs: items,
  }
}

const schema = buildTableSchema({
  tableKey: 'table1',
  persistency: 'localStorage',
  remote: true,
  draggable: true,
  datasource: async param => await loadData(param),
  maxHeight: '75vh',
  staticFilters: [
  ],
  filters: [
    booleanFilter({ key: 'active', label: 'Active' }),
    timeRangeFilter({ key: 'date', label: 'Date' }),
  ],
  searchQuery: ['name'],
  expandedContent: (row) => {
    return (
      <div>
        Hi
      </div>
    )
  },
  columns: [
    ...((['math', 'english', 'chinese', 'other'] as const).map(subject => ({
      label: subject,
      key: `scores.${subject}` as const,
      // MIN MAX AVG
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
