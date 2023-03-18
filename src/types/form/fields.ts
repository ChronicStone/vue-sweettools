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
import { Narrowable } from "./form";
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
}

export type TFieldTypes = `${FieldTypes}`;

type Dependencies = Record<string, unknown>;

export type _FieldOptions =
  | (number | string)[]
  | SelectOption[]
  | TreeSelectOption[]
  | CascaderOption[]
  | ((
      dependencies?: Dependencies,
      virtualDependencies?: Dependencies
    ) =>
      | SelectOption[]
      | TreeSelectOption[]
      | CascaderOption[]
      | (number | string)[])
  | ((
      dependencies?: Dependencies,
      virtualDependencies?: Dependencies
    ) => Promise<
      | SelectOption[]
      | TreeSelectOption[]
      | CascaderOption[]
      | (number | string)[]
    >);

export interface TextField {
  type: "text";
  clearable?: boolean;
  fieldParams?: {
    minLength?: number;
    maxLength?: number;
    showCharacterCount?: boolean;
    prefix?: string;
    suffix?: string;
    mask?: string | MaskOptions;
  };
}

export interface TreeSelectField {
  type: "tree-select";
  clearable?: boolean;
  options: _FieldOptions;
  fieldParams?: {
    cascade?: boolean;
    multiple?: boolean;
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
  };
}

export interface CascaderField {
  type: "cascader";
  clearable?: boolean;
  options: _FieldOptions;
  fieldParams?: {
    cascade?: boolean;
    multiple?: boolean;
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
    renderSwitcherIcon?: (
      option: CascaderOption,
      checked: boolean
    ) => VNodeChild;
    renderTag?: (option: CascaderOption, checked: boolean) => VNodeChild;
    filter?: (
      pattern: string,
      option: CascaderOption,
      path: CascaderOption[]
    ) => boolean;
    filterMenuProps?: Record<string, unknown>;
  };
}

export interface TextAreaField {
  type: "textarea";
  clearable?: boolean;
  fieldParams?: TextField["fieldParams"] & {
    autosize?: boolean | { minRows?: number; maxRows?: number };
    showCount?: boolean;
  };
}

export interface TagField {
  type: "tag";
  fieldParams?: {
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
  };
}

export interface PasswordField extends Omit<TextField, "type" | "pair"> {
  type: "password";
  clearable?: boolean;
  fieldParams?: Record<string, never>;
}

export interface SelectField {
  type: "select";
  clearable?: boolean;
  options: _FieldOptions;
  fieldParams?: {
    multiple?: boolean;
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
  };
}

export interface NumberField {
  type: "number";
  clearable?: boolean;
  fieldParams?: {
    min?: number;
    max?: number;
    step?: number;
  };
}

export interface RatingField {
  type: "rating";
  fieldParams?: {
    renderIcon?: () => VNodeChild;
    color?: string;
    iconCount?: number;
    size: "small" | "medium" | "large" | number;
    allowHalf?: boolean;
  };
}

export interface SliderField {
  type: "slider";
  fieldParams?: {
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
  };
}

export interface SwitchField {
  type: "switch";
  fieldParams?: {
    checkedStyle?: string;
    uncheckedStyle?: string;
    checkedValue?: string | boolean | number;
    uncheckedValue?: string | boolean | number;
  };
}

export interface RadioField {
  type: "radio";
  options: _FieldOptions;
}

export interface CheckboxField {
  type: "checkbox";
  fieldParams?: {
    checkedValue?: string | boolean | number;
    uncheckedValue?: string | boolean | number;
  };
}

export interface CheckboxGroupField {
  type: "checkbox-group";
  options: _FieldOptions;
  fieldParams?: {
    minChecked?: number;
    maxChecked?: number;
  };
}

export interface TimeField {
  type: "time";
  clearable?: boolean;
  fieldParams?: {
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
  };
}

export interface DateField {
  type: "date" | "datetime" | "daterange" | "datetimerange" | "month" | "year";
  clearable?: boolean;
  fieldParams?: {
    dateDisabled?: (current: number) => boolean;
    timeDisabled?: (current: number) => boolean;
    separator?: string;
  };
}

export interface ObjectField<
  FieldKey extends Narrowable = string,
  StoreKey extends string = string
> {
  type: "object";
  extraProperties?: boolean;
  gridSize?: number | string;
  fields: FormField<FieldKey, StoreKey>[];
  collapsible?: boolean;
  collapsed?: boolean;
}

export interface _ArrayField<
  FieldKey extends Narrowable = string,
  StoreKey extends string = string
> {
  extraProperties?: boolean;
  gridSize?: number | string;
  fields: FormField<FieldKey, StoreKey>[];
  collapsible?: boolean;
  collapsed?: boolean;
  headerTemplate?: (
    item: Record<string, GenericObject>,
    index: number
  ) => string;
}

export interface ArrayListField<
  FieldKey extends Narrowable = string,
  StoreKey extends string = string
> extends _ArrayField<FieldKey, StoreKey> {
  type: "array-list";
  listGridSize?: number | string;
  listItemSize?: number | string;
}

export interface ArrayTabsField<
  FieldKey extends Narrowable = string,
  StoreKey extends string = string
> extends _ArrayField<FieldKey, StoreKey> {
  type: "array-tabs";
}

export interface InfoField {
  type: "info";
  content: (
    dependencies?: Dependencies,
    virtualDependencies?: Dependencies
  ) => VNodeChild | string;
}

export interface CustomField {
  type: "custom-component";
  component: Component;
  fieldParams?: Record<string, unknown>;
  collapsible?: boolean;
  collapsed?: boolean;
}

export type FieldDescription = {
  title: string | (() => VNodeChild);
  content: string | (() => VNodeChild);
};

export type _BaseField<
  FieldKey extends Narrowable = string,
  StoreKey extends string = string
> = {
  label?:
    | string
    | ((
        dependencies?: Dependencies,
        virtualDependencies?: Dependencies
      ) => VNodeChild | string);
  key: FieldKey;
  placeholder?: string;
  dependencies?: (string | [string, string])[];
  virtualDependencies?: Array<StoreKey | [StoreKey, string]>;
  required?:
    | boolean
    | ((
        dependencies?: Dependencies,
        virtualDependencies?: Dependencies
      ) => boolean);
  size?: number | string;
  gridSize?: number | string;
  default?: unknown;
  fields?: FormField<FieldKey, StoreKey>[];
  conditionEffect?: "disable" | "hide";
  labelPosition?: "left" | "top";
  description?: string | (() => VNodeChild) | FieldDescription;
  fieldParams?: Record<string, unknown>;
  condition?: (
    dependencies?: Dependencies,
    virtualDependencies?: Dependencies
  ) => Promise<boolean> | boolean;
  preformat?: (value: unknown) => unknown;
  transform?: (value: unknown) => unknown;
  validators?:
    | ((
        dependencies?: Dependencies,
        virtualDependencies?: Dependencies
      ) => ValidationArgs)
    | ValidationArgs;
  watch?: (
    value: unknown,
    params: {
      setValue: (key: string, value: unknown) => void;
      getValue: (key: string) => void;
    }
  ) => void;
  ignore?: boolean;
};

export type FormField<
  FieldKey extends Narrowable = string,
  StoreKey extends string = string
> = _BaseField<FieldKey, StoreKey> &
  (
    | TextField
    | TextAreaField
    | PasswordField
    | SelectField
    | NumberField
    | SliderField
    | SwitchField
    | RadioField
    | CheckboxField
    | CheckboxGroupField
    | TimeField
    | DateField
    | ObjectField<FieldKey, StoreKey>
    | ArrayListField<FieldKey, StoreKey>
    | ArrayTabsField<FieldKey, StoreKey>
    | InfoField
    | CustomField
    | TreeSelectField
    | CascaderField
    | RatingField
    | TagField
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
};

export type FieldComponentEmits = {
  (e: "update:modelValue", value: unknown): void;
};
