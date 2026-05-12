import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts', 'src/client.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  splitting: true,
  external: ['react', 'react-dom', 'motion'],
  outDir: 'dist',
})