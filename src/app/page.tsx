import { notFound } from "next/navigation";
import { getDocBySlug, getDocsTree, flattenTreeFiles } from "@/lib/docs";
import { DocView } from "@/components/DocView";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const doc = getDocBySlug([]);
  const tree = getDocsTree();
  const flatFiles = flattenTreeFiles(tree);

  if (!doc) {
    notFound();
  }

  const currentIndex = flatFiles.findIndex((f) => f.path === "/");
  const prevDoc = currentIndex > 0 ? flatFiles[currentIndex - 1] : null;
  const nextDoc =
    currentIndex >= 0 && currentIndex < flatFiles.length - 1
      ? flatFiles[currentIndex + 1]
      : flatFiles[0] || null;

  return <DocView doc={doc} prevDoc={prevDoc} nextDoc={nextDoc} />;
}
