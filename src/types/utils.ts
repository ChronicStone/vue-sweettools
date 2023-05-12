export type Primitive = string | number | symbol;

export type GenericObject = Record<Primitive, unknown>;

export type Join<
  L extends Primitive | undefined,
  R extends Primitive | undefined
> = L extends string | number
  ? R extends string | number
    ? `${L}.${R}`
    : L
  : R extends string | number
  ? R
  : undefined;

export type Union<
  L extends unknown | undefined,
  R extends unknown | undefined
> = L extends undefined
  ? R extends undefined
    ? undefined
    : R
  : R extends undefined
  ? L
  : L | R;

export type NestedPaths<
  T extends GenericObject,
  Prev extends Primitive | undefined = undefined,
  Path extends Primitive | undefined = undefined
> = {
  [K in keyof T]: T[K] extends GenericObject
    ? NestedPaths<T[K], Union<Prev, Path>, Join<Path, K>>
    : Union<Union<Prev, Path>, Join<Path, K>>;
}[keyof T];

export type TypeFromPath<T extends GenericObject, Path extends string> = {
  [K in Path]: K extends keyof T
    ? T[K]
    : K extends `${infer P}.${infer S}`
    ? T[P] extends GenericObject
      ? TypeFromPath<T[P], S>
      : never
    : never;
}[Path];

type NonRecursive<T> = T extends Record<string, any>
  ? T & {
      [K in keyof T]-?: K extends keyof NonRecursive<T[K]> ? never : unknown;
    }
  : T;

export type DeepRequired<T> = NonRecursive<{
  [P in keyof T]-?: T[P] extends Record<string, any>
    ? DeepRequired<T[P]>
    : T[P];
}>;

export type RemoveNeverProps<T> = {
  [K in keyof T as T[K] extends never | undefined ? never : K]: T[K];
};

export type UnionToIntersection<U> = (
  U extends any ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;

export type ExpandRecursively<T> = T extends object
  ? T extends infer O
    ? { [K in keyof O]: ExpandRecursively<O[K]> }
    : never
  : T;

export type Narrowable =
  | string
  | number
  | boolean
  | symbol
  | object
  | undefined
  | void
  | null;
