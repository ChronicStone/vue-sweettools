import { GenericObject } from "@/types/utils";
import { getPropertyFromPath } from "./getPropertyFromPath";

export function mapFieldDependencies(
  arrayDependencies: Array<{ key: string; value: unknown }>
) {
  const dependencies: GenericObject = {};
  for (const { key, value } of arrayDependencies) dependencies[key] = value;
  return dependencies;
}

export function preformatFieldDependencies(
  dependencies: Array<string | [string, string]> | undefined,
  formState: Record<string, unknown>,
  parentKey: string[] = []
) {
  return (dependencies ?? [])
    .map((dependency) =>
      typeof dependency === "string"
        ? { source: dependency, target: dependency }
        : Array.isArray(dependency)
        ? { source: dependency[0], target: dependency[1] }
        : dependency
    )
    .map(({ source, target }) => ({
      key: target,
      value: null,
      ...(source === "$root" && { value: formState }),
      ...(source.includes?.("$parent") && {
        value: getPropertyFromPath([...(parentKey ?? [])], formState, source),
      }),
      ...(!["$root"].includes(source) &&
        !source.includes("$parent") && {
          value: getPropertyFromPath(source, formState),
        }),
    }));
}
