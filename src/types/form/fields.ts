/* eslint-disable @typescript-eslint/no-explicit-any */
import { Primitive } from "./../utils";
import { GenericObject } from "@/types/utils";
import { Validation, ValidationArgs } from "@vuelidate/core";
import {
  CascaderOption,
  SelectGroupOption,
  SelectOption,
  TreeSelectOption,
  InputProps,
} from "naive-ui";
import { SelectBaseOption } from "naive-ui/es/select/src/interface";
import { Component, VNode, VNodeChild } from "vue";
import { Narrowable } from "../utils";
import { MaskOptions } from "maska";

export enum FieldTypes {
  TEXT = "text",
  NUMBER = "number",
  SELECT = "select",
  SWITCH = "switch",
  CHECKBOX = "checkbox",
  CHECKBOX_GROUP = "checkbox-group",
  RADIO = "radio",
  SLIDER = "slider",
  TEXTAREA = "textarea",
  PASSWORD = "password",
  DATE = "date",
  DATE_TIME = "datetime",
  DATE_RANGE = "daterange",
  DATE_TIME_RANGE = "datetimerange",
  MONTH = "month",
  YEAR = "year",
  TIME = "time",
  CUSTOM_COMPONENT = "custom-component",
  OBJECT = "object",
  ARRAY_LIST = "array-list",
  ARRAY_TABS = "array-tabs",
  INFO = "info",
  TREE_SELECT = "tree-select",
  RATING = "rating",
  TAG = "tag",
  CASCADER = "cascader",
  GROUP = "group",
  ARRAY_VARIANT = "array-variant",
  COLOR_PICKER = "color-picker",
}

export type TFieldTypes = `${FieldTypes}`;

export type Dependencies = Record<string, any>;

export type _CoreFieldOptions =
  | (number | string)[]
  | SelectOption[]
  | TreeSelectOption[]
  | CascaderOption[]
  | readonly (string | number)[]
  | readonly SelectOption[]
  | readonly TreeSelectOption[]
  | readonly CascaderOption[];

export type _FieldOptions<
  StoreData extends Record<string, unknown> = Record<string, unknown>
> =
  | _CoreFieldOptions
  | ((
      dependencies: Dependencies,
      virtualDependencies: StoreData
    ) => _CoreFieldOptions)
  | ((
      dependencies: Dependencies,
      virtualDependencies: StoreData
    ) => Promise<_CoreFieldOptions>);

export interface TextFieldProps {
  minLength?: number;
  maxLength?: number;
  showCharacterCount?: boolean;
  prefix?: string | (() => VNodeChild);
  suffix?: string | (() => VNodeChild);
  mask?: string | MaskOptions;
}

export interface TextField<
  StoreData extends Record<string, unknown> = Record<string, unknown>
> {
  type: "text";
  clearable?: boolean;
  fieldParams?:
    | TextFieldProps
    | ((deps: Dependencies, virtualDeps: StoreData) => TextFieldProps);
}

export interface TreeSelectFieldProps {
  cascade?: boolean;
  checkStrategy?: "all" | "parent" | "child";
  childrenField?: string;
  valueField?: string;
  labelField?: string;
  disabledField?: string;
  maxSelectedCount?: number | "responsive";
  clearFilterAfterSelect?: boolean;
  allowCheckingNotLoaded?: boolean;
  filterable?: boolean;
  placement?:
    | "top"
    | "top-start"
    | "top-end"
    | "bottom"
    | "bottom-start"
    | "bottom-end";
  remote?: boolean;
  separator?: string;
  showPath?: boolean;
  virtualScroll?: boolean;
  renderLabel?: (option: {
    option: TreeSelectOption;
    checked: boolean;
    selected: boolean;
  }) => VNodeChild;
  filter?: (
    pattern: string,
    option: TreeSelectOption,
    path: TreeSelectOption[]
  ) => boolean;
  filterMenuProps?: Record<string, any>;
}

export interface TreeSelectField<
  StoreData extends Record<string, unknown> = Record<string, unknown>
> {
  type: "tree-select";
  clearable?: boolean;
  multiple?: boolean;
  options: _FieldOptions<StoreData>;
  fieldParams?:
    | TreeSelectFieldProps
    | ((deps: Dependencies, virtualDeps: StoreData) => TreeSelectFieldProps);
}

export interface CascaderFieldParams {
  cascade?: boolean;
  checkable?: boolean;
  checkStrategy?: "all" | "parent" | "child";
  childrenField?: string;
  valueField?: string;
  labelField?: string;
  disabledField?: string;
  maxSelectedCount?: number | "responsive";
  clearFilterAfterSelect?: boolean;
  allowCheckingNotLoaded?: boolean;
  filterable?: boolean;
  placement?:
    | "top"
    | "top-start"
    | "top-end"
    | "bottom"
    | "bottom-start"
    | "bottom-end";
  remote?: boolean;
  separator?: string;
  showPath?: boolean;
  virtualScroll?: boolean;
  renderLabel?: (option: CascaderOption, checked: boolean) => VNodeChild;
  renderPrefix?: (option: CascaderOption, checked: boolean) => VNodeChild;
  renderSuffix?: (option: CascaderOption, checked: boolean) => VNodeChild;
  renderSwitcherIcon?: (option: CascaderOption, checked: boolean) => VNodeChild;
  renderTag?: (option: CascaderOption, checked: boolean) => VNodeChild;
  filter?: (
    pattern: string,
    option: CascaderOption,
    path: CascaderOption[]
  ) => boolean;
  filterMenuProps?: Record<string, unknown>;
}

export interface CascaderField<
  StoreData extends Record<string, unknown> = Record<string, unknown>
> {
  type: "cascader";
  clearable?: boolean;
  options: _FieldOptions<StoreData>;
  multiple?: boolean;
  fieldParams?:
    | CascaderFieldParams
    | ((deps: Dependencies, virtualDeps: StoreData) => CascaderFieldParams);
}

export interface TextAreaFieldParams extends TextFieldProps {
  autosize?: boolean | { minRows?: number; maxRows?: number };
  showCount?: boolean;
}

export interface TextAreaField<
  StoreData extends Record<string, unknown> = Record<string, unknown>
> {
  type: "textarea";
  clearable?: boolean;
  fieldParams?:
    | TextAreaFieldParams
    | ((deps: Dependencies, virtualDeps: StoreData) => TextAreaFieldParams);
}

export interface TagFieldParams {
  deletable?: boolean;
  type?: "default" | "primary" | "info" | "success" | "warning" | "error";
  size?: "small" | "medium" | "large";
  tagStyle?: string | Record<string, Primitive>;
  onCreate?:
    | ((label: string) => string)
    | ((label: string) => { label: string; value: string });
  rounded?: boolean;
  max?: number;
  inputProps?: InputProps;
  renderTag?:
    | ((tag: string, index: number) => VNodeChild)
    | ((tag: { label: string; value: string }, index: number) => VNodeChild);
}

export interface TagField<
  StoreData extends Record<string, unknown> = Record<string, unknown>
> {
  type: "tag";
  fieldParams?:
    | TagFieldParams
    | ((deps: Dependencies, virtualDeps: StoreData) => TagFieldParams);
}

export interface PasswordField<
  StoreData extends Record<string, unknown> = Record<string, unknown>
> extends Omit<TextField<StoreData>, "type" | "pair"> {
  type: "password";
  clearable?: boolean;
}

export interface SelectFieldParams {
  filterable?: boolean;
  renderLabel?: (
    option: SelectOption | SelectGroupOption,
    selected: boolean
  ) => VNodeChild;
  renderOption?: (info: {
    node: VNode;
    option: SelectOption | SelectGroupOption;
    selected: boolean;
  }) => VNodeChild;
  renderTag?: (props: {
    option: SelectBaseOption;
    handleClose: () => void;
  }) => VNodeChild;
  createTags?: boolean;
  virtualScroll?: boolean;
}

export interface SelectField<
  StoreData extends Record<string, unknown> = Record<string, unknown>
> {
  type: "select";
  clearable?: boolean;
  options: _FieldOptions<StoreData>;
  multiple?: boolean;
  fieldParams?:
    | SelectFieldParams
    | ((deps: Dependencies, virtualDeps: StoreData) => SelectFieldParams);
}

export interface NumberFieldParams {
  min?: number;
  max?: number;
  step?: number;
  prefix?: string | (() => VNodeChild);
  suffix?: string | (() => VNodeChild);
}

export interface NumberField<
  StoreData extends Record<string, unknown> = Record<string, unknown>
> {
  type: "number";
  clearable?: boolean;
  fieldParams?:
    | NumberFieldParams
    | ((deps: Dependencies, virtualDeps: StoreData) => NumberFieldParams);
}

export interface ColorPickerFieldParams {
  showPreview?: boolean;
  showAlpha?: boolean;
  renderLabel?: (color: string | null) => VNodeChild;
  modes?: Array<"rgb" | "hex" | "hsl" | "hsv">;
  swatches?: string[];
  actions?: Array<"clear" | "confirm">;
}

export interface ColorPickerField<
  StoreData extends Record<string, unknown> = Record<string, unknown>
> {
  type: "color-picker";
  fieldParams?:
    | ColorPickerFieldParams
    | ((deps: Dependencies, virtualDeps: StoreData) => ColorPickerFieldParams);
}

export interface RatingFieldParams {
  renderIcon?: () => VNodeChild;
  color?: string;
  iconCount?: number;
  size: "small" | "medium" | "large" | number;
  allowHalf?: boolean;
}

export interface RatingField<
  StoreData extends Record<string, unknown> = Record<string, unknown>
> {
  type: "rating";
  fieldParams?:
    | RatingFieldParams
    | ((deps: Dependencies, virtualDeps: StoreData) => RatingFieldParams);
}

export interface SliderFieldParams {
  min?: number;
  max?: number;
  step?: number;
  range?: boolean;
  reverse?: boolean;
  enableTooltip?: boolean;
  formatTooltip?: (value: number) => string | number;
  // alwaysShowTooltip?: boolean;
  // tooltipPlacement?:
  //     | "top-start"
  //     | "top"
  //     | "top-end"
  //     | "right-start"
  //     | "right"
  //     | "right-end"
  //     | "bottom-start"
  //     | "bottom"
  //     | "bottom-end"
  //     | "left-start"
  //     | "left"
  //     | "left-end";
  marks?: { [markValue: number]: string };
}

export interface SliderField<
  StoreData extends Record<string, unknown> = Record<string, unknown>
> {
  type: "slider";
  fieldParams?:
    | SliderFieldParams
    | ((deps: Dependencies, virtualDeps: StoreData) => SliderFieldParams);
}

export interface SwitchFieldParams {
  checkedStyle?: string;
  uncheckedStyle?: string;
  checkedValue?: string | boolean | number;
  uncheckedValue?: string | boolean | number;
}

export interface SwitchField<
  StoreData extends Record<string, unknown> = Record<string, unknown>
> {
  type: "switch";
  fieldParams?:
    | SwitchFieldParams
    | ((deps: Dependencies, virtualDeps: StoreData) => SwitchFieldParams);
}

export interface RadioField<
  StoreData extends Record<string, unknown> = Record<string, unknown>
> {
  type: "radio";
  options: _FieldOptions<StoreData>;
}

export interface CheckboxFieldParams {
  checkedValue?: string | boolean | number;
  uncheckedValue?: string | boolean | number;
}

export interface CheckboxField<
  StoreData extends Record<string, unknown> = Record<string, unknown>
> {
  type: "checkbox";
  fieldParams?:
    | CheckboxFieldParams
    | ((deps: Dependencies, virtualDeps: StoreData) => CheckboxFieldParams);
}

export interface CheckboxGroupFieldParams {
  minChecked?: number;
  maxChecked?: number;
}

export interface CheckboxGroupField<
  StoreData extends Record<string, unknown> = Record<string, unknown>
> {
  type: "checkbox-group";
  options: _FieldOptions<StoreData>;
  fieldParams?:
    | CheckboxGroupFieldParams
    | ((
        deps: CheckboxGroupFieldParams,
        virtualDeps: StoreData
      ) => CheckboxGroupFieldParams);
}

export interface TimeFieldParams {
  bottomActions?: Array<"now" | "confirm"> | null;
  displayedHours?: number | number[];
  displayedMinutes?: number | number[];
  displayedSeconds?: number | number[];
  disableHour?: (hour: number) => boolean;
  disableMinute?: (minute: number, hour: number | null) => boolean;
  disableSecond?: (
    second: number,
    minute: number | null,
    hour: number | null
  ) => boolean;
  format?: string;
  hourStep?: number;
  minuteStep?: number;
  secondStep?: number;
}

export interface TimeField<
  StoreData extends Record<string, unknown> = Record<string, unknown>
> {
  type: "time";
  clearable?: boolean;
  fieldParams?:
    | TimeFieldParams
    | ((deps: Dependencies, virtualDeps: StoreData) => TimeFieldParams);
}

export interface DateFieldParams {
  dateDisabled?: (current: number) => boolean;
  timeDisabled?: (current: number) => boolean;
  separator?: string;
}

export interface DateField<
  StoreData extends Record<string, unknown> = Record<string, unknown>
> {
  type: "date" | "datetime" | "daterange" | "datetimerange" | "month" | "year";
  clearable?: boolean;
  fieldParams?:
    | DateFieldParams
    | ((deps: Dependencies, virtualDeps: StoreData) => DateFieldParams);
}

export interface GroupField<
  FieldKey extends Narrowable = string,
  StoreData extends Record<string, unknown> = Record<string, unknown>
> {
  type: "group";
  gridSize?: number | string;
  fields: Array<
    Omit<_BaseField<FieldKey, StoreData>, "label"> &
      (
        | TextField<StoreData>
        | PasswordField<StoreData>
        | SelectField<StoreData>
        | NumberField<StoreData>
        | TimeField<StoreData>
        | DateField<StoreData>
        | TreeSelectField<StoreData>
        | CascaderField<StoreData>
        | ColorPickerField<StoreData>
      )
  >;
}

export interface ObjectFieldParams {
  frameless?: boolean;
}

export interface ObjectField<
  FieldKey extends Narrowable = string,
  StoreData extends Record<string, unknown> = Record<string, unknown>
> {
  type: "object";
  extraProperties?: boolean;
  gridSize?: number | string;
  fields: FormField<FieldKey, StoreData>[];
  collapsible?: boolean;
  collapsed?: boolean;
  fieldParam?:
    | ObjectFieldParams
    | ((deps: Dependencies, virtualDeps: StoreData) => ObjectFieldParams);
}

export interface _ArrayField<
  FieldKey extends Narrowable = string,
  StoreData extends Record<string, unknown> = Record<string, unknown>
> {
  extraProperties?: boolean;
  gridSize?: number | string;
  fields: FormField<FieldKey, StoreData>[];
  collapsible?: boolean;
  collapsed?: boolean;
  headerTemplate?: (item: Record<string, any>, index: number) => string;
  actions?: {
    [key in "deleteItem" | "moveUp" | "moveDown"]?:
      | boolean
      | ((
          value: Record<string, unknown>,
          dependencies: Record<string, unknown>,
          index: number
        ) => boolean);
  } & {
    addItem?:
      | boolean
      | ((
          values: Array<Record<string, unknown>>,
          dependencies: Record<string, unknown>
        ) => boolean);
    custom?: Array<{
      label: string;
      icon: string;
      condition?: (
        value: Record<string, unknown>,
        dependencies: Record<string, unknown>
      ) => boolean;
      action: (rowApi: ArrayCustomActionApi) => void;
    }>;
  };
}

export interface ArrayCustomActionApi {
  index: number;
  value: Record<string, unknown>;
  dependencies: Record<string, unknown>;
  getValue(key: string): unknown;
  setValue(key: string, value: unknown): void;
}

export type ArrayVariantField<
  FieldKey extends Narrowable = string,
  StoreData extends Record<string, unknown> = Record<string, unknown>
> = Omit<_ArrayField<FieldKey, StoreData>, "fields"> & {
  type: "array-variant";
  variantKey: string;
  variants: Array<{
    label: string;
    key: string | number;
    fields: FormField<FieldKey, StoreData>[];
  }>;
} & (
    | {
        displayMode: "tabs";
      }
    | {
        displayMode: "list";
        listGridSize?: number | string;
        listItemSize?: number | string;
      }
  );

export interface ArrayListField<
  FieldKey extends Narrowable = string,
  StoreData extends Record<string, unknown> = Record<string, unknown>
> extends _ArrayField<FieldKey, StoreData> {
  type: "array-list";
  listGridSize?: number | string;
  listItemSize?: number | string;
}

export interface ArrayTabsField<
  FieldKey extends Narrowable = string,
  StoreData extends Record<string, unknown> = Record<string, unknown>
> extends _ArrayField<FieldKey, StoreData> {
  type: "array-tabs";
}

export interface InfoField<
  StoreData extends Record<string, unknown> = Record<string, unknown>
> {
  type: "info";
  content: (
    dependencies: Dependencies,
    virtualDependencies: StoreData
  ) => VNodeChild | string;
}

export interface CustomField<
  StoreData extends Record<string, unknown> = Record<string, unknown>
> {
  type: "custom-component";
  component: Component;
  fieldParams?:
    | Record<string, unknown>
    | ((deps: Dependencies, virtualDeps: StoreData) => Record<string, unknown>);
  collapsible?: boolean;
  collapsed?: boolean;
}

export type FieldDescription = {
  title: string | (() => VNodeChild);
  content: string | (() => VNodeChild);
};

export type _BaseField<
  FieldKey extends Narrowable = string,
  StoreData extends Record<string, unknown> = Record<string, unknown>
> = {
  label?:
    | string
    | ((
        dependencies: Dependencies,
        virtualDependencies: StoreData
      ) => VNodeChild | string);
  key: FieldKey;
  placeholder?: string | (() => string);
  dependencies?: (string | [string, string])[];
  required?:
    | boolean
    | ((dependencies: Dependencies, virtualDependencies: StoreData) => boolean);
  size?: number | string;
  gridSize?: number | string;
  default?: unknown;
  fields?: FormField<FieldKey, StoreData>[];
  conditionEffect?: "disable" | "hide";
  labelPosition?: "left" | "top";
  description?: string | (() => VNodeChild) | FieldDescription;
  fieldParams?:
    | Record<string, unknown>
    | ((deps: Dependencies, virtualDeps: StoreData) => Record<string, unknown>);
  condition?: (
    dependencies: Dependencies,
    virtualDependencies: StoreData
  ) => Promise<boolean> | boolean;
  preformat?: (value: any) => unknown;
  transform?: (value: any) => unknown;
  validators?:
    | ((
        dependencies: Dependencies,
        virtualDependencies: StoreData
      ) => ValidationArgs)
    | ValidationArgs;
  watch?: (
    value: any,
    params: {
      setValue: (key: string, value: unknown) => void;
      getValue: (key: string) => void;
    }
  ) => void;
  onDependencyChange?: (
    dependencies: Dependencies,
    api: { setValue: (value: unknown) => void; getValue: () => unknown }
  ) => void;
  ignore?: boolean;
};

export type FormField<
  FieldKey extends Narrowable = string,
  StoreData extends Record<string, unknown> = Record<string, unknown>
> = _BaseField<FieldKey, StoreData> &
  (
    | TextField<StoreData>
    | TextAreaField<StoreData>
    | PasswordField<StoreData>
    | SelectField<StoreData>
    | NumberField<StoreData>
    | ColorPickerField<StoreData>
    | SliderField<StoreData>
    | SwitchField<StoreData>
    | RadioField<StoreData>
    | CheckboxField<StoreData>
    | CheckboxGroupField<StoreData>
    | TimeField<StoreData>
    | DateField<StoreData>
    | ObjectField<FieldKey, StoreData>
    | ArrayListField<FieldKey, StoreData>
    | ArrayTabsField<FieldKey, StoreData>
    | InfoField<StoreData>
    | CustomField<StoreData>
    | TreeSelectField<StoreData>
    | CascaderField<StoreData>
    | RatingField<StoreData>
    | TagField<StoreData>
    | GroupField<FieldKey, StoreData>
    | ArrayVariantField<FieldKey, StoreData>
  );

export type FieldContext = ReturnType<typeof useFieldContext>;

export type FieldComponentProps = {
  modelValue: unknown;
  field: FormField;
  context: FieldContext;
  parentDisabled: boolean;
  validator: Validation;
  collapsed: boolean;
  indent?: number;
  parentKey: string[];
  disabled: boolean;
  size?: string;
  groupLength?: number;
  group?: boolean;
};

export type FieldComponentEmits = {
  (e: "update:modelValue", value: unknown): void;
};
