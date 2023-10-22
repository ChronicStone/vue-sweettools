export function setPropertyFromPath(
  object: Record<string, unknown>,
  path: string | (string | number)[],
  value: any,
  key = ""
) {
  const properties = mapRelativeKeyPath(path, key);
  properties.reduce(
    (o, p, i) =>
      (o[p as string] =
        properties.length === ++i ? value : o[p as string] || {}),
    object
  );
}

export function propertySetter(
  target: string,
  parentKey: (string | number)[],
  state: Record<string, unknown>,
  value: any
) {
  if (target === "$root") state = value;
  else if (target.includes("$parent"))
    setPropertyFromPath(state, [...(parentKey ?? [])], value, target);
  else return setPropertyFromPath(state, target, value);
}

export function propertyResolver(
  target: string,
  parentKey: (string | number)[],
  state: Record<string, unknown>
) {
  if (target === "$root") return state;
  else if (target.includes("$parent"))
    return getPropertyFromPath([...(parentKey ?? [])], state, target);
  else return getPropertyFromPath(target, state);
}