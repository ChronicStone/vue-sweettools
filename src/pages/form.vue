<script setup lang="ts">
import FormRenderer from "@/components/Form/Renderer/FormRenderer.vue";
import TestInput from "@/components/Utils/TestInput.vue";
import { FormSchema } from "@/types/form/form";
import { FormRefInstance } from "@/types/form/instance";
import { helpers, sameAs } from "@vuelidate/validators";
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
      dependencies: ["field1"],
      validators: (dependencies) => ({
        sameAs: helpers.withMessage(
          "Isn't the same as field 1",
          sameAs(dependencies?.field1)
        ),
      }),
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
      label: "Component custom",
      key: "custom",
      type: "custom-component",
      component: TestInput,
      required: true,
      description: "This is an extra descr",
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
      type: "array-list",
      key: "arrayTest",
      listGridSize: "2",
      listItemSize: "2 md:1",
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
        {
          label: "test 2",
          type: "text",
          key: "test3",
          dependencies: [["$parent.test2", "test2"]],
          condition: (dependencies) => {
            console.log({ dependencies });
            return dependencies?.test2 === "hehe";
          },
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
  arrayTest: Array.from({ length: 5 }, (_, index) => ({
    test2: `haha${index}`,
  })),
};

async function submit() {
  const isValid = await validate();
  console.log({ isValid });
}
</script>

<template>
  <NEl class="p-16 bg-[var(--primary-color)] min-w-screen min-h-screen h-full">
    <NCard class="p-4">
      <div class="flex flex-col gap-4">
        <FormRenderer ref="formRef" :schema="schema" :data="data">
        </FormRenderer>
        <NButton type="primary" @click="submit">SUBMIT</NButton>
      </div>
    </NCard>
  </NEl>
</template>
