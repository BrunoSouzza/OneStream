"use client";

import React, { useEffect, useState } from "react";
import { List } from "lucide-react";
import type { TocItem } from "@/lib/types";

interface TableOfContentsProps {
  items: TocItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      {
        rootMargin: "-80px 0px -70% 0px",
        threshold: 0.1,
      }
    );

    for (const item of items) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) {
    return null;
  }

  return (
    <aside className="hidden xl:block xl:w-64 xl:shrink-0">
      <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pl-4 pr-2">
        <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          <List className="h-3.5 w-3.5 text-indigo-500" />
          Nesta página
        </div>
        <ul className="space-y-1.5 border-l border-slate-200 text-xs dark:border-slate-800">
          {items.map((item) => {
            const isActive = activeId === item.id;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  style={{
                    paddingLeft: item.level === 3 ? "1.5rem" : "0.75rem",
                  }}
                  className={`-ml-px block border-l-2 py-1 transition-colors ${
                    isActive
                      ? "border-indigo-600 font-medium text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                      : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-900 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:text-slate-200"
                  }`}
                >
                  {item.text}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
