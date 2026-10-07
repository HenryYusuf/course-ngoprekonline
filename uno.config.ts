import { presetTypography } from '@unocss/preset-typography'
import { defineConfig, presetAttributify, presetUno } from 'unocss'

/**
 * Design tokens ala ddpanda.org (spec: GitHub issue #12).
 * Single source of truth: CSS variables (preflights below, RGB triplets so
 * utilities can apply alpha via `<alpha-value>`). The `.dark` block is
 * prepared but intentionally not exposed in the UI yet (light-only decision).
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
      },
    },
    fontFamily: {
      sans: '\'DM Sans\', ui-sans-serif, system-ui, sans-serif',
      display: 'Syne, ui-sans-serif, system-ui, sans-serif',
      mono: '"Space Mono", ui-monospace, SFMono-Regular, monospace',
    },
    // ddpanda look: every corner square, `rounded-full` chips included.
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
    ['label-caps', 'font-mono text-[11px] font-bold uppercase tracking-[0.08em]'],
    ['caret-blink', [
      'relative',
      'after:content-empty',
      'after:inline-block after:h-[0.9em] after:w-[0.6em] after:ml-[0.15em] after:align-[-0.05em]',
      'after:bg-primary',
      'after:animate-[caret-blink-kf_1.1s_step-end_infinite]',
    ]],
    ['no-scrollbar', 'scrollbar-width:none [&::-webkit-scrollbar]:hidden'],
  ],
  preflights: [
    {
      layer: 'base',
      getCSS: () => `
:root {
  --c-background: 255 255 255;
  --c-foreground: 24 24 27;
  --c-card: 255 255 255;
  --c-border: 228 228 231;
  --c-muted: 244 244 245;
  --c-muted-foreground: 82 82 91;
  --c-accent: 254 242 244;
  --c-surface-low: 244 244 245;
  --c-surface-high: 255 255 255;
  --c-primary: 225 29 72;
  --c-primary-foreground: 255 255 255;
}

/* Prepared but not exposed: dark tokens (spec #12, light-only for now). */
.dark {
  --c-background: 10 10 10;
  --c-foreground: 250 250 250;
  --c-card: 10 10 10;
  --c-border: 39 39 42;
  --c-muted: 24 24 27;
  --c-muted-foreground: 161 161 170;
  --c-accent: 39 39 42;
  --c-surface-low: 24 24 27;
  --c-surface-high: 10 10 10;
  --c-primary: 225 29 72;
  --c-primary-foreground: 255 255 255;
}

@keyframes caret-blink-kf {
  0%, 40% { opacity: 1 }
  50%, 90% { opacity: 0 }
  100% { opacity: 1 }
}

::selection {
  background: rgb(var(--c-primary));
  color: rgb(var(--c-primary-foreground));
}

html {
  font-family: "DM Sans", ui-sans-serif, system-ui, sans-serif;
  color: rgb(var(--c-foreground));
  background-color: rgb(var(--c-background));
}
`,
    },
  ],
})
