---
title: Como Funciona
description: Entenda como os arquivos Markdown do repositório são transformados em rotas e páginas do site.
order: 1
tags:
  - Arquitetura
  - Rotas
---

# Como Funciona o Mapeamento de Rotas

No **OneStream Docs**, você não precisa configurar rotas manualmente no código para criar novas páginas. O motor de leitura (`src/lib/docs.ts`) percorre recursivamente a pasta `docs/` e constrói:

1. **A Árvore de Navegação (TreeView)** exibida na barra lateral esquerda.
2. **As Rotas Estáticas do Next.js** através de `generateStaticParams()`.
3. **O Índice de Busca (`Ctrl + K`)** com todos os títulos, cabeçalhos e trechos de texto.

## Exemplos de Mapeamento (`docs/` -> URL)

Veja como o caminho do arquivo no GitHub reflete diretamente na URL do navegador:

| Arquivo no Repositório (`main`) | Rota Gerada no Site |
| :--- | :--- |
| `docs/index.md` | `/` |
| `docs/01-introducao/01-como-funciona.md` | `/01-introducao/01-como-funciona` |
| `docs/01-introducao/02-estrutura-de-pastas.md` | `/01-introducao/02-estrutura-de-pastas` |
| `docs/03-guia-markdown/avancado/01-subpastas-e-treeview.md` | `/03-guia-markdown/avancado/01-subpastas-e-treeview` |

> [!TIP]
> No topo do menu lateral esquerdo, clique no ícone de código (`</>`) para alternar a visualização da TreeView entre **Títulos Amigáveis** e os **Nomes Reais dos Arquivos (`.md`)** exatamente como estão no repositório!
