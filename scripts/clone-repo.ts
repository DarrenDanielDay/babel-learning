import os from "os";
import path from "path";
import fs from "fs";
import http from "isomorphic-git/http/node";
import * as git from "isomorphic-git";

const dirName = "packages";
const packageFolder = path.resolve(process.cwd(), dirName);

interface CloneArguments {
  url?: string;
  packageName?: string;
}

function parseArgs(): CloneArguments {
  const { argv } = process;
  const result: Partial<CloneArguments> = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith("-")) {
      i++;
      result[parseArgName(arg) as keyof CloneArguments] = argv[i];
    }
  }
  return result as CloneArguments;
}

function parseArgName(argName: string) {
  let i = 0;
  while (argName[i] === "-") i++;
  argName = argName.slice(i);
  return argName
    .split("-")
    .map((value, i) =>
      i === 0 ? value : `${value[0].toUpperCase()}${value.slice(1)}`
    )
    .join("");
}

async function ensureDirCreated(dir: string) {
  return new Promise<void>((rs, rj) => {
    fs.stat(dir, (err, stat) => {
      if (err || !stat.isDirectory()) {
        fs.mkdir(dir, (err) => {
          err ? rj(err) : rs();
        });
        return;
      }
      rs();
    });
  });
}

export async function clone(url: string, packageName?: string) {
  packageName ??= url
    .split("/")
    .find((v, i, a) => a.length === i + 1)!
    .split(".")[0];
  const dir = path.resolve(packageFolder, packageName);
  await ensureDirCreated(dir);
  console.info(`start clone: cloning into "${dir}" from "${url}"`);
  await git.clone({ fs, http, url, dir });
  console.log("git clone done.");
}

export async function main() {
  const args = parseArgs();
  console.log("args:", args);
  await ensureDirCreated(packageFolder);
  await clone(args.url ?? "https://github.com/jquery/jquery", args.packageName);
}

main()
  .catch((e) => {
    console.log(e.toString());
  })
  .finally(() => {
    console.log("clone done.");
  });
