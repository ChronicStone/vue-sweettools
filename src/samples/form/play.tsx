import TestInput from "@/components/Utils/TestInput.vue";

const { sample, formData } = defineFormSchemaSample({
  title: "Playground",
  data: {},
  schema: {
    gridSize: 8,
    fields: [
      {
        label: "Array list",
        type: "text",
        key: "text",
        required: true,
        size: 8,
      },
      {
        label: "Files",
        type: "upload",
        key: "upload",
        required: true,
        size: 8,
        multiple: true,
        fieldParams: {
          listType: "image-card",
        },
      },
    ],
  },
});

export default { sample };
