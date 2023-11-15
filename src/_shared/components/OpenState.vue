<script setup lang="ts">
const props = defineProps<{ default?: boolean }>()
const isOpen = ref<boolean>(props?.default ?? false)

const toggle = () => (isOpen.value = !isOpen.value)
function setValue(value: boolean) {
  isOpen.value = value
}
</script>

<template>
  <slot :is-open="isOpen" :toggle="toggle" :set-value="setValue" />
</template>
