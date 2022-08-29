export default async () => {
  const esbuild = await import('esbuild');
  const { pluginNodemon } = await import('../dist/index.cjs');

  await esbuild
    .build({
      entryPoints: ['./test/entry.js'],
      plugins: [pluginNodemon()],
    })
    .catch(() => {
      throw new Error('Failed: CommonJS');
    });
};
