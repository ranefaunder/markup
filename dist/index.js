// src/index.ts
import { html as htmHtml } from "htm/preact";
import { h } from "preact";
var templates = new WeakMap;
function normalizeTemplate(strings) {
  const cached = templates.get(strings);
  if (cached)
    return cached;
  const parts = strings.map((part, index) => {
    const afterValue = index > 0 ? part.replace(/^[ \t]*\r?\n[ \t]*(?=<[a-zA-Z])/, " ") : part;
    const beforeTag = afterValue.replace(/([^\s>])(\s*)(<[a-zA-Z][^>]*>)/g, (_, text, whitespace, tag) => whitespace.includes(`
`) || whitespace.includes("\t") ? `${text} ${tag}` : `${text}${whitespace}${tag}`);
    return beforeTag.replace(/(<\/[a-zA-Z][^>]*>)[ \t]*\r?\n[ \t]*/g, (match, tag, offset, source) => offset + match.length < source.length || index < strings.length - 1 ? `${tag} ` : match);
  });
  const normalized = Object.assign(parts, { raw: parts });
  templates.set(strings, normalized);
  return normalized;
}
function html(strings, ...values) {
  return htmHtml(normalizeTemplate(strings), ...values);
}
function css(strings, ...values) {
  let content = "";
  for (let index = 0;index < strings.length; index++) {
    content += strings[index];
    if (index < values.length && values[index] != null)
      content += values[index];
  }
  return h("style", { dangerouslySetInnerHTML: { __html: content.trim() } });
}
export {
  css,
  html
};
