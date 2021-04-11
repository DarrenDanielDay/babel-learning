import { parseSync, } from "@babel/core";
import { isExportDefaultDeclaration, isFile, isIdentifier } from "babel-types";
import { readFileSync } from "fs";
import glob from 'glob';
import { resolve } from "path";

function getFileContent(fileName: string) {
    return readFileSync(fileName).toString("utf-8");
}

const pattern = resolve(process.cwd(), "packages", "jquery", "src/**/*.js");
const files = glob.sync(pattern)
const out: string[] =  []
for (const file of files) {
    const result = parseSync(getFileContent(file));
    if (isFile(result)) {
        result.program.body.forEach((statement) => {
            if (isExportDefaultDeclaration(statement)) {
                const { declaration } = statement
                if(isIdentifier(declaration)) {
                    out.push(declaration.name)
                }
            }
        })
    }
}
console.log(out)