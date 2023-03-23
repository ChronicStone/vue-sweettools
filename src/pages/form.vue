<script setup lang="tsx">
import FormRenderer from "@/components/Form/Renderer/FormRenderer.vue";
import { FormRefInstance } from "@/types/form/instance";
import { helpers } from "@vuelidate/validators";
import { NButton, NCard, NEl, SelectOption } from "naive-ui";

const formApi = useFormApi();

const sharedDepsSchema = buildFormSchema({
  sharedStore: {
    fullName: {
      dependencies: ["firstName", "lastName"],
      value: (dependencies: Record<string, unknown>) =>
        `${dependencies?.firstName} ${dependencies?.lastName}`,
    },
  },
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
      virtualDependencies: ["fullName"],
      options: (dependencies, virtualDeps) => {
        return dependencies?.isChecked
          ? virtualDeps?.fullName?.toString?.()?.split("") ?? []
          : [];
      },
      size: 8,
    },
    {
      label: "Select 2",
      key: "test",
      type: "info",
      size: 8,
      virtualDependencies: ["fullName"],
      content: (_, virtualDeps) => <div>{virtualDeps?.fullName}</div>,
    },
  ],
});

const arraySchema = buildFormSchema({
  gridSize: 1,
  fieldSize: 1,
  fields: [
    { type: "text", key: "name", label: "Name", required: true },
    {
      key: "items",
      label: "Items",
      type: "array-list",
      extraProperties: true,
      required: true,
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
          transform: (value: string) => value?.trim?.() ?? "",
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
const { formData, validate } = useFormController(formRef, arraySchema);

async function submit() {
  const isValid = await validate();
  console.log({ isValid, data: formData.value });
}

async function createForm() {
  const { formData, isCompleted } = await formApi.createForm(arraySchema, {
    obj: { text1: "HAHAHA" },
  });
}
</script>

<template>
  <NEl
    class="p-16 bg-[var(--primary-color)] min-w-screen min-h-screen h-full flex flex-col gap-10"
  >
    <NCard class="p-4">
      <div class="flex flex-col gap-4">
        <FormRenderer ref="formRef" :schema="arraySchema" :data="data" />
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
