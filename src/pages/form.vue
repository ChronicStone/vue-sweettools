<script setup lang="tsx">
import FormRenderer from "@/components/Form/Renderer/FormRenderer.vue";
import { FormRefInstance } from "@/types/form/instance";
import { NButton, NCard, NEl } from "naive-ui";

const formApi = useFormApi();

const options = [1, "hahaa"];

const _schema = (mode: true | false) =>
  buildFormSchema({
    title: "This is title",
    fields: [
      {
        label: "Assign on creation",
        key: "testStatus",
        type: "checkbox",
        default: "Assigned",
        fieldParams: { uncheckedValue: "Created", checkedValue: "Assigned" },
      },
      {
        label: "Assign on creation",
        key: "test",
        type: "select",
        multiple: true,
        options: async () => options,
      },
      {
        label: "hi",
        key: "hi",
        type: "text",
        transform: (value) => {
          console.log("text", value);
          return "hi";
        },
      },
      { label: "ho", key: "ho", type: "text", condition: () => mode === true },
      {
        label: "Due date / deadline",
        key: "expectedDueDate",
        type: "date",
        required: true,
        transform: (value) => {
          console.log("dueDate", value);
          return new Date(value).toISOString();
        },
        // fieldParams: {
        //   dateDisabled: (v) => dayjs(v).valueOf() < Date.now(),
        // },
      },
    ],
  });

const schema = buildFormSchema({
  fields: [
    {
      label: "Gender",
      key: "gender",
      type: "radio",
      size: "8",
      options: ["male", "female", "other"],
      required: true,
    },
    {
      label: "Exam",
      key: "examId",
      type: "tree-select",
      required: true,
      options: [],
      fieldParams: {
        cascade: true,
        checkStrategy: "child",
        showPath: false,
      },
      watch: async (value) => {
        console.log("exam changed", value);
      },
    },
    {
      label: "Administration mode",
      key: "proctoringType",
      type: "select",
      required: true,
      options: [],
      default: "general",
      watch(value, { setValue }) {
        if (["online", "onsite"].includes(value as string))
          setValue("pause", false);
      },
    },
    {
      label: "On-site session",
      key: "onSiteSessionId",
      type: "select",
      options: [],
      required: true,
      dependencies: ["proctoringType", "quantity"],
      condition: (dependencies) => {
        return (dependencies?.proctoringType ?? "") === "onsite";
      },
      size: "8",
    },
    {
      label: "Date mode",
      key: "dateMode",
      type: "select",
      required: true,
      options: [],
      default: "dueDate",
    },
    {
      label: "Due date / deadline",
      key: "expectedDueDate",
      type: "date",
      required: true,
    },
    {
      label: "Batch",
      key: "batchId",
      type: "select",
      options: [],
      size: 8,
    },
  ],
});

const steppedSchema = buildFormSchema({
  sharedStore: {
    someStoreProp: {
      value: () => [],
    },
  },
  steps: [
    {
      icon: "mdi:user",
      title: "A very long step title dkzqdkz qkdqz",
      fields: [
        {
          label: "Text 1",
          type: "text",
          key: "text1",
          required: true,
          default: "+",
          fieldParams: {
            mask: {
              mask: "+971-5#-###-####",
              eager: true,
            },
          },
        },
        {
          key: "?",
          label: "Button",
          type: "info",
          content: () => (
            <NButton onClick={() => createForm()}>OPEN NESTED FORM</NButton>
          ),
          virtualDependencies: ["haha"],
        },
        {
          size: 8,
          label: "Group fields",
          type: "group",
          key: "group",
          transform: (value: any) => `${value?.hi} ${value?.hi2}`,
          fields: [
            {
              type: "text",
              key: "hi",
              size: "120px",
              fieldParams: () => ({}),
            },
            {
              type: "text",
              key: "hi2",
            },
          ],
        },
      ],
    },
    {
      title: "STEP 2",
      fields: [
        {
          label: "Text 2",
          type: "text",
          key: "text2",
          required: true,
        },
      ],
    },
    {
      title: "STEP 3",
      fields: [
        {
          label: "Text 3",
          type: "text",
          key: "text3",
          required: true,
        },
      ],
    },
    {
      title: "STEP 4",
      fields: [
        {
          label: "Text 4",
          type: "text",
          key: "text4",
          required: true,
        },
      ],
    },
  ],
});

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

const formRef = ref<FormRefInstance>();
const {
  formData,
  validate,
  nextStep,
  previousStep,
  canTriggerNext,
  canTriggerPrevious,
} = useFormController(formRef, steppedSchema);

async function submit() {
  const isValid = await validate();
  console.log({ isValid, data: formData.value });
}

async function createForm() {
  const { formData, isCompleted } = await formApi.createForm(_schema(true), {
    obj: { text1: "HAHAHA" },
  });

  console.log("formdata", formData);
  formData.test.find((item) => item === 1);
}
</script>

<template>
  <NEl
    class="p-16 bg-[var(--primary-color)] min-w-screen min-h-screen h-full flex flex-col gap-10"
  >
    <NCard class="p-4">
      <div class="flex flex-col gap-4">
        <FormRenderer
          ref="formRef"
          :schema="schema"
          :data="{ gender: 'male' }"
        />
        <NButton type="primary" @click="submit">SUBMIT</NButton>
      </div>
    </NCard>

    <NCard class="p-4">
      <div class="flex flex-col gap-4">
        <FormRenderer ref="formRef" :schema="sharedDepsSchema" />
        <NButton type="primary" @click="submit">SUBMIT</NButton>
      </div>
    </NCard>

    <NCard class="p-4">
      <div class="flex flex-col gap-4">
        <FormRenderer ref="formRef" :schema="steppedSchema" />
        <div class="flex items-center gap-4 w-full">
          <NButton secondary type="primary" @click="previousStep">
            <template #icon>
              <mdi:chevron-left />
            </template>
            BACK
          </NButton>
          <NButton type="primary" icon-placement="right" @click="nextStep">
            <template #icon>
              <mdi:chevron-right />
            </template>
            NEXT
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
