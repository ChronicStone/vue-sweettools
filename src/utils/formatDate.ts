export function formatDateToISOstring(val: string) {
  return new Date(val).toDateString();
}
