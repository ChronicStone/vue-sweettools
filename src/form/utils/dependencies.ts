import type { FormField } from '../types/fields'
import type { GenericObject } from '@/_shared/types/utils'

export function mapFieldDependencies(
  arrayDependencies: Array<{ key: string; value: unknown }>,
) {
  const dependencies: GenericObject = {}
  for (const { key, value } of arrayDependencies) dependencies[key] = value
  return dependencies
}

export function preformatFieldDependencies(
  dependencies: Array<string | [string, string]> | undefined,
  formState: Record<string, unknown>,
  parentKey: string[] = [],
) {
  return (dependencies ?? [])
    .map(dependency =>
      typeof dependency === 'string'
        ? { source: dependency, target: dependency }
        : Array.isArray(dependency)
          ? { source: dependency[0], target: dependency[1] }
          : dependency,
    )
    .map(({ source, target }) => {
      return ({
        key: target,
        value: getObjectProperty(source, parentKey, formState),
      })
    })
}

export function resolveFieldDependencies(
  field: FormField,
  state: GenericObject,
  parentKey: string[] = [],
) {
  return mapFieldDependencies(
    (field?.dependencies ?? [])
      .map(dependency =>
        typeof dependency === 'string'
          ? { source: dependency, target: dependency }
          : Array.isArray(dependency)
            ? { source: dependency[0], target: dependency[1] }
            : dependency,
      )
      .map(({ source, target }) => ({
        key: target,
        value: getObjectProperty(source, parentKey, state),
      })),
  )
}
