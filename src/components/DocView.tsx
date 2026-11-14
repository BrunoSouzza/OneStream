import React from "react";
import Link from "next/link";
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
  const pathSegments = doc.relativePath.split("/");

  return (
    <div className="flex flex-1 justify-between px-4 py-8 sm:px-8 lg:px-12">
      <main className="mx-auto w-full max-w-3xl min-w-0">
        {/* Breadcrumb & Repository Path Bar */}
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

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
              <Clock className="h-3 w-3" />
              {doc.readingTimeMinutes} min de leitura
            </span>
            <a
              href={siteConfig.getGithubFileUrl(doc.relativePath)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium text-indigo-600 hover:underline dark:text-indigo-400"
              title="Visualizar este arquivo .md diretamente na branch main do GitHub"
            >
              <span>Ver no GitHub</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

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
          <MarkdownRenderer content={doc.content} />
        </article>

        {/* Read-Only Git Governance Banner */}
        <div className="my-6 flex flex-col justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/60 p-4 text-xs text-slate-600 dark:border-slate-800/90 dark:bg-slate-900/40 dark:text-slate-400 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-200/70 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              <Lock className="h-4 w-4" />
            </div>
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                Página protegida (Somente Leitura no Site)
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Arquivos <code>.md</code> não podem ser excluídos pelo site. Alterações são refletidas automaticamente da branch{" "}
                <code className="text-emerald-600 dark:text-emerald-400">
                  {siteConfig.githubBranch}
                </code>
                .
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
      <TableOfContents items={doc.toc} />
    </div>
  );
}
