import { parse, parseExpression } from "@babel/parser";
import * as BabelTypes from "@babel/types"

const expression = parseExpression("typeof this === 'undefined' ? 0 : 1");

if (BabelTypes.isConditionalExpression(expression)) {
    console.log(BabelTypes.yieldExpression(expression).toString())
}

const message = "Hello, this a simple program.";