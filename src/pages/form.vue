<script setup lang="tsx">
import FormRenderer from "@/components/Form/Renderer/FormRenderer.vue";
import { FormRefInstance } from "@/types/form/instance";
import { NButton, NCard, NEl } from "naive-ui";

const formApi = useFormApi();

const schema = buildFormSchema({
  fields: [
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
          label: "Hello obj",
          type: "object",
          key: "obj",
          fields: [
            {
              label: "Text 1",
              type: "text",
              key: "text1",
              required: true,
              transform: (text) =>
                (text as string)?.toLocaleUpperCase?.()?.split("") ?? [],
            },
            {
              key: "?",
              label: "Button",
              type: "info",
              content: () => (
                <NButton onClick={() => createForm()}>OPEN NESTED FORM</NButton>
              ),
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
const { formData, validate, nextStep, previousStep } = useFormController(
  formRef,
  {
    steps: [
      {
        label: "STEP 1",
        fields: [
          {
            label: "Text 1",
            type: "text",
            key: "text1",
            required: true,
          },
        ],
      },
      {
        label: "STEP 2",
        fields: [
          {
            label: "Text 2",
            type: "text",
            key: "text2",
            required: true,
          },
        ],
      },
    ],
  }
);

async function submit() {
  const isValid = await validate();
  console.log({ isValid, data: formData.value });
}

async function createForm() {
  const { formData, isCompleted } = await formApi.createForm(steppedSchema, {
    obj: { text1: "HAHAHA" },
  });
}
</script>

<template>
  <NEl
    class="p-16 bg-[var(--primary-color)] min-w-screen min-h-screen h-full flex flex-col gap-10"
  >
    <!-- <NCard class="p-4">
      <div class="flex flex-col gap-4">
        <FormRenderer ref="formRef" :schema="schema" />
        <NButton type="primary" @click="submit">SUBMIT</NButton>
      </div>
    </NCard> -->

    <NCard class="p-4">
      <div class="flex flex-col gap-4">
        <FormRenderer ref="formRef" :schema="sharedDepsSchema" />
        <NButton type="primary" @click="submit">SUBMIT</NButton>
      </div>
    </NCard>

    <NCard class="p-4">
      <div class="flex flex-col gap-4">
        <FormRenderer ref="formRef" :schema="steppedSchema" />
        <NButton type="primary" @click="previousStep">PREV</NButton>
        <NButton type="primary" @click="nextStep">NEXT</NButton>
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
