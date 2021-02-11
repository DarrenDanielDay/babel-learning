export interface ITreeNode<T> {
  entry: T;
  children: ITreeNode<T>[];
  parent?: ITreeNode<T>;
}
export interface IFile {
  path: string;
  content: string;
  read(): Promise<void>;
}

export interface IFolder {
  path: string;
  subFolders: IFolder[];
  files: IFile[];
  parentFolder: IFolder | null;
  open(recursive: boolean): Promise<void>;
}