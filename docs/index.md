---
title: Bem-vindo ao OneStream
description: Portal de documentação moderno onde cada arquivo Markdown (.md) na branch main é refletido automaticamente como uma rota do site.
order: 0
tags:
  - Documentação
  - Git-Backed
  - Next.js
---

# Bem-vindo ao OneStream Docs

O **OneStream Docs** é um portal de documentação moderno construído com **Next.js (App Router)**, **TypeScript** e **Tailwind CSS**, desenhado para refletir fielmente a estrutura de diretórios e arquivos `.md` da sua branch `main` no GitHub.

> [!IMPORTANT]
> Todos os arquivos e pastas dentro do diretório `docs/` deste repositório tornam-se automaticamente rotas navegáveis no menu lateral em formato **TreeView** — sem possibilidade de exclusão pelo navegador.

## Principais Recursos

| Recurso | Descrição |
| :--- | :--- |
| **Roteamento Automático por `.md`** | Qualquer arquivo `.md` criado dentro de `docs/` vira imediatamente uma página com URL amigável correspondente ao caminho das pastas. |
| **Menu Lateral em TreeView** | Navegação hierárquica idêntica a uma IDE, com suporte a subpastas ilimitadas, filtro instantâneo e alternância entre título amigável ou nome real do arquivo `.md`. |
| **Somente Leitura no Site** | Nenhum arquivo pode ser apagado ou adulterado pela interface web. A única fonte da verdade (*Single Source of Truth*) é a branch `main` do repositório GitHub. |
| **Busca Global (`Ctrl + K`)** | Pesquisa instantânea em todos os documentos por título, caminho do arquivo, seções e conteúdo. |
| **Índice Dinâmico (TOC)** | O menu lateral direito (*Nesta página*) é gerado automaticamente a partir dos subtítulos `##` e `###` do seu Markdown. |

## Como Adicionar uma Nova Página

Para publicar uma nova página ou seção no site, basta criar um arquivo `.md` no repositório e fazer push para a branch `main`:

```bash
# 1. Crie uma nova pasta ou arquivo .md dentro de docs/
mkdir -p docs/04-api
echo "# Autenticação da API" > docs/04-api/autenticacao.md

# 2. Faça commit e envie para a branch main
git add docs/04-api/autenticacao.md
git commit -m "docs: adiciona página de autenticação da API"
git push origin main
```

Assim que o commit chega na branch `main`, o deploy automático atualiza o site e exibe a pasta **Api** e a página **Autenticação** no **TreeView** lateral!
