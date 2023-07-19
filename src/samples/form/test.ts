const variant1 = buildMultiFieldSchema([
  {
    label: "Variant 1 field 1",
    key: "variant1Field1",
    type: "text",
  },
]);

const variant2 = buildMultiFieldSchema([
  {
    label: "Variant 2 field 2",
    key: "variant2Field1",
    type: "text",
    required: true,
  },
  {
    label: "Select",
    key: "variant2Field2",
    type: "select",
    options: [...(["test", "haha"] as const)],
  },
]);

const { sample, formData } = defineFormSchemaSample({
  title: "Testing sample",
  data: {},
  schema: {
    fieldSize: 8,
    gridSize: 8,
    fields: [
      {
        label: "Variant array",
        key: "variantArray",
        type: "array-variant",
        displayMode: "tabs",
        variantKey: "variant",
        variants: [
          {
            label: "Variant 1",
            key: "variant1",
            fields: variant1,
          },
          {
            label: "Variant 2",
            key: "variant2",
            fields: variant2,
          },
        ],
      },
    ],
  },
});

export default { sample };
