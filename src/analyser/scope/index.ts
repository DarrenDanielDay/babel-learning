import {
  isArrowFunctionExpression,
  isBlockStatement,
  isDoWhileStatement,
  isExpression,
  isForOfStatement,
  isForStatement,
  isFunctionDeclaration,
  isFunctionExpression,
  isIfStatement,
  isMethod,
  isNode,
  isWhileStatement,
  Node,
  returnStatement,
} from "@babel/types";
import { isForInStatement } from "babel-types";
import { isPrimitive, withLeastOneConstraint } from "../../utils";
import { unreachable } from "../../utils/assert";
import { ScopeTree } from "../schema";
import { wrapSingleStmtWithBlock } from "../ast-utils";

export function emptyScopeTreeNode(parent?: ScopeTree): ScopeTree {
  return {
    entry: {
      stmts: [],
      vars: new Map(),
      refs: new Map(),
    },
    children: [],
    parent,
  };
}

/**
 * Wrap cases of single statement/expression of block. For example:
 *
 * ```js
 * if (a === 1) doSomething();
 * // After convert:
 * if (a === 1) { doSomething(); }
 *
 * const mapper = (obj) => obj.foo;
 * // After convert:
 * const mapper = (obj) => { return obj.foo; };
 * ```
 * @param astNode the ast node
 */
export function wrapSingleStmt(astNode: Node) {
  if (
    withLeastOneConstraint(
      isForStatement,
      isForInStatement,
      isForOfStatement,
      isWhileStatement,
      isDoWhileStatement
    )(astNode)
  ) {
    astNode.body = wrapSingleStmtWithBlock(astNode.body);
  } else if (isIfStatement(astNode)) {
    astNode.consequent = wrapSingleStmtWithBlock(astNode.consequent);
    astNode.alternate &&
      (astNode.alternate = wrapSingleStmtWithBlock(astNode.alternate));
  } else if (isArrowFunctionExpression(astNode)) {
    if (isExpression(astNode.body)) {
      astNode.body = wrapSingleStmtWithBlock(returnStatement(astNode.body));
    }
  }
}
export function buildScopeTree(
  astNode: unknown,
  parent: ScopeTree,
  isFunc: boolean
) {
  if (isPrimitive(astNode)) {
    return;
  }
  if (Array.isArray(astNode)) {
    for (const childNode of astNode) {
      if (isNode(childNode)) {
        buildScopeTree(childNode, parent, false);
        continue;
      }
      return unreachable("All array items must be node.", childNode);
    }
    return;
  }
  if (isNode(astNode)) {
    wrapSingleStmt(astNode);
    if (isBlockStatement(astNode)) {
      const newNode = emptyScopeTreeNode(parent);
      isFunc && (newNode.entry.isFuncScope = isFunc);
      parent.children.push(newNode);
      newNode.entry.isFuncScope;
      newNode.entry.stmts.push(...astNode.body);
      // Set the new node to be the parent node for child nodes.
      parent = newNode;
    }
    isFunc = withLeastOneConstraint(
      isFunctionExpression,
      isFunctionDeclaration,
      isMethod,
      isArrowFunctionExpression
    )(astNode);
    for (const value of Object.values(astNode)) {
      buildScopeTree(value, parent, isFunc);
    }
    return;
  }
}

export function analyseFuncAndVar(scopeTree: ScopeTree) {
  scopeTree;
}
