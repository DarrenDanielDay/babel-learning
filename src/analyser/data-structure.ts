export interface SourceCode {
  fileName: string;
  fullPath: string;
  code: string;
}

export interface CodeAnalyseResult {
  exportNames: string[];
}

export enum APIType {
  Value,
  Function,
  Class,
}

export interface API {
  type: APIType;
}

export interface ValueAPI extends API {
  type: APIType.Value;
}

export interface FunctionAPI extends API {
  type: APIType.Function;
}

export type APIs = FunctionAPI | ValueAPI;
