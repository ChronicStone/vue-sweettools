const { sample, formData } = defineFormSchemaSample({
  title: "Testing sample",
  data: {
    general: {
      locales: {
        default: "en_GB",
        options: ["en_GB", "fr_FR"],
      },
    },
  },
  schema: {
    fields: [
      {
        size: "8",
        key: "general",
        label: "GENERAL",
        type: "object",
        gridSize: "8",
        collapsed: true,
        description: `This section will allow you to control various aspects of the exam, such as logo, language, and time restriction.`,
        fields: [
          // {
          //   key: "logo",
          //   type: "custom-component",
          //   component: ImageUpload,
          //   label: "Exam logo",
          //   size: "8",
          //   fieldParams: {
          //     destination: "openExam/assets/logo",
          //   },
          //   transform: (value: string | object) => (typeof value === "string" ? value : ""),
          //   description:
          //     "This logo will be displayed on the top left of the candidate application, and on the certificates. If you don’t have a specific logo for your exam, please select the logo of your organization.",
          // },
          {
            // collapsed: true,
            key: "locales",
            type: "object",
            fieldParams: { frameless: true },
            size: "8",
            fields: [
              {
                key: "default",
                type: "select",
                label: "Default language (Candidate app)",
                // options: () => OpenExamController.getCandidateAppLocales(),
                options: () => {
                  console.log("options1");
                  return [];
                },
                size: "8 md:4",
                // description:
                //   "This field defines the language interface that will be displayed by default to the candidate.",
              },
              {
                key: "options",
                type: "select",
                label: "Default language (Candidate app)",
                // options: () => OpenExamController.getCandidateAppLocales(),
                options: () => {
                  console.log("options2");
                  return [];
                },
                size: "8 md:4",
                // description:
                //   "This field defines the language interface that will be displayed by default to the candidate.",
              },
              // {
              //   key: "options",
              //   type: "select",
              //   label: "Authorized languages (Candidate app)",
              //   // fieldParams: { multiple: true },
              //   options: () => OpenExamController.getCandidateAppLocales(),
              //   size: "8 md:4",
              //   dependencies: [],
              //   // description:
              //   //   "This field defines the languages interface that will also be available by the candidate.",
              // },
            ],
          },
        ],
      },
    ],
  },
});

export default { sample };
