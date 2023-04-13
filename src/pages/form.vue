<script setup lang="tsx">
import FormRenderer from "@/components/Form/Renderer/FormRenderer.vue";
import { buildFieldSchema } from "@/composables/form/useFormController";
import { FormRefInstance } from "@/types/form/instance";
import { helpers } from "@vuelidate/validators";
import { NButton, NCard, NEl, SelectOption } from "naive-ui";

const formApi = useFormApi();

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
      label: "Due date / deadline",
      key: "expectedDueDate",
      type: "text",
      required: true,
      transform: (value) => {
        console.log("dueDate", value);
        return new Date(value?.toString?.() ?? "").toISOString();
      },
      // fieldParams: {
      //   dateDisabled: (v) => dayjs(v).valueOf() < Date.now(),
      // },
      condition: (data, data2) => data2?.haha.includes("haha") ?? false,
    },
    {
      label: "First name",
      type: "text",
      required: true,
      key: "firstName",
    },
    {
      label: "Last name",
      type: "text",
      required: true,
      key: "lastName",
      ignore: true,
    },
    {
      label: "Switch options",
      type: "checkbox",
      required: true,
      key: "isChecked",
      size: 8,
    },
    {
      label: "Select options",
      type: "select",
      required: true,
      key: "select",
      dependencies: ["isChecked"],
      options: (dependencies, virtualDeps) => {
        return dependencies?.isChecked
          ? virtualDeps?.toString?.()?.split("") ?? []
          : [];
      },
      size: 8,
    },
    {
      label: "Select 2",
      key: "test",
      type: "info",
      size: 8,
      content: (_, virtualDeps) => <div>{virtualDeps?.haha}</div>,
    },
  ],
});

const arraySchema = buildFormSchema({
  fields: [
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
  sharedStore: [
    { key: "options", value: () => ["haha", "hoho"] },
    { key: "options2", value: () => ["haha", "hoho"] },
    {
      key: "sync",
      dependencies: ["syncVal"],
      value: (deps: Record<string, unknown>) =>
        (deps?.syncVal ?? "N/A") as string,
    },
    // // {
    // //   key: "sync",
    // //   // dependencies: ["syncField"],
    // //   value: (deps) => deps?.syncField as string ?? "N/A",
    // // },
  ],
  fields: [
    {
      key: "select",
      type: "select",
      options: (_, { options }) => {
        console.log("refresh", options);
        return options ?? [];
      },
    },
    {
      key: "syncVal",
      type: "text",
    },
    {
      key: "info",
      type: "info",
      content: (_, deps) => `${deps?.sync ?? "N/A"} - ${JSON.stringify(deps)}`,
    },
    fieldTest,
  ],
});

const { formData, validate } = useFormController(formRef, depsSchema);

async function createForm() {
  const { formData, isCompleted } = await formApi.createForm(depsSchema);
}
</script>

<template>
  <NEl
    class="p-16 bg-[var(--primary-color)] min-w-screen min-h-screen h-full flex flex-col gap-10"
  >
    <NCard class="p-4">
      <div class="flex flex-col gap-4">
        <FormRenderer ref="formRef" :schema="depsSchema" />
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
