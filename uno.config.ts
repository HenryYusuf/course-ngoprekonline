import { presetTypography } from '@unocss/preset-typography'
import { defineConfig, presetAttributify, presetUno } from 'unocss'

/**
 * Design tokens for "Kemasan Spesifikasi" (label & kemasan perangkat elektronik).
 * Single source of truth: CSS variables (preflights below, RGB triplets so
 * utilities can apply alpha via `<alpha-value>`). Light-only by decision.
 *
 * Strategy: restrained. Bone/ink neutrals + one safety-orange signal.
 * `--c-primary` (#FF4D14) is the fill/mark; on fill the foreground is ink
 * (safety-label contrast, 5.4:1). `--c-primary-deep` (#C23A0A) carries small
 * orange text on light grounds (4.8:1+). Elevation is declared once: borders.
 */
export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetTypography(),
  ],
  theme: {
    colors: {
      background: 'rgb(var(--c-background) / <alpha-value>)',
      foreground: 'rgb(var(--c-foreground) / <alpha-value>)',
      card: 'rgb(var(--c-card) / <alpha-value>)',
      border: 'rgb(var(--c-border) / <alpha-value>)',
      muted: {
        DEFAULT: 'rgb(var(--c-muted) / <alpha-value>)',
        foreground: 'rgb(var(--c-muted-foreground) / <alpha-value>)',
      },
      accent: 'rgb(var(--c-accent) / <alpha-value>)',
      surface: {
        low: 'rgb(var(--c-surface-low) / <alpha-value>)',
        high: 'rgb(var(--c-surface-high) / <alpha-value>)',
      },
      primary: {
        DEFAULT: 'rgb(var(--c-primary) / <alpha-value>)',
        foreground: 'rgb(var(--c-primary-foreground) / <alpha-value>)',
        deep: 'rgb(var(--c-primary-deep) / <alpha-value>)',
      },
      plate: {
        DEFAULT: 'rgb(var(--c-plate) / <alpha-value>)',
        fg: 'rgb(var(--c-plate-fg) / <alpha-value>)',
        muted: 'rgb(var(--c-plate-muted) / <alpha-value>)',
      },
    },
    fontFamily: {
      sans: '\'Archivo\', ui-sans-serif, system-ui, sans-serif',
      display: '\'Archivo\', ui-sans-serif, system-ui, sans-serif',
      mono: '\'IBM Plex Mono\', ui-monospace, SFMono-Regular, monospace',
    },
    // Carton folds: every corner square; chips are cut labels, not pills.
    borderRadius: {
      'DEFAULT': '0px',
      'sm': '0px',
      'md': '0px',
      'lg': '0px',
      'xl': '0px',
      '2xl': '0px',
      '3xl': '0px',
      'full': '0px',
    },
  },
  shortcuts: [
    ['label-caps', 'font-mono text-[11px] font-medium uppercase tracking-[0.06em] leading-[1.4]'],
    ['stamp', 'inline-flex items-center gap-1.5 border border-foreground px-2 py-1 label-caps'],
    ['btn-signal', [
      'inline-flex items-center justify-center gap-2 border border-foreground bg-primary px-5 py-3',
      'label-caps text-primary-foreground transition-colors duration-200',
      'hover:bg-foreground hover:text-background',
    ]],
    ['btn-ghost', [
      'inline-flex items-center justify-center gap-2 border border-foreground bg-transparent px-5 py-3',
      'label-caps text-foreground transition-colors duration-200',
      'hover:bg-foreground hover:text-background',
    ]],
    ['spec-row', 'flex items-baseline justify-between gap-6 border-t border-plate-muted/25 py-2 first:border-t-0'],
    ['no-scrollbar', 'scrollbar-width:none [&::-webkit-scrollbar]:hidden'],
  ],
  preflights: [
    {
      layer: 'base',
      getCSS: () => `
:root {
  --c-background: 251 250 246;
  --c-foreground: 23 24 28;
  --c-card: 255 255 255;
  --c-border: 222 221 215;
  --c-muted: 241 239 232;
  --c-muted-foreground: 86 87 92;
  --c-accent: 255 237 228;
  --c-surface-low: 243 241 234;
  --c-surface-high: 255 255 255;
  --c-primary: 255 77 20;
  --c-primary-foreground: 23 24 28;
  --c-primary-deep: 194 58 10;
  --c-plate: 23 24 28;
  --c-plate-fg: 251 250 246;
  --c-plate-muted: 154 155 158;
}

@keyframes plate-row-in {
  from {
    opacity: 0;
    transform: translateY(6px);
    animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
  }
  to { opacity: 1; transform: translateY(0); }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-delay: 0ms !important;
    transition-duration: 0.01ms !important;
  }
}

::selection {
  background: rgb(var(--c-primary));
  color: rgb(var(--c-primary-foreground));
}

html {
  font-family: 'Archivo', ui-sans-serif, system-ui, sans-serif;
  color: rgb(var(--c-foreground));
  background-color: rgb(var(--c-background));
  caret-color: rgb(var(--c-primary-deep));
  scrollbar-color: rgb(var(--c-muted-foreground) / 0.45) rgb(var(--c-surface-low));
}

/* Browser surfaces: themed from the palette, not left to defaults. */
::-webkit-scrollbar { width: 10px; height: 10px; }
::-webkit-scrollbar-track { background: rgb(var(--c-surface-low)); }
::-webkit-scrollbar-thumb { background: rgb(var(--c-muted-foreground) / 0.45); border: 2px solid rgb(var(--c-surface-low)); }
::-webkit-scrollbar-thumb:hover { background: rgb(var(--c-muted-foreground) / 0.7); }

:focus-visible {
  outline: 2px solid rgb(var(--c-primary));
  outline-offset: 2px;
}

::placeholder { color: rgb(var(--c-muted-foreground)); opacity: 1; }

/* Prose: the article body carries the world too. The doubled .prose class
   raises specificity one notch so these rules win over presetTypography's
   equally-scoped selectors regardless of stylesheet order. */
.prose.prose {
  max-width: 68ch;
  color: rgb(var(--c-foreground));
  font-size: 1.0625rem;
  line-height: 1.75;
}
.prose.prose :where(h1, h2, h3, h4):not(:where([class~="not-prose"] *)) {
  font-family: 'Archivo', ui-sans-serif, system-ui, sans-serif;
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.15;
  color: rgb(var(--c-foreground));
}
.prose.prose :where(a):not(:where([class~="not-prose"] *)) {
  color: rgb(var(--c-primary-deep));
  text-underline-offset: 3px;
  text-decoration-thickness: 1px;
}
.prose.prose :where(a):not(:where([class~="not-prose"] *)):hover {
  text-decoration-thickness: 2px;
}
.prose.prose :where(h1, h2, h3, h4, h5, h6) :where(a):not(:where([class~="not-prose"] *)) {
  color: inherit;
  font-weight: inherit;
  text-decoration: none;
}
.prose.prose :where(code):not(:where([class~="not-prose"] *)) {
  font-family: 'IBM Plex Mono', ui-monospace, monospace;
  font-size: 0.875em;
  background: rgb(var(--c-surface-low));
  border: 1px solid rgb(var(--c-border));
  padding: 0.1em 0.35em;
}
.prose.prose :where(pre):not(:where([class~="not-prose"] *)) {
  background: rgb(var(--c-plate));
  color: rgb(var(--c-plate-fg));
  border-radius: 0;
  border: 1px solid rgb(var(--c-foreground));
}
.prose.prose :where(pre code):not(:where([class~="not-prose"] *)) {
  background: transparent;
  border: 0;
  padding: 0;
  color: inherit;
}
.prose.prose :where(img):not(:where([class~="not-prose"] *)) {
  border: 1px solid rgb(var(--c-border));
}
.prose.prose :where(blockquote):not(:where([class~="not-prose"] *)) {
  border-left: 2px solid rgb(var(--c-primary));
  color: rgb(var(--c-muted-foreground));
  font-style: normal;
}
.prose.prose :where(table):not(:where([class~="not-prose"] *)) {
  font-variant-numeric: tabular-nums;
}
.prose.prose :where(th):not(:where([class~="not-prose"] *)) {
  font-family: 'IBM Plex Mono', ui-monospace, monospace;
  font-size: 0.8em;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
`,
    },
  ],
})
