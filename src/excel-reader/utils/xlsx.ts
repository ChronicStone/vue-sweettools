import type { IContent } from 'json-as-xlsx'
import JsonToXlsx from 'json-as-xlsx'
import type { ExportColumnsSchema, ImportSchema, ImportSchemaField } from '../types/reader'

export function exportExcel<T extends IContent>(
  data: T[],
  columns: ExportColumnsSchema[],
  fileName = `${Date.now()}.xlsx`,
) {
  const sheets = [
    {
      sheet: 'data',
      columns: [...columns],
      content: data,
    },
  ]

  JsonToXlsx(sheets, { fileName })
}

export function generateInportSchemaRefFile(fields: ImportSchemaField[]) {
  const getColumnsRef = () =>
    fields
      .map(field => ({ key: field.key, value: field }))
      .filter(({ value }) => !value.ignoreOnReference)

  const mapColumns = () =>
    getColumnsRef().map(({ key, value }) => ({
      label: `${key} ${value?.required ? '(*)' : ''}`,
      value: key,
    }))

  const mapMinimalExample = () => {
    const row: Record<string, string> = {}
    getColumnsRef()
      .filter(({ value }) => value?.required)
      .forEach(({ key, value: { example } }) => (row[key] = example))
    return row
  }

  const mapFullExample = () => {
    const row: Record<string, string> = {}
    getColumnsRef().forEach(
      ({ key, value: { example } }) => (row[key] = example),
    )
    return row
  }

  const sheets = [
    {
      sheet: 'ReferenceImport',
      columns: [...mapColumns()],
      content: [mapFullExample(), mapMinimalExample()],
    },
  ]

  JsonToXlsx(sheets, {
    fileName: 'ReferenceImport',
    writeOptions: {
      // type: 'buffer',
      bookType: 'xlsx',
    },
  })
}
