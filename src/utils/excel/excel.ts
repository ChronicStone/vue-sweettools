import { ExportColumnsSchema, ImportSchema } from "@/types/execl";
import JsonToXlsx, { IContent } from "json-as-xlsx";

export function exportExcel<T extends IContent>(
  data: T[],
  columns: ExportColumnsSchema[],
  fileName = `${Date.now()}.xlsx`
) {
  const sheets = [
    {
      sheet: "invalid",
      columns: [...columns],
      content: data,
    },
  ];

  JsonToXlsx(sheets, { fileName });
}

export function generateInportSchemaRefFile(schema: ImportSchema) {
  const getColumnsRef = () =>
    schema
      .map((field) => ({ key: field.key, value: field }))
      .filter(({ value }) => !value.ignoreOnReference);

  const mapColumns = () =>
    getColumnsRef().map(({ key, value: { validation } }) => ({
      label: `${key} ${validation?.required ? "(*)" : ""}`,
      value: key,
    }));

  const mapMinimalExample = () => {
    const row: Record<string, string> = {};
    getColumnsRef()
      .filter(({ value }) => value?.validation?.required)
      .forEach(({ key, value: { example } }) => (row[key] = example));
    return row;
  };

  const mapFullExample = () => {
    const row: Record<string, string> = {};
    getColumnsRef().forEach(
      ({ key, value: { example } }) => (row[key] = example)
    );
    return row;
  };

  const sheets = [
    {
      sheet: "ReferenceImport",
      columns: [...mapColumns()],
      content: [mapFullExample(), mapMinimalExample()],
    },
  ];

  JsonToXlsx(sheets, {
    fileName: "ReferenceImport",
    writeOptions: {
      // type: 'buffer',
      bookType: "xlsx",
    },
  });
}
