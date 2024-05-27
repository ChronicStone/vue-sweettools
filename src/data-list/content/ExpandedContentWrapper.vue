<script setup lang="ts">
import { NEl } from 'naive-ui'

const { scrollX, tableWidth } = useTableViewport()
</script>

<template>
  <NEl
    tag="div"
    class="p-[var(--n-td-padding)]"
    :style="{ width: '100%', maxWidth: `${tableWidth}px`, marginLeft: `${scrollX}px` }"
  >
    <slot />
  </NEl>
</template>
