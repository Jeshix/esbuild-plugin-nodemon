import { resolve } from 'path';
import nodemon from 'nodemon';

import type { Plugin } from 'esbuild';
import type { Settings } from 'nodemon';

interface PluginSettings {
  clearConsole?: boolean;
  nodemon?: Settings;
}

function pluginPath(): string {
  const { url } = import.meta;

  if (!url) {
    return __dirname;
  }

  return new URL(url).pathname
    .split('/')
    .filter((element, index, array) => !element.match(/^.*:/) && index < array.length - 1)
    .join('/');
}

function pluginNodemon(pluginSettings: PluginSettings = {}): Plugin {
  const clearConsole = pluginSettings.clearConsole ?? true;
  const nodemonSettings = JSON.parse(JSON.stringify(pluginSettings.nodemon ?? {})) as Settings;
  let tempDirPath: string | undefined;
  let isRunning: boolean;

  return {
    name: 'esbuild-plugin-nodemon',
    setup(build) {
      const { initialOptions } = build;

      if (!build.initialOptions.watch) {
        return;
      }

      if (!nodemonSettings.script) {
        tempDirPath = resolve(pluginPath(), '..', '..', 'esbuild-plugin-nodemon-temp');
        nodemonSettings.script = resolve(tempDirPath, 'index.js');
        nodemonSettings.watch = nodemonSettings.watch
          ? [...nodemonSettings.watch, nodemonSettings.script]
          : [nodemonSettings.script];
        initialOptions.bundle = true;
        initialOptions.outfile = nodemonSettings.script;
        delete initialOptions.outdir;
      }

      if (clearConsole) {
        build.onStart(() => {
          if (isRunning) {
            global.console.clear();
          }
        });
      }

      build.onEnd(({ errors }) => {
        if (errors.length) {
          return;
        }

        if (!isRunning) {
          isRunning = true;

          nodemon(nodemonSettings);
          nodemon.on('log', ({ colour }) => {
            global.console.log(colour);
          });

          return;
        }

        if (!tempDirPath) {
          return;
        }

        nodemon.emit('restart');
      });

      process.once('SIGINT', () => {
        process.exit(0);
      });
    },
  };
}

export { pluginNodemon };
