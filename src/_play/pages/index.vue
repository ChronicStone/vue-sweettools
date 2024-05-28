<script setup lang="tsx">
import { NButton } from 'naive-ui'
import type { FetchParams } from '@/index'
import { DataTable, booleanFilter, buildTableSchema, timeRangeFilter } from '@/index'

function getRandomDate() {
  const now = new Date()
  const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
  return new Date(Math.random() * (oneYearAgo.getTime() - now.getTime()) + now.getTime()).toISOString()
}

// Date range between today & 1 year ago
function getDateRange(daysAgo: number) {
  return [new Date(new Date().getTime() - daysAgo * 24 * 60 * 60 * 1000), new Date()].map(d => d.toISOString())
}

async function loadData(params: FetchParams) {
  await new Promise(resolve => setTimeout(resolve, 200))
  const items = Array.from({ length: 1000 }, (_, i) => ({
    id: i,
    name: `name ${i}`,
    age: Math.floor(Math.random() * 100),
    status: Math.random() > 0.5 ? 'Active' : 'Inactive',
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
    createdAt: getRandomDate(),
  }))

  return items
}

const schema = buildTableSchema({
  tableKey: 'table1',
  persistency: 'localStorage',
  remote: false,
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
  quickFilters: [
    // {
    //   type: 'select-list',
    //   label: 'User',
    //   key: 'user.id',
    //   options: () => Array.from({ length: 10 }).map((_, i) => ({ label: `User ${i}`, value: i })),
    //   matchMode: 'equals',
    //   default: 1,
    // },
    {
      type: 'toggle-list',
      label: 'Other',
      key: 'createdAt',
      options: [{ label: 'Today', value: 1 }, { label: 'Last 7 days', value: 7 }, { label: 'Last 30 days', value: 30 }, { label: 'Last 60 days', value: 60 }],
      matchMode: 'between',
      params: { dateMode: true },
      multiple: false,
      transform: (v: number) => getDateRange(v),
    },
  ],
  actions: [
    {
      label: 'Group 1',
      children: [
        {
          label: 'Action 1',
          icon: 'mdi:eye',
        },
        {
          label: 'Action 2',
          icon: 'mdi:eye',
        },
        {
          label: 'Group 2',
          children: [
            {
              label: 'Action 1',
              icon: 'mdi:eye',
            },
            {
              label: 'Action 2',
              icon: 'mdi:eye',
            },
          ],
        },
      ],
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
