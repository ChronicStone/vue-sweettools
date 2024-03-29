import type { Dependencies, FormField, ReadonlyFieldApi } from '../types/fields'

type MapFieldPropsParams = {
  field: FormField
  fieldProps:
    | Record<string, any>
    | ((deps: Dependencies, fieldApi: ReadonlyFieldApi) => Record<string, any>)
  dependencies: Dependencies
  fieldApi: ReadonlyFieldApi
  raw?: boolean
}

export function mapFieldProps({
  field,
  fieldProps: _fieldProps,
  dependencies,
  fieldApi,
  raw,
}: MapFieldPropsParams) {
  const fieldProps
    = typeof _fieldProps === 'function'
      ? _fieldProps(dependencies, fieldApi)
      : _fieldProps

  if (raw)
    return fieldProps

  switch (field.type) {
    case 'text':
    case 'textarea':
    case 'password':
      return {
        'show-count': fieldProps.showCount ?? false,
        'rows': fieldProps?.rows ?? 3,
        'autosize': fieldProps?.autosize ?? false,
        ...(fieldProps.minLength && { minlength: fieldProps.minLength }),
        ...(fieldProps.maxLength && { maxlength: fieldProps.maxLength }),
        ...(field.type === 'password' && { 'show-password-on': 'click' }),
        ...(fieldProps.mask && { mask: fieldProps.mask }),
      }
    case 'select':
      return {
        'filterable': fieldProps.filterable ?? true,
        'clearable': field.clearable ?? true,
        'multiple': field.multiple ?? false,
        'virtual-scroll': fieldProps.virtualScroll ?? false,
        ...(fieldProps.renderLabel && {
          'render-label': fieldProps.renderLabel,
        }),
        ...(fieldProps.renderOption && {
          'render-option': fieldProps.renderOption,
        }),
        ...(fieldProps.renderTag && { 'render-tag': fieldProps.renderTag }),
        'max-tag-count': fieldProps.maxSelectedCount ?? 'responsive',
        'tag': fieldProps.writable ?? false,
      }
    case 'tree-select':
      return {
        'cascade': fieldProps?.cascade ?? true,
        'clearable': field?.clearable ?? true,
        'multiple': field?.multiple ?? false,
        'check-strategy': fieldProps?.checkStrategy ?? 'all',
        ...(fieldProps.childrenField && {
          'children-field': fieldProps.childrenField,
        }),
        ...(fieldProps.valueField && { 'value-field': fieldProps.valueField }),
        ...(fieldProps.labelField && { 'label-field': fieldProps.labelField }),
        ...(fieldProps.disabledField && {
          'disabled-field': fieldProps.valueField,
        }),
        'max-tag-count': fieldProps?.maxSelectedCount ?? 'responsive',
        'clear-filter-after-select': fieldProps?.clearFilterAfterSelect ?? true,
        'allow-checking-not-loaded':
          fieldProps?.allowCheckingNotLoaded ?? false,
        'filterable': fieldProps?.filterable ?? true,
        'placement': fieldProps?.placement ?? 'bottom-start',
        'remote': fieldProps?.remote ?? false,
        'separator': fieldProps?.separator ?? '/',
        'show-path': fieldProps?.showPath ?? true,
        'virtual-scroll': fieldProps?.virtualScroll ?? false,
        ...(fieldProps.renderLabel && {
          'render-label': fieldProps.renderLabel,
        }),
        ...(fieldProps.filter && { filter: fieldProps.filter }),
        ...(fieldProps.filterMenuProps && {
          'filter-menu-props': fieldProps.filterMenuProps,
        }),
      }
    case 'cascader':
      return {
        'cascade': fieldProps?.cascade ?? true,
        'clearable': field?.clearable ?? true,
        'multiple': field?.multiple ?? false,
        'checkable': fieldProps?.checkable ?? false,
        'check-strategy': fieldProps?.checkStrategy ?? 'all',
        'max-tag-count': fieldProps?.maxSelectedCount ?? 'responsive',
        'clear-filter-after-select': fieldProps?.clearFilterAfterSelect ?? true,
        'allow-checking-not-loaded':
          fieldProps?.allowCheckingNotLoaded ?? false,
        'consistent-menu-width': fieldProps?.consistentMenuWidth ?? true,
        'default-expanded-keys': fieldProps?.defaultExpandedKeys ?? [],
        'filterable': fieldProps?.filterable ?? true,
        'placement': fieldProps?.placement ?? 'bottom-start',
        'remote': fieldProps?.remote ?? false,
        'separator': fieldProps?.separator ?? '/',
        'show-path': fieldProps?.showPath ?? true,
        'virtual-scroll': fieldProps?.virtualScroll ?? false,
        ...(fieldProps.renderLabel && {
          'render-label': fieldProps.renderLabel,
        }),
        ...(fieldProps.renderPrefix && {
          'render-prefix': fieldProps.renderPrefix,
        }),
        ...(fieldProps.renderSuffix && {
          'render-suffix': fieldProps.renderSuffix,
        }),
        ...(fieldProps.renderSwitcherIcon && {
          'render-switcher-icon': fieldProps.renderSwitcherIcon,
        }),
        ...(fieldProps.renderTag && { 'render-tag': fieldProps.renderTag }),
        ...(fieldProps.filter && { filter: fieldProps.filter }),
        ...(fieldProps.filterMenuProps && {
          'filter-menu-props': fieldProps.filterMenuProps,
        }),
        ...(fieldProps.childrenField && {
          'children-field': fieldProps.childrenField,
        }),
        ...(fieldProps.keyField && { 'key-field': fieldProps.valueField }),
        ...(fieldProps.labelField && { 'label-field': fieldProps.labelField }),
        ...(fieldProps.disabledField && {
          'disabled-field': fieldProps.valueField,
        }),
      }
    case 'number':
      return {
        'show-button': fieldProps.showIncrementButtons ?? true,
        ...(typeof fieldProps.min !== 'undefined' && { min: fieldProps.min }),
        ...(typeof fieldProps.max !== 'undefined' && { max: fieldProps.max }),
        ...(typeof fieldProps.step !== 'undefined'
        && fieldProps.step && { step: fieldProps.step }),
      }
    case 'rating':
      return {
        'allow-half': fieldProps.allowHalf ?? false,
        'count': fieldProps.iconCount ?? 5,
        'size': fieldProps.iconSize ?? 'medium',
        'color': fieldProps.iconColor ?? '#f7ba2a',
      }
    case 'slider':
      return {
        'min': fieldProps.min ?? 0,
        'max': fieldProps.max ?? 100,
        'step': fieldProps.step ?? 1,
        'range': fieldProps.range ?? false,
        'reverse': fieldProps.reverse ?? false,
        'tooltip': fieldProps.showTooltip ?? true,
        'format-tooltip':
          fieldProps.formatTooltip
          ?? function (value: number) {
            return value
          },
        ...(fieldProps.marks && { marks: fieldProps.marks }),
      }
    case 'switch':
      return {
        'checked-value': fieldProps.checkedValue ?? true,
        'default-value': fieldProps.defaultValue ?? false,
        ...(fieldProps.checkedStyle && {
          'checked-style': fieldProps.checkedStyle,
        }),
        ...(fieldProps.uncheckedStyle && {
          'unchecked-style': fieldProps.uncheckedStyle,
        }),
      }
    case 'color-picker':
      return {
        'show-preview': fieldProps.showPreview ?? false,
        'show-alpha': fieldProps.showAlpha ?? true,
        'modes': fieldProps.modes ?? ['hex', 'rgb', 'hsl'],
        'swatches': fieldProps.swatches ?? [],
        'actions': fieldProps.actions ?? ['confirm', 'clear'],
        ...(fieldProps.renderLabel && {
          'render-label': fieldProps.renderLabel,
        }),
      }
    case 'checkbox':
      return {
        'default-checked': fieldProps.defaultChecked ?? false,
        'indeterminate': fieldProps.hasThirdState ?? false,
        ...(fieldProps.uncheckedValue && {
          'unchecked-value': fieldProps.uncheckedValue,
        }),
        ...(fieldProps.checkedValue && {
          'checked-value': fieldProps.checkedValue,
        }),
      }
    case 'checkbox-group':
      return {
        ...(fieldProps.minChecked && { min: fieldProps.minChecked }),
        ...(fieldProps.maxChecked && { max: fieldProps.maxChecked }),
      }
    case 'time':
      return {
        actions: fieldProps.bottomActions ?? ['clear', 'confirm'],
        use12HoursFormat: fieldProps.use12HoursFormat ?? false,
        ...(fieldProps.format && { format: fieldProps.format }),
        ...(fieldProps.displayedHours && { hours: fieldProps.displayedHours }),
        ...(fieldProps.displayedMinutes && {
          minutes: fieldProps.displayedMinutes,
        }),
        ...(fieldProps.displayedSeconds && {
          seconds: fieldProps.displayedSeconds,
        }),
        ...(fieldProps.disableHour && {
          'is-hour-disabled': fieldProps.disableHour,
        }),
        ...(fieldProps.disableMinute && {
          'is-minute-disabled': fieldProps.disableMinute,
        }),
        ...(fieldProps.disableSecond && {
          'is-second-disabled': fieldProps.disableSecond,
        }),
        ...(fieldProps.hourStep && { hours: fieldProps.hourStep }),
        ...(fieldProps.minuteStep && { minutes: fieldProps.minuteStep }),
        ...(fieldProps.secondStep && { seconds: fieldProps.secondStep }),
      }
    case 'date':
    case 'datetime':
    case 'daterange':
    case 'datetimerange':
    case 'monthrange':
    case 'month':
    case 'year':
      return {
        ...(fieldProps.separator && { separator: fieldProps.separator }),
        ...(fieldProps.format && { format: fieldProps.format }),
        ...(fieldProps.dateDisabled && {
          'is-date-disabled': fieldProps.dateDisabled,
        }),
        ...(fieldProps.timeDisabled && {
          'is-time-disabled': fieldProps.timeDisabled,
        }),
      }
    case 'tag':
      return {
        round: fieldProps?.rounded ?? false,
        deletable: fieldProps?.deletable ?? true,
        type: fieldProps?.type ?? 'default',
        size: fieldProps?.size ?? 'medium',
        ...(fieldProps.tagStyle && { 'tag-style': fieldProps.tagStyle }),
        ...(fieldProps.max && { 'tag-style': fieldProps.max }),
        ...(fieldProps.onCreate && { 'on-create': fieldProps.onCreate }),
        ...(fieldProps.inputProps && { 'input-props': fieldProps.inputProps }),
        ...(fieldProps.renderTag && { 'input-props': fieldProps.renderTag }),
      }
    case 'upload':
      return {
        'abstract': fieldProps.abstract ?? false,
        'accept': fieldProps.accept ?? undefined,
        'action': fieldProps.action ?? undefined,
        'create-thumbnail-url': fieldProps.createThumbnailUrl ?? undefined,
        'default-file-list': fieldProps.defaultFileList ?? [],
        'default-upload': fieldProps.uploadOnSelection ?? true,
        'directory': fieldProps.allowDirectory ?? false,
        'directory-dnd': fieldProps.enableDragDrop ?? true,
        'file-list-style': fieldProps.fileListStyle ?? {},
        'input-props': fieldProps.inputProps ?? undefined,
        'image-group-props': fieldProps.imageGroupProps ?? undefined,
        'max': fieldProps.max ?? undefined,
        'multiple': field.multiple ?? false,
        'list-type': fieldProps.listType ?? 'image',
        'render-icon': fieldProps.renderFileIcon ?? undefined,
        'should-use-thumbnail-url':
          fieldProps.shouldUseThumbnailUrl ?? undefined,
        'show-trigger': true,
        'show-cancel-button': fieldProps.showCancelButton ?? true,
        'show-download-button': fieldProps.showDownloadButton ?? true,
        'show-file-list': fieldProps.showFileList ?? true,
        'show-preview-button': fieldProps.showPreviewButton ?? true,
        'show-remove-button': fieldProps.showRemoveButton ?? true,
        'show-retry-button': fieldProps.showRetryButton ?? true,
      }
    case 'object':
    case 'array-list':
    case 'array-tabs':
    default:
      return {}
  }
}
