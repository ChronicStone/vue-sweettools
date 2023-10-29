const { sample, formData } = defineFormSchemaSample({
  title: "Playground",
  data: {},
  schema: {
    gridSize: 8,
    fields: [
      {
        label: "Array list",
        type: "array-list",
        key: "arrayList",
        collapsible: false,
        compact: true,
        size: 8,
        fields: [
          {
            key: "firstName",
            label: "First Name",
            type: "text",
            required: true,
          },
          { key: "lastName", label: "Last Name", type: "text" },
        ],
      },
    ],
  },
});

export default { sample };
