<script setup lang="ts">
import { DataTable, booleanFilter, buildTableSchema, timeRangeFilter } from '@chronicstone/vue-sweettools'

async function loadData() {
  await new Promise(resolve => setTimeout(resolve, 200))
  const items = Array.from({ length: 2 }, (_, i) => ({
    id: i,
    name: `name ${i}`,
    age: Math.floor(Math.random() * 100),
    address: `address ${i}`,
    active: Math.random() > 0.5,
    user: { id: i, name: `name ${i}` },
    productLine: i === 0 ? [{ productLine: 'Adult', id: i }, { productLine: 'Children', id: i }] : [{ id: i }],
    date: new Date().toISOString(),

  }))

  console.info('items', items)
  return items
}

const schema = buildTableSchema({
  rowIdKey: 'id',
  tableKey: 'table1',
  persistency: 'localStorage',
  remote: false,
  datasource: loadData,
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
  filters: [booleanFilter({ key: 'active', label: 'Active' }), timeRangeFilter({ key: 'date', label: 'Date' })],
  searchQuery: ['name'],
  columns: [
    { label: 'ID', key: 'id' },
    { label: 'Name', key: 'name' },
    { label: 'Active', key: 'active', render: rowData => rowData.active ? 'Yes' : 'No' },
    { label: 'Age', key: 'age' },
    { label: 'Address', key: 'address' },
  ],
  rowActions: [
    { label: 'Test', icon: 'mdi:eye' },
    // { label: 'Test', icon: 'mdi:pen' },

  ],
})
</script>

<template>
  <div style="padding: 2em;">
    <div class="flex items-center gap-2">
      <NuxtLink to="/datalist">
        DATALIST
      </NuxtLink>
    </div>
    <DataTable v-bind="schema">
      Test table
    </DataTable>
  </div>
</template>
