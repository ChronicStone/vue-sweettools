import type { VNodeChild } from 'vue'
import type { Narrowable, RemoveNeverProps, UnionToIntersection } from '@/_shared/types/utils'

export type ImportSchema<
  M extends boolean = false,
  FieldKey extends Narrowable = string,
> = Array<{
  key: FieldKey
  label: string
  targetKey?: string
  cellRenderer?: (
    value: string | string[],
    field: ImportSchema<true>[number]
  ) => VNodeChild
  multiple?: boolean
  multipleSeparator?: string
  validation: {
    required: boolean
    rule?: RegExp
    caseInsensitive?: boolean
    enum2?: string[]
    enum?: M extends true ? any[] : any[] | (() => any | Promise<any>)
  }
  example: string
  format: {
    transform?: (value: unknown) => unknown
    trim?: boolean
    lowercase?: boolean
    uppercase?: boolean
    number?: boolean
  }
  ignoreOnReference?: boolean
}>

export interface ExportColumnsSchema {
  label: string
  value: string | (() => string)
}

export type ImportInfoReturnType<T extends ImportSchema<any, any>[number]> =
  RemoveNeverProps<
    UnionToIntersection<
      | {
        [K in T as K['validation']['required'] extends false
          ? never
          : K['targetKey'] extends string
            ? K['targetKey']
            : K['key']]: K['multiple'] extends true
          ? Array<ResolveFieldType<K>>
          : ResolveFieldType<K>;
      }
      | {
        [K in T as K['validation']['required'] extends true
          ? never
          : K['targetKey'] extends string
            ? K['targetKey']
            : K['key']]?: K['multiple'] extends true
          ? Array<ResolveFieldType<K>>
          : ResolveFieldType<K>;
      }
    >
  >

export type ResolveFieldType<T extends ImportSchema<any, any>[number]> =
  T['format']['transform'] extends (value: any) => any
    ? ReturnType<T['format']['transform']>
    : T['format']['number'] extends true
      ? number
      : T['validation']['enum'] extends Array<any>
        ? T['validation']['enum'][number]
        : string
