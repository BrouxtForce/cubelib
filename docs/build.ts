/// <reference types="bun-types" />

Bun.build({
    entrypoints: ["../src/index.ts"],
    minify: true,
    outdir: "public",
    naming: "[dir]/cubelib.[ext]"
});