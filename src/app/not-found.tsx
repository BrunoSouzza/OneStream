import Link from "next/link";
import { FileQuestion, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-500">
        <FileQuestion className="h-7 w-7" />
      </div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
        Arquivo Markdown não encontrado
      </h1>
      <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
        Esta rota não corresponde a nenhum arquivo <code>.md</code> presente na pasta{" "}
        <code>docs/</code> da branch <code>main</code>.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition-colors hover:bg-indigo-500"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar para o início
      </Link>
    </div>
  );
}
