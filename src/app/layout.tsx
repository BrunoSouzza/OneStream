import type { Metadata } from "next";
import "./globals.css";
import { siteConfig } from "@/lib/site-config";
import { getDocsTree, getSearchIndex } from "@/lib/docs";
import { DocsShell } from "@/components/DocsShell";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const tree = getDocsTree();
  const searchIndex = getSearchIndex();

  return (
    <html lang="pt-BR" className="dark" suppressHydrationWarning>
      <body className="antialiased selection:bg-indigo-500 selection:text-white">
        <DocsShell tree={tree} searchIndex={searchIndex}>
          {children}
        </DocsShell>
      </body>
    </html>
  );
}
