import path from "path";
import * as typedoc from "typedoc";

export interface GeneTypeDocConfig {
  entryPoints?: string[];
  outDir?: string;
  jsonFileName?: string;
}

export async function geneTypeDoc(config?: GeneTypeDocConfig) {
  const {
    entryPoints = ["src"],
    outDir = "gene-typedoc",
    jsonFileName = "documentation.json",
  } = config || {};
  const app = new typedoc.Application();

  // If you want TypeDoc to load tsconfig.json / typedoc.json files
  app.options.addReader(new typedoc.TSConfigReader());
  app.options.addReader(new typedoc.TypeDocReader());

  app.bootstrap({
    // typedoc options here
    entryPoints: entryPoints,
  });

  const project = app.convert();

  if (project) {
    // Project may not have converted correctly

    // Rendered docs
    await app.generateDocs(project, outDir);
    // Alternatively generate JSON output
    await app.generateJson(project, path.join(outDir, jsonFileName));
  }
}
