<script setup lang="ts">
import { NCard } from 'naive-ui'

const { frameless, compact, content } = definePropsRefs<{
  frameless: boolean
  compact: boolean
  content: 'card' | 'list'
}>()
</script>

<template>
  <div v-if="frameless" class="flex flex-col gap-6">
    <slot name="header" />
    <slot />
    <slot name="footer" />
  </div>

  <NCard
    v-else
    :content-style="{ padding: content === 'list' ? '1em' : 0 }"
    :header-style="{ ...(compact ? { padding: '1em' } : {}) }"
    :actions-style="{ ...(compact ? { padding: '0em' } : {}) }"
    :segmented="content === 'list'"
  >
    <template #header>
      <slot name="header" />
    </template>

    <slot />

    <template #action>
      <slot name="footer" />
    </template>
  </NCard>
</template>
