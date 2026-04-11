import type { Equal, Expect } from "@/_shared/types/utils";
import type { DataTableColumn } from "@/data-list/types/datatable";
import type { Action, RowAction } from "@/data-list/types/shared";
import { buildGridSchema } from "@/data-grid/schemaBuilder";
import {
  buildListSchema,
  buildTableSchema,
} from "@/data-list/composables/useSchemaBuilder";

type AccountRow = {
  id: number;
  accountType: "checking" | "savings";
  processingMeta: {
    retries: number;
    flags: string[];
  };
};

type ContractRow = {
  id: string;
  contractNumber: string;
  customer: {
    name: string;
  };
};

const tableSchema = buildTableSchema({
  tableKey: "accounts",
  remote: false,
  datasource: async () => [] as AccountRow[],
  searchQuery: ["accountType", "processingMeta.retries"],
  rowIdKey: "id",
  sortOptions: [
    { key: "accountType", label: "Type" },
    { key: "processingMeta.retries", label: "Retries" },
  ],
  columns: [
    {
      label: "Type",
      key: "accountType",
      render: (rowData) => rowData.accountType,
    },
    {
      label: "Retries",
      key: "processingMeta.retries",
      render: (rowData) => rowData.processingMeta.retries,
    },
  ],
  rowActions: [
    {
      icon: ({ rowData }) => rowData.processingMeta.flags[0] ?? "mdi:check",
      label: ({ rowData }) => rowData.accountType,
      action: ({ rowData, tableApi }) => {
        tableApi.updateRow(
          (row) => row.id === rowData.id,
          (row) => ({
            ...row,
            processingMeta: {
              ...row.processingMeta,
              retries: row.processingMeta.retries + 1,
            },
          }),
        );
      },
    },
  ],
  actions: [
    {
      label: "Touch accounts",
      action: ({ selected }) => {
        selected.map((row) => row.processingMeta.retries);
      },
    },
  ],
});

const listSchema = buildListSchema({
  remote: false,
  datasource: async () => [] as ContractRow[],
  searchQuery: ["contractNumber", "customer.name"],
  rowIdKey: "id",
  sortOptions: [
    { key: "contractNumber", label: "Contract" },
    { key: "customer.name", label: "Customer" },
  ],
  content: ({ rowData, tableApi }) => {
    tableApi.updateRow(
      (row) => row.id === rowData.id,
      (row) => row,
    );
    return `${rowData.contractNumber} - ${rowData.customer.name}`;
  },
  rowActions: [
    {
      icon: "mdi:file-document",
      label: ({ rowData }) => rowData.contractNumber,
      action: ({ rowData }) => {
        rowData.customer.name;
      },
    },
  ],
});

const gridSchema = buildGridSchema({
  fields: [
    {
      key: "processingMeta.retries",
      render: ({ data }) => data.processingMeta.retries,
    },
  ],
} as const satisfies import("@/data-grid/types").DataGridSchema<AccountRow>);

type TableColumnMember = Extract<
  (typeof tableSchema.columns)[number],
  DataTableColumn<any, any>
>;
type TableActionMember = Extract<
  NonNullable<typeof tableSchema.actions>[number],
  Action<any, any>
>;
type TableRowActionMember = Extract<
  NonNullable<typeof tableSchema.rowActions>[number],
  RowAction<any, any>
>;

type TableRow = Parameters<NonNullable<TableColumnMember["render"]>>[0];
type TableSelectedRow = Parameters<
  NonNullable<TableActionMember["action"]>
>[0]["selected"][number];
type TableRowActionRow = Parameters<
  NonNullable<TableRowActionMember["action"]>
>[0]["rowData"];
type TableRowIdKey = NonNullable<typeof tableSchema.rowIdKey>;
type TableSortKey = NonNullable<
  NonNullable<typeof tableSchema.sortOptions>[0]
>["key"];
type TableSearchKey = NonNullable<typeof tableSchema.searchQuery>[number];

type ListRow = Parameters<typeof listSchema.content>[0]["rowData"];
type ListSortKey = NonNullable<
  NonNullable<typeof listSchema.sortOptions>[0]
>["key"];
type ListSearchKey = NonNullable<typeof listSchema.searchQuery>[number];
type ListRowIdKey = NonNullable<typeof listSchema.rowIdKey>;
type ListRowActionMember = Extract<
  NonNullable<typeof listSchema.rowActions>[number],
  RowAction<any, any>
>;
type ListRowActionRow = Parameters<
  NonNullable<ListRowActionMember["action"]>
>[0]["rowData"];

type GridRow = Parameters<
  NonNullable<(typeof gridSchema.fields)[0]["render"]>
>[0]["data"];

const _tableRowInference: AccountRow = null as unknown as TableRow;
const _tableSelectedInference: AccountRow = null as unknown as TableSelectedRow;
const _tableRowActionInference: AccountRow =
  null as unknown as TableRowActionRow;
const _tableRowIdInference: TableRowIdKey = "id";

const _listRowInference: ContractRow = null as unknown as ListRow;
const _listRowIdInference: ListRowIdKey = "id";
const _listRowActionInference: ContractRow =
  null as unknown as ListRowActionRow;

const _gridRowInference: AccountRow = null as unknown as GridRow;
