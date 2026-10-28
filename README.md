# Quitanda · Design System do Parcele Aqui

Documento vivo da identidade visual do Parcele Aqui, para o portal e para a plataforma.

**Por que Quitanda.** O Parcele Aqui é de Belo Horizonte. Em Minas, quitanda é o conjunto de broa, biscoito e pão de queijo servido junto na mesa da tarde: peças diferentes, feitas com a mesma receita. O nome vale para o DS; as variáveis de código continuam técnicas (`var(--action-primary-bg)`).

- Figma editável: https://www.figma.com/design/16KaiI0Di1klxX2DzlD1GZ

Site estático, sem build. Publicado no Vercel (preset **Other**, sem install command).

## v2.0 · Outubro 2026

Reconstruído a partir dos dois arquivos Figma aprovados:

- Portal: https://www.figma.com/design/LxC1jHoS1UaNIQQppFBz7c/Novo-portal-Parcele-Aqui
- Plataforma: https://www.figma.com/design/5jovrhn3uvUDkhswLwNdF4

O que mudou em relação à v1.x:

- **Tipografia:** Young Serif (títulos), Hanken Grotesk (texto e interface), Bricolage Grotesque (números grandes). Sai Fraunces + Geist.
- **Cores:** coleção `Quitanda / Color` com modos Light e Dark. 60 primitivos e 47 semânticos no modelo grupo / papel / variante (Text/Strong, Action/Primary/Bg, Status/Error/Bg...), contraste AA auditado nos dois temas.
- **Tema escuro:** `data-theme="dark"` no `<html>`. Sem atributo, segue o sistema.
- **Ícones:** Phosphor regular (sai Lucide), servido localmente em `assets/phosphor`.
- **Componentes:** botão com 6 estados e regra de fundo, campos, checkbox, radio, toggle, avisos, toasts, tooltip (novo), badges, pills, tags, cards, linha de parcela, método de pagamento, simulador, navegação do portal e da plataforma, menu mobile em acordeão, carrossel, FAQ, modal, cookies, rodapé e telas de sistema.
- **Imagem:** sistema de ilustrações em risografia (elenco fixo, 53 cenas, objetos, padronagens e cenários) e banco de fotos, cada imagem com o prompt que a reproduz.
- **Padrões:** hero das internas, regras do mobile (CTA nunca quebra, carrossel para 3+ cards), logo wall, formulários.
- **Handoff:** `tokens/tokens.css` e `tokens/tokens.json` prontos para o código.

Fora deste DS (em aprovação): textos, regras de negócio e conteúdos `[preencher]`.

## Estrutura

```
index.html                 documentação (gerada)
tokens/tokens.css          variáveis CSS, claro e escuro
tokens/tokens.json         mesmos tokens em JSON, com alias do Figma
assets/ds.css              estilos da documentação e componentes de referência (pa-*)
assets/ds.js               interações da documentação
assets/phosphor/           fonte de ícones Phosphor regular (MIT)
assets/ilustracoes/        cenas riso 1980x1020 (WebP)
assets/ilustracoes-quadrado/ as mesmas cenas em 1200x1200 com respiro
assets/objetos/            objetos riso com fundo transparente
assets/padronagens/        padrões, texturas, tiles de papel e cenários
assets/fotos/              banco de fotos do portal
logos/                     SVGs oficiais
```

## Fontes

[Young Serif](https://fonts.google.com/specimen/Young+Serif), [Hanken Grotesk](https://fonts.google.com/specimen/Hanken+Grotesk) e [Bricolage Grotesque](https://fonts.google.com/specimen/Bricolage+Grotesque) via Google Fonts. Ícones: [Phosphor](https://phosphoricons.com/).
