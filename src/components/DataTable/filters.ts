import { _FieldOptions } from "@/types/form/fields";
import { SelectOptions, TableFilter } from "@/types/table";
import { formatDateToISOstring } from "@/utils/formatDate";

export function textFilter(
  label: string,
  key: string,
  matchMode: "equals" | "contains"
): TableFilter {
  return {
    key,
    matchMode,
    type: "text",
    label: label,
  };
}

export function selectFilter(
  label: string,
  key: string,
  options: _FieldOptions,
  multiple = true
): TableFilter {
  return {
    label,
    key,
    options,
    type: "select",
    matchMode: multiple ? "arrayContains" : "equals",
  };
}

export function booleanFilter(
  key: string,
  label: string,
  options?: { truthyValue?: boolean; falsyValue?: boolean }
): TableFilter {
  return {
    key,
    label,
    type: "radio",
    matchMode: "arrayContains",
    options: [
      { label: "Yes", value: options?.truthyValue ?? true },
      { label: "No", value: options?.falsyValue ?? false },
      { label: "All", value: null },
    ],
    transform: (value: boolean) => (value !== null ? [value] : []),
    preformat: (value: unknown[]) => (value?.length ? value[0] : null),
  };
}

export function booleanExistFilter(key: string, label: string): TableFilter {
  return {
    ...booleanFilter(key, label),
    matchMode: "exists",
  };
}

export function timeRangeFilter(key: string, label: string): TableFilter {
  return {
    key,
    label,
    type: "daterange",
    transform: (value: unknown[]) => {
      return !Array.isArray(value) || value.some((value) => !value)
        ? null
        : value.map((value) => formatDateToISOstring(value as string));
    },
    preformat: (value: unknown) => {
      return Array.isArray(value) && value.length
        ? value.map((date: string) => new Date(date).getTime())
        : null;
    },
    matchMode: "between",
    params: { dateMode: true },
  };
}