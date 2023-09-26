import { ComputedRef, Ref, computed } from "vue";
import { Column, FetchParams, TableApi, TableRowAction } from "@/types/table";
import { DataTableColumn } from "naive-ui";

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
  fetchParams: Readonly<Ref<FetchParams>>;
};

export function useGridColumns(
  params: AgGridConfigParams,
  tableApi: Ref<TableApi | undefined>,
  theme: ComputedRef<GlobalTheme | null>,
  themeOverrides: ComputedRef<GlobalThemeOverrides | undefined>,
  draggable: ComputedRef<boolean>
) {
  const { permissionValidator } = useGlobalConfig();
  const columnDefs = computed(() => [
    ...(draggable.value
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
      .filter((column) => column?.condition?.() ?? true)
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

  const columnDefs2 = computed<DataTableColumn[]>(() => [
    ...(params.enableSelection.value
      ? [{ type: "selection" } satisfies DataTableColumn]
      : []),
    ...(params.rowActions.value?.length
      ? [
          {
            title: "Actions",
            key: "#actions",
            width: 80 + params.rowActions.value.length * 20,
            render: (row: GenericObject) => (
              <ActionsCellRenderer
                permissionValidator={permissionValidator.value}
                data={row}
                tableApi={tableApi.value!}
                actions={params.rowActions.value}
              />
            ),
          },
        ]
      : []),
    ...(params.columns.value ?? [])
      .filter(Boolean)
      .filter((column) => column?.condition?.() ?? true)
      .map(
        (column) =>
          ({
            title: column.label,
            key: column.key,
            width: column.width,
            minWidth: column.minWidth,
            maxWidth: column.maxWidth,
            resizable: column?.resizable ?? true,
            ...(column.render && {
              render: (row: GenericObject) => renderVNode(column.render, row),
            }),
            // headerName: column.label,
            // field: column.key,
            // width: column.width,
            // hide: column.hide ?? false,
            // resizable: column.resizable ?? true,
            // sortable: column.sortable ?? true,
            // ...(column.render && {
            //   cellRenderer: JsxCellRenderer,
            //   cellRendererParams: {
            //     _cellRenderer: column.render,
            //     tableApi,
            //     theme,
            //     themeOverrides,
            //   },
            // }),
            // ...(column.cellComponent && {
            //   cellRenderer: ComponentCellRenderer,
            //   cellRendererParams: {
            //     _cellRenderer: column.cellComponent,
            //     ...(column.cellComponentParams && column.cellComponentParams),
            //     tableApi,
            //     theme,
            //     themeOverrides,
            //   },
            // }),
          } satisfies DataTableColumn)
      ),
  ]);

  return {
    columnDefs,
    defaultColumnDef: DEFAULT_COL_DEF,
    columnDefs2,
  };
}
