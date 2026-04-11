import type { Equal, Expect } from "@/_shared/types/utils";
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

type IsAny<T> = 0 extends 1 & T ? true : false;

const tableSchema = buildTableSchema({
  tableKey: "accounts",
  remote: false,
  datasource: async () => [] as AccountRow[],
  rowIdKey: "id",
  columns: [
    {
      label: "Type",
      key: "accountType",
      render: (rowData) => {
        const _row: AccountRow = rowData;
        type _NotAny = Expect<Equal<IsAny<typeof rowData>, false>>;
        return rowData.accountType;
      },
    },
  ],
  rowActions: [
    {
      icon: ({ rowData }) => rowData.processingMeta.flags[0] ?? "mdi:check",
      label: ({ rowData }) => rowData.accountType,
      action: ({ rowData, tableApi }) => {
        const _row: AccountRow = rowData;
        type _NotAny = Expect<Equal<IsAny<typeof rowData>, false>>;
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
        const _selected: AccountRow[] = selected;
        type _NotAny = Expect<Equal<IsAny<(typeof selected)[number]>, false>>;
        selected.map((row) => row.processingMeta.retries);
      },
    },
  ],
});

const listSchema = buildListSchema({
  remote: false,
  datasource: async () => [] as ContractRow[],
  rowIdKey: "id",
  content: ({ rowData, tableApi }) => {
    const _row: ContractRow = rowData;
    type _NotAny = Expect<Equal<IsAny<typeof rowData>, false>>;
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
        const _row: ContractRow = rowData;
        type _NotAny = Expect<Equal<IsAny<typeof rowData>, false>>;
        rowData.customer.name;
      },
    },
  ],
});

const gridSchema = buildGridSchema<AccountRow>({
  fields: [
    {
      key: "processingMeta.retries",
      render: ({ data }) => {
        const _row: AccountRow = data;
        type _NotAny = Expect<Equal<IsAny<typeof data>, false>>;
        return data.processingMeta.retries;
      },
    },
  ],
});

tableSchema;
listSchema;
gridSchema;
