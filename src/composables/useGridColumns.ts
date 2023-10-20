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
  columns: ComputedRef<Array<Column<any, any> | ColumnGroup<any>>>;
  enableSelection: ComputedRef<boolean>;
  rowActions: ComputedRef<TableRowAction<GenericObject>[]>;
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
};

function mapColumnsRecursively(
  column: Column<any, any> | ColumnGroup<any>,
  params: AgGridConfigParams
): ColDef | ColGroupDef {
  if ("children" in column)
    return {
      headerName: column.label,
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
        theme: params.theme,
        themeOverrides: params.themeOverrides,
        searchable: params.searchQuery.value.includes(column.key),
        label: column.label,
      },
      ...(column.render && {
        cellRenderer: JsxCellRenderer,
        cellRendererParams: {
          _cellRenderer: column.render,
          tableApi: params.tableApi,
          theme: params.theme,
          themeOverrides: params.themeOverrides,
        },
      }),
      ...(column.cellComponent && {
        cellRenderer: ComponentCellRenderer,
        cellRendererParams: {
          _cellRenderer: column.cellComponent,
          ...(column.cellComponentParams && column.cellComponentParams),
          tableApi: params.tableApi,
          theme: params.theme,
          themeOverrides: params.themeOverrides,
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
              theme: params.theme,
              themeOverrides: params.themeOverrides,
              selectAll: params.selectAll,
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
              theme: params.theme,
              themeOverrides,
            },
            width: 80 + params.rowActions.value.length * 20,
          },
        ]
      : []),
    ...(params.columns.value ?? [])
      .filter((c) => c?.condition?.() ?? true)
      .map((c) => mapColumnsRecursively(c, params)),
  ]);

  return {
    columnDefs,
    defaultColumnDef: DEFAULT_COL_DEF,
  };
}
