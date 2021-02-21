// @ts-nocheck
require("./prepare");
import { globalProxy, accessManager, SetProperty } from "./global-proxy";
export function main() {
  with (globalProxy) {
    const fs = require("fs");
    const path = require("path");
    const script = fs
      .readFileSync(
        path.resolve(process.cwd(), "packages/jquery/dist/jquery.js")
      )
      .toString("utf-8");
    eval(script);
    console.log(typeof window);
  }

  accessManager.accesses
    .filter((v): v is SetProperty => v.type === "set")
    .forEach((access) => {
      console.log(access);
    });
  console.log(global.window.$);
  console.log(global.$);
  
  with (global) {
    const fs = require("fs");
    const path = require("path");
    const script = fs
      .readFileSync(
        path.resolve(process.cwd(), "packages/jquery/dist/jquery.js")
      )
      .toString("utf-8");
    eval(script);
    console.log(typeof window);
  }

  // console.log(global.window.$);
  // console.log(global.$);
}
