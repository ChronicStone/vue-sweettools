export function omitKeysFromObject(
  object: Record<string, unknown>,
  keys: string[]
) {
  const newObject = { ...object };
  keys.forEach((key) => delete newObject[key]);
  return newObject;
}
