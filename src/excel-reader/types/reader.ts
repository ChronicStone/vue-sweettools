import type { ComputedRef, VNodeChild } from 'vue'
import type { MaybePromise, Narrowable, RemoveNeverProps, UnionToIntersection } from '@/_shared/types/utils'

export type PrimitiveValue = string | boolean | number | null

export type ImportSchemaField<FieldKey extends Narrowable = string> = {
  key: FieldKey
  transformKey?: string
  label: string
  ignoreOnReference?: boolean
  multiple?: boolean
  multipleSeparator?: string
  required?: boolean
  matchPattern?: RegExp
  caseInsensitive?: boolean
  enum?: (PrimitiveValue)[] | (() => MaybePromise<PrimitiveValue[]>)
  format?: Array<'trim' | 'lowercase' | 'uppercase' | 'number' | 'date'>
  transform?: (value: PrimitiveValue) => any
  cellRenderer?: (value: string | string[], field: ImportSchemaField<FieldKey>) => VNodeChild
} & ({
  enum: (PrimitiveValue)[] | (() => MaybePromise<PrimitiveValue[]>)
  example?: PrimitiveValue
} | {
  example: PrimitiveValue
})

export type ImportSchema<FieldKey extends Narrowable = string> = {
  fields: ImportSchemaField<FieldKey>[]
  onData?: (data: Record<string, unknown>[]) => MaybePromise<void | Record<string, unknown>[]>
}

export interface ExportColumnsSchema {
  label: string
  value: string | (() => string)
}

export type ImportInfoReturnType<T extends ImportSchema<any>['fields'][number]> =
  RemoveNeverProps<
    UnionToIntersection<
      | {
        // REQUIRED FALSE OR NOT DEFINED
        [K in T as K extends { required: false } | { required: undefined }
          ? never
          : K extends { transformKey: string }
            ? K['transformKey']
            : K['key']]: K extends { multiple: true }
          ? Array<ResolveFieldType<K>>
          : ResolveFieldType<K>;
      }
      | {
        [K in T as K extends { required: true }
          ? never
          : K extends { transformKey: string }
            ? K['transformKey']
            : K['key']]?: K extends { multiple: true }
          ? Array<ResolveFieldType<K>>
          : ResolveFieldType<K>;
      }
    >
  >

export type ResolveFieldType<T extends ImportSchemaField<any>> =
  T extends { transform: (value: any) => any }
    ? ReturnType<T['transform']>
    : T extends { enum: any }
      ? ExtractEnumType<T['enum']>
      : T extends { format: infer F }
        ? F extends [...any, infer Type]
          ? Type extends 'number'
            ? number
            : Type extends 'date'
              ? Date
              : string
          : string
        : string

export type ExtractEnumType<
  T extends ImportSchemaField['enum'],
  V = T extends Array<unknown>
    ? T[number]
    : T extends (...args: any) => Promise<Array<unknown>> | Array<unknown>
      ? Awaited<ReturnType<T>>[number]
      : string | number,
> = V extends { value: unknown }
  ? V['value']
  : V extends { key: unknown }
    ? V['key']
    : V

export type ExcelInstanceType = {
  invalidRows: ComputedRef<Record<string, unknown>[]>
  validRows: ComputedRef<Record<string, unknown>[]>
  exportInvalidRows: () => void
  downloadReferenceFile: () => void
}
