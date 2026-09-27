# Faunder Markup

Small `html` and `css` template tags for Preact components. `html` uses `htm/preact` and preserves a space around line breaks next to markup, matching ordinary HTML text flow. `css` returns a Preact `<style>` element.

## Install

```sh
bun add github:ranefaunder/markup
```

The package uses `htm` and `preact` as peer dependencies.

## Use

```ts
import { html, css } from "@faunder/markup"

export function Greeting({ name }: { name: string }) {
  const view = html`
    <p data-scope="Greeting">Hello, <strong>${name}</strong></p>
  `

  const style = css`
    @scope ([data-scope="Greeting"]) {
      strong { color: #345cc4; }
    }
  `

  return [view, style]
}
```

When a line break separates inline text and an element, `html` preserves one space. It does not add a space when the source places text and tags directly together. Use explicit spaces when that is clearer for the component.

`css` inserts raw CSS into a `<style>` element. Interpolate only trusted, code-owned values; do not pass user-provided CSS.

## Develop

```sh
bun install
bun run typecheck
bun test
bun run build
```

The build creates JavaScript and TypeScript declarations in `dist/`.
