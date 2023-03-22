import { Primitive } from "@//types/utils";
import { ImportSchema } from "@/types/execl";
import { DataTableColumn, NDataTable, NPopover, NTag } from "naive-ui";
import { Ref } from "vue";

const MULTIPLE_SEPARATOR_DEFAULT = ",";
type GenericObject = Record<Primitive, any>;

export function useImportManager(schema: Ref<ImportSchema<true>>) {
  const searchQuery = ref<string>("");
  const rawData = ref<Record<string, string>[]>([]);
  const data = computed(() =>
    rawData.value.map((row) => formatRow(schema.value, row))
  );

  const filteredRows = computed<Record<string, unknown>[]>(() =>
    data.value
      .sort(
        (a, b) => +validateRow(schema.value, a) - +validateRow(schema.value, b)
      )
      .filter((row) => {
        if (!searchQuery.value) return true;
        for (const key in row)
          if (
            row[key] &&
            row[key]
              .toString()
              .toLowerCase()
              .includes(searchQuery.value.toLowerCase())
          )
            return true;
        return false;
      })
  );

  const invalidRows = computed(() =>
    filteredRows.value.filter((row) => !validateRow(schema.value, row))
  );
  const validRows = computed(() =>
    filteredRows.value.filter((row) => validateRow(schema.value, row))
  );

  const tableColumns = computed(
    () =>
      [
        {
          title: () => <NTag type="primary">IS VALID</NTag>,
          key: "__isValid",
          render: (row: Record<string, unknown>) =>
            renderBoolean(validateRow(schema.value, row)),
        },
        ...schema.value.map((field) => ({
          title: () => (
            <span>
              {field?.label ?? field.key}{" "}
              {field.validation.required && <span class="text-red-500">*</span>}
            </span>
          ),
          key: field?.targetKey ?? field.key,
          render: getCellRenderer(
            field?.targetKey ?? (field.key as string),
            field
          ),
          sorter: "default",
        })),
      ] as DataTableColumn[]
  );

  const pagination = reactive({
    page: 1,
    pageSize: 50,
    pageSizes: [50, 100, 250, 500],
    showSizePicker: true,
    onUpdatePageSize(pageSize: number) {
      this.pageSize = pageSize;
    },
    onChange(page: number) {
      this.page = page;
    },
    prefix() {
      return (
        <div>
          {pagination.pageSize * pagination.page - (pagination.pageSize - 1)} -{" "}
          {pagination.pageSize * pagination.page} of{" "}
          {filteredRows.value?.length}
        </div>
      );
    },
  });

  return {
    searchQuery,
    rawData,
    data,
    filteredRows,
    validRows,
    invalidRows,
    pagination,
    tableColumns,
  };
}

function validateField(value: any, field: ImportSchema<true>[number]) {
  if (!value && !field.validation.required) return true;
  if (
    field.validation?.required &&
    (!value || (Array.isArray(value) && !value.length))
  )
    return false;
  if (
    field.validation?.rule &&
    !new RegExp(field.validation?.rule).test(value?.toString() ?? "")
  ) {
    return field?.multiple && Array.isArray(value)
      ? value.every((v) => new RegExp(field.validation?.rule as RegExp).test(v))
      : new RegExp(field.validation?.rule as RegExp).test(
          value?.toString() ?? ""
        );
  }

  if (field.validation?.enum) {
    if (!field.validation?.required && !value) return true;
    else {
      const mappedEnum = field.validation?.enum.map((enumItem) =>
        field.validation?.caseInsensitive
          ? enumItem?.toString()?.toLocaleLowerCase()
          : enumItem
      );
      const mappedValue =
        field.multiple && Array.isArray(value)
          ? value.map((v) =>
              field.validation?.caseInsensitive
                ? v?.toString()?.toLocaleLowerCase()
                : v
            )
          : field.validation?.caseInsensitive
          ? value?.toString()?.toLocaleLowerCase()
          : value;

      return field.multiple && Array.isArray(value)
        ? (mappedValue as string[]).every((v) =>
            mappedEnum.includes(
              field.validation?.caseInsensitive
                ? v?.toString?.()?.toLocaleLowerCase?.()
                : v
            )
          )
        : mappedEnum.includes(
            field.validation?.caseInsensitive
              ? value?.toString?.()?.toLocaleLowerCase?.() ?? ""
              : value
          );
    }
  }
  return true;
}

function validateRow(
  _schema: ImportSchema<true>,
  row: Record<string, unknown>
) {
  return _schema.every((field) =>
    validateField(row[field?.targetKey ?? field.key], field)
  );
}

function formatRowKeys(row: Record<string, string>) {
  return Object.entries(row).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key.replace("(*)", "").replace(/ +/g, "")]: value,
    }),
    {} as Record<string, string>
  );
}

function formatRow(_schema: ImportSchema<true>, row: Record<string, string>) {
  const _row = formatRowKeys(row);
  return _schema.reduce((acc, field) => {
    if (field?.multiple) {
      const value = _row[field.key];
      if (value) {
        const multipleValues = value
          ?.toString()
          ?.split(field?.multipleSeparator ?? MULTIPLE_SEPARATOR_DEFAULT);
        return {
          ...acc,
          [field?.targetKey ?? field.key]: multipleValues
            .map((value: string) => value.trim())
            .map((value: string) => formatField(value, field?.format)),
        };
      } else return { ...acc, [field?.targetKey ?? field.key]: null };
    }

    return {
      ...acc,
      [field?.targetKey ?? field.key]: formatField(
        _row[field.key],
        field.format
      ),
    };
  }, {} as GenericObject);

  function formatField(
    value: string,
    format: ImportSchema<true>[number]["format"]
  ) {
    let updated: unknown = value;
    if (!format) return value;

    if (format?.trim) updated = updated?.toString?.().trim();
    if (format?.lowercase) updated = updated?.toString?.().toLocaleLowerCase();
    if (format?.uppercase) updated = updated?.toString?.().toLocaleUpperCase();
    if (format?.number) updated = Number(updated);
    if (format?.transform) updated = format.transform(updated);
    return updated;
  }
}

export function renderBoolean(value: boolean) {
  return (
    <span
      class={`iconify ${value ? "text-green-500" : "text-red-500"}`}
      data-icon={value ? "mdi:check" : "mdi:close"}
    />
  );
}

export function getCellRenderer(
  key: string,
  field: ImportSchema<true>[number]
) {
  if (typeof field?.cellRenderer === "function") return field.cellRenderer;
  if (field?.multiple) return multiCellRenderer(key, field);
  else return defaultCellRenderer(key, field);
}

export function rowValidityRenderer(isValid: boolean) {
  return (
    <div class={isValid ? "text-green-500" : "text-red-500"}>
      {isValid ? "✔" : "✖"}
    </div>
  );
}

export function defaultCellRenderer(
  key: string,
  schema: ImportSchema<true>[number]
) {
  return (row: Record<string, unknown>) => {
    const isFieldValid = validateField(row[key], schema);
    if (schema.validation.required && !row[key])
      return <div class="text-red-500">MISSING VALUE</div>;
    return <div class={isFieldValid ? "" : "text-red-500"}>{row[key]}</div>;
  };
}

export function multiCellRenderer(
  key: string,
  schema: ImportSchema<true>[number]
) {
  return (row: Record<string, Array<unknown>>) => {
    if (schema.validation.required && !row[key]?.length)
      return <div class="text-red-500">MISSING VALUE</div>;
    else if (!row[key]?.length) return <div></div>;

    const mappedItems = row[key].map((item) => ({
      value: item,
      __isValid: validateField(item, { ...schema, multiple: false }),
    }));
    const columns: DataTableColumn<{ __isValid: boolean }>[] = [
      { title: "Value", key: "value" },
      {
        title: () => <NTag type="primary">IS VALID</NTag>,
        key: "__valid",
        render: (row) => renderBoolean(row.__isValid),
      },
    ];

    return (
      <NPopover width={400} style="padding: 0;">
        {{
          default: () => (
            <NDataTable
              maxHeight={150}
              data={mappedItems}
              columns={columns}
            ></NDataTable>
          ),
          trigger: () => (
            <div
              class={`flex items-center gap-2 ${
                mappedItems.some(
                  (item: { __isValid: boolean }) => !item.__isValid
                )
                  ? "text-red-500"
                  : ""
              }`}
            >
              {row[key].length}
              <span class="iconify" data-icon="mdi:eye"></span>
            </div>
          ),
        }}
      </NPopover>
    );
  };
}
