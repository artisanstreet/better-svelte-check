import { chmod, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { build } from "rolldown";

/** Keep dependencies external so upstream can resolve its own internal modules. */
await rm(new URL("../dist/", import.meta.url), { force: true, recursive: true });
await build({
  input: fileURLToPath(new URL("../src/cli.ts", import.meta.url)),
  output: {
    file: fileURLToPath(new URL("../dist/cli.js", import.meta.url)),
    format: "esm",
    sourcemap: true,
  },
  external: [/^node:/, /^[^./]/],
});
await chmod(new URL("../dist/cli.js", import.meta.url), 0o755);
