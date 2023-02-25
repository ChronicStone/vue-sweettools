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
    {
      label: "Select",
      key: "selectTest",
      type: "select",
      options: (dependencies: any) =>
        dependencies?.field1 ? [{ label: "hello", value: "hello" }] : [],
      dependencies: ["field1"],
      placeholder: "Hello test",
      required: true,
      size: 8,
    },
    {
      label: "Object",
      type: "object",
      key: "objectTest",
      size: 8,
      fields: [
        {
          label: "test",
          type: "text",
          key: "test1",
          required: true,
        },
        {
          label: "test 2",
          type: "text",
          key: "test2",
        },
      ],
    },
    {
      label: "Array test",
      type: "array",
      key: "objectTest",
      size: 8,
      fields: [
        {
          label: "test",
          type: "text",
          key: "test1",
          required: true,
        },
        {
          label: "test 2",
          type: "text",
          key: "test2",
        },
      ],
    },
  ],
};

const formRef = ref<FormRefInstance>();
const { formData, validate } = useForm(formRef, {
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
    {
      label: "Select",
      key: "selectTest",
      type: "select",
      fieldParams: {
        multiple: true,
      },
      options: (dependencies: any) =>
        dependencies?.field1 ? [{ label: "hello", value: "hello" }] : [],
      dependencies: ["field1"],
      placeholder: "Hello test",
      required: true,
      size: 8,
    },
  ],
});

const data = {
  field1: "haha",
  field2: "hoho",
  objectTest: {
    test2: "4231231",
  },
};
</script>

<template>
  <div class="p-32 flex flex-col gap-4">
    <FormRenderer ref="formRef" :schema="schema" :data="data"> </FormRenderer>
    <NButton type="primary" @click="validate">SUBMIT</NButton>

    <div>
      <pre>
        {{ formData }}
      </pre>
    </div>
  </div>
</template>
