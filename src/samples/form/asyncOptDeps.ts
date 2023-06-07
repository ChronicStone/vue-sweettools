import axios from "axios";

const sample = defineFormSchemaSample({
  title: "Field dependencies + async options",
  description:
    "This sample shows how to use async options with field dependencies & automatic options resolution.",
  schema: {
    title: "Field dependencies + async options",
    gridSize: 8,
    fieldSize: 8,
    maxWidth: "700px",
    fields: [
      {
        key: "dogBreed",
        type: "select",
        label: "Dog breed",
        placeholder: "Select a breed",
        options: async () =>
          await axios
            .get<{ message: Record<string, string[]> }>(
              "https://dog.ceo/api/breeds/list/all"
            )
            .then((res) => res.data)
            .then((data) => Object.keys(data.message) as string[]),
      },
      {
        key: "dogSubBreed",
        type: "select",
        label: "Dog sub-breed",
        placeholder: "Select a sub-breed",
        description:
          "This field depends on dogBreed. When DogBreen changes, the async function will be re-executed to get the updated options.",
        dependencies: ["dogBreed"],
        options: async ({ dogBreed }) => {
          return await axios
            .get<{ message: string[] }>(
              `https://dog.ceo/api/breed/${dogBreed}/list`
            )
            .then((res) => res.data.message);
        },
      },
    ],
  },
});

export default sample;
