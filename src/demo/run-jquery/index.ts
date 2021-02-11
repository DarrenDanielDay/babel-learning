import "./prepare";
import $ from "jquery";
import {
  isEqual,
  isFunction,
  isNumber,
  isString,
} from "../../utils/type-guards";
import { show } from "../../utils";

const visitedObjects = new Set<unknown>();

export function exploreAPI(name: string, api: unknown) {
  if (visitedObjects.has(api)) return;
  if (isFunction(api)) {
    show(`function ${name}(...${api.length})`);
  }
  if (
    isNumber(api) ||
    isString(api) ||
    Array.isArray(api) ||
    isEqual(api, null) ||
    isEqual(api, undefined)
  ) {
    show(`const ${name} =`, api);
    return;
  }
  visitedObjects.add(api);
  Object.entries(api as never).forEach(([childName, api]) =>
    exploreAPI(`${name}.${childName}`, api)
  );
}

export function main() {
  exploreAPI("$", $);
}
