import { TableFilter } from "@/types/table";

export function mapFiltersToFormSchema(filters: TableFilter[]) {
  return filters.filter(Boolean).map((filter) => {
    return {
      ...filter,
      clearable: true,
      fieldParams: {
        ...(filter?.fieldParams ?? {}),
        ...(filter.type === "select" && {
          multiple: filter?.fieldParams?.multiple ?? true,
        }),
        ...(filter.type === "checkbox" && {
          hasThirdState: filter?.fieldParams?.hasThirdState ?? true,
        }),
      },
    };
  });
}