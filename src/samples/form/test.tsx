const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function resolveAsyncOptions() {
  // console.log("resolver running");
  await sleep(500);
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
        label: "Test value",
        type: "text",
        key: "testVal",
        fieldParams: {
          mask: {
            mask: "#",
            tokens: {
              "#": { pattern: /^[a-zA-Z\s]*$/, repeated: true },
            },
          },
        },
      },
    ],
  },
});

export default { sample };
