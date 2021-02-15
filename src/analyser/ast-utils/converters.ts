import { Statement, isBlockStatement, blockStatement } from "@babel/types";

export function wrapSingleStmtWithBlock(stmt: Statement) {
  if (isBlockStatement(stmt)) {
    return stmt;
  } else {
    return blockStatement([stmt]);
  }
}
