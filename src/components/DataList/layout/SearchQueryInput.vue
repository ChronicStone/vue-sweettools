<script setup lang="ts">
import { useTranslations } from "@/i18n/composables/useTranslations";
import { NInput } from "naive-ui";

const emit = defineEmits<{ (e: "update:searchQuery", value: string): void }>();
const props = defineProps<{ searchQuery: string }>();

const i18n = useTranslations();
const localValue = ref<string>(props.searchQuery);
</script>

<template>
  <NInput
    v-model:value="localValue"
    clearable
    :placeholder="i18n.t('datatable.searchQueryPlaceholder')"
    :on-change="() => emit('update:searchQuery', localValue)"
  />
</template>
