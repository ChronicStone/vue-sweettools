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

export type NestedPaths<T> = T extends Array<infer U>
  ? `${NestedPaths<U>}`
  : T extends object
  ? {
      [K in keyof T & (string | number)]: K extends string
        ? `${K}` | `${K}.${NestedPaths<T[K]>}`
        : never;
    }[keyof T & (string | number)]
  : never;

export type NestedPathsForType<T, P> = T extends Array<infer U>
  ? NestedPathsForType<U, P>
  : T extends object
  ? {
      [K in keyof T & (string | number)]: K extends string
        ? T[K] extends P
          ? `${K}` | `${K}.${NestedPathsForType<T[K], P>}`
          : T[K] extends object
          ? `${K}.${NestedPathsForType<T[K], P>}`
          : never
        : never;
    }[keyof T & (string | number)]
  : never;

export type TypeFromPath<T extends GenericObject, Path extends string> = {
  [K in Path]: K extends keyof T
    ? T[K]
    : K extends `${infer P}.${infer S}`
    ? T[P] extends GenericObject
      ? TypeFromPath<T[P], S>
      : never
    : never;
}[Path];

export type NonNullableDeep<T> = T extends null | undefined ? never : T;

export type DeepRequired<T> = {
  [P in keyof T]-?: DeepRequired<NonNullableDeep<T[P]>>;
};

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

type Expect<T extends true> = T extends true ? true : false;

type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B
  ? 1
  : 2
  ? true
  : false;

export type MaybePromise<T> = T | Promise<T>;
