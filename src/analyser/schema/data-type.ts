import { SelectKey } from "../../utils/types";

interface ObjectTypeMapping {
  Primitive: PrimitiveDescriber;
  PlainObject: PlainObjectDescriber;
  ThisFunction: ThisFunctionDescriber;
  ArrowFunction: ArrowFunctionDescriber;
}

export type ObjectTypes = keyof ObjectTypeMapping;

export type PrimitiveTypes = keyof PrimitiveTypeMapping;

interface PrimitiveTypeMapping {
  Number: number;
  String: string;
  Boolean: boolean;
  Null: null;
  Undefined: undefined;
  Symbol: symbol;
  BigInt: bigint;
}

export interface BaseTypeDescriber {
  objectType: ObjectTypes;
}

export type TypeDescriber = ObjectTypeMapping[keyof ObjectTypeMapping]

export interface PrimitiveDescriber extends BaseTypeDescriber {
  objectType: "Primitive";
  primitiveType: PrimitiveTypes;
}

export interface BaseField<KeyType extends KeyTypes> {
  keyType: KeyType;
  valueType: TypeDescriber;
  ranged: boolean;
}

export interface RangedField<KeyType extends RangeKeyTypes>
  extends BaseField<KeyType> {
  ranged: true;
}

export interface KeyField<KeyType extends KeyTypes = KeyTypes>
  extends BaseField<KeyType> {
  keyType: KeyType;
  ranged: false;
  key: PrimitiveTypeMapping[this["keyType"]];
}
export type RangeKeyTypes = SelectKey<PrimitiveTypes, "Number" | "String">;

export type KeyTypes = SelectKey<PrimitiveTypes, "Symbol"> | RangeKeyTypes;

type _KM<T extends KeyTypes> = T extends KeyTypes ? KeyField<T> : never;

type _RM<K extends RangeKeyTypes> = K extends RangeKeyTypes ? RangedField<K> : never;

export type Field = _KM<KeyTypes> | _RM<RangeKeyTypes>

export interface PlainObjectDescriber extends BaseTypeDescriber {
  objectType: "PlainObject";
  fields: Field[];
  /**
   * When prototype is `undefined` (not specified), it is `Object`.
   *
   * When prototype is `null`, it may comes from `Object.create(null)`.
   */
  prototypeDescriber?: TypeDescriber | null;
}

export interface ThisFunctionDescriber extends BaseTypeDescriber {
  objectType: "ThisFunction";
  arguments: {
    thisArgument: TypeDescriber;
    positionalArguments: TypeDescriber[];
    /**
     * The rest argument is the type for the array.
     */
    restArgument: TypeDescriber;
  };
  returns: TypeDescriber;
  bodyCode: string;
}

export interface ArrowFunctionDescriber extends BaseTypeDescriber {
  objectType: "ArrowFunction";
  arguments: {
    positionalArguments: TypeDescriber[];
    /**
     * The rest argument is the type for the array.
     */
    restArgument: TypeDescriber;
  };
  returns: TypeDescriber;
  bodyCode: string;
}
