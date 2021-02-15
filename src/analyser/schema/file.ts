export interface IFile {
  path: string;
  parentFolder: IFolder | null;
  fileName: string;
  content: string;
  read(): Promise<void>;
  write(content: string): Promise<void>;
}

export interface IFolder {
  folderName: string;
  path: string;
  subFolders: IFolder[];
  files: IFile[];
  parentFolder: IFolder | null;
  open(recursive: boolean): Promise<void>;
}
