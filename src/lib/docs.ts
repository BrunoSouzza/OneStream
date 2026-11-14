import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { slugifyHeading } from "./slugify";
import type { TocItem, TreeNode, DocPage, SearchEntry } from "./types";

export type { TocItem, TreeNode, DocPage, SearchEntry };

const DOCS_DIR = path.join(process.cwd(), "docs");

/**
 * Converts a filename or folder name like "01-introducao" or "visao-geral.md"
 * into a human-friendly label when no frontmatter title is available.
 */
export function formatDisplayName(rawName: string): string {
  const withoutExt = rawName.replace(/\.mdx?$/i, "");
  const withoutOrder = withoutExt.replace(/^\d+[-_]/, "");
  const words = withoutOrder.split(/[-_]+/);
  return words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Extracts numeric order prefix (e.g., "01-introducao" -> 1), defaults to 999
 */
function extractOrderFromFilename(name: string): number {
  const match = name.match(/^(\d+)[-_]/);
  return match ? parseInt(match[1], 10) : 999;
}

export { slugifyHeading };

/**
 * Extracts H2 and H3 headings from Markdown content (ignoring fenced code blocks)
 */
export function extractToc(markdown: string): TocItem[] {
  const lines = markdown.split(/\r?\n/);
  const toc: TocItem[] = [];
  let inCodeBlock = false;

  for (const line of lines) {
    if (line.trim().startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;

    const match = line.match(/^(#{2,3})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const rawText = match[2].replace(/[`*_~]/g, "").trim();
      toc.push({
        id: slugifyHeading(rawText),
        text: rawText,
        level,
      });
    }
  }

  return toc;
}

/**
 * Recursively scans the docs/ directory and builds the TreeView structure
 */
export function getDocsTree(dirPath: string = DOCS_DIR, baseRelPath: string = ""): TreeNode[] {
  if (!fs.existsSync(dirPath)) {
    return [];
  }

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  const nodes: TreeNode[] = [];

  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;

    const fullPath = path.join(dirPath, entry.name);
    const relPath = baseRelPath ? `${baseRelPath}/${entry.name}` : entry.name;

    if (entry.isDirectory()) {
      const children = getDocsTree(fullPath, relPath);
      if (children.length > 0) {
        nodes.push({
          name: entry.name,
          displayName: formatDisplayName(entry.name),
          path: `/${relPath}`,
          relativePath: relPath,
          type: "folder",
          order: extractOrderFromFilename(entry.name),
          children,
        });
      }
    } else if (entry.isFile() && /\.mdx?$/i.test(entry.name)) {
      const rawFile = fs.readFileSync(fullPath, "utf-8");
      const { data, content } = matter(rawFile);

      const withoutExt = relPath.replace(/\.mdx?$/i, "");
      const isIndex = withoutExt === "index" || withoutExt.endsWith("/index");
      const routePath =
        withoutExt === "index"
          ? "/"
          : isIndex
          ? `/${withoutExt.replace(/\/index$/, "")}`
          : `/${withoutExt}`;

      // Extract first H1 heading if frontmatter title is not set
      const h1Match = content.match(/^#\s+(.+)$/m);
      const displayName =
        data.title ||
        (h1Match ? h1Match[1].trim() : formatDisplayName(entry.name));

      const order =
        typeof data.order === "number"
          ? data.order
          : entry.name.toLowerCase() === "index.md"
          ? 0
          : extractOrderFromFilename(entry.name);

      nodes.push({
        name: entry.name,
        displayName,
        path: routePath,
        relativePath: relPath,
        type: "file",
        order,
      });
    }
  }

  // Sort: index first, then by order, then folders before files or alphabetically
  nodes.sort((a, b) => {
    if (a.path === "/") return -1;
    if (b.path === "/") return 1;
    if (a.order !== b.order) return a.order - b.order;
    if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
    return a.name.localeCompare(b.name, "pt-BR");
  });

  return nodes;
}

/**
 * Flattens the tree into an ordered list of file nodes (for Prev/Next navigation)
 */
export function flattenTreeFiles(nodes: TreeNode[]): TreeNode[] {
  const result: TreeNode[] = [];
  for (const node of nodes) {
    if (node.type === "file") {
      result.push(node);
    } else if (node.children) {
      result.push(...flattenTreeFiles(node.children));
    }
  }
  return result;
}

/**
 * Resolves a slug array (e.g., ["01-introducao", "visao-geral"] or []) to a DocPage
 */
export function getDocBySlug(slug: string[] = []): DocPage | null {
  const joinedSlug = slug.map((s) => decodeURIComponent(s)).join("/");

  const candidates =
    joinedSlug === ""
      ? [path.join(DOCS_DIR, "index.md"), path.join(DOCS_DIR, "README.md")]
      : [
          path.join(DOCS_DIR, `${joinedSlug}.md`),
          path.join(DOCS_DIR, joinedSlug, "index.md"),
        ];

  let foundPath: string | null = null;
  for (const candidate of candidates) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      foundPath = candidate;
      break;
    }
  }

  if (!foundPath) {
    return null;
  }

  const rawFile = fs.readFileSync(foundPath, "utf-8");
  const { data, content } = matter(rawFile);
  const relativePath = path
    .relative(DOCS_DIR, foundPath)
    .split(path.sep)
    .join("/");

  const h1Match = content.match(/^#\s+(.+)$/m);
  const fileName = path.basename(foundPath);
  const title =
    data.title || (h1Match ? h1Match[1].trim() : formatDisplayName(fileName));

  const wordCount = content.trim().split(/\s+/).length;
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  const routePath = joinedSlug === "" ? "/" : `/${joinedSlug}`;

  return {
    slug,
    routePath,
    relativePath,
    title,
    description: data.description || undefined,
    order:
      typeof data.order === "number"
        ? data.order
        : extractOrderFromFilename(fileName),
    tags: Array.isArray(data.tags) ? data.tags : undefined,
    updatedAt: data.updatedAt ? String(data.updatedAt) : undefined,
    content,
    toc: extractToc(content),
    readingTimeMinutes,
  };
}

/**
 * Returns all valid slug arrays for Next.js generateStaticParams
 */
export function getAllDocSlugs(): string[][] {
  const tree = getDocsTree();
  const files = flattenTreeFiles(tree);
  return files
    .filter((f) => f.path !== "/")
    .map((f) => f.path.replace(/^\//, "").split("/"));
}

/**
 * Builds search index for the Ctrl+K search modal
 */
export function getSearchIndex(): SearchEntry[] {
  const tree = getDocsTree();
  const files = flattenTreeFiles(tree);
  const entries: SearchEntry[] = [];

  for (const file of files) {
    const slug =
      file.path === "/" ? [] : file.path.replace(/^\//, "").split("/");
    const doc = getDocBySlug(slug);
    if (!doc) continue;

    const plainExcerpt = doc.content
      .replace(/^#+\s+.+$/gm, "")
      .replace(/```[\s\S]*?```/g, "")
      .replace(/[`*_~>\[\]()!]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 220);

    entries.push({
      title: doc.title,
      description: doc.description || plainExcerpt,
      routePath: doc.routePath,
      relativePath: `docs/${doc.relativePath}`,
      headings: doc.toc.map((t) => t.text),
      excerpt: plainExcerpt,
    });
  }

  return entries;
}
