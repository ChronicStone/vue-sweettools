<script setup lang="ts">
import { Validation } from "@vuelidate/core";

const emit = defineEmits<{ (e: "update:modelValue", value: string): void }>();
const props = defineProps<{ modelValue: string; validator: Validation }>();

const modelValue = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

watch(
  () => modelValue.value,
  () => props.validator?.$touch()
);
</script>

<template>
  <input
    v-model="modelValue"
    class="p-2 border-4 border-solid w-full"
    :class="{ 'border-red-500': validator.$errors?.length }"
  />
</template>
