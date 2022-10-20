# Developing

This repo is managed using [npm workspaces](https://docs.npmjs.com/cli/v8/using-npm/workspaces).

Te top level directory does not contain a package.
The published packages are located in the packages directory.
The top-level directory coordinates all scripts as needed, and is a central place to define the workspace.

Each package should have a `package.json` that describes its name and individual scripts.

To setup a new package, `npm init -w packages/new-package-name`.
This then gets added into the top-level directory workspace and gets linked.

For individual scripts, run either in the package directory itself, or in the top-level directory and specify the package.

For example, to add typescript to the opentelemetry-node package:

```shell
# from the top-level directory:
npm install typescript --save-dev -w @honeycombio/opentelemetry-node
# or from the package directory:
npm install typescript --save-dev
```

The build command compiles the typescript to javascript in a `dist` directory.
The clean command removes the compiled javascript code from the `dist` directory.

To run for an individual package:

```shell
# from the top-level directory:
npm run build -w @honeycombio/opentelemetry-node
npm run clean -w @honeycombio/opentelemetry-node
# or from the package directory:
npm run build
npm run clean
```

Format and lint scripts can either be run at the root (to include everything) or in the individual directory.

`npm run check-format` will specify files that will have formatting changes made.
`npm run format` will fix the changes; most times you'll just want to run this command.

`npm run lint` will specify files that have linting errors.
`npm run lint-fix` will try to fix the linting errors.

## Example Applications

- [Hello World](packages/opentelemetry-node/examples/hello-world/) is a simple javascript application. It has a readme for example development.

To run the example from the root directory, run `npm run example-node`.

## Recommended Plugins for VSCode

ESLint (dbaeumer.vscode-eslint)
Prettier (esbenp.prettier-vscode)
Prettier ESLint (rvest.vs-code-prettier-eslint)
