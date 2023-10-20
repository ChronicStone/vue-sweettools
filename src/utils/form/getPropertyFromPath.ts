import { GenericObject } from "@/types/utils";

export function getPropertyFromPath(
  path: string | (string | number)[],
  obj: GenericObject,
  key = ""
) {
  const offset = getPathOffset(key);
  const properties = [
    ...(Array.isArray(path) ? path : path.split("."))
      .map((pathKey, index, array) =>
        index < array.length - offset ? pathKey : null
      )
      .filter((pathKey) => pathKey != null),
    ...key.split(".").slice(1),
  ];

  return properties.reduce(
    (prev, curr) => prev && prev[curr as string],
    obj as any
  );
}

export function getPathOffset(key: string) {
  try {
    if (!key) return 0;
    const offset = key.split(".")[0].split(":").pop();
    return offset && !isNaN(+offset) ? +offset : 0;
  } catch (err) {
    return 0;
  }
}

export function mapRelativeKeyPath(
  path: string | (string | number)[],
  key = ""
) {
  const offset = getPathOffset(key);
  return [
    ...(Array.isArray(path) ? path : path.split("."))
      .map((pathKey, index, array) =>
        index < array.length - offset ? pathKey : null
      )
      .filter((pathKey) => pathKey != null),
    ...key.split(".").slice(1),
  ] as Array<string | number>;
}
