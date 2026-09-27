import { describe, expect, test } from "bun:test"
import { render } from "preact-render-to-string"
import { css, html } from "../src/index"

describe("html", () => {
  test("keeps a space after a closing tag before text, a tag, or a value", () => {
    const name = "maailma"
    expect(render(html`<p><strong>Hei</strong>\n  maailma</p>`)).toBe("<p><strong>Hei</strong> maailma</p>")
    expect(render(html`<p><strong>Hei</strong>\n  <em>maailma</em></p>`)).toBe("<p><strong>Hei</strong> <em>maailma</em></p>")
    expect(render(html`<p><strong>Hei</strong>\n  ${name}</p>`)).toBe("<p><strong>Hei</strong> maailma</p>")
  })

  test("keeps a space after a value before an opening tag", () => {
    const first = "Rane"
    expect(render(html`<p>${first}\n  <strong>Faunder</strong></p>`)).toBe("<p>Rane <strong>Faunder</strong></p>")
  })

  test("keeps intentionally adjacent text and multiline attributes", () => {
    expect(render(html`<p><strong>Hei</strong>maailma</p>`)).toBe("<p><strong>Hei</strong>maailma</p>")
    expect(render(html`<a href="/"\n  class="link">Linkki</a>`)).toBe('<a href="/" class="link">Linkki</a>')
  })
})

describe("css", () => {
  test("creates one style element from trusted static CSS and values", () => {
    const color = "red"
    expect(render(css`\n  p { color: ${color}; }\n`)).toBe("<style>p { color: red; }</style>")
  })
})
