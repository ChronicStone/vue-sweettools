import type {
  DataSource,
  FilterBuilderProperty,
  InferTableParams,
} from "../types/shared";
import type { DataListSchema } from "../types/datalist";
import type { DataTableSchema } from "../types/datatable";

export function buildTableSchema<
  Source extends DataSource<any, false>,
  const Schema extends DataTableSchema<false, Source, InferTableParams<Source>>,
>(schema: Schema): Schema;
export function buildTableSchema<
  Source extends DataSource<any, true>,
  const Schema extends DataTableSchema<true, Source, InferTableParams<Source>>,
>(schema: Schema): Schema;
export function buildTableSchema(schema: DataTableSchema<any, any, any>) {
  return schema;
}

export function buildListSchema<
  Source extends DataSource<any, false>,
  const Schema extends DataListSchema<false, Source, InferTableParams<Source>>,
>(schema: Schema): Schema;
export function buildListSchema<
  Source extends DataSource<any, true>,
  const Schema extends DataListSchema<true, Source, InferTableParams<Source>>,
>(schema: Schema): Schema;
export function buildListSchema(schema: DataListSchema<any, any, any>) {
  return schema;
}

export function defineFilterProperty(params: FilterBuilderProperty) {
  return params;
}
