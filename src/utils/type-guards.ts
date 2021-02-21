import { PrimitiveTypes, TupleUnion, UnionToIntersection } from "./types";

export const isNumber = (obj: unknown): obj is number =>
  typeof obj === "number";
export const isString = (obj: unknown): obj is string =>
  typeof obj === "string";
export const isBoolean = (obj: unknown): obj is boolean =>
  typeof obj === "boolean";
export const isSymbol = (obj: unknown): obj is symbol =>
  typeof obj === "symbol";
export const isBigInt = (obj: unknown): obj is bigint =>
  typeof obj === "bigint";
export const isFunction = (obj: unknown): obj is Function =>
  typeof obj === "function";
export const isUndefined = (obj: unknown): obj is undefined =>
  typeof obj === "undefined";
export const isEqual = <T>(obj: unknown, value: T): obj is T => obj === value;
export const isPrimitive = (obj: unknown): obj is PrimitiveTypes =>
  ["number", "string", "boolean", "undefined", "symbol", "bigint"].some(
    (typeName) => typeof obj === typeName
  ) || obj === null;
export const isTSObject = (obj: unknown): obj is object => typeof obj === "object" && obj !== null;
export const withConstraint = <U, T extends U>(fn: (obj: U) => obj is T) => (
  o: U
): o is T => fn(o);
type GuardUnion<Arr extends ((o: any) => o is unknown)[]> = Arr extends ((
  o: any
) => o is infer R)[]
  ? R
  : never;
type GuardIntersection<
  Arr extends ((o: any) => o is unknown)[]
> = UnionToIntersection<GuardUnion<Arr>>;
export const withLeastOneConstraint = <
  S extends U,
  T extends ((obj: U) => obj is S)[],
  U = Parameters<T[0]>[0]
>(
  ...fns: T
): ((o: U) => o is GuardUnion<T>) => (o: U): o is GuardUnion<T> =>
  fns.some((fn) => fn(o));
export const withAllConstraints = <
  S extends U,
  T extends ((obj: U) => obj is S)[],
  U = Parameters<T[0]>[0]
>(
  ...fns: T
): ((o: any) => o is GuardIntersection<T>) => (
  o: any
): o is GuardIntersection<T> => fns.every((fn) => fn(o));
