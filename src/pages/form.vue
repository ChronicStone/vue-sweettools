<script setup lang="tsx">
import FormRenderer from "@/components/Form/Renderer/FormRenderer.vue";
import CollapseButton from "@/components/Utils/CollapseButton.vue";
import { buildFieldSchema } from "@/composables/form/useFormController";
import { FormRefInstance } from "@/types/form/instance";
import { helpers } from "@vuelidate/validators";
import { NButton, NCard, NEl, useNotification } from "naive-ui";

const formApi = useFormApi();
const notif = useNotification();

const fieldTest = buildFieldSchema({
  key: "objTestExt",
  type: "object",
  fields: [
    { key: "item1", type: "text" },
    { key: "item2", type: "select", options: [...(["haha", "he"] as const)] },
  ],
});

const sharedDepsSchema = buildFormSchema({
  sharedStore: [{ key: "haha", value: () => ["haha", "hoho"] as const }],
  fields: [
    {
      label: "First name",
      type: "text",
      required: true,
      key: "firstName",
      condition: () => true,
    },
  ],
});

const arraySchema = buildFormSchema({
  testId: "testForm",
  fields: [
    {
      key: "test",
      type: "group",
      label: "Group",
      fields: [
        {
          key: "countryCode",
          type: "select",
          options: [],
          size: "7.5rem",
        },
        {
          key: "phoneValue",
          type: "text",
          dependencies: [["$parent.countryCode", "countryCode"]],
          condition: (deps) => !!deps?.countryCode,
          conditionEffect: "disable",
        },
      ],
    },
    {
      label: "Checkgroup",
      key: "checkgroup",
      type: "checkbox-group",
      options: [
        { label: "haha", value: "haha" },
        { label: "hehe", value: "hehe" },
      ],
      size: 8,
      required: true,
    },
    {
      key: "items",
      label: "Items",
      type: "array-list",
      extraProperties: true,
      required: true,
      size: 8,
      gridSize: "1 md:2",
      fields: [
        {
          key: "label",
          label: "Label",
          type: "text",
          required: true,
          dependencies: ["items"],
          validators: ({ items }: { items: Array<{ label: string }> }) => ({
            uniqueLabel: helpers.withMessage(
              (params) => `The item "${params.$model}" already exists`,
              (value: string) => {
                if (!value) return true;
                return (
                  items
                    .map((item) => item.label.toLocaleLowerCase())
                    .filter(Boolean)
                    .filter((item) => item === value.toLocaleLowerCase())
                    .length < 2
                );
              }
            ),
          }),
          transform: (value: string) => value.trim(),
        },
      ],
      headerTemplate: (data, index) =>
        `ITEM ${index + 1}: ${data?.label || ""}`,
    },
  ],
});

const data = {
  items: [{ label: "haha", otherProp: "hehehey" }, { label: "jqzdkdzqkdqz" }],
};

const formRef = ref<FormRefInstance>();
// const { formData, validate } = useFormController(formRef, arraySchema);

async function submit() {
  const isValid = await validate();
  console.log({ isValid, data: formData.value });
}

const depsSchema = buildFormSchema({
  testId: "formDemo",
  title: "Hello test",
  fullScreen: "true",
  sharedStore: [
    { key: "options", value: () => ["haha", "hoho"] },
    { key: "options2", value: () => ["haha", "hoho"] },
    {
      key: "sync",
      dependencies: ["syncVal"],
      value: (deps: Record<string, unknown>) =>
        (deps?.syncVal ?? "N/A") as string,
    },
  ],
  fields: [
    {
      type: "text",
      key: "phone",
      label: "Phone nb",
      condition: () => false,
      required: true,
    },
    {
      key: "select",
      type: "select",
      options: ["haha", "hehe", 1] as const,
    },
    {
      type: "text",
      key: "phone2",
      label: "Phone nb",
      condition: () => [""].includes(""),
      conditionEffect: "disable",
      required: true,
    },
    {
      type: "text",
      key: "phone3",
      label: "Phone nb",
      condition: () => true,
      ignore: true,
    },
  ],
});

const { formData, validate } = useFormController(formRef, depsSchema);

async function createForm() {
  const { formData, isCompleted } = await formApi.createForm(
    {
      gridSize: 8,
      fieldSize: 8,
      overlayOpacity: 0.95,
      maxWidth: "700px",
      steps: [
        {
          icon: "mdi:plus",
          label: "Hello",
          root: "step1",
          fields: [
            { key: "text", type: "text", label: "Text", required: true },
          ],
        },
        {
          root: "step1",
          fields: [{ key: "text3", type: "text", label: "hi" }],
        },
        {
          root: "step2",
          fields: [{ type: "date", key: "date", label: "Hi", required: true }],
        },
        {
          fields: [{ key: "text3", type: "text", label: "hi", required: true }],
        },
      ],
    },
    {
      step1: {
        text: "qzdqzddzq",
        text3: "hiiii2",
      },
      step2: {
        date: 1688076000000,
      },
      text3: "dqzdzqdzqdzq",
    }
  );

  notif.create({
    content: JSON.stringify(formData, null, 4),
  });
}
</script>

<template>
  <NEl
    class="p-16 bg-[var(--primary-color)] min-w-screen min-h-screen h-full flex flex-col gap-10"
  >
    <NCard class="p-4">
      <div class="flex flex-col gap-4">
        <FormRenderer ref="formRef" :schema="arraySchema" />
        <div class="flex items-center gap-4 w-full">
          <NButton type="primary" icon-placement="right" @click="submit">
            <template #icon>
              <mdi:chevron-right />
            </template>
            SUBMIT
          </NButton>
        </div>
        <NDivider class="!m-0 !my-2" />
        <pre>
          {{ formData }}
        </pre>
      </div>
    </NCard>

    <NCard>
      <NButton @click="createForm">OPEN FORM</NButton>
    </NCard>
  </NEl>
</template>
