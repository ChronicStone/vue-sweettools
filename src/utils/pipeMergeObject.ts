import { deepmerge } from "deepmerge-ts";

export const pipeMergeObject = <T>(...args: T[]) =>
  args.reduce((acc, curr) => deepmerge(acc as any, curr as any), {});
