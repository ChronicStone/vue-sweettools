<script setup lang="ts">
import { DataTable, booleanFilter, buildTableSchema } from '@chronicstone/vue-sweettools'

async function loadData() {
  await new Promise(resolve => setTimeout(resolve, 200))
  return Array.from({ length: 200 }, (_, i) => ({
    id: i,
    name: `name ${i}`,
    age: Math.floor(Math.random() * 100),
    address: `address ${i}`,
    active: Math.random() > 0.5,
  }))
}

const schema = buildTableSchema({
  rowIdKey: 'id',
  tableKey: 'table1',
  persistency: 'localStorage',
  remote: false,
  datasource: loadData,
  filters: [booleanFilter({ key: 'active', label: 'Active' })],
  searchQuery: ['name'],
  columns: [
    { label: 'ID', key: 'id' },
    { label: 'Name', key: 'name' },
    { label: 'Active', key: 'active', render: rowData => rowData.active ? 'Yes' : 'No' },
    { label: 'Age', key: 'age' },
    { label: 'Address', key: 'address' },
    { label: 'Address', key: 'address' },
    { label: 'Address', key: 'address' },
    { label: 'Address', key: 'address' },
    { label: 'Address', key: 'address' },
    { label: 'Address', key: 'address' },
    { label: 'Address', key: 'address' },
    { label: 'Address', key: 'address' },
    { label: 'Address', key: 'address' },
    { label: 'Address', key: 'address' },
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
