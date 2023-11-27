# MIGRATION GUIDE

## UPCOMING CHANGES

### Breaking changes - Exported types

- RemoteTableData > RemoteDataSource
- TableFilter > DynamicFilter
- TableActionParams > ActionParams

## BUG FIXES

1. DATA TABLE

- Inconsistant / multiple triggers of table data resolving on query state change
- Inconsistant cell rendering / cell wrapping & overflow issues


2. FORM

- unwrap reactive breakpoint map that causes runtime scheduler issues
- 

3. EXCEL 

- Properly infer enum options when enum is a function


## NEW FEATURES & IMPROVEMENTS

1. FORM

- new FileUpload input type
- new MonthRange input type
- new date parsing & formatting system
- date i18n format
- new field API (get/set value, get other field options)
- improved type inferrence of output value for custom component fields
- Narrowed value type for transform / preformat depending on field type

2. DATA TABLE

- Change internal table renderer from AgGrid to NaiveUI's datatable
- New DataList component (New rendering mode for data tables)
- Expandable rows content
- Persisted grid columns control (show/hide, order, pin left/right)
- New optional sort control for table
- Auto-inferrence of table row data type from remote & datasource props
- If persistency is enabled, fieldKey is now properly required


3. OTHER

- x5 performance improvement on typescript inferrence on IDE (Especially DataTable schemas that were very heavy)
- i18n capabilities for the whole library
- Ability to override any default text of the UI components through i18n impl
- code-base complete restructuration to make code much more accessible, organized logically per features
- code-base cleanup, removal of all code duplication / unused code
