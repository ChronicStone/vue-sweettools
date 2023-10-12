export function setPropertyFromPath(
  object: Record<string, unknown>,
  path: string | (string | number)[],
  value: any,
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

  console.log({ offset, properties, value });

  properties.reduce(
    (o, p, i) =>
      (o[p as string] =
        properties.length === ++i ? value : o[p as string] || {}),
    object
  );
}
