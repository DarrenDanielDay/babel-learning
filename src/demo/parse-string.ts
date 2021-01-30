import { parseExpression } from "@babel/parser";
import * as BabelTypes from "@babel/types";
import { dividor, setSource, show, showNode } from "../utils";

export function main() {
  const source = "typeof this === 'undefined' ? 0 : 1";
  setSource(source);
  const expression = parseExpression(source);
  if (BabelTypes.isConditionalExpression(expression)) {
    const { test, consequent, alternate } = expression;
    showNode(test, consequent, alternate);
    dividor();
    if (BabelTypes.isBinaryExpression(test)) {
      const { operator, left, right } = test;
      show(operator);
      showNode(left, right);
      dividor();
      if (BabelTypes.isUnaryExpression(left)) {
        const { argument, operator } = left;
        show(operator);
        showNode(argument);
      }
    }
  }
}
