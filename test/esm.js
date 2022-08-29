import esbuild from 'esbuild';
import { pluginNodemon } from '../dist/index.mjs';

export default async () => {
  await esbuild
    .build({
      entryPoints: ['./test/entry.js'],
      plugins: [pluginNodemon()],
    })
    .catch(() => {
      throw new Error('Failed: ESM');
    });
};
