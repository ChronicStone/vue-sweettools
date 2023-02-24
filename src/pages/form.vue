<script setup lang="ts">
import FormRenderer from "@/components/Form/Renderer/FormRenderer.vue";
import { FormSchema } from "@/types/form/form";

const schema: FormSchema = {
  fields: Array.from({ length: 1000 }, (_, index) => ({
    label: `Field ${index}`,
    key: `field${index}`,
    type: "text",
    required: true,
    dependencies: [`field${index - 1}`],
    condition: (dependencies) => {
      if (index < 5000) return true;
      return dependencies?.[`field${index - 1}`] === "haha";
    },
  })),
};
</script>

<template>
  <div class="p-32">
    <FormRenderer :schema="schema"> </FormRenderer>
  </div>
</template>
