# Developing

## Prerequisites

Required:

- Node.js (minimum version declared in package.json)

Recommended:

- Docker & Docker Compose - Required for running smoke-tests.
  - [Docker Desktop](https://www.docker.com/products/docker-desktop/) is a reliable choice if you don't have your own preference.
- [remake](https://remake.readthedocs.io/) - A better make.
  - Each script defined in package.json is also a make target.
    View them with `remake --tasks`.
  - Make? When we've got npm scripts? Yes.
    Because this is one of several projects maintained by a common group of people.
    That group has settled on Makefiles as a way to smooth the context-switching that occurs when moving between projects.

## First Steps

When you first clone the project:

```shell
# from the top-level directory:
npm install
```

The build command compiles the typescript to javascript in a `dist` directory.
The clean command removes the compiled javascript code from the `dist` directory.

```shell
# from the top-level directory:
npm run build
npm run clean
```

Format and lint scripts

`npm run check-format` will specify files that will have formatting changes made.
`npm run format` will fix the changes; most times you'll just want to run this command.

`npm run lint` will specify files that have linting errors.
`npm run lint-fix` will try to fix the linting errors.

Testing scripts

`npm run test` will run the unit tests

## Example Applications

- [Hello World](./examples/hello-node/) is a simple javascript application. It has a readme for example development.

To run the example from the root directory, run `npm run example-node`.

## Recommended Plugins for VSCode

ESLint (dbaeumer.vscode-eslint)
Prettier (esbenp.prettier-vscode)
Prettier ESLint (rvest.vs-code-prettier-eslint)
