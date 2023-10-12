import { helpers, minLength } from "@vuelidate/validators";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function resolveAsyncOptions() {
  await sleep(3500);
  return Array.from({ length: 10 }).map((_, i) => `Item_${i}`);
}

const { sample, formData } = defineFormSchemaSample({
  title: "Testing sample",
  data: {},
  schema: {
    fieldSize: 8,
    gridSize: 8,
    fields: [
      {
        label: "Array reactive",
        type: "array-tabs",
        key: "array",
        actions: {
          moveDown: false,
          moveUp: false,
          deleteItem: (value) => Object.values(value).every((v) => !v),
          custom: [
            {
              label: "Custom action",
              icon: "mdi:plus",
              action: (api) => {
                api.setValue("$parent.0.item", "HAHAHA");
                nextTick(() =>
                  console.log("item", api.getValue("$parent.0.item2"))
                );
              },
            },
          ],
        },
        fields: [
          {
            label: "Item",
            type: "text",
            key: "item",
            watch(value, { setValue }) {
              setValue("$parent.item2", value);
            },
          },
          {
            label: "Item2",
            type: "text",
            key: "item2",
          },
          {
            label: "Item2",
            type: "select",
            key: "item3",
            dependencies: [["$parent.item", "item"]],
            options: (deps) => (deps.item ? ["1", "2", "3"] : []),
          },
        ],
      },
    ],
  },
});

export default { sample };
