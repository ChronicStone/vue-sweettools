import { FilterType, TableFilter } from "@/types/table";
import { GenericObject } from "@/types/utils";

export function mapFilterInitialState(
  filters: TableFilter[],
  baseState: GenericObject,
  clearMode = false
): GenericObject {
  const GetInitState = (type: FilterType, defaultValue: any) =>
    typeof defaultValue != "undefined"
      ? defaultValue
      : ["select", "checkboxGroup"].includes(type)
      ? []
      : ["daterange", "datetimerange"].includes(type)
      ? [null, null]
      : null;
  const state: { [key: string]: any } = {};
  filters.filter(Boolean).forEach((filter) => {
    baseState[filter.key] && !clearMode
      ? (state[filter.key] = baseState[filter.key])
      : (state[filter.key] = GetInitState(
          (filter as any).inputType,
          (filter as any).defaultValue
        ));
  });
  return state;
}
