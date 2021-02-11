import { parse } from "@babel/parser";
import * as BabelTypes from "@babel/types";
import { setSource, showNode } from "../utils";

export function main() {
  const source = `\
"use strict";
function foo(...args) {

}

module.exports.foo = foo
`;
  const node = parse(source);
  setSource(source);
  showNode(node);
  console.log(JSON.stringify(node.program.body, undefined, 2));
  node.program.body[0];
  BabelTypes.isTSAnyKeyword(node);
}
