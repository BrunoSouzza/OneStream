export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export interface TreeNode {
  name: string;
  displayName: string;
  path: string; // URL route path, e.g., "/01-introducao/visao-geral"
  relativePath: string; // File path inside docs/, e.g., "01-introducao/visao-geral.md"
  type: "folder" | "file";
  order: number;
  children?: TreeNode[];
}

export interface DocPage {
  slug: string[];
  routePath: string;
  relativePath: string;
  title: string;
  description?: string;
  order: number;
  tags?: string[];
  updatedAt?: string;
  content: string;
  toc: TocItem[];
  readingTimeMinutes: number;
}

export interface SearchEntry {
  title: string;
  description: string;
  routePath: string;
  relativePath: string;
  headings: string[];
  excerpt: string;
}
