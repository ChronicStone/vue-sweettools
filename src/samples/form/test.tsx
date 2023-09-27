const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function resolveAsyncOptions() {
  // console.log("resolver running");
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
        label: "Test value",
        type: "group",
        key: "phoneNumber",
        fields: [
          {
            label: "Country code",
            key: "countryCode",
            type: "select", // SET REQUIRED ON CHILDREN
            options: ["Code 1", "Code 2"],
            size: "7.5rem",
          },
          {
            key: "phoneValue",
            type: "text",
            required: true, // SET REQUIRED ON CHILDREN
            conditionEffect: "disable",
            condition: (deps: any) => !!deps?.countryCode,
          },
        ],
        required: true, // STILL SET REQUIRED TO PARENT TO RENDER ASTERISK
      },
    ],
  },
});

export default { sample };
