/// <reference types="bun-types" />

import fs from "node:fs/promises";
import path from "node:path";

async function runProcess(args: string[]): Promise<void> {
    return new Promise<void>(resolve => {
        Bun.spawn(args, {
            onExit() {
                resolve();
            },
            stdout: "inherit",
            stderr: "inherit",
            stdin: "inherit"
        });
    });
}

// Uses the npm trash package if available
if (process.argv.includes("clean")) {
    const cleanDirectories = ["./content/docs/api", "./public"];

    let hasTrash = false;
    try {
        const trash = (await import("trash")).default;
        hasTrash = true;

        for (const dir of cleanDirectories) {
            if (await fs.exists(dir)) {
                await trash(dir);
            }
        }
    } catch (error) {
        if (hasTrash) {
            console.error(error);
        } else {
            console.warn("Installing the npm trash package will move the deleted contents to trash rather than deleting them.");
            for (const dir of cleanDirectories) {
                if (await fs.exists(dir)) {
                    await fs.rm(dir, { recursive: true });
                }
            }
        }
    }
}

await Bun.build({
    entrypoints: ["../src/index.ts"],
    minify: true,
    outdir: "public",
    naming: "[dir]/cubelib.[ext]"
});

await runProcess(["npx", "typedoc"]);

const API_REFERENCE_PATH = "./content/docs/api/";
const paths = (await fs.readdir(API_REFERENCE_PATH, { recursive: true })).map(path => API_REFERENCE_PATH + path);

const filepaths: string[] = [];

for (const path of paths) {
    const stats = await fs.stat(path);
    if (stats.isFile()) {
        filepaths.push(path);
    }
}

for (const filepath of filepaths) {
    const parsed = path.parse(filepath);

    let fileData = await Bun.file(filepath).text();
    fileData = fileData.replaceAll("globals.md", "");
    fileData = fileData.replaceAll("README.md", "");

    let i = 0;
    while (true) {
        i = fileData.indexOf("](", i);
        if (i === -1) {
            break;
        }
        i += 2;
        let j = fileData.indexOf(")", i);
        const url = fileData.slice(i, j).replaceAll(".md", "");
        if (fileData.slice(i, j).indexOf("https://") === -1) {
            fileData = fileData.slice(0, i) + `${url}` + fileData.slice(j);
        }
    }

    if (parsed.base === "README.md") {
        if (await fs.exists(path.join(parsed.dir, "globals.md"))) {
            await fs.unlink(filepath);
            continue;
        }
        const folderName = path.basename(parsed.dir);
        await Bun.write(filepath, `---\ntitle: ${folderName}\n---\n\n${fileData}`);
        await fs.rename(filepath, path.join(parsed.dir, "_index.md"));
        continue;
    }
    if (parsed.base === "globals.md") {
        await Bun.write(filepath, `---\ntitle: API Reference\n---\n\n${fileData}`);
        await fs.rename(filepath, path.join(parsed.dir, "_index.md"));
        continue;
    }

    await Bun.write(filepath, `---\ntitle: ${parsed.name}\n---\n\n${fileData}`);
}

await runProcess(["hugo"]);