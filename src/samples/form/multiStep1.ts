const { sample, formData } = defineFormSchemaSample({
  title: "Basic multi-step form",
  description: "Example of a basic multi-step form",
  schema: {
    gridSize: 8,
    fieldSize: "8 md:4",
    overlayOpacity: 0.95,
    maxWidth: "700px",
    steps: [
      {
        icon: "mdi:plus",
        title: "User information",
        root: "userIdentity",
        fields: [
          {
            key: "firstName",
            type: "text",
            label: "First name",
            required: true,
          },
          { key: "lastName", type: "text", label: "Last name", required: true },
          { key: "email", type: "text", label: "Email", required: true },
          {
            key: "birthDate",
            type: "date",
            label: "Birth date",
            required: true,
          },
        ],
      },
      {
        title: "Address",
        root: "userAddress",
        fields: [
          { key: "address", type: "text", label: "Address", required: true },
          { key: "city", type: "text", label: "City", required: true },
          { key: "zipCode", type: "text", label: "ZIP code", required: true },
          {
            key: "country",
            type: "select",
            label: "Country",
            required: true,
            options: [...(["France", "Belgium", "Germany", "Spain"] as const)],
          },
        ],
      },
      {
        title: "Organizations",
        fields: (["orgaList", "orgaTabs"] as const).map((key, index) => ({
          key,
          type: `array-${index === 0 ? "tabs" : "list"}`,
          label: `Organizations (${index === 0 ? "tabs" : "list"})`,
          size: 8,
          fields: [
            { key: "name", type: "text", label: "Org name", required: true },
            {
              key: "address",
              type: "text",
              label: "Text",
              required: true,
            },
            { key: "city", type: "text", label: "City", required: true },
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
        })),
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

export default { sample };
