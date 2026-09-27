import { html as htmHtml } from "htm/preact"
import { h, type JSX } from "preact"

const templates = new WeakMap<TemplateStringsArray, TemplateStringsArray>()

function normalizeTemplate(strings: TemplateStringsArray): TemplateStringsArray {
  const cached = templates.get(strings)
  if (cached) return cached

  const parts = strings.map((part, index) => {
    const afterValue = index > 0
      ? part.replace(/^[ \t]*\r?\n[ \t]*(?=<[a-zA-Z])/, " ")
      : part
    const beforeTag = afterValue.replace(
      /([^\s>])(\s*)(<[a-zA-Z][^>]*>)/g,
      (_, text: string, whitespace: string, tag: string) =>
        whitespace.includes("\n") || whitespace.includes("\t")
          ? `${text} ${tag}`
          : `${text}${whitespace}${tag}`
    )
    return beforeTag.replace(
      /(<\/[a-zA-Z][^>]*>)[ \t]*\r?\n[ \t]*/g,
      (match, tag: string, offset: number, source: string) =>
        offset + match.length < source.length || index < strings.length - 1
          ? `${tag} `
          : match
    )
  })

  const normalized = Object.assign(parts, { raw: parts }) as TemplateStringsArray
  templates.set(strings, normalized)
  return normalized
}

/** Parse Preact markup with HTML-like whitespace around inline elements. */
export function html(
  strings: TemplateStringsArray,
  ...values: unknown[]
): ReturnType<typeof htmHtml> {
  return htmHtml(normalizeTemplate(strings), ...values)
}

/** Render trusted CSS in a style element. Never interpolate untrusted CSS. */
export function css(
  strings: TemplateStringsArray,
  ...values: Array<string | number | null | undefined>
): JSX.Element {
  let content = ""
  for (let index = 0; index < strings.length; index++) {
    content += strings[index]
    if (index < values.length && values[index] != null) content += values[index]
  }
  return h("style", { dangerouslySetInnerHTML: { __html: content.trim() } })
}
