# better-svelte-check

One-shot Svelte checking through your project's Vite source transforms. Loads
`vite.config.ts`, captures transformed components before Svelte compilation, and
checks them with the upstream Svelte language-tools engine. Authored files stay
unchanged on disk.

## Run from source

Requires Node.js 22.19+ or 24+ and pnpm 11. The consuming project must have Vite 8,
`@sveltejs/vite-plugin-svelte` 7, and Svelte 5 installed and configured.

```sh
corepack pnpm install
corepack pnpm run build
node dist/cli.js --workspace /absolute/path/to/app
node dist/cli.js --workspace /absolute/path/to/app --output json
```

Options: `--workspace`, `--tsconfig`, `--mode`, `--output human|json`, and `--help`.
Defaults: current directory, `tsconfig.json`, `development`, and `human`.
Errors exit with status 1; warnings alone exit with status 0.

The package is an unpublished MVP. `corepack pnpm pack` builds a standalone package
with the `better-svelte-check` command for local installation.

## Processing

The checker uses the consuming project's Vite installation and plugin container,
including plugin ordering, filters, contexts, and source-map composition. It
captures source at the `vite-plugin-svelte:compile` boundary and prepares imported
components discovered outside the initial TypeScript project crawl.

It disables the script part of `vitePreprocess` to preserve TypeScript annotations.
Markup and style preprocessing still run. Unknown script preprocessors are rejected
because the checker cannot guarantee that they preserve types.

Diagnostics are mapped back to authored source using plugin-provided source maps.
Accurate locations require accurate maps from every source-changing plugin.
Published SER 5.0.1 lowers syntax but does not supply whole-component source maps;
its type errors are detected, but reported locations may be inaccurate. The SER
source-map implementation remains on its `recover/vite-svelte-check-mvp` branch.
The checker itself has no runtime dependency on SER.

## Boundaries

- Client development pipeline only; `--mode` selects the Vite configuration mode.
- `.svelte` components only.
- One-shot checking; no watch mode or upstream CLI parity.
- Pinned `svelte-language-server` 0.18.4 internals; this is an adapter, not a vendored
  language-tools fork. Each project runs in a separate process.
- No tsgo, Vite virtual-module declarations, or source-writing commands.

## Development

```sh
corepack pnpm run check
corepack pnpm test
corepack pnpm pack
```

Integration tests exercise the built CLI with published SER, SvelteKit, native
Svelte, Vite transforms, imported components, and deliberate type errors. They run
without a sibling SER checkout. CI runs checks, tests, and package construction.

Recovered from `artisanstreet/svelte-effect-runtime`, commit `209f6e8`, including
the original MVP and its two follow-up fixes. See LICENSE for retained attribution.
