export const resolveFromStringPath = (
  path: string,
  obj: { [key: string]: any },
  separator = "."
) => {
  try {
    const properties: string[] = Array.isArray(path)
      ? path
      : path.split(separator);
    const value = properties.reduce((prev, curr) => prev && prev[curr], obj);
    return value;
  } catch (err) {
    return undefined;
  }
};
