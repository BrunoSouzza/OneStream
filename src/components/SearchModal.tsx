"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, FileText, Hash, ArrowRight, X } from "lucide-react";
import type { SearchEntry } from "@/lib/types";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  searchIndex: SearchEntry[];
}

export function SearchModal({
  isOpen,
  onClose,
  searchIndex,
}: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [isOpen]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return searchIndex.slice(0, 8);

    return searchIndex
      .filter((item) => {
        return (
          item.title.toLowerCase().includes(q) ||
          item.relativePath.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.headings.some((h) => h.toLowerCase().includes(q)) ||
          item.excerpt.toLowerCase().includes(q)
        );
      })
      .slice(0, 10);
  }, [query, searchIndex]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          results.length > 0 ? (prev + 1) % results.length : 0
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          results.length > 0
            ? (prev - 1 + results.length) % results.length
            : 0
        );
      } else if (e.key === "Enter" && results[selectedIndex]) {
        e.preventDefault();
        router.push(results[selectedIndex].routePath);
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, results, selectedIndex, router, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24">
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
        onClick={onClose}
      />

      <div className="relative z-10 mx-4 w-full max-w-xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        {/* Search Input Header */}
        <div className="flex items-center border-b border-slate-200 px-4 dark:border-slate-800">
          <Search className="h-4 w-4 shrink-0 text-indigo-500" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar em todos os arquivos .md (título, caminho, tópicos)..."
            className="w-full bg-transparent px-3 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-slate-100"
          />
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto p-2">
          {results.length === 0 ? (
            <div className="py-12 text-center text-sm text-slate-500 dark:text-slate-400">
              Nenhum resultado encontrado para{" "}
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                &ldquo;{query}&rdquo;
              </span>
              .
            </div>
          ) : (
            <ul className="space-y-1">
              {results.map((item, idx) => {
                const active = idx === selectedIndex;
                return (
                  <li key={item.routePath}>
                    <button
                      type="button"
                      onMouseEnter={() => setSelectedIndex(idx)}
                      onClick={() => {
                        router.push(item.routePath);
                        onClose();
                      }}
                      className={`flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                        active
                          ? "bg-indigo-50 text-indigo-900 dark:bg-indigo-500/15 dark:text-indigo-200"
                          : "text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/50"
                      }`}
                    >
                      <FileText
                        className={`mt-0.5 h-4 w-4 shrink-0 ${
                          active
                            ? "text-indigo-600 dark:text-indigo-400"
                            : "text-slate-400"
                        }`}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate text-sm font-semibold">
                            {item.title}
                          </span>
                          <code className="shrink-0 rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                            {item.relativePath}
                          </code>
                        </div>
                        <p className="mt-0.5 line-clamp-1 text-xs text-slate-500 dark:text-slate-400">
                          {item.description}
                        </p>
                        {item.headings.length > 0 && (
                          <div className="mt-1.5 flex flex-wrap gap-1">
                            {item.headings.slice(0, 3).map((h) => (
                              <span
                                key={h}
                                className="inline-flex items-center gap-0.5 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                              >
                                <Hash className="h-2.5 w-2.5" />
                                {h}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <ArrowRight
                        className={`mt-1 h-4 w-4 shrink-0 transition-transform ${
                          active
                            ? "translate-x-0.5 text-indigo-600 dark:text-indigo-400"
                            : "opacity-0"
                        }`}
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer Hints */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-4 py-2 text-[11px] text-slate-500 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-400">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="rounded border border-slate-300 bg-white px-1 py-0.5 font-mono text-[10px] dark:border-slate-700 dark:bg-slate-800">
                ↑↓
              </kbd>{" "}
              navegar
            </span>
            <span>
              <kbd className="rounded border border-slate-300 bg-white px-1 py-0.5 font-mono text-[10px] dark:border-slate-700 dark:bg-slate-800">
                Enter
              </kbd>{" "}
              abrir
            </span>
            <span>
              <kbd className="rounded border border-slate-300 bg-white px-1 py-0.5 font-mono text-[10px] dark:border-slate-700 dark:bg-slate-800">
                Esc
              </kbd>{" "}
              fechar
            </span>
          </div>
          <span>Indexado automaticamente dos arquivos .md</span>
        </div>
      </div>
    </div>
  );
}
