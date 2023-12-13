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

##### 1. FORM

- new FileUpload input type
- new MonthRange input type
- new date parsing & formatting system
- date i18n format
- new field API (get/set value, get other field options)
- improved type inferrence of output value for custom component fields
- Narrowed value type for transform / preformat depending on field type

##### 2. DATA TABLE

- Change internal table renderer from AgGrid to NaiveUI's datatable
- New DataList component (New rendering mode for data tables)
- Expandable rows content
- Persisted grid columns control (show/hide, order, pin left/right)
- New optional sort control for table
- Auto-inferrence of table row data type from remote & datasource props
- If persistency is enabled, fieldKey is now properly required

**TABLE QUERY IMPLEMENTATION CHANGES**

1. Exported types

From what I recall, VTEST API originally implemented the search engine by defining its own set of types (MatchMode, SortOrder, PropertyCondition ...)

That's kind of an issue because if changes happen on the API, you won't have any ts error expliciting what should be updated. Thus, i recommend installing sweettools as a dev dependency of API, & consume the exported types directly.

2. New 'arrayLookup' logic

Each filter now has an 'arrayLookup' property defined like this : 
```ts
type ArrayLookup = 'OR' | 'AND'
```

On the case the provided value is an array, this property will determine if the operator joining each value of the filter should be $or / $and.

Here's an example. First, we have a standard equals match with a string as filter value : 

```ts
const filter = {
  value: 'France',
  property: 'country',
  matchMode: 'equals',
}

const outputCondition = {
  [filter.property]: property.value
}
```

This behaves like it did before. But things change if the input value is an array :

```ts
const filter = {
  value: ['France', 'Spain'],
  property: 'country',
  matchMode: 'equals',
  arrayLookup: 'OR'
}

const outputCondition = {
  [filter.arrayLookup === 'AND' ? '$and' : '$or']: filter.value.map(value => ({
    [filter.property]: value
  }))
}
```
Of course the case where an objectId is provided still needed to be handled. 
In case arrayLookup is not defined, the search engine should default to $or operator.

This does not change much regarding the implementation of API, from what I remember it kind of already does this, the only change being that now the $or / $and operator to apply for arrays is controlled by the filter.



3. MatchMode changes

This slight change over how array values are handled allows standardized filters which all behave the same way.

Originally, we had dedicated match modes such as arrayContains to provide an array of UUIDs, and filter using a property from that array. Now equals is the right matchMode to do this.

Considering this, matchModes have been refactored & standardized. Here's the new Match Modes list : 

- `contains`
- `between`
- `equals`
- `notEquals`
- `greaterThan`
- `greaterThanOrEqual`
- `lessThan`
- `lessThanOrEqual`
- `exists`
- `arrayLength`
- `objectMatch`

Non-standard `arrayContains` has been removed, but also `arrayContainsObject` and `objectStringMap` which are replaced by `objectMatch`, which provides a much simpler object matching filter, which covers all the use cases arrayContainsObject and objectStringMap handled previously. 

##### 3. OTHER

- x5 performance improvement on typescript inferrence on IDE (Especially DataTable schemas that were very heavy)
- i18n capabilities for the whole library
- Ability to override any default text of the UI components through i18n impl
- code-base complete restructuration to make code much more accessible, organized logically per features
- code-base cleanup, removal of all code duplication / unused code
