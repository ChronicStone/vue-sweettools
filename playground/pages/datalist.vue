<script setup lang="tsx">
import { ref } from 'vue'
import {
  NAvatar,
  NButton,
  NCheckbox,
  NEl,
  NTag,
  useThemeVars,
} from 'naive-ui'
import { DataList, booleanFilter, buildListSchema } from '@chronicstone/vue-sweettools'

const firstNames = [
  'Cyprien',
  'Cyril',
  'Aurélien',
  'Baptiste',
  'Benoît',
  'Boris',
  'Brice',
  'Bruno',
  'Cédric',
  'Christophe',
  'Clément',
]

const lastNames = [
  'THAO',
  'LEMARCHAND',
  'LEMAIRE',
  'LEGRAND',
  'OLIVIER',
  'ROUSSEL',
  'ANDRE',
  'PREVOST',
]

const themeVars = useThemeVars()
const { isDark } = useDarkMode()
const schema = buildListSchema({
  remote: false,
  rowIdKey: 'id',
  persistency: false,
  filters: [booleanFilter({ key: 'valid', label: 'Is valid' })],
  searchQuery: ['firstName', 'lastName'],
  sortOptions: [
    { key: 'firstName', label: 'First name' },
    { key: 'lastName', label: 'Last name' },
    { key: 'valid', label: 'Valid' },
  ],
  rowActions: [{ label: 'Create', icon: 'mdi:plus', action: () => ({}) }],
  actions: [{ label: 'Create', icon: 'mdi:plus', action: () => ({}) }],
  title: ({ rowData }) => `${rowData.firstName} ${rowData.lastName}`,
  subtitle: ({ rowData }) => (
    <NTag round bordered={false} type={rowData.valid ? 'success' : 'error'}>
      {rowData.valid ? 'ACTIVE' : 'INACTIVE'}
    </NTag>
  ),
  image: ({ rowData }) => (
    <NAvatar round={false} size={80} src={rowData.avatar} />
  ),
  expandedContent: ({ rowData }) => (
    <pre>{JSON.stringify(rowData, null, 4)}</pre>
  ),
  description: ({ rowData }) => (
    <div class="flex items-center gap-2">
      <NTag type="warning">ADMIN</NTag>
      <NTag type="info">MANAGER</NTag>
    </div>
  ),
  datasource: async () => {
    const sleep = (ms: number) =>
      new Promise(resolve => setTimeout(resolve, ms))
    await sleep(1000)
    return Array.from({ length: 1000 }, (_, i) => ({
      firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
      lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
      valid: i % 2 === 0,
      id: i,
      // RANDOM AVATAR
      avatar: 'https://i.pravatar.cc/80',
    }))
  },
})
</script>

<template>
  <NEl tag="div" class="flex flex-col bg-[var(--body-color)]">
    <div class="flex items-center gap-2">
      <NCheckbox v-model:checked="isDark">
        Dark ?
      </NCheckbox>
      <NuxtLink to="/">
        DATATABLE
      </NuxtLink>
    </div>
    <div class="p-2 md:p-10">
      <NCard :content-style="{ padding: '0.2em' }" class="p-4">
        <DataList v-bind="schema" persistency="localStorage">
          <h1 class="text-xl font-bold">
            Users
          </h1>
        </DataList>
      </NCard>
    </div>
  </NEl>
</template>
