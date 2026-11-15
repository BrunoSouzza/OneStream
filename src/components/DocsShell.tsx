"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  BookOpen,
  Search,
  Sun,
  Moon,
  Github,
  Menu,
  GitBranch,
} from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import type { SearchEntry, TreeNode } from "@/lib/types";
import { TreeSidebar } from "./TreeSidebar";
import { SearchModal } from "./SearchModal";

interface DocsShellProps {
  tree: TreeNode[];
  searchIndex: SearchEntry[];
  children: React.ReactNode;
}

export function DocsShell({ tree, searchIndex, children }: DocsShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("onestream-theme");
    const isDark = saved ? saved === "dark" : true;
    setDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggleTheme = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem("onestream-theme", next ? "dark" : "light");
    document.documentElement.classList.toggle("dark", next);
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 h-16 w-full border-b border-slate-200/80 bg-white/85 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/85">
        <div className="flex h-full w-full items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden"
              aria-label="Abrir menu de navegação"
            >
              <Menu className="h-5 w-5" />
            </button>

            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/20">
                <BookOpen className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                  {siteConfig.name}
                </span>
                <span className="hidden items-center gap-1 text-[10px] font-medium text-slate-500 dark:text-slate-400 sm:inline-flex">
                  <GitBranch className="h-2.5 w-2.5 text-emerald-500" />
                  Sincronizado com{" "}
                  <code className="font-mono text-emerald-600 dark:text-emerald-400">
                    {siteConfig.githubBranch}
                  </code>
                </span>
              </div>
            </Link>
          </div>

          {/* Search Bar Trigger */}
          <div className="flex flex-1 items-center justify-end gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex w-full max-w-xs items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50/90 px-3 py-1.5 text-xs text-slate-500 transition-colors hover:border-indigo-400 hover:bg-white dark:border-slate-800 dark:bg-slate-900/90 dark:text-slate-400 dark:hover:border-indigo-500/60 dark:hover:bg-slate-900 sm:max-w-sm"
            >
              <span className="flex items-center gap-2 truncate">
                <Search className="h-3.5 w-3.5 text-slate-400" />
                <span>Pesquisar documentação...</span>
              </span>
              <kbd className="hidden rounded border border-slate-200 bg-white px-1.5 py-0.5 font-mono text-[10px] font-semibold text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 sm:inline-block">
                Ctrl K
              </kbd>
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              className="rounded-lg border border-slate-200 p-2 text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
              title={darkMode ? "Alternar para modo claro" : "Alternar para modo escuro"}
            >
              {darkMode ? (
                <Sun className="h-4 w-4 text-amber-400" />
              ) : (
                <Moon className="h-4 w-4 text-slate-700" />
              )}
            </button>

            <a
              href={siteConfig.getGithubRepoUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-800"
              title="Abrir repositório no GitHub"
            >
              <Github className="h-4 w-4" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content Layout with TreeView Sidebar */}
      <div className="flex w-full">
        <TreeSidebar
          tree={tree}
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
        />
        <div className="min-w-0 flex-1">{children}</div>
      </div>

      {/* Ctrl+K Search Modal */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        searchIndex={searchIndex}
      />
    </div>
  );
}
