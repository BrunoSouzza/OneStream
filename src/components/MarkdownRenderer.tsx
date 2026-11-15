"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Check,
  Copy,
  Hash,
  Info,
  Lightbulb,
  AlertTriangle,
  ShieldAlert,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { slugifyHeading } from "@/lib/slugify";
import { ArchitectureBoard } from "./ArchitectureBoard";

function extractTextFromChildren(children: React.ReactNode): string {
  if (typeof children === "string" || typeof children === "number") {
    return String(children);
  }
  if (Array.isArray(children)) {
    return children.map(extractTextFromChildren).join("");
  }
  if (React.isValidElement(children) && children.props) {
    return extractTextFromChildren(
      (children.props as { children?: React.ReactNode }).children
    );
  }
  return "";
}

function CodeBlock({
  language,
  code,
}: {
  language: string;
  code: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore clipboard errors
    }
  };

  return (
    <div className="group my-5 overflow-hidden rounded-xl border border-slate-200 bg-slate-900 shadow-sm dark:border-slate-800 dark:bg-slate-900/95">
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/70 px-4 py-2 text-xs text-slate-400">
        <span className="font-mono uppercase tracking-wider text-indigo-400">
          {language || "texto"}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 rounded-md border border-slate-700/80 bg-slate-800/80 px-2 py-1 text-[11px] font-medium text-slate-300 transition-colors hover:border-slate-600 hover:bg-slate-700 hover:text-white"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-emerald-400" />
              <span className="text-emerald-400">Copiado!</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span>Copiar</span>
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-slate-100 sm:text-sm">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function MarkdownRenderer({
  content,
  relativePath,
}: {
  content: string;
  relativePath?: string;
}) {
  return (
    <div className="prose-docs max-w-none text-slate-700 dark:text-slate-300">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => {
            const text = extractTextFromChildren(children);
            const id = slugifyHeading(text);
            return (
              <h1
                id={id}
                className="mb-4 mt-2 scroll-mt-24 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl"
              >
                {children}
              </h1>
            );
          },
          h2: ({ children }) => {
            const text = extractTextFromChildren(children);
            const id = slugifyHeading(text);
            return (
              <h2
                id={id}
                className="group mb-4 mt-10 flex scroll-mt-24 items-center gap-2 border-b border-slate-200 pb-2.5 text-xl font-bold tracking-tight text-slate-900 dark:border-slate-800 dark:text-white sm:text-2xl"
              >
                <span>{children}</span>
                <a
                  href={`#${id}`}
                  aria-label="Link para esta seção"
                  className="text-slate-400 opacity-0 transition-opacity hover:text-indigo-500 group-hover:opacity-100"
                >
                  <Hash className="h-4 w-4" />
                </a>
              </h2>
            );
          },
          h3: ({ children }) => {
            const text = extractTextFromChildren(children);
            const id = slugifyHeading(text);
            return (
              <h3
                id={id}
                className="group mb-3 mt-7 flex scroll-mt-24 items-center gap-2 text-lg font-semibold text-slate-900 dark:text-slate-100"
              >
                <span>{children}</span>
                <a
                  href={`#${id}`}
                  aria-label="Link para esta subseção"
                  className="text-slate-400 opacity-0 transition-opacity hover:text-indigo-500 group-hover:opacity-100"
                >
                  <Hash className="h-3.5 w-3.5" />
                </a>
              </h3>
            );
          },
          p: ({ children }) => (
            <p className="my-4 leading-7 text-slate-700 dark:text-slate-300">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="my-4 list-disc space-y-2 pl-6 text-slate-700 marker:text-indigo-500 dark:text-slate-300">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="my-4 list-decimal space-y-2 pl-6 text-slate-700 marker:font-semibold marker:text-indigo-500 dark:text-slate-300">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="leading-7">{children}</li>,
          hr: () => (
            <hr className="my-8 border-slate-200 dark:border-slate-800" />
          ),
          blockquote: ({ children }) => {
            const rawText = extractTextFromChildren(children).trim();
            const alertMatch = rawText.match(
              /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*([\s\S]*)/i
            );

            if (alertMatch) {
              const type = alertMatch[1].toUpperCase();
              const body = alertMatch[2];

              const styles: Record<
                string,
                {
                  border: string;
                  bg: string;
                  title: string;
                  icon: React.ReactNode;
                }
              > = {
                NOTE: {
                  border: "border-blue-500/40",
                  bg: "bg-blue-500/5 dark:bg-blue-500/10",
                  title: "Nota",
                  icon: <Info className="h-4 w-4 text-blue-500" />,
                },
                TIP: {
                  border: "border-emerald-500/40",
                  bg: "bg-emerald-500/5 dark:bg-emerald-500/10",
                  title: "Dica",
                  icon: <Lightbulb className="h-4 w-4 text-emerald-500" />,
                },
                IMPORTANT: {
                  border: "border-violet-500/40",
                  bg: "bg-violet-500/5 dark:bg-violet-500/10",
                  title: "Importante",
                  icon: <Sparkles className="h-4 w-4 text-violet-500" />,
                },
                WARNING: {
                  border: "border-amber-500/40",
                  bg: "bg-amber-500/5 dark:bg-amber-500/10",
                  title: "Atenção",
                  icon: <AlertTriangle className="h-4 w-4 text-amber-500" />,
                },
                CAUTION: {
                  border: "border-rose-500/40",
                  bg: "bg-rose-500/5 dark:bg-rose-500/10",
                  title: "Cuidado",
                  icon: <ShieldAlert className="h-4 w-4 text-rose-500" />,
                },
              };

              const cfg = styles[type] || styles.NOTE;

              return (
                <div
                  className={`my-5 rounded-xl border-l-4 p-4 ${cfg.border} ${cfg.bg}`}
                >
                  <div className="mb-1.5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    {cfg.icon}
                    <span>{cfg.title}</span>
                  </div>
                  <div className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                    {body}
                  </div>
                </div>
              );
            }

            return (
              <blockquote className="my-5 rounded-r-xl border-l-4 border-indigo-500 bg-slate-50 py-3 pl-4 pr-4 italic text-slate-700 dark:bg-slate-900/70 dark:text-slate-300">
                {children}
              </blockquote>
            );
          },
          code: ({ className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || "");
            const lang = match ? match[1].toLowerCase() : "";
            const codeString = String(children).replace(/\n$/, "");
            const isMultiline = codeString.includes("\n") || Boolean(match);

            if (
              lang === "architecture" ||
              lang === "miro" ||
              lang === "canvas"
            ) {
              return (
                <ArchitectureBoard
                  rawCode={codeString}
                  relativePath={relativePath}
                />
              );
            }

            if (isMultiline) {
              return (
                <CodeBlock
                  language={lang || "text"}
                  code={codeString}
                />
              );
            }

            return (
              <code
                className="rounded-md border border-slate-200 bg-slate-100 px-1.5 py-0.5 font-mono text-[0.85em] font-medium text-indigo-600 dark:border-slate-800 dark:bg-slate-800/90 dark:text-indigo-300"
                {...props}
              >
                {children}
              </code>
            );
          },
          pre: ({ children }) => <>{children}</>,
          table: ({ children }) => (
            <div className="my-6 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full border-collapse text-left text-sm">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-600 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-400">
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th className="px-4 py-3 font-semibold">{children}</th>
          ),
          td: ({ children }) => (
            <td className="border-t border-slate-200/70 px-4 py-3 dark:border-slate-800/70">
              {children}
            </td>
          ),
          a: ({ href, children }) => {
            const isExternal = href?.startsWith("http");
            return (
              <a
                href={href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className="inline-flex items-center gap-1 font-medium text-indigo-600 underline decoration-indigo-500/40 underline-offset-4 transition-colors hover:text-indigo-500 hover:decoration-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                <span>{children}</span>
                {isExternal && <ExternalLink className="h-3 w-3 shrink-0" />}
              </a>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
