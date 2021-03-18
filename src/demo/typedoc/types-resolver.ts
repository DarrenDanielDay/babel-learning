import path from "path";

export interface ITypesResolver {
  getTypesAbsolutePath(packageName: string): string;
}

export class NodeModulesTypesResolver implements ITypesResolver {
  public static readonly $TYPES = "@types";
  public static readonly NODE_MODULES = "node_modules";

  constructor(protected projectRoot: string) {}

  getTypesAbsolutePath(packageName: string): string {
    return path.resolve(
      path.join(
        this.getNodeModulesPath(),
        NodeModulesTypesResolver.$TYPES,
        packageName
      )
    );
  }

  private getNodeModulesPath(): string {
    return path.join(this.projectRoot, NodeModulesTypesResolver.NODE_MODULES);
  }
}
