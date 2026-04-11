import type { UploadFileInfo } from "naive-ui";
import type { Component } from "vue";
import {
  buildFieldSchema,
  buildFormSchema,
  buildMultiFieldSchema,
} from "@/form/composables/useFormController";
import type { FormInferredData, FormSchema } from "@/form/types/form";

const textField = buildFieldSchema({
  type: "text",
  key: "name",
  fieldParams: {
    minLength: 2,
  },
});

const monthRangeField = buildFieldSchema({
  type: "monthrange",
  key: "period",
});

const uploadField = buildFieldSchema({
  type: "upload",
  key: "attachments",
  output: "object",
  multiple: true,
  uploadHandler: async () => {},
});

const optionsFields = buildMultiFieldSchema([
  {
    type: "select",
    key: "status",
    options: [
      { label: "Draft", value: "draft" as const },
      { label: "Published", value: "published" as const },
    ],
  },
  {
    type: "checkbox-group",
    key: "roles",
    options: [
      { label: "Admin", value: "admin" as const },
      { label: "User", value: "user" as const },
    ],
  },
] as const);

const customComponent = null as unknown as Component & {
  new (): {
    $props: {
      modelValue?: { id: string; label: string } | null;
    };
  };
};

const formSchema = buildFormSchema({
  fields: [
    textField,
    {
      type: "number",
      key: "count",
    },
    {
      type: "select",
      key: "status",
      options: [
        { label: "Draft", value: "draft" as const },
        { label: "Published", value: "published" as const },
      ],
      fieldParams: {
        renderLabel: (option, selected) => {
          return selected
            ? "group" in option
              ? String(option.label)
              : String(option.value)
            : "group" in option
              ? String(option.label)
              : String(option.value);
        },
      },
    },
    {
      type: "slider",
      key: "scoreRange",
      fieldParams: {
        range: true,
      },
    },
    {
      type: "date",
      key: "singleDate",
      transform: (value) => value ?? "",
    },
    monthRangeField,
    uploadField,
    {
      type: "custom-component",
      key: "customValue",
      component: customComponent,
      required: true,
    },
    {
      type: "object",
      key: "contact",
      fields: [
        {
          type: "text",
          key: "email",
        },
      ],
    },
    {
      type: "array-list",
      key: "items",
      virtualFields: {
        doubledIndex: (index) => index * 2,
      },
      fields: [
        {
          type: "text",
          key: "label",
        },
      ],
    },
  ],
} as const);

type OptionsFields = typeof optionsFields;
type Schema = typeof formSchema;
type InferFormData<TSchema extends FormSchema<any, any>> =
  TSchema extends FormSchema<infer TStepKey, infer TFieldKey>
    ? FormInferredData<TSchema, TStepKey, TFieldKey>
    : never;
type Inferred = InferFormData<Schema>;

const _textFieldWitness: "text" = textField.type;
const _monthRangeWitness: "monthrange" = monthRangeField.type;
const _uploadFieldWitness: "upload" = uploadField.type;
const _optionsFieldWitness: "select" | "checkbox-group" = optionsFields[0].type;

const _nameWitness: string = null as unknown as Inferred["name"];
const _countWitness: number = null as unknown as Inferred["count"];
const _statusWitness: "draft" | "published" =
  null as unknown as Inferred["status"];
const _scoreRangeWitness: [number, number] =
  null as unknown as Inferred["scoreRange"];
const _singleDateWitness: string = null as unknown as Inferred["singleDate"];
const _periodWitness: [string, string] = null as unknown as Inferred["period"];
const _attachmentsWitness: Array<{
  id: string;
  name: string;
  status: "error" | "pending" | "uploading" | "finished" | "removed";
}> = null as unknown as Inferred["attachments"];
const _customValueWitness: { id: string; label: string } =
  null as unknown as Inferred["customValue"];
const _contactWitness: { email: string } =
  null as unknown as Inferred["contact"];
const _itemWitness: { label: string; doubledIndex: number } =
  null as unknown as Inferred["items"][number];

type _OptionsFieldsWitness = OptionsFields[number]["key"];
