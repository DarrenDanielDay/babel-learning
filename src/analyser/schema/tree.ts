import {
  ArrowFunctionExpression,
  FunctionDeclaration,
  Method,
  Statement,
} from "@babel/types";
import { Field } from "./data-type";

export interface ITreeNode<T> {
  entry: T;
  children: ITreeNode<T>[];
  parent?: ITreeNode<T>;
}

export interface Variable {
  name: string;
  refFields: Field[];
}

export type Variables = Map<string, Variable>;

export interface ScopeEntry {
  isFuncScope?: true;
  stmts: Statement[];
  /**
   * Variables that declared in the scope.
   */
  vars: Variables;
  /**
   * Variables that referenced outside the scope.
   */
  refs: Variables;
}

export interface ScopeTree extends ITreeNode<ScopeEntry> {}

export type FunctionScopedItem =
  | FunctionDeclaration
  | ArrowFunctionExpression
  | Method;
