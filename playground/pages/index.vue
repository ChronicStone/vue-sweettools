<script setup lang="ts">
import { DataTable, booleanFilter, buildTableSchema } from 'vue-sweettools'

function loadData() {
  return Array.from({ length: 1000 }, (_, i) => ({
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
    { label: 'Name', key: 'name',  },
    { label: 'Active', key: 'active', render: rowData => rowData.active ? 'Yes' : 'No' },
    {
      label: "Other",
      key: 'hey',
      children: [
        { label: 'Age', key: 'age' },
        { label: 'Address', key: 'address' },
      ]
    }
  ],
})
</script>

<template>
  <div style="padding: 2em;">
    <DataTable v-bind="schema">
      Test table
    </DataTable>
  </div>
</template>
