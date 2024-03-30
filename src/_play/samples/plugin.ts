// import { Plugin } from "vite";
// import { IncomingMessage, ServerResponse } from "http";
// import { promises as fs } from "fs";
// import path from "path";
// import util from "util";

// interface FormSample {
//   sample: {
//     title: string;
//     description?: string;
//     schema: ReturnType<typeof defineFormSchemaSample>;
//   };
//   sampleCode: string;
// }

// async function resolveSample(filePath: string): Promise<FormSample> {
//   const fileContent = await fs.readFile(filePath, "utf-8");
//   const module = await import(filePath);
//   const { sample } = module.default;
//   const mappedSample = sample as FormSample["sample"];
//   return {
//     sample: mappedSample,
//     sampleCode: util.inspect(mappedSample.schema, { depth: null }),
//   };
// }

// export function sampleFormPlugin(): Plugin {
//   return {
//     name: "sample-form-plugin", // the name of the plugin
//     resolveId(id) {
//       if (id === "sample:form") {
//         return id; // the plugin takes responsibility for this id
//       }
//     },
//     async load(id) {
//       const dirPath = path.resolve(__dirname, "src/samples/form");
//       const generatedCode: FormSample[] = [];

//       if (id === "sample:form") {
//         const files = await fs.readdir(dirPath);

//         for (const file of files) {
//           const filePath = path.join(dirPath, file);
//           const stat = await fs.stat(filePath);
//           generatedCode.push(await resolveSample(filePath));
//         }

//         return "export default []"; // the content of the module
//       }
//     },
//   };
// }

// async function extractFormSamplesPlugin(): Promise<Plugin> {
//   const formSamplesDir = path.resolve(__dirname, "src/samples/form");
//   const generatedCode: FormSample[] = [];

//   async function processFile(filePath: string): Promise<void> {
//     const fileContent = await fs.readFile(filePath, "utf-8");
//     const module = await import(filePath);
//     const { sample } = module.default;
//     const mappedSample = sample as FormSample["sample"];
//     generatedCode.push({
//       sample: mappedSample,
//       sampleCode: util.inspect(mappedSample.schema, { depth: null }),
//     });
//   }

//   await traverseDirectory(formSamplesDir);

//   const virtualModulePath = "/@form-samples";
//   const virtualModuleContent = `export default ${JSON.stringify(
//     generatedCode
//   )};`;

//   return {
//     name: "extract-form-samples",
//     enforce: "pre",

//     configureServer(server) {
//       server.middlewares.use(
//         (req: IncomingMessage, res: ServerResponse, next: () => void) => {
//           if (req.url === virtualModulePath) {
//             res.setHeader("Content-Type", "application/javascript");
//             res.end(virtualModuleContent);
//           } else {
//             next();
//           }
//         }
//       );
//     },
//   };
// }

// export default extractFormSamplesPlugin;
