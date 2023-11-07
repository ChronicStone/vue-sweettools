import { ComputedRef, Ref, computed } from "vue";
import {
  Column,
  ColumnGroup,
  FetchParams,
  TableApi,
  TableRowAction,
} from "@/types/table";

import ColumnHeaderRenderer from "@/components/DataTable/CellRenderers/ColumnHeaderRenderer.vue";
import ActionsCellRenderer from "@/components/DataTable/CellRenderers/ActionsCellRenderer.vue";
import JsxCellRenderer from "@/components/DataTable/CellRenderers/JsxCellRenderer.vue";
import ComponentCellRenderer from "@/components/DataTable/CellRenderers/ComponentCellRenderer.vue";
import { GenericObject } from "@/types/utils";
import { ColDef, ColGroupDef } from "ag-grid-community";
import { GlobalTheme, GlobalThemeOverrides } from "naive-ui";
import SelectionCellRenderer from "@/components/DataTable/CellRenderers/SelectionCellRenderer.vue";
import { useTranslations } from "@/i18n/composables/useTranslations";
import { RowNode } from "ag-grid-community";

const DEFAULT_COL_DEF = {
  sortable: true,
  resizable: true,
  suppressMenu: true,
  floatingFilter: false,
  suppressFilterButton: true,
  comparator: () => 0,
} as const;

type AgGridConfigParams = {
  isRemote: ComputedRef<boolean>;
  columns: ComputedRef<Array<Column<never, never> | ColumnGroup<never, never>>>;
  enableSelection: ComputedRef<boolean>;
  rowActions: ComputedRef<TableRowAction<never>[]>;
  setGlobalSelection: (value: boolean) => void;
  selectAll: Ref<boolean>;
  selected: Ref<Array<Record<string, any>>>;
  nbSelected: ComputedRef<number>;
  fetchParams: Readonly<Ref<FetchParams>>;
  tableApi: Ref<TableApi | undefined>;
  theme: ComputedRef<GlobalTheme | null>;
  themeOverrides: ComputedRef<GlobalThemeOverrides | undefined>;
  draggable: ComputedRef<boolean>;
  searchQuery: ComputedRef<string[]>;
  i18n: ReturnType<typeof useTranslations>;
  lastSelectedNode: Ref<RowNode<any> | null>;
  setLastSelectedNode: (node: RowNode<any>) => void;
};

function mapColumnsRecursively(
  column: Column | ColumnGroup,
  params: AgGridConfigParams
): ColDef | ColGroupDef {
  if ("children" in column)
    return {
      headerName:
        typeof column.label === "function" ? column.label() : column.label,
      children: column.children
        .filter((c) => c?.condition?.() ?? true)
        .map((c) => mapColumnsRecursively(c, params)),
    };
  else
    return {
      autoHeight: column?.autoHeight ?? false,
      autoHeaderHeight: column?.autoHeaderHeight ?? false,
      pinned: column?.pinned ?? null,
      onCellClicked: column?.onCellClicked,
      onCellContextMenu: column?.onCellContextMenu,
      onCellDoubleClicked: column?.onCellDoubleClicked,
      field: column.key,
      ...(column.width && { width: column.width as number }),
      hide: column.hide ?? false,
      resizable: column.resizable ?? true,
      sortable: column.sortable ?? true,
      headerComponent: ColumnHeaderRenderer,
      headerComponentParams: {
        tableApi: params.tableApi,
        getTheme: () => params.theme.value,
        getThemeOverrides: () => params.themeOverrides.value,
        searchable: params.searchQuery.value.includes(column.key as unknown as string),
        label: column.label,
        i18n: params.i18n,
      },
      ...(column.render && {
        cellRenderer: JsxCellRenderer,
        cellRendererParams: {
          _cellRenderer: column.render,
          tableApi: params.tableApi,
          getTheme: () => params.theme.value,
          getThemeOverrides: () => params.themeOverrides.value,
        },
      }),
      ...(column.cellComponent && {
        cellRenderer: ComponentCellRenderer,
        cellRendererParams: {
          _cellRenderer: column.cellComponent,
          ...(column.cellComponentParams && column.cellComponentParams),
          tableApi: params.tableApi,
          getTheme: () => params.theme.value,
          getThemeOverrides: () => params.themeOverrides.value,
        },
      }),
    };
}

export function useGridColumns(params: AgGridConfigParams) {
  const { permissionValidator } = useGlobalConfig();
  const columnDefs = computed(() => [
    ...(params.draggable.value
      ? [
          {
            rowDrag: true,
            width: 50,
          },
        ]
      : []),
    ...(params.enableSelection.value
      ? [
          {
            // checkboxSelection: true,
            headerCheckboxSelection: true,
            resizable: false,
            width: 80,
            cellRenderer: SelectionCellRenderer,
            cellRendererParams: {
              getTheme: () => params.theme.value,
              getThemeOverrides: () => params.themeOverrides.value,
              getSelectAll: () => params.selectAll.value,
              getLastSelectedNode: () => params.lastSelectedNode.value,
              setLastSelectedNode: params.setLastSelectedNode,
            },
          },
        ]
      : []),
    ...(params.rowActions.value?.length
      ? [
          {
            headerName: "Actions",
            cellRenderer: ActionsCellRenderer,
            cellRendererParams: {
              _rowActions: params.rowActions.value,
              permissionValidator: permissionValidator.value,
              tableApi: params.tableApi,
              getTheme: () => params.theme.value,
              getThemeOverrides: () => params.themeOverrides.value,
            },
            width: 80 + params.rowActions.value.length * 20,
          },
        ]
      : []),
    ...(params.columns.value ?? [])
      .filter((c) => c?.condition?.() ?? true)
      .map((c) => mapColumnsRecursively(c as Column | ColumnGroup, params)),
  ]);

  return {
    columnDefs,
    defaultColumnDef: DEFAULT_COL_DEF,
  };
}
