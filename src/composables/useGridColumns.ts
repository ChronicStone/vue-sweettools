import { ComputedRef, Ref, computed } from "vue";
import { Column, FetchParams, TableApi, TableRowAction } from "@/types/table";

import ColumnHeaderRenderer from "@/components/DataTable/CellRenderers/ColumnHeaderRenderer.vue";
import SelectionHeaderRenderer from "@/components/DataTable/CellRenderers/SelectionHeaderRenderer.vue";
import ActionsCellRenderer from "@/components/DataTable/CellRenderers/ActionsCellRenderer.vue";
import JsxCellRenderer from "@/components/DataTable/CellRenderers/JsxCellRenderer.vue";
import ComponentCellRenderer from "@/components/DataTable/CellRenderers/ComponentCellRenderer.vue";
import { GenericObject } from "@/types/utils";
import { ColDef } from "ag-grid-community";
import { GlobalTheme, GlobalThemeOverrides } from "naive-ui";

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
  columns: ComputedRef<Column<any, any>[]>;
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
};

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
            checkboxSelection: true,
            headerCheckboxSelection: true,
            resizable: false,
            width: 80,
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
      .filter(Boolean)
      .filter((column) => column?.condition?.() ?? true)
      .map((column) => ({
        headerName: column.label,
        field: column.key,
        width: column.width,
        hide: column.hide ?? false,
        resizable: column.resizable ?? true,
        sortable: column.sortable ?? true,
        // headerComponent: ColumnHeaderRenderer,
        // headerComponentParams: {
        //   tableApi: params.tableApi,
        //   theme: params.theme,
        //   themeOverrides,
        // },
        ...(column.render && {
          cellRenderer: JsxCellRenderer,
          cellRendererParams: {
            _cellRenderer: column.render,
            tableApi: params.tableApi,
            theme: params.theme,
            themeOverrides,
          },
        }),
        ...(column.cellComponent && {
          cellRenderer: ComponentCellRenderer,
          cellRendererParams: {
            _cellRenderer: column.cellComponent,
            ...(column.cellComponentParams && column.cellComponentParams),
            tableApi: params.tableApi,
            theme: params.theme,
            themeOverrides,
          },
        }),
      })),
  ]);

  return {
    columnDefs,
    defaultColumnDef: DEFAULT_COL_DEF,
  };
}
