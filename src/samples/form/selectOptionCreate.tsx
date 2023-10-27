import { helpers, minLength } from "@vuelidate/validators";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const options = [
  { label: "Item 1", value: generateUUID() },
  { label: "Item 2", value: generateUUID() },
  { label: "Item 3", value: generateUUID() },
];

async function addItem() {
  await sleep(1000);
  const newItem = {
    label: `Item ${options.length + 1}`,
    value: generateUUID(),
  };

  options.push(newItem);
  return newItem;
}

const { sample, formData } = defineFormSchemaSample({
  title: "Select item creation",
  data: {},
  schema: {
    fieldSize: 8,
    gridSize: 8,
    fields: [
      {
        key: "object",
        type: "object",
        label: "object",
        fields: [
          {
            label: "Select 1",
            type: "select",
            options: () => options,
            key: "select1",
            allowOptionsRefresh: true,
            createOption: {
              label: "Add item",
              handler: addItem,
              revalidateFieldOptions: ["$parent.select2"],
            },
          },
          {
            label: "Select 2",
            type: "select",
            options: () => options,
            key: "select2",
            allowOptionsRefresh: true,
            createOption: {
              label: "Add item",
              handler: addItem,
              revalidateFieldOptions: ["$parent.select1"],
            },
          },
        ],
      },
    ],
  },
});

export default { sample };
