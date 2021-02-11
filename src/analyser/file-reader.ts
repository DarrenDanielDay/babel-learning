import path from "path";
import { dfsAsync } from "./algorithm";
import { IFile, IFolder } from "./schema/data-structure";
const fs: typeof import("fs/promises") = require("fs").promises;

export async function* walk<R>(
  rootFolder: string,
  onFile: (file: string) => R
): AsyncGenerator<R, void, unknown> {
  const childFolders = async (folder: string) => {
    const childFolders = await fs.readdir(folder);
    return childFolders.map((childFolder) => path.join(folder, childFolder));
  };
  yield* dfsAsync(rootFolder, childFolders, (file) => {
    return Promise.resolve(onFile(file));
  });
}

export class LocalFile implements IFile {
  content: string = "";
  constructor(public path: string) {}
  async read() {
    this.content = await fs.readFile(this.path, { encoding: "utf-8" });
  }
}

export class LocalFolder implements IFolder {
  subFolders: IFolder[] = [];
  files: IFile[] = [];
  parentFolder: IFolder | null = null;
  constructor(public path: string) {}
  async open(recursive: boolean = true): Promise<void> {
    const subPaths = await fs.readdir(this.path);
    const stats = await Promise.all(
      subPaths.map((subPath) =>
        fs.stat(subPath).then((stat) => ({
          isFolder: stat.isDirectory(),
          isFile: stat.isFile(),
          path: subPath,
        }))
      )
    );
    const folders = stats.filter((stat) => stat.isFolder);
    const files = stats.filter((stat) => stat.isFile);
    this.subFolders.length = 0;
    this.subFolders.push(
      ...folders.map((folder) => new LocalFolder(folder.path))
    );
    this.files.length = 0;
    this.files.push(...files.map((file) => new LocalFile(file.path)));
    if (!recursive) return;
    await Promise.all(this.files.map(file => file.read()));
    await Promise.all(this.subFolders.map((folder) => folder.open(recursive)));
  }
}
