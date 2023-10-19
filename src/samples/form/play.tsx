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
        label: "Select",
        type: "select",
        options: () => [],
        key: "select",
        allowOptionsRefresh: true,
        createOption: async () => {
          await sleep(1000);
          return "New item " + Date.now();
        },
      },
    ],
  },
});

export default { sample };
