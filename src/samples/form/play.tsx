const { sample, formData } = defineFormSchemaSample({
  title: "Custom actions / Scoped APIs",
  data: {},
  schema: {
    fieldSize: 8,
    gridSize: 8,
    fields: [
      {
        label: "Select obj",
        type: "select",
        key: "select",
        options: () => [
          {
            label: "Item 1",
            value: { name: "Cyp", id: 1 },
          },
          {
            label: "Item 2",
            value: { name: "Alice", id: 2 },
          },
        ],
      },
    ],
  },
});

export default { sample };
