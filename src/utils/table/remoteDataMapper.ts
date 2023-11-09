import { GenericObject } from "@/types/utils";
import { DataSource, FetchParams } from "@/types/table";
import { resolveFromStringPath } from "@/utils/resolveFromStringPath";

export async function remoteDataMapper(
  data: Array<GenericObject>,
  datasource: DataSource<GenericObject, false>,
  { searchQuery, page, limit, sortKey, sortOrder, query }: FetchParams,
  fullReload: boolean,
  enablePagination = true,
  rowKey: string | null = null
): Promise<{
  totalDocs: number;
  totalPages: number;
  docs: any[];
  rawDocs: any[];
}> {
  try {
    let output: GenericObject[] = [];
    if (fullReload)
      output = (await datasource()).map((item) => ({
        ...item,
        __$ROW_ID__: rowKey
          ? propertyResolver(rowKey, [], item) ?? generateUUID()
          : generateUUID(),
      }));
    else output = [...data];
    const rawOutput = [...output];

    if (searchQuery && searchQuery.value) {
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
              ?.includes(searchQuery.value!.toLowerCase())
          )
            return true;
        return false;
      });
    }

    // Process sorting
    if (sortKey) {
      output = output.sort((a, b) => {
        const aValue = resolveFromStringPath(sortKey, a) as any;
        const bValue = resolveFromStringPath(sortKey, b) as any;
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
              return !!(
                typeof item[key] !== "undefined" && value.includes(filter.value)
              );
            if (filter.matchMode === "between")
              return !!(value >= filter.value[0] && value <= filter.value[1]);
            if (filter.matchMode === "arrayContains")
              return !!(
                typeof item[key] !== "undefined" &&
                Array.isArray(filter.value) &&
                filter.value.some((val) => val === item[key])
              );
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
    output = enablePagination ? output.slice(start, end) : output;

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
