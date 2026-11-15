"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileCode2,
  Clock,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Lock,
  GitBranch,
  Tag,
  Edit3,
  Save,
  X,
  Eye,
  Columns,
  Check,
} from "lucide-react";
import type { DocPage, TreeNode } from "@/lib/types";
import { siteConfig } from "@/lib/site-config";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { TableOfContents } from "./TableOfContents";

interface DocViewProps {
  doc: DocPage;
  prevDoc: TreeNode | null;
  nextDoc: TreeNode | null;
}

export function DocView({ doc, prevDoc, nextDoc }: DocViewProps) {
  const router = useRouter();
  const pathSegments = doc.relativePath.split("/");

  // Full Markdown Editor State
  const [isEditing, setIsEditing] = useState(false);
  const [rawMarkdown, setRawMarkdown] = useState("");
  const [loadingRaw, setLoadingRaw] = useState(false);
  const [savingDoc, setSavingDoc] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [editorMode, setEditorMode] = useState<"split" | "edit" | "preview">(
    "split"
  );

  const openEditor = async () => {
    setLoadingRaw(true);
    try {
      const res = await fetch(
        `/api/docs?path=${encodeURIComponent(doc.relativePath)}`
      );
      const data = await res.json();
      if (res.ok && typeof data.rawContent === "string") {
        setRawMarkdown(data.rawContent);
      } else {
        setRawMarkdown(doc.content);
      }
      setIsEditing(true);
    } catch {
      setRawMarkdown(doc.content);
      setIsEditing(true);
    } finally {
      setLoadingRaw(false);
    }
  };

  const handleSaveMarkdown = async () => {
    setSavingDoc(true);
    setSavedSuccess(false);
    try {
      const res = await fetch("/api/docs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          relativePath: doc.relativePath,
          rawContent: rawMarkdown,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erro ao salvar arquivo Markdown");
      }
      setSavedSuccess(true);
      router.refresh();
      setTimeout(() => {
        setSavedSuccess(false);
        setIsEditing(false);
      }, 900);
    } catch (err) {
      alert(
        err instanceof Error ? err.message : "Erro ao salvar arquivo Markdown"
      );
    } finally {
      setSavingDoc(false);
    }
  };

  // Support Ctrl+S / Cmd+S while editing
  useEffect(() => {
    if (!isEditing) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        handleSaveMarkdown();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  // Strip YAML frontmatter for the live preview pane
  const previewBody = React.useMemo(() => {
    return rawMarkdown.replace(/^---[\r\n][\s\S]*?[\r\n]---[\r\n]*/, "");
  }, [rawMarkdown]);

  return (
    <div className="flex w-full flex-1 justify-between gap-8 px-4 py-8 sm:px-8 lg:px-12 2xl:px-16">
      <main className="min-w-0 flex-1 max-w-none">
        {/* Breadcrumb, Edit Button & Repository Path Bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200/80 bg-slate-50/70 px-3.5 py-2 text-xs text-slate-500 dark:border-slate-800/80 dark:bg-slate-900/50 dark:text-slate-400">
          <div className="flex flex-wrap items-center gap-1.5 font-mono">
            <FileCode2 className="h-3.5 w-3.5 text-indigo-500" />
            <span className="text-slate-400 dark:text-slate-500">
              {siteConfig.docsFolder}/
            </span>
            {pathSegments.map((seg, index) => {
              const isLast = index === pathSegments.length - 1;
              return (
                <React.Fragment key={`${seg}-${index}`}>
                  <span
                    className={
                      isLast
                        ? "font-semibold text-indigo-600 dark:text-indigo-400"
                        : "text-slate-600 dark:text-slate-300"
                    }
                  >
                    {seg}
                  </span>
                  {!isLast && (
                    <ChevronRight className="h-3 w-3 text-slate-400" />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <span className="hidden items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 sm:inline-flex">
              <Clock className="h-3 w-3" />
              {doc.readingTimeMinutes} min de leitura
            </span>

            {!isEditing ? (
              <button
                type="button"
                onClick={openEditor}
                disabled={loadingRaw}
                className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-indigo-500"
              >
                <Edit3 className="h-3.5 w-3.5" />
                <span>
                  {loadingRaw ? "Carregando..." : "Editar Página (.md)"}
                </span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleSaveMarkdown}
                  disabled={savingDoc}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-emerald-500"
                >
                  {savedSuccess ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      <span>Salvo!</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-3.5 w-3.5" />
                      <span>
                        {savingDoc ? "Salvando..." : "Salvar no .md (Ctrl+S)"}
                      </span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                >
                  <X className="h-3.5 w-3.5" />
                  <span>Cancelar</span>
                </button>
              </div>
            )}

            <a
              href={siteConfig.getGithubFileUrl(doc.relativePath)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium text-indigo-600 hover:underline dark:text-indigo-400"
              title="Visualizar este arquivo .md no GitHub"
            >
              <span>GitHub</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        {/* Live Split-View Markdown Editor */}
        {isEditing ? (
          <div className="mb-10 overflow-hidden rounded-2xl border border-indigo-500/40 bg-white shadow-xl dark:bg-slate-900">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-slate-50 px-4 py-2.5 dark:border-slate-800 dark:bg-slate-950/60">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-200">
                <Edit3 className="h-4 w-4 text-indigo-500" />
                <span>
                  Editando diretamente:{" "}
                  <code className="rounded bg-indigo-500/10 px-1.5 py-0.5 font-mono text-indigo-600 dark:text-indigo-400">
                    docs/{doc.relativePath}
                  </code>
                </span>
              </div>

              <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-0.5 dark:border-slate-800 dark:bg-slate-900">
                <button
                  type="button"
                  onClick={() => setEditorMode("edit")}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                    editorMode === "edit"
                      ? "bg-indigo-600 text-white"
                      : "text-slate-500 hover:text-slate-800 dark:text-slate-400"
                  }`}
                >
                  Código .md
                </button>
                <button
                  type="button"
                  onClick={() => setEditorMode("split")}
                  className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                    editorMode === "split"
                      ? "bg-indigo-600 text-white"
                      : "text-slate-500 hover:text-slate-800 dark:text-slate-400"
                  }`}
                >
                  <Columns className="h-3 w-3" />
                  <span>Lado a Lado</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEditorMode("preview")}
                  className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                    editorMode === "preview"
                      ? "bg-indigo-600 text-white"
                      : "text-slate-500 hover:text-slate-800 dark:text-slate-400"
                  }`}
                >
                  <Eye className="h-3 w-3" />
                  <span>Preview</span>
                </button>
              </div>
            </div>

            <div
              className={`grid min-h-[620px] ${
                editorMode === "split"
                  ? "grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 dark:divide-slate-800"
                  : "grid-cols-1"
              }`}
            >
              {(editorMode === "edit" || editorMode === "split") && (
                <div className="flex flex-col">
                  <textarea
                    value={rawMarkdown}
                    onChange={(e) => setRawMarkdown(e.target.value)}
                    spellCheck={false}
                    className="h-full min-h-[580px] w-full flex-1 resize-y bg-slate-950 p-4 font-mono text-xs leading-relaxed text-slate-100 focus:outline-none sm:text-sm"
                    placeholder="Digite o conteúdo Markdown (.md)..."
                  />
                </div>
              )}

              {(editorMode === "preview" || editorMode === "split") && (
                <div className="max-h-[700px] overflow-y-auto p-6">
                  <MarkdownRenderer
                    content={previewBody}
                    relativePath={doc.relativePath}
                  />
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Optional Tags */}
            {doc.tags && doc.tags.length > 0 && (
              <div className="mb-4 flex flex-wrap items-center gap-1.5">
                {doc.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-0.5 text-xs font-medium text-indigo-600 dark:text-indigo-300"
                  >
                    <Tag className="h-3 w-3" />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Markdown Body */}
            <article className="pb-10">
              <MarkdownRenderer
                content={doc.content}
                relativePath={doc.relativePath}
              />
            </article>
          </>
        )}

        {/* Governance Banner (Editable content, Protected against Deletion) */}
        <div className="my-6 flex flex-col justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/60 p-4 text-xs text-slate-600 dark:border-slate-800/90 dark:bg-slate-900/40 dark:text-slate-400 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-200/70 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              <Lock className="h-4 w-4" />
            </div>
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                Proteção contra Exclusão • Edição Direta no Markdown Ativa
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Você pode editar o texto e os quadros de arquitetura e salvar direto em{" "}
                <code>docs/{doc.relativePath}</code>. A exclusão de arquivos só é permitida pelo repositório Git.
              </p>
            </div>
          </div>

          <a
            href={siteConfig.getGithubFileUrl(doc.relativePath)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-medium text-slate-700 shadow-2xs transition-colors hover:border-indigo-400 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-indigo-500"
          >
            <GitBranch className="h-3.5 w-3.5 text-emerald-500" />
            <span>Inspecionar na main</span>
          </a>
        </div>

        {/* Prev / Next Navigation Cards */}
        {(prevDoc || nextDoc) && (
          <nav className="mt-8 grid grid-cols-1 gap-4 border-t border-slate-200 pt-8 dark:border-slate-800 sm:grid-cols-2">
            {prevDoc ? (
              <Link
                href={prevDoc.path}
                className="group flex flex-col rounded-xl border border-slate-200 p-4 transition-all hover:border-indigo-500/60 hover:bg-indigo-50/30 dark:border-slate-800 dark:hover:border-indigo-500/50 dark:hover:bg-indigo-500/5"
              >
                <span className="flex items-center gap-1 text-xs font-medium text-slate-400 dark:text-slate-500">
                  <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
                  Anterior
                </span>
                <span className="mt-1 font-semibold text-slate-900 group-hover:text-indigo-600 dark:text-slate-100 dark:group-hover:text-indigo-400">
                  {prevDoc.displayName}
                </span>
                <code className="mt-0.5 font-mono text-[10px] text-slate-400">
                  docs/{prevDoc.relativePath}
                </code>
              </Link>
            ) : (
              <div />
            )}

            {nextDoc ? (
              <Link
                href={nextDoc.path}
                className="group flex flex-col items-end rounded-xl border border-slate-200 p-4 text-right transition-all hover:border-indigo-500/60 hover:bg-indigo-50/30 dark:border-slate-800 dark:hover:border-indigo-500/50 dark:hover:bg-indigo-500/5"
              >
                <span className="flex items-center gap-1 text-xs font-medium text-slate-400 dark:text-slate-500">
                  Próximo
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
                <span className="mt-1 font-semibold text-slate-900 group-hover:text-indigo-600 dark:text-slate-100 dark:group-hover:text-indigo-400">
                  {nextDoc.displayName}
                </span>
                <code className="mt-0.5 font-mono text-[10px] text-slate-400">
                  docs/{nextDoc.relativePath}
                </code>
              </Link>
            ) : (
              <div />
            )}
          </nav>
        )}
      </main>

      {/* Right Table of Contents */}
      {!isEditing && <TableOfContents items={doc.toc} />}
    </div>
  );
}
