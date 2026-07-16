# Parcele Aqui — Design System

Documento vivo da identidade visual e estratégica do Parcele Aqui.

Site estático, um único `index.html` autocontido (sem build). Publicado no Vercel.

## v1.2.1 — Julho 2026 · Fix de logo + downloads

- **Logo migrado de JPEG base64 → SVGs inline otimizados** (redução de ~1.4 MB de metadados do Illustrator via SVGO).
- **Adicionada pasta `/logos`** com 3 assets baixáveis:
  - `parcele-aqui-logo.svg` (mark + wordmark horizontal, 1131×343)
  - `parcele-aqui-icon.svg` (só o mark quadrado, 1200×1200)
  - `parcele-aqui-icon-negativo.svg` (versão para fundos escuros, 104×88)
- **Nova seção "Downloads"** no capítulo Logo, com preview e link direto para baixar cada SVG.
- **Removido `hero-floating-logo`** — o quadradinho branco flutuante atrás dos badges do hero.
- **Logo da topbar ampliado de 24px → 28px** para o wordmark ficar legível (proporção horizontal 3.3:1 precisa de mais altura).
- **Cores oficiais do logo corrigidas na documentação**: `#FFCC1B` (mark amarelo), `#DAA500` (dobra dourada), `#1C1815` (pin), `#1D1D1B` (wordmark).

## v1.2 — Julho 2026 · Atualização tipográfica

- **Trocada a fonte de display**: Kufam → **Fraunces** (serifa variable com eixos opsz, weight, SOFT, WONK). Escolha alinhada às tendências 2026 de fontes editoriais em fintech premium, sem cair no clichê da Bricolage Grotesque.
- **Trocada a fonte de UI/corpo**: DM Sans → **Geist** (open source da Vercel). Acabamento premium em formulários, dashboards e componentes de interface.
- Adicionados tokens `--fraunces-display`, `--fraunces-heading`, `--fraunces-body` para uso automático dos eixos variáveis por faixa de tamanho.
- Hero headline compactado: line-height 0.98 → 0.9.
- Adicionado `font-variant-numeric: tabular-nums` em métricas com números.
- Atualizada a seção Tipografia com specs das duas novas famílias.

## Estrutura

```
parcele-aqui-ds-deploy/
├── index.html
├── vercel.json
├── .gitignore
├── README.md
└── logos/
    ├── parcele-aqui-logo.svg           (6 KB)
    ├── parcele-aqui-icon.svg           (0.8 KB)
    └── parcele-aqui-icon-negativo.svg  (0.7 KB)
```

## Deploy no Vercel

```bash
cd parcele-aqui-ds-deploy
git init
git add .
git commit -m "v1.2.1 · SVGs oficiais + downloads"
git remote add origin <SEU_REPO>
git push -u origin main
```

Preset Vercel: **Other** (sem build, sem install command).

## Créditos

Fontes: [Fraunces](https://fonts.google.com/specimen/Fraunces) + [Geist](https://fonts.google.com/specimen/Geist) — ambas gratuitas via Google Fonts.
Ícones: [Phosphor](https://phosphoricons.com/).
