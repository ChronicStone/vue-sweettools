const sample = defineFormSchemaSample({
  title: "Basic multi-step form",
  description: "Example of a basic multi-step form",
  schema: {
    gridSize: 8,
    fieldSize: 8,
    overlayOpacity: 0.95,
    maxWidth: "700px",
    steps: [
      {
        icon: "mdi:plus",
        title: "User information",
        root: "userIdentity",
        fields: [
          { key: "firstName", type: "text", label: "Text", required: true },
          { key: "lastName", type: "text", label: "Text", required: true },
          { key: "email", type: "text", label: "Text", required: true },
        ],
      },
      {
        title: "Address",
        root: "userAddress",
        fields: [
          { key: "address", type: "text", label: "Text", required: true },
          { key: "city", type: "text", label: "Text", required: true },
          { key: "zipCode", type: "text", label: "Text", required: true },
          {
            key: "country",
            type: "select",
            label: "Text",
            required: true,
            options: [...(["France", "Belgium", "Germany", "Spain"] as const)],
          },
        ],
      },
      {
        title: "Organizations",
        fields: [
          {
            key: "organizations",
            type: "array-tabs",
            label: "Organizations",
            fields: [
              { key: "name", type: "text", label: "Text", required: true },
              {
                key: "address",
                type: "text",
                label: "Text",
                required: true,
              },
              { key: "city", type: "text", label: "Text", required: true },
              {
                key: "zipCode",
                type: "text",
                label: "Text",
                required: true,
              },
              {
                key: "country",
                type: "select",
                label: "Text",
                required: true,
                options: [
                  ...(["France", "Belgium", "Germany", "Spain"] as const),
                ],
              },
            ],
          },
        ],
      },
      {
        fields: [
          {
            key: "acceptsCGU",
            type: "checkbox",
            label: "Text",
            required: true,
          },
          {
            key: "acceptsNewsletter",
            type: "checkbox",
            label: "Text",
            required: true,
          },
        ],
      },
    ],
  },
});

export default sample;
