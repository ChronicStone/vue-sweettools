import {
  FormInferredData,
  FormSchema,
  FormSharedStore,
  InferSharedStoreData,
} from "@/types/form/form";
import { Narrowable } from "@/types/utils";
import { Equal, Expect } from "hotscript/dist/internals/helpers";

export function defineFormSchemaSample<
  TFormSchema extends FormSchema<StepKey, FieldKey>,
  StepKey extends Narrowable,
  FieldKey extends Narrowable
>(sample: {
  title: string;
  description?: string;
  schema: TFormSchema;
  data?: Record<string, any>;
}) {
  return {
    sample,
    formData: null as unknown as FormInferredData<
      TFormSchema,
      StepKey,
      FieldKey
    >,
  };
}
export function prettyPrintSchema(obj: any) {
  // @ts-expect-error ignore this
  Object.prototype.toJSON = function () {
    const sobj = {};
    let i: any;
    for (i in this) {
      // eslint-disable-next-line no-prototype-builtins
      if (this.hasOwnProperty(i)) {
        // @ts-expect-error ignore this
        sobj[i] =
          // @ts-expect-error ignore this
          typeof this[i] == "function" ? unescape(this[i].toString()) : this[i];
      }
    }

    return sobj;
  };
  // @ts-expect-error ignore this
  Array.prototype.toJSON = function () {
    const sarr = [];
    let i: any;
    for (i = 0; i < this.length; i++)
      sarr.push(
        typeof this[i] == "function" ? unescape(this[i].toString()) : this[i]
      );

    return sarr;
  };

  const str = JSON.stringify(obj, null, 4);

  // @ts-expect-error ignore this
  delete Object.prototype.toJSON;
  // @ts-expect-error ignore this
  delete Array.prototype.toJSON;

  return str;
}

export function assertDataTypeInferrence<
  T extends Record<string, unknown>,
  Y extends T
>() {
  return true;
}
