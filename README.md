# esbuild-plugin-nodemon

An [esbuild](https://esbuild.github.io/) plugin for watch file changes via [nodemon](https://nodemon.io/)

## Install

```console
npm install --save-dev @jeshix/esbuild-plugin-nodemon
```

or

```console
yarn add --dev @jeshix/esbuild-plugin-nodemon
```

## Usage example

```js
const esbuild = require("esbuild");
const { pluginNodemon } = require("@jeshix/esbuild-plugin-nodemon");

esbuild.build({
  entryPoints: ["app.js"],
  watch: true,
  plugins: [
    pluginNodemon({
      // config
    }),
  ],
});
```

> **Note**
>
> Plugin works only in `watch` mode

## Configuration

| Option         | Description                                                   | Type      | Default value | Notes                                                                                                                   |
| -------------- | ------------------------------------------------------------- | --------- | ------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `tempDir`      | Path to your temporary directory, where bundle will be stored | `string`  | `.watch`      | Can be absolute or relative to your project root                                                                        |
| `clearConsole` | Clear console before rebuild                                  | `boolean` | `true`        |                                                                                                                         |
| `quietMode`    | Start nodemon in quiet mode                                   | `boolean` | `false`       |                                                                                                                         |
| `deleteOnExit` | Delete temporary directory on process exit                    | `boolean` | `true`        | Temporary directory must not contain any files, except esbuild output, otherwise, this option will be forced to `false` |

## License

[MIT](./LICENSE)
