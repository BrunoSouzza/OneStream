---
title: Sincronização com a Branch Main
description: Como o site reflete automaticamente cada push ou merge na branch main do GitHub.
order: 1
tags:
  - GitHub
  - CI/CD
  - Deploy
---

# Sincronização Automática com a Branch `main`

O projeto já vem configurado para atualizar o site automaticamente sempre que houver um `push` ou `merge` de Pull Request na branch `main`.

## Opção 1: Deploy Automático via Vercel (Recomendado)

1. Suba este repositório para o seu GitHub.
2. Conecte o repositório na [Vercel](https://vercel.com/new).
3. A cada commit na branch `main` (criação, edição ou remoção de arquivos `.md`), a Vercel reconstrói e publica o site em poucos segundos.

## Opção 2: Deploy Automático via GitHub Pages (GitHub Actions)

Este repositório já inclui o workflow `.github/workflows/deploy.yml` configurado para o **GitHub Pages**:

1. No seu repositório do GitHub, acesse **Settings -> Pages**.
2. Em **Build and deployment -> Source**, selecione **GitHub Actions**.
3. Qualquer alteração na branch `main` disparará a action que gera o site estático (`output: "export"`) e publica automaticamente.

> [!NOTE]
> Configure a variável `NEXT_PUBLIC_GITHUB_REPO="seu-usuario/seu-repositorio"` (ou edite `src/lib/site-config.ts`) para que os links **"Ver no GitHub"** apontem diretamente para os arquivos do seu repositório.
