/* eslint-disable @typescript-eslint/ban-types */

export type LocaleTemplate = {
  validators?: {
    required: string;
    requiredIf: string;
    requiredUnless: string;
    sameAs: string;
    url: string;
    email: string;
    alpha: string;
    alphaNum: string;
    numeric: string;
    between: string;
    decimal: string;
    integer: string;
    ipAddress: string;
    macAddress: string;
    maxLength: string;
    maxValue: string;
    minLength: string;
    minValue: string;
    not?: string;
    or?: string;
    and?: string;
  };
  form?: {};
  datatable: {
    searchQueryPlaceholder: string;
    searchQueryColumnIndicatorTooltip: string;
    actionsButton: string;
    filtersTooltipLabel: string;
    appliedFiltersCount: string;
    filtersPanelTitle: string;
    filtersPanelResetButton: string;
    filtersPanelSubmitButton: string;
    selectedRows: string;
    numberOfDisplayedRows: string;
    paginationInfo: string;
    refreshButtonTooltip: string;
    refreshAndResetAction: string;
  };
  excelImport?: {};
};
