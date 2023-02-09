<script setup lang="ts">
import { NInput } from "naive-ui";
import { ref } from "vue";

const emit = defineEmits<{ (e: "update:searchQuery", value: string): void }>();
const props = defineProps<{ searchQuery: string }>();

const localValue = ref<string>(props.searchQuery);
</script>

<template>
  <NInput
    v-model:value="localValue"
    clearable
    :placeholder="'Search value'"
    :on-change="() => emit('update:searchQuery', localValue)"
  />
</template>
