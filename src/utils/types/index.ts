export type SelectKey<Union extends string, K extends Union> = K;
export type PrimitiveTypes =
  | string
  | number
  | boolean
  | undefined
  | null
  | symbol
  | bigint;
export type AnyArray = readonly unknown[];
export type TupleUnion<Arr extends AnyArray> = Arr extends [
  infer First,
  ...infer Rest
]
  ? First | TupleUnion<Rest>
  : never;
export type UnionToIntersection<U> = (
  U extends unknown ? (_: U) => void : never
) extends (_: infer T) => void
  ? T
  : never;
export type TypeGuard<U, S extends U> = (obj: U) => obj is S;
