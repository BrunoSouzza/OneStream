---
title: Governança e Somente Leitura
description: Por que arquivos não podem ser excluídos pelo site e apenas pelo repositório Git.
order: 2
tags:
  - Segurança
  - Governança
---

# Governança: Somente Leitura no Site

Seguindo o padrão **Docs-as-Code**, o site opera em modo **100% Somente Leitura (Read-Only)**.

> [!CAUTION]
> Nenhum visitante ou usuário pode excluir, renomear ou sobrescrever arquivos `.md` através do navegador. Toda exclusão ou modificação exige permissão de escrita na branch `main` do repositório no GitHub.

## Como Excluir uma Página Oficialmente

Como o site reflete a branch `main`, para remover uma página da documentação você deve removê-la pelo Git (ou diretamente pela interface do GitHub na branch `main`):

```bash
# Remova o arquivo pelo Git
git rm docs/caminho/para/pagina-antiga.md
git commit -m "docs: remove página obsoleta"
git push origin main
```

Assim que o commit for processado na `main`, a rota deixará de existir e o item será removido automaticamente do **TreeView**.
