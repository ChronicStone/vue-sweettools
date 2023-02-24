import { GenericObject } from "@/types/utils";

export function mapFieldDependencies(
  arrayDependencies: Array<{ key: string; value: unknown }>
) {
  const dependencies: GenericObject = {};
  for (const { key, value } of arrayDependencies) dependencies[key] = value;
  return dependencies;
}
