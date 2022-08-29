import { existsSync, readdirSync, rmSync } from 'fs';
import { resolve, join } from 'path';
import nodemon from 'nodemon';

import type { Plugin } from 'esbuild';

interface Config {
  tempDir?: string;
  clearConsole?: boolean;
  quietMode?: boolean;
  deleteOnExit?: boolean;
}

function isDirEmpty(path: string) {
  if (existsSync(path)) {
    const files = readdirSync(path);

    if (files.length > 1 || (files.length === 1 && files[0] !== 'index.js')) {
      return false;
    }
  }

  return true;
}

function pluginNodemon(config: Config = {}): Plugin {
  const tempDir = resolve(process.cwd(), config.tempDir ?? '.watch');
  const tempFile = join(tempDir, 'index.js');
  const clearConsole = config.clearConsole ?? true;
  const quietMode = config.quietMode ?? false;
  const deleteOnExit = config.deleteOnExit ?? true;
  let isRunning = false;

  return {
    name: 'esbuild-plugin-nodemon',
    setup(build) {
      if (!build.initialOptions.watch) {
        return;
      }

      const options = build.initialOptions;

      options.bundle = true;
      options.outfile = tempFile;
      delete options.outdir;

      if (clearConsole) {
        build.onStart(() => {
          if (isRunning) {
            global.console.clear();
          }
        });
      }

      build.onEnd(({ errors }) => {
        if (isRunning || errors.length) {
          return;
        }

        isRunning = true;

        nodemon({ script: tempFile, watch: [tempFile] });

        if (!quietMode) {
          nodemon.on('log', ({ colour }) => {
            global.console.log(colour);
          });
        }
      });

      if (!deleteOnExit) {
        return;
      }

      if (isDirEmpty(tempDir)) {
        process.once('exit', () => {
          if (existsSync(tempDir)) {
            rmSync(tempDir, { recursive: true });
          }
        });

        process.once('SIGINT', () => {
          process.exit(0);
        });
      } else {
        global.console.log(
          '\n',
          '\u001B[93m[WARNING]\u001B[39m',
          '\u001B[95m[esbuild-plugin-nodemon]\u001B[39m',
          'Temporary directory is not empty and will not be deleted on process exit',
          '\n',
        );
      }
    },
  };
}

export { pluginNodemon };
