import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DOCS_DIR = path.join(process.cwd(), "docs");

function resolveSafeDocPath(relativePath: string): string | null {
  const normalized = path
    .normalize(relativePath)
    .replace(/^(\.\.(\/|\\|$))+/, "");
  const fullPath = path.join(DOCS_DIR, normalized);
  if (!fullPath.startsWith(DOCS_DIR)) {
    return null;
  }
  return fullPath;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const relativePath = searchParams.get("path");
  if (!relativePath) {
    return NextResponse.json(
      { error: "Parâmetro path é obrigatório." },
      { status: 400 }
    );
  }

  const fullPath = resolveSafeDocPath(relativePath);
  if (!fullPath || !fs.existsSync(fullPath)) {
    return NextResponse.json(
      { error: "Arquivo .md não encontrado." },
      { status: 404 }
    );
  }

  const rawContent = fs.readFileSync(fullPath, "utf-8");
  return NextResponse.json({ relativePath, rawContent });
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { relativePath, rawContent, oldBlockCode, newBlockCode } = body as {
      relativePath?: string;
      rawContent?: string;
      oldBlockCode?: string;
      newBlockCode?: string;
    };

    if (!relativePath) {
      return NextResponse.json(
        { error: "O caminho do arquivo (relativePath) é obrigatório." },
        { status: 400 }
      );
    }

    const fullPath = resolveSafeDocPath(relativePath);
    if (!fullPath || !fs.existsSync(fullPath)) {
      return NextResponse.json(
        { error: "Arquivo .md não encontrado em docs/." },
        { status: 404 }
      );
    }

    // Mode 1: Update the entire .md file content
    if (typeof rawContent === "string") {
      fs.writeFileSync(fullPath, rawContent, "utf-8");
      return NextResponse.json({
        ok: true,
        message: "Arquivo Markdown atualizado com sucesso!",
      });
    }

    // Mode 2: Update an interactive architecture/miro block inside the .md file
    if (typeof newBlockCode === "string") {
      const currentFile = fs.readFileSync(fullPath, "utf-8");

      // Normalize line endings for matching
      const normalize = (s: string) => s.replace(/\r\n/g, "\n").trim();
      const fenceRegex = /```(?:architecture|miro|canvas)\r?\n([\s\S]*?)```/g;

      let replaced = false;
      const updatedFile = currentFile.replace(
        fenceRegex,
        (fullMatch, innerCode) => {
          if (replaced) return fullMatch;
          if (
            !oldBlockCode ||
            normalize(innerCode) === normalize(oldBlockCode)
          ) {
            replaced = true;
            return newBlockCode;
          }
          return fullMatch;
        }
      );

      // Fallback: if oldBlockCode didn't match due to prior in-session edits, replace the first architecture block
      let finalFile = updatedFile;
      if (!replaced) {
        finalFile = currentFile.replace(fenceRegex, () => {
          replaced = true;
          return newBlockCode;
        });
      }

      if (!replaced) {
        return NextResponse.json(
          {
            error:
              "Bloco ```architecture não encontrado no arquivo Markdown para atualizar.",
          },
          { status: 400 }
        );
      }

      fs.writeFileSync(fullPath, finalFile, "utf-8");
      return NextResponse.json({
        ok: true,
        message: "Board salvo diretamente no arquivo .md!",
      });
    }

    return NextResponse.json(
      { error: "Nenhum conteúdo enviado para atualização." },
      { status: 400 }
    );
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Erro ao salvar alterações no arquivo .md",
      },
      { status: 500 }
    );
  }
}
