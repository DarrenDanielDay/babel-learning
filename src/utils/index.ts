import * as BabelTypes from "@babel/types";
export * from "./type-guards";
export * from "./assert";
export * from "./types";
import { ScopeTree, Variables } from "../analyser/schema/tree";
import { isPrimitive } from "./type-guards";
let sourceCode: string = "";

export function show(...args: unknown[]) {
  console.log(...args);
}

export function dividor() {
  show("=".repeat(100));
}

export function setSource(code: string) {
  sourceCode = code;
}

export function showNode(...nodes: BabelTypes.Node[]) {
  nodes
    .map(
      (node) =>
        `${node.type}[${node.start}, ${node.end}]:"${sourceCode.slice(
          node.start!,
          node.end!
        )}"`
    )
    .forEach((code) => show(code));
}

export function astJson(node: BabelTypes.Node): string {
  return `{${Object.entries(node)
    .filter(
      ([key, value]) =>
        !["start", "end", "loc"].includes(key) && (value ?? null) !== null
    )
    .map(
      ([key, value]) =>
        `"${key}":${
          Array.isArray(value)
            ? `[${value.map((v: BabelTypes.Node) => astJson(v)).join(",")}]`
            : isPrimitive(value)
            ? JSON.stringify(value) ?? "null"
            : astJson(value)
        }`
    )
    .join(",")}}`;
}

export function toJson(obj: unknown) {
  return JSON.stringify(obj, undefined, 2);
}

export function showAstJson(node: BabelTypes.Node) {
  show(toJson(JSON.parse(astJson(node))));
}

export function varJson(vars: Variables) {
  return `{${[...vars.entries()]
    .map(([key, variable]) => `"${key}": ${JSON.stringify(variable)}`)
    .join(",")}}`;
}

export function scopeTreeJson(root: ScopeTree): string {
  return `{
    "entry":
      {
        ${[
          {
            key: "stmts",
            value: root.entry.stmts.map((stmt) => stmt.type as string),
          },
          // { key: "vars", value: varJson(root.entry.vars) },
          // { key: "refs", value: varJson(root.entry.refs) },
          { key: "isFunc", value: root.entry.isFuncScope },
        ]
          .filter((obj) => obj.value != null)
          .map(
            ({ key, value }) => `"${key}":${JSON.stringify(value) ?? "null"}`
          )
          .join(",")}
    },
    "children":[${root.children.map(scopeTreeJson).join(",")}]}`;
}

export function showScopeTree(root: ScopeTree) {
  show(toJson(JSON.parse(scopeTreeJson(root))));
}
