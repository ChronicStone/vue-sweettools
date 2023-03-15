<script setup lang="ts">
import { FormSchema } from "@/types/form/form";

const formStyles = useFormStyles();

const props = defineProps<{ schema: FormSchema }>();
const emit = defineEmits<{ (e: "close"): void }>();
</script>

<template>full</template>
