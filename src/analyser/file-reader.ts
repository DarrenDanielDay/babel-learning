import path from "path";
import { dfsAsync } from "./algorithm";
const fs: typeof import("fs/promises") = require("fs").promises;

export async function* walk<R>(rootFolder: string, onFile: (file: string) => R): AsyncGenerator<R, void, unknown> {
  const childFolders = async (folder: string) => {
    const childFolders = await fs.readdir(folder);
    return childFolders.map(childFolder => path.join(folder, childFolder));
  }
  yield* dfsAsync(rootFolder, childFolders, (file) => {
    return Promise.resolve(onFile(file));
  });
}