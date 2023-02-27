export function arrayToObject<T extends any[]>(array: T) {
  return array.reduce(
    (acc, curr, index) => ({
      ...acc,
      [index]: curr,
    }),
    []
  );
}
