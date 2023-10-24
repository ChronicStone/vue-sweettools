import { SweettoolsLocaleTemplate } from "@/types/i18n";
import { DeepRequired } from "@/types/utils";

export const en: DeepRequired<SweettoolsLocaleTemplate> = {
  datatable: {
    searchQueryPlaceholder: "Search value",
    searchQueryColumnIndicatorTooltip:
      "This column is searchable through quick search",
    actionsButton: "Actions",
    filtersTooltipLabel: "Open filters",
    appliedFiltersCount: "({count}) active",
    filtersPanelTitle: "Filters",
    filtersPanelResetButton: "Reset",
    filtersPanelSubmitButton: "Search",
    selectedRows: "{count} selected",
    numberOfDisplayedRows: "{count} row | {count} rows",
    paginationInfo: "{start}-{end} of {total} rows",
    refreshButtonTooltip: "Refresh",
    refreshAndResetAction: "Reset & refresh",
    noRowsToShow: "No rows to show",
  },
  form: {
    layout: {
      multiStep: {
        stepTitle: "Step {index}",
      },
    },
    actions: {
      nextButton: "Next",
      prevButton: "Back",
      submitButton: "Submit",
      cancelButton: "Cancel",
    },
    validators: {
      required: "The field {property} is required",
      requiredIf: "The field {property} is required",
      requiredUnless: "The field {property} is required",
      sameAs: "The field {property} is required",
      url: "The provided value is not a valid URL",
      email: "The provided value is not a valid email address",
      alpha: "Only alphabetic characters are allowed",
      alphaNum: "Only alphanumeric characters are allowed",
      numeric: "Only numeric characters are allowed",
      between: "The field {property} is required",
      decimal: "The field {property} is required",
      integer: "The field {property} is required",
      ipAddress: "The field {property} is required",
      macAddress: "The field {property} is required",
      maxLength: "The field {property} is required",
      maxValue: "The field {property} is required",
      minLength: "The field {property} is required",
      minValue: "The field {property} is required",
      not: "The field {property} is required",
      or: "The field {property} is required",
      and: "The field {property} is required",
      invalidObjectProperties: "The field {property} has invalid properties",
      invalidArrayProperties:
        "The field {property} has items with invalid properties",
    },
    fields: {
      array: {
        headerTemplate: "Item {index}",
        createItem: "Create item",
        deleteItem: "Delete item",
        deleteItemConfirmationDialig: {
          title: "Delete item",
          message: "Are you sure you want to delete this item?",
          confirmButton: "Delete",
          cancelButton: "Cancel",
        },
        moveItemUp: "Move item up",
        moveItemDown: "Move item down",
      },
      text: {
        defaultPlaceholder: "Enter a value",
      },
      select: {
        refreshOptionsButton: "Refresh",
        createItemButton: "Create item",
      },
    },
  },
  excelImport: {
    downloadReferenceFileButton: "Download reference file",
    dropFileOrBrowse: "Drop excel file or browse",
    countInvalidRows: "{count} invalid",
    countValidRows: "{count} valid",
    isValidTag: "Is valid",
    missingValue: "Missing value",
    value: "Value",
  },
};
