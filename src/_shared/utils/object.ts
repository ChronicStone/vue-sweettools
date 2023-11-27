import { deepmerge } from 'deepmerge-ts'
import type { GenericObject } from '@/_shared/types/utils'

function getPropertyFromPath(
  path: string | (string | number)[],
  obj: GenericObject,
  key = '',
) {
  const offset = getObjectPropertyPathOffset(key)
  const properties = [
    ...(Array.isArray(path) ? path : path.split('.'))
      .map((pathKey, index, array) => index < array.length - offset ? pathKey : null,
      )
      .filter(pathKey => pathKey != null),
    ...key.split('.').slice(1),
  ]

  return properties.reduce(
    (prev, curr) => prev && prev[curr as string],
    obj as any,
  )
}

function getObjectPropertyPathOffset(key: string) {
  try {
    if (!key)
      return 0
    const offset = key.split('.')[0].split(':').pop()
    return offset && !Number.isNaN(+offset) ? +offset : 0
  }
  catch (err) {
    return 0
  }
}

export function mapRelativeKeyPath(
  path: string | (string | number)[],
  key = '',
) {
  const offset = getObjectPropertyPathOffset(key)
  return [
    ...(Array.isArray(path) ? path : path.split('.'))
      .map((pathKey, index, array) => index < array.length - offset ? pathKey : null,
      )
      .filter(pathKey => pathKey != null),
    ...key.split('.').slice(1),
  ] as Array<string | number>
}

function setPropertyFromPath(
  object: Record<string, unknown>,
  path: string | (string | number)[],
  value: any,
  key = '',
) {
  const properties = mapRelativeKeyPath(path, key)
  properties.reduce(
    (o, p, i) => (o[p as string]
          = properties.length === ++i ? value : o[p as string] || {}),
    object,
  )
}

export function setObjectProperty(
  params: {
    key: string
    object: Record<string, unknown>
    value: any
  }& ({ scoped: false } | { scoped: true, parentKey: (string | number)[] }),
) {
  if (params.key === '$root' && params.scoped)
    Object.assign(params.object, params.value)
  else if (params.key.includes('$parent') && params.scoped)
    setPropertyFromPath(params.object, [...(params.parentKey ?? [])], params.value, params.key)
  else return setPropertyFromPath(params.object, params.key, params.value)
}

export function getObjectProperty(
  params: {
    key: string
    object: Record<string, unknown>
  }& ({ scoped: false } | { scoped: true, parentKey: (string | number)[] }),
) {
  if (params.key === '$root' && params.scoped)
    return params.object
  else if (params.key.includes('$parent') && params.scoped)
    return getPropertyFromPath([...(params.parentKey ?? [])], params.object, params.key)
  else return getPropertyFromPath(params.key, params.object)
}

export function getObjectPropertyFullPath(
  key: string,
  parentKey: (string | number)[],
) {
  if (key.startsWith('$parent'))
    return mapRelativeKeyPath(parentKey, key)
  else return mapRelativeKeyPath(key)
}

export function pipeMergeObject<T>(...args: T[]) {
  return args.reduce((acc, curr) => deepmerge(acc as any, curr as any), {})
}
