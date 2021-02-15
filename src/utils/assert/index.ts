export function assert(expr?: boolean, message?: string) {
  if (!expr) {
    throw new Error(message || "Assertion failed.");
  }
}

export function unreachable(...args: any[]): never {
  console.log(...args);
  throw new Error(args[0]?.toString() ?? "Unreachable");
}
