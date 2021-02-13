export type SelectKey<Union extends string, K extends Union> = K;
export type PrimitiveTypes =
  | string
  | number
  | boolean
  | undefined
  | null
  | symbol
  | bigint;