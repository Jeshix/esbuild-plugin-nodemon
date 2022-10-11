# esbuild-plugin-nodemon

An [esbuild](https://esbuild.github.io/) plugin for watch file changes via [nodemon](https://nodemon.io/)

## Install

```console
npm install --save-dev nodemon @jeshix/esbuild-plugin-nodemon
```

or

```console
yarn add --dev nodemon @jeshix/esbuild-plugin-nodemon
```

## Usage example

```js
const { build } = require("esbuild");
const { pluginNodemon } = require("@jeshix/esbuild-plugin-nodemon");

build({
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
> Plugin will set `bundle` option to `true` and store output files in its directory, if no `nodemon.script` path will be provided

## Configuration

| Option         | Description                        | Type      | Default value |
| -------------- | ---------------------------------- | --------- | ------------- |
| `clearConsole` | Clear console before every rebuild | `Boolean` | `true`        |
| `nodemon`      | Nodemon settings                   | `Object`  | `{}`          |

## License

[MIT](./LICENSE)
