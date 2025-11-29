import DOMPurify from "isomorphic-dompurify"

/**
 * تنقية HTML من العناصر الخطرة والأكواد الضارة
 * يستخدم DOMPurify لمنع XSS attacks
 */
export function sanitizeHTML(html: string): string {
  return DOMPurify.sanitize(html, {
    // العناصر المسموحة فقط
    ALLOWED_TAGS: [
      "p",
      "br",
      "strong",
      "em",
      "u",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "ul",
      "ol",
      "li",
      "a",
      "img",
      "blockquote",
      "code",
      "pre",
      "div",
      "span",
      "table",
      "thead",
      "tbody",
      "tr",
      "th",
      "td",
    ],
    // الخصائص المسموحة فقط
    ALLOWED_ATTR: ["href", "src", "alt", "title", "class", "id", "target", "rel"],
    // منع العناصر الخطرة
    FORBID_TAGS: ["script", "style", "iframe", "object", "embed", "form", "input"],
    // منع الأحداث الخطرة
    FORBID_ATTR: ["onerror", "onload", "onclick", "onmouseover", "onmouseout", "onfocus", "onblur"],
  })
}
