import TestInput from "@/components/Utils/TestInput.vue";

const { sample, formData } = defineFormSchemaSample({
  title: "Playground",
  data: {
    invoiceDate: "2023-10-23T18:00:00.000Z",
  },
  schema: {
    gridSize: 8,
    fields: [
      // {
      //   label: "Text",
      //   type: "datetimerange",
      //   key: "date",
      // },
      // {
      //   label: "Array list",
      //   type: "text",
      //   key: "text",
      //   required: true,
      //   size: 8,
      // },
      // {
      //   label: "Files",
      //   type: "upload",
      //   key: "upload",
      //   required: true,
      //   size: 8,
      //   multiple: true,
      //   fieldParams: {
      //     listType: "image-card",
      //   },
      // },
      {
        label: "Invoice date",
        key: "invoiceDate",
        type: "select",
        options: () => ["value1", "value2", "value3"],
        required: true,
      },
      {
        label: "Invoice date",
        key: "invoiceDate2",
        type: "datetime",
        required: true,
        dependencies: ["invoiceDate"],
        onDependencyChange(deps, api) {
          const options = api.getOptions<number>("invoiceDate");
          console.log(options.map((o) => o.label));
        },
      },
    ],
  },
});

export default { sample };
