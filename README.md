# OneStream Docs

Portal de documentação moderno construído com **Next.js (App Router)**, **TypeScript** e **Tailwind CSS**, onde cada arquivo Markdown (`.md`) dentro da pasta [`docs/`](./docs) reflete automaticamente uma rota do site e aparece no menu lateral em formato **TreeView**.

## ✨ Principais Funcionalidades

- **Roteamento Automático por `.md`**: Basta criar pastas e arquivos `.md` dentro de `docs/` na branch `main` para gerar novas rotas no site.
- **Menu Lateral em TreeView**: Navegação hierárquica com suporte a múltiplos níveis de pastas, expansão/recolhimento individual ou global, filtro rápido em tempo real e alternância entre título amigável ou nome real do arquivo `.md`.
- **Somente Leitura no Site**: Nenhum arquivo pode ser excluído ou modificado pela interface web. Exclusões e edições são feitas exclusivamente no repositório GitHub (refletindo a branch `main`).
- **Busca Global (`Ctrl + K`)**: Pesquisa instantânea por título, caminho do arquivo, seções e conteúdo.
- **Índice Dinâmico (Table of Contents)**: Gerado automaticamente a partir das seções `##` e `###` de cada documento.
- **Dark / Light Mode**: Tema escuro moderno por padrão com alternância instantânea.

## 📁 Estrutura do Projeto

```text
OneStream/
├── .github/workflows/deploy.yml  # Deploy automático a cada push na branch main
├── docs/                         # Seus arquivos Markdown (.md) -> Rotas do site
│   ├── index.md                  # Rota inicial: /
│   ├── 01-introducao/
│   ├── 02-fluxo-git/
│   └── 03-guia-markdown/
└── src/
    ├── app/                      # Rotas Next.js App Router (/ e /[...slug])
    ├── components/               # TreeSidebar, MarkdownRenderer, SearchModal, TOC
    └── lib/                      # Motor de leitura recursiva do diretório docs/
```

## 🚀 Como Executar Localmente

> **Requisito**: Node.js `>= 18.17` (recomendado Node.js 20 LTS).

```bash
# 1. Instale as dependências
npm install

# 2. Inicie o servidor de desenvolvimento
npm run dev
```

Acesse `http://localhost:3000`.

## 🔄 Sincronização com o GitHub (`main`)

1. Inicialize o repositório Git e envie para a branch `main` no GitHub:
   ```bash
   git init
   git branch -M main
   git add .
   git commit -m "feat: estrutura inicial do OneStream Docs"
   git remote add origin https://github.com/SEU-USUARIO/OneStream.git
   git push -u origin main
   ```
2. Conecte o repositório na **Vercel** (zero-config) ou habilite o **GitHub Pages** (*Settings -> Pages -> Source: GitHub Actions*) para que todo commit na `main` publique automaticamente as alterações.
