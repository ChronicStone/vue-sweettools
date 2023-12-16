export type SweettoolsLocaleTemplate = {
  form?: {
    layout?: {
      multiStep?: { stepTitle?: string }
    }
    actions?: {
      nextButton?: string
      prevButton?: string
      submitButton?: string
      cancelButton?: string
    }
    validators?: {
      required?: string
      requiredIf?: string
      requiredUnless?: string
      sameAs?: string
      url?: string
      email?: string
      alpha?: string
      alphaNum?: string
      numeric?: string
      between?: string
      decimal?: string
      integer?: string
      ipAddress?: string
      macAddress?: string
      maxLength?: string
      maxValue?: string
      minLength?: string
      minValue?: string
      not?: string
      or?: string
      and?: string
      invalidObjectProperties?: string
      invalidArrayProperties?: string
      [key: string]: string | undefined
    }
    fields?: {
      array?: {
        headerTemplate?: string
        createItem?: string
        deleteItem?: string
        deleteItemConfirmationDialig: {
          title?: string
          message?: string
          confirmButton?: string
          cancelButton?: string
        }
        moveItemUp?: string
        moveItemDown?: string
      }
      text?: {
        defaultPlaceholder?: string
      }
      select?: {
        createItemButton?: string
        refreshOptionsButton?: string
      }
    }
  }
  datatable?: {
    sortPanelTitle?: string
    saveSort?: string
    clearSort?: string
    searchQueryPlaceholder?: string
    searchQueryColumnIndicatorTooltip?: string
    actionsButton?: string
    filtersTooltipLabel?: string
    appliedFiltersCount?: string
    filtersPanelTitle?: string
    filtersPanelResetButton?: string
    filtersPanelSubmitButton?: string
    selectedRows?: string
    numberOfDisplayedRows?: string
    paginationInfo?: string
    refreshButtonTooltip?: string
    refreshAndResetAction?: string
    noRowsToShow?: string
    sortAsc?: string
    sortDesc?: string
    columnsConfigButtonTooltip: string
    columnsConfigPanelTitle: string
    columnsConfigPanelResetButton: string

  }
  excelImport?: {
    downloadReferenceFileButton?: string
    dropFileOrBrowse?: string
    countValidRows?: string
    countInvalidRows?: string
    isValidTag?: string
    missingValue?: string
    value?: string
  }
}

export type LocaleDateFormatTemplate = {
  date: string
  datetime: string
  daterange: string
  datetimerange: string
  monthrange: string
  month: string
  year: string
}
