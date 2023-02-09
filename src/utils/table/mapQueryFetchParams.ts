import { GenericObject } from "@/types/utils";
import { pipeMergeObject } from "../pipeMergeObject";
import { StaticFilter, TableFilter } from "@/types/table";
import { GridControls, MappedFilters } from "@/types/table";

export function mapQueryFetchParams(
  filterState: GenericObject,
  panelFilters: TableFilter[],
  staticFilters: StaticFilter[]
) {
  const mappedFilters = pipeMergeObject(
    mapStaticFilters(staticFilters),
    mapTableFilters(panelFilters, filterState)
  );

  return Object.keys(mappedFilters).length > 0 ? mappedFilters : null;
}

function mapStaticFilters(filters: StaticFilter[]) {
  return filters.reduce(
    (acc, { key, value, matchMode, required, params }) => ({
      ...acc,
      [key]: [
        ...(acc?.[key] ?? []),
        { value, matchMode, required: required ?? false, params: params ?? {} },
      ],
    }),
    {} as Record<string, MappedFilters[]>
  );
}

export function mapTableFilters(
  filters: TableFilter[],
  filterState: GenericObject
) {
  const getDefaultMatchMode = (value: any) =>
    Array.isArray(value) ? "arrayContains" : "contains";

  return Object.entries(filterState).reduce((acc, [key, value]) => {
    const filter = filters.find((filter) => filter.key === key);
    if (
      !filter ||
      (Array.isArray(value) && !value.length) ||
      (!Array.isArray(value) && !value)
    )
      return acc;
    return {
      ...acc,
      [key]: [
        {
          matchMode: filter?.matchMode ?? getDefaultMatchMode(value),
          required: false,
          params: filter?.params ?? {},
          value,
        },
      ],
    };
  }, {} as Record<string, MappedFilters[]>);
}
