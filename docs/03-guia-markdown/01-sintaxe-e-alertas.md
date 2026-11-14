---
title: Sintaxe Markdown e Alertas
description: Exemplos de blocos de código, tabelas, alertas e elementos visuais suportados.
order: 1
tags:
  - Markdown
  - UI
---

# Sintaxe Markdown e Componentes Visuais

Todos os arquivos `.md` suportam **GitHub Flavored Markdown (GFM)** completo, incluindo blocos de código com botão de cópia, tabelas responsivas e caixas de alerta estilizadas.

## Caixas de Alerta (Callouts)

Use a sintaxe oficial de alertas do GitHub nos seus arquivos `.md`:

> [!NOTE]
> Use `[!NOTE]` para destacar informações contextuais úteis na documentação.

> [!TIP]
> Use `[!TIP]` para compartilhar boas práticas e atalhos com a equipe.

> [!WARNING]
> Use `[!WARNING]` para avisar sobre pontos de atenção importantes.

## Blocos de Código com Cópia Rápida

```typescript
interface Documento {
  caminho: string;
  branch: "main";
  somenteLeitura: true;
}

export function validarDocumento(doc: Documento): string {
  return `Sincronizado de ${doc.caminho} (${doc.branch})`;
}
```

## Tabelas GFM

| Elemento | Sintaxe Markdown | Suporte |
| :--- | :--- | :--- |
| Tabelas | `\| Coluna \| Valor \|` | Completo |
| Alertas GitHub | `> [!NOTE]` / `> [!TIP]` | Completo |
| Código com Copy | ` ```linguagem ` | Completo |
| Âncoras Automáticas | `## Título da Seção` | Completo |
