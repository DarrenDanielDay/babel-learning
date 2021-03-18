import { geneTypeDoc } from './gene-type-doc';
import { ITypesResolver, NodeModulesTypesResolver } from './types-resolver';

export async function main() {
    const resolver: ITypesResolver = new NodeModulesTypesResolver(process.cwd());
    await geneTypeDoc({entryPoints: [resolver.getTypesAbsolutePath('jquery')]})
}

