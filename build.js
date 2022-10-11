import { build } from 'esbuild';
import { esbuildPluginNodeExternals } from 'esbuild-plugin-node-externals';

[
  { format: 'cjs', ext: 'cjs' },
  { format: 'esm', ext: 'mjs' },
].forEach(({ format, ext }) => {
  build({
    entryPoints: ['./src/index.ts'],
    minify: true,
    platform: 'node',
    target: ['node16'],
    format,
    outfile: `dist/index.${ext}`,
    plugins: [esbuildPluginNodeExternals()],
  }).catch(() => process.exit(1));
});
