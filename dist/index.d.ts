import { html as htmHtml } from "htm/preact";
import { type JSX } from "preact";
/** Parse Preact markup with HTML-like whitespace around inline elements. */
export declare function html(strings: TemplateStringsArray, ...values: unknown[]): ReturnType<typeof htmHtml>;
/** Render trusted CSS in a style element. Never interpolate untrusted CSS. */
export declare function css(strings: TemplateStringsArray, ...values: Array<string | number | null | undefined>): JSX.Element;
