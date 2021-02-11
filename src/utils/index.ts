import * as BabelTypes from "@babel/types";

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
