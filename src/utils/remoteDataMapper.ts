import { GenericObject } from "./../types/utils";
import { FetchParams } from "@/types/table";
import { resolveFromStringPath } from "./resolveFromStringPath";

export async function remoteDataMapper(
  data: Array<GenericObject>,
  datasource: (fetchParams: FetchParams) => Promise<any[]>,
  { searchQuery, page, limit, sortKey, sortOrder, query }: FetchParams,
  fullReload: boolean
): Promise<{
  totalDocs: number;
  totalPages: number;
  docs: any[];
  rawDocs: any[];
}> {
  try {
    let output = fullReload
      ? (await datasource({
          searchQuery,
          page,
          limit,
          sortKey,
          sortOrder,
          query,
        })) || []
      : data;

    const rawOutput = [...output];

    if (searchQuery?.value) {
      output = output.filter((item) => {
        const keys = Object.keys(item).filter((key) =>
          searchQuery.fields.includes(key)
        );
        for (const key of keys)
          if (
            item[key] &&
            item[key]
              ?.toString()
              ?.toLowerCase()
              ?.includes(searchQuery?.value?.toLowerCase())
          )
            return true;
        return false;
      });
    }

    // Process sorting
    if (sortKey) {
      output = output.sort((a, b) => {
        const aValue = a[sortKey];
        const bValue = b[sortKey];
        if (aValue === bValue) return 0;
        if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
        if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
        return 0;
      });
    }

    if (query && Object.keys(query).length > 0) {
      for (const key in query) {
        const filters = query[key];
        output = output.filter((item) => {
          const value: any = resolveFromStringPath(key, item);
          for (const filter of filters) {
            if (filter.matchMode === "equals") {
              return !!(filter.value === value);
            }
            if (filter.matchMode === "contains")
              return !!(item[key] && value.includes(filter.value));
            if (filter.matchMode === "between")
              return !!(value >= filter.value[0] && value <= filter.value[1]);
            if (filter.matchMode === "arrayContains")
              return !!(item[key] && filter.value.includes(item[key]));
          }
          return false;
        });
      }
    }

    const totalDocs = output.length;
    const totalPages = Math.ceil(totalDocs / limit);

    // Process pagination
    const start = (page - 1) * limit;
    const end = start + limit;
    output = output.slice(start, end);

    return { totalDocs, totalPages, docs: output, rawDocs: rawOutput };
  } catch (err) {
    console.error(err);
    return {
      rawDocs: [],
      docs: [],
      totalPages: 0,
      totalDocs: 0,
    };
  }
}
