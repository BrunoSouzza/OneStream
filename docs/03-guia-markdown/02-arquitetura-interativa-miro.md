---
title: Arquitetura Interativa (Estilo Miro)
description: Crie quadros interativos onde você personaliza categoria, nome, ícone, cor e salva diretamente no arquivo Markdown (.md).
order: 2
tags:
  - Arquitetura
  - Miro Canvas
  - Persistência .md
---

# Desenho de Arquitetura Interativo (Estilo Miro)

Neste quadro interativo, qualquer alteração que você fizer — mover cards, mudar o nome da categoria (ex.: de `Microsserviço` para `Lambda`, `Squad`, `BFF`, etc.), trocar o **ícone**, mudar a **cor** ou criar novas conexões — pode ser **salva diretamente neste arquivo `.md`** clicando no botão **Salvar no .md**!

Quando você der **F5** no navegador, o arquivo `.md` já terá todas as suas atualizações salvas no disco.

```architecture
title: Arquitetura OneStream Cloud

# Componentes: [id | Categoria | Nome | Subtítulo | x, y | icone | cor]
[web | Frontend / Web | Portal OneStream | Next.js + Tailwind | 40, 100 | globe | sky]
[gateway | API Gateway | Edge Router | Kong + Rate Limit | 300, 290 | layers | yellow]
[auth | Segurança & IAM | Auth Service | OAuth2 + JWT | 310, 40 | shield | rose]
[core | Microsserviço | Order Service | Node.js + TypeScript | 600, 180 | server | indigo]
[kafka | Event Stream | Event Bus | Apache Kafka | 610, 350 | code | violet]
[pg | Banco de Dados | PostgreSQL | Cluster Primário | 980, 90 | database | emerald]
[nota | Post-it / SLA | Meta de Latência | < 50ms p99 (Clique para editar) | 950, 240 | note | yellow]

# Conexões: origem --> destino : Rótulo
web --> gateway : Teste
gateway --> auth : gRPC
gateway --> core : REST
core --> pg : SQL Pool
core --> kafka : OrderCreated
```

## Como personalizar qualquer Card

1. **Clique em qualquer card** no quadro acima para abrir o painel lateral **Personalizar Card**.
2. Altere livremente:
   - **Categoria / Tipo** (ex.: digite `Microsserviço`, `Worker`, `Squad Pagamentos`, `Regra de Negócio`, `S3 Bucket` — qualquer texto!).
   - **Nome do Card** e **Subtítulo**.
   - **Cor do Card** (8 temas visuais disponíveis).
   - **Ícone do Card** (20 ícones de arquitetura, nuvem, banco, segurança, mobile, mensageria e post-it).
3. Arraste os cards para a posição desejada e clique em **Salvar no .md** no canto superior direito do quadro.
4. Pressione **F5**: suas alterações estão gravadas diretamente em `docs/03-guia-markdown/02-arquitetura-interativa-miro.md`!
