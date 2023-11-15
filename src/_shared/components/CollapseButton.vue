<script setup lang="ts">
const { modelValue: collapsed } = defineModels<{ modelValue: boolean }>()
</script>

<template>
  <div
    class="grid h-5 w-5 place-items-center bg-opacity-10 rounded-full group-hover:(bg-gray-500 bg-opacity-20)"
  >
    <mdi-chevron-right
      class="transition duration-150 ease-in-out transform cursor-pointer"
      :class="collapsed ? '' : 'rotate-90'"
    />
  </div>
</template>
