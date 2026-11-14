/**
 * Generates GitHub-style slug ID for headings
 */
export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[`*~_]/g, "")
    .replace(/[^\w\s\u00C0-\u017F-]/g, "")
    .replace(/\s+/g, "-");
}
