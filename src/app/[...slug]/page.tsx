import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getAllDocSlugs,
  getDocBySlug,
  getDocsTree,
  flattenTreeFiles,
} from "@/lib/docs";
import { DocView } from "@/components/DocView";

export const dynamic = "force-dynamic";

interface PageProps {
  params: {
    slug: string[];
  };
}

export function generateStaticParams() {
  const slugs = getAllDocSlugs();
  return slugs.map((slug) => ({ slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const doc = getDocBySlug(params.slug);
  if (!doc) {
    return { title: "Página não encontrada" };
  }
  return {
    title: doc.title,
    description: doc.description,
  };
}

export default function DocSlugPage({ params }: PageProps) {
  const doc = getDocBySlug(params.slug);
  if (!doc) {
    notFound();
  }

  const tree = getDocsTree();
  const flatFiles = flattenTreeFiles(tree);
  const currentIndex = flatFiles.findIndex((f) => f.path === doc.routePath);

  const prevDoc = currentIndex > 0 ? flatFiles[currentIndex - 1] : null;
  const nextDoc =
    currentIndex >= 0 && currentIndex < flatFiles.length - 1
      ? flatFiles[currentIndex + 1]
      : null;

  return <DocView doc={doc} prevDoc={prevDoc} nextDoc={nextDoc} />;
}
