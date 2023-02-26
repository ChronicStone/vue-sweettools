import { GenericObject } from "@/types/utils";
import { FormField } from "@/types/form/fields";
import { mapFieldDependencies } from "./mapFieldDependencies";
import { getPropertyFromPath } from "./getPropertyFromPath";

export function resolveFieldDependencies(
  field: FormField,
  state: GenericObject,
  parentKey: string[] = []
) {
  return mapFieldDependencies(
    (field?.dependencies ?? [])
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
        ...(source === "$root" && { value: state.value }),
        ...(source.includes?.("$parent") && {
          value: getPropertyFromPath([...(parentKey ?? [])], state, source),
        }),
        ...(!["$root"].includes(source) &&
          !source.includes("$parent") && {
            value: getPropertyFromPath(source, state),
          }),
      }))
  );
}
