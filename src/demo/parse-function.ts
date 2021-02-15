import { parse } from "@babel/parser";
import * as BabelTypes from "@babel/types";
import { dfs } from "../analyser/algorithm";
import { buildScopeTree, emptyScopeTreeNode } from "../analyser/scope";
import {
  dividor,
  setSource,
  show,
  showAstJson,
  showNode,
  showScopeTree,
} from "../utils";
const source = `\
"use strict";
function foo(...args) {
  for (const obj of args) {
    if (obj === 1) {
      const obj = {
        foo() {
          var baz = 1;
          const bar = 2;
          if (obj === 1) {
            throw new Error("no");
          }
          (() => () => () => {})()()()
        }
      }
      return obj;
    } else 
      return args[0];
  }
  if (typeof this === 'undefined') var args = 1;
}
var a = 1;
module.exports.foo = foo
`;
export function main() {
  const node = parse(source);
  // setSource(source);
  // showNode(node);
  dividor();
  // showAstJson(node);
  const root = emptyScopeTreeNode();
  buildScopeTree(node, root, true);
  showAstJson(node);
  dividor();
  showScopeTree(root);
  dividor();
  let cnt = 0;
  [
    ...dfs(
      root,
      (node) => node.children,
      (node) => {
        if (node.entry.isFuncScope) cnt++;
      }
    ),
  ];
  show(cnt);
}
