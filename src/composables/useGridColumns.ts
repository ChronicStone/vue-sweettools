import { ComputedRef, Ref, computed } from "vue";
import { Column, FetchParams, TableApi, TableRowAction } from "@/types/table";

import SelectionHeaderRenderer from "@/components/DataTable/CellRenderers/SelectionHeaderRenderer.vue";
import ActionsCellRenderer from "@/components/DataTable/CellRenderers/ActionsCellRenderer.vue";
import JsxCellRenderer from "@/components/DataTable/CellRenderers/JsxCellRenderer.vue";
import ComponentCellRenderer from "@/components/DataTable/CellRenderers/ComponentCellRenderer.vue";
import { GenericObject } from "@/types/utils";
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
  fetchParams: ComputedRef<FetchParams>;
};

export function useGridColumns(
  params: AgGridConfigParams,
  tableApi: Ref<TableApi | undefined>,
  theme: ComputedRef<GlobalTheme | null>,
  themeOverrides: ComputedRef<GlobalThemeOverrides | undefined>
) {
  const { permissionValidator } = useGlobalConfig();
  const columnDefs = computed(() => [
    ...(params.enableSelection.value
      ? [
          {
            checkboxSelection: true,
            // ...(params.isRemote.value && {
            //   headerComponent: SelectionHeaderRenderer,
            //   headerComponentParams: {
            //     setGlobalSelection: params.setGlobalSelection,
            //     theme,
            //     themeOverrides,
            //   },
            // }),
            headerCheckboxSelection: true,
            width: 80,
            resizable: false,
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
              tableApi: tableApi,
              theme,
              themeOverrides,
            },
            width: 80 + params.rowActions.value.length * 20,
          },
        ]
      : []),
    ...(params.columns.value ?? [])
      .filter(Boolean)
      .filter(
        (column) =>
          column?.condition?.({
            tableApi: tableApi.value as TableApi,
            nbSelected: params.nbSelected.value,
            selectAll: params.selectAll.value,
            selected: params.selected.value,
            fetchParams: params.fetchParams.value,
          }) ?? true
      )
      .map((column) => ({
        headerName: column.label,
        field: column.key,
        width: column.width,
        hide: column.hide ?? false,
        resizable: column.resizable ?? true,
        sortable: column.sortable ?? true,
        ...(column.render && {
          cellRenderer: JsxCellRenderer,
          cellRendererParams: {
            _cellRenderer: column.render,
            tableApi,
            theme,
            themeOverrides,
          },
        }),
        ...(column.cellComponent && {
          cellRenderer: ComponentCellRenderer,
          cellRendererParams: {
            _cellRenderer: column.cellComponent,
            ...(column.cellComponentParams && column.cellComponentParams),
            tableApi,
            theme,
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
