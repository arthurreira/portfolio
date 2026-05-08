import { defineConfig } from 'tsup'

export default defineConfig({
  entry: [
    'src/components/button.tsx',
    'src/components/card.tsx',
    'src/components/badge.tsx',
    'src/components/skeleton.tsx',
    'src/components/avatar.tsx',
    'src/components/dialog.tsx',
    'src/components/popover.tsx',
    'src/components/navbar.tsx',
    'src/components/themeToggle.tsx',
    'src/lib/theme-provider.tsx',
    'src/lib/utils.ts',
  ],
  format: ['esm', 'cjs'],
  dts: true,
  splitting: false,
  external: ['react', 'react-dom'],
  outDir: 'dist',
  esbuildOptions(options) {
    options.conditions = ['require', 'default']
  }
})