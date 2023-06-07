import basic1 from "./basic1";
import multiStep1 from "./multiStep1";
import asyncOptionDeps from "./asyncOptDeps";
import crossFieldValidation from "./crossFieldValidation";

export const formSamples: Array<ReturnType<typeof defineFormSchemaSample>> = [
  basic1,
  asyncOptionDeps,
  multiStep1,
  crossFieldValidation,
];
