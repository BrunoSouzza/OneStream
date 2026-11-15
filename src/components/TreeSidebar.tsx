"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  FileText,
  GitBranch,
  Lock,
  ChevronsUpDown,
  ChevronsDownUp,
  Code2,
  Filter,
  X,
} from "lucide-react";
import type { TreeNode } from "@/lib/types";
import { siteConfig } from "@/lib/site-config";

interface TreeSidebarProps {
  tree: TreeNode[];
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function TreeSidebar({
  tree,
  mobileOpen,
  onCloseMobile,
}: TreeSidebarProps) {
  const pathname = usePathname();
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});
  const [showRawFileNames, setShowRawFileNames] = useState(false);
  const [treeFilter, setTreeFilter] = useState("");

  // Initialize all folders as expanded by default and keep active path expanded
  useEffect(() => {
    const initial: Record<string, boolean> = {};
    const collectFolders = (nodes: TreeNode[]) => {
      for (const node of nodes) {
        if (node.type === "folder") {
          initial[node.relativePath] = true;
          if (node.children) collectFolders(node.children);
        }
      }
    };
    collectFolders(tree);
    setExpandedFolders((prev) => ({ ...initial, ...prev }));
  }, [tree]);

  // Ensure folders leading to current pathname are expanded
  useEffect(() => {
    if (!pathname) return;
    setExpandedFolders((prev) => {
      const next = { ...prev };
      const checkNode = (nodes: TreeNode[]): boolean => {
        let hasActive = false;
        for (const node of nodes) {
          if (node.type === "file" && node.path === pathname) {
            hasActive = true;
          } else if (node.type === "folder" && node.children) {
            const childActive = checkNode(node.children);
            if (childActive) {
              next[node.relativePath] = true;
              hasActive = true;
            }
          }
        }
        return hasActive;
      };
      checkNode(tree);
      return next;
    });
  }, [pathname, tree]);

  const toggleFolder = (relativePath: string) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [relativePath]: !prev[relativePath],
    }));
  };

  const setAllFolders = (open: boolean) => {
    const updated: Record<string, boolean> = {};
    const walk = (nodes: TreeNode[]) => {
      for (const n of nodes) {
        if (n.type === "folder") {
          updated[n.relativePath] = open;
          if (n.children) walk(n.children);
        }
      }
    };
    walk(tree);
    setExpandedFolders(updated);
  };

  // Filter tree nodes when user types in the sidebar filter
  const filteredTree = useMemo(() => {
    const q = treeFilter.trim().toLowerCase();
    if (!q) return tree;

    const filterNodes = (nodes: TreeNode[]): TreeNode[] => {
      const result: TreeNode[] = [];
      for (const node of nodes) {
        const matchesSelf =
          node.displayName.toLowerCase().includes(q) ||
          node.name.toLowerCase().includes(q) ||
          node.relativePath.toLowerCase().includes(q);

        if (node.type === "file") {
          if (matchesSelf) result.push(node);
        } else if (node.type === "folder" && node.children) {
          const filteredChildren = filterNodes(node.children);
          if (matchesSelf || filteredChildren.length > 0) {
            result.push({
              ...node,
              children: matchesSelf && filteredChildren.length === 0 ? node.children : filteredChildren,
            });
          }
        }
      }
      return result;
    };

    return filterNodes(tree);
  }, [tree, treeFilter]);

  const renderNode = (node: TreeNode, depth: number = 0) => {
    const isFolder = node.type === "folder";
    const isExpanded =
      treeFilter.trim().length > 0 ? true : !!expandedFolders[node.relativePath];
    const isActive =
      !isFolder &&
      (pathname === node.path ||
        (node.path !== "/" && pathname === `${node.path}/`));

    const label = showRawFileNames ? node.name : node.displayName;

    if (isFolder) {
      return (
        <div key={node.relativePath} className="select-none">
          <button
            type="button"
            onClick={() => toggleFolder(node.relativePath)}
            style={{ paddingLeft: `${depth * 14 + 10}px` }}
            className="group flex w-full items-center gap-2 rounded-md py-1.5 pr-2.5 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800/70 dark:hover:text-white"
          >
            <span className="text-slate-400 transition-transform duration-150 dark:text-slate-500">
              {isExpanded ? (
                <ChevronDown className="h-3.5 w-3.5" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5" />
              )}
            </span>
            {isExpanded ? (
              <FolderOpen className="h-4 w-4 shrink-0 text-indigo-500 dark:text-indigo-400" />
            ) : (
              <Folder className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-indigo-500 dark:text-slate-500 dark:group-hover:text-indigo-400" />
            )}
            <span className="truncate">{label}</span>
            <span className="ml-auto rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-mono text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              {node.children?.length || 0}
            </span>
          </button>

          {isExpanded && node.children && (
            <div className="relative mt-0.5 space-y-0.5">
              {/* Vertical Tree Guide Line */}
              <div
                style={{ left: `${depth * 14 + 17}px` }}
                className="pointer-events-none absolute bottom-1 top-0 w-px bg-slate-200 dark:bg-slate-800"
              />
              {node.children.map((child) => renderNode(child, depth + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={node.relativePath}
        href={node.path}
        onClick={onCloseMobile}
        style={{ paddingLeft: `${depth * 14 + 26}px` }}
        className={`group relative flex items-center gap-2 rounded-md py-1.5 pr-2.5 text-sm transition-all ${
          isActive
            ? "bg-indigo-50/90 font-semibold text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300"
            : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-200"
        }`}
      >
        {isActive && (
          <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r bg-indigo-600 dark:bg-indigo-400" />
        )}
        <FileText
          className={`h-4 w-4 shrink-0 ${
            isActive
              ? "text-indigo-600 dark:text-indigo-400"
              : "text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300"
          }`}
        />
        <span className="truncate" title={`docs/${node.relativePath}`}>
          {label}
        </span>
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-80 xl:w-[340px] shrink-0 flex-col border-r border-slate-200 bg-white/95 backdrop-blur-md transition-transform duration-200 ease-in-out dark:border-slate-800/80 dark:bg-slate-950/95 lg:sticky lg:top-16 lg:z-20 lg:h-[calc(100vh-4rem)] lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Tree Explorer Toolbar */}
        <div className="border-b border-slate-200/80 p-3 dark:border-slate-800/80">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Explorador • /{siteConfig.docsFolder}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setShowRawFileNames((v) => !v)}
                title={
                  showRawFileNames
                    ? "Mostrar títulos amigáveis"
                    : "Mostrar nomes reais dos arquivos (.md)"
                }
                className={`rounded p-1 text-xs transition-colors ${
                  showRawFileNames
                    ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300"
                    : "text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                }`}
              >
                <Code2 className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setAllFolders(true)}
                title="Expandir todas as pastas"
                className="rounded p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              >
                <ChevronsUpDown className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setAllFolders(false)}
                title="Recolher todas as pastas"
                className="rounded p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              >
                <ChevronsDownUp className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Filter input inside TreeView */}
          <div className="relative">
            <Filter className="pointer-events-none absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={treeFilter}
              onChange={(e) => setTreeFilter(e.target.value)}
              placeholder="Filtrar pasta ou arquivo .md..."
              className="w-full rounded-md border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-7 text-xs text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-200 dark:focus:border-indigo-400"
            />
            {treeFilter && (
              <button
                type="button"
                onClick={() => setTreeFilter("")}
                className="absolute right-2 top-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Tree Nodes List */}
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 py-3">
          {filteredTree.length > 0 ? (
            filteredTree.map((node) => renderNode(node, 0))
          ) : (
            <div className="px-3 py-8 text-center text-xs text-slate-400 dark:text-slate-500">
              Nenhum arquivo <code>.md</code> encontrado para &ldquo;{treeFilter}&rdquo;.
            </div>
          )}
        </nav>

        {/* Read-only & Git Branch Footer */}
        <div className="border-t border-slate-200/80 bg-slate-50/70 p-3 dark:border-slate-800/80 dark:bg-slate-900/40">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
              <GitBranch className="h-3.5 w-3.5 text-emerald-500" />
              branch:{" "}
              <code className="rounded bg-emerald-500/10 px-1.5 py-0.5 font-mono text-[11px] text-emerald-600 dark:text-emerald-400">
                {siteConfig.githubBranch}
              </code>
            </span>
            <span
              className="inline-flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500"
              title="Os arquivos não podem ser excluídos pelo site; apenas via commit na branch main do repositório."
            >
              <Lock className="h-3 w-3" />
              Somente leitura
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
