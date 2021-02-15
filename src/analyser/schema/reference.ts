interface ReferenceTypeMapping {
  Read: unknown;
  Write: unknown;
}

export interface BaseReference {
  refType: keyof ReferenceTypeMapping;
}
