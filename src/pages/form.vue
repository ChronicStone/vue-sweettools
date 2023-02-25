<script setup lang="ts">
import FormRenderer from "@/components/Form/Renderer/FormRenderer.vue";
import { FormSchema } from "@/types/form/form";
import { FormRefInstance } from "@/types/form/instance";
import { NButton } from "naive-ui";

const schema: FormSchema = {
  fields: [
    {
      label: `Field 1`,
      key: `field1`,
      type: "text",
      required: true,
      size: "8 md:4",
    },
    {
      label: `Field 2`,
      key: `field2`,
      type: "text",
      required: true,
      size: "8 md:4",
    },
  ],
};

const formRef = ref<FormRefInstance>();
const { formData, validate } = useForm(formRef, schema);
</script>

<template>
  <div class="p-32 flex flex-col gap-4">
    <FormRenderer ref="formRef" :schema="schema"> </FormRenderer>
    <NButton @click="validate">SUBMIT</NButton>

    <div>
      <pre>
        {{ formData }}
        {{ formRef }}
      </pre>
    </div>
  </div>
</template>
