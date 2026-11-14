---
title: Estrutura de Pastas
description: Como organizar pastas, subpastas e ordenar arquivos no TreeView.
order: 2
tags:
  - Organização
  - TreeView
---

# Estrutura de Pastas e Ordenação

O menu lateral funciona como um **TreeView** completo: pastas contêm arquivos `.md` e também outras subpastas em qualquer nível de profundidade.

## Exemplo da Árvore do Repositório

```text
docs/
├── index.md
├── 01-introducao/
│   ├── 01-como-funciona.md
│   └── 02-estrutura-de-pastas.md
├── 02-fluxo-git/
│   ├── 01-sincronizacao-branch-main.md
│   └── 02-governanca-somente-leitura.md
└── 03-guia-markdown/
    ├── 01-sintaxe-e-alertas.md
    └── avancado/
        └── 01-subpastas-e-treeview.md
```

## Como Controlar a Ordem dos Itens

Você pode controlar a ordem em que as pastas e arquivos aparecem no TreeView de duas maneiras:

### 1. Prefixo Numérico no Nome do Arquivo ou Pasta

Adicione um número no início do nome da pasta ou arquivo (ex.: `01-introducao`, `02-fluxo-git`). O sistema utiliza esse número para ordenar os itens e remove automaticamente o prefixo numérico ao gerar o nome amigável da pasta no menu.

### 2. Frontmatter YAML no Topo do Arquivo `.md`

Você também pode definir metadados no topo de qualquer arquivo `.md`:

```markdown
---
title: Meu Título Personalizado
description: Resumo da página para SEO e busca.
order: 1
tags:
  - Guia
  - Produção
---

# Conteúdo da Página...
```
