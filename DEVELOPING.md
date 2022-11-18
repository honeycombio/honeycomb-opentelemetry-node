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
  - Make? When we've got npm scripts? Yes. See [Make Is Cool](#make-is-cool)
- VS Code - plugins:
  - ESLint (dbaeumer.vscode-eslint)
  - Prettier (esbenp.prettier-vscode)
  - Prettier ESLint (rvest.vs-code-prettier-eslint)

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

`npm run test` will run the unit tests, it is on silent by default for verbose output of console logs and warnings use `npm run test-verbose`

## Example Applications

- [Hello World](./examples/hello-node/) is a simple javascript application. It has a readme for example development.

To run the example from the root directory, run `npm run example-node`.

## Building a Tarball for Local Development

To get a tarball to use as a local dependency, after cleaning and building run `npm pack`:

```sh
npm install
npm run clean
npm run build
npm pack
```

This creates a file in the root directory like this: `honeycombio-opentelemetry-node-0.1.42-beta.tgz`
To use as a dependency in another project, install it with `npm`:

`npm install honeycombio-opentelemetry-node-0.1.1-beta.tgz`

This will create a dependency in your `package.json` like this:

```json
  "dependencies": {
    "@honeycombio/opentelemetry-node": "file:honeycombio-opentelemetry-node-0.1.42-beta.tgz",
  }
```

## Make is Cool

This is one of several projects maintained by the same group of people.
That group has settled on Makefiles as a way to smooth the context-switching that occurs when moving between projects written in different languages using different tooling.
Makefiles let us have a common set of commands in our workflows across projects.
The command below use [remake](https://remake.readthedocs.io/), but are equally effective with `make`.

### First Steps

When you first clone the project:

```shell
# from the top-level directory, see the common project tasks
remake --tasks

# install dependencies and run the routine code checks
remake
```

The build target compiles the typescript to javascript in a `dist` directory.
The clean target removes the compiled javascript code from the `dist` directory.

```shell
# from the top-level directory:
remake build
remake clean
```

Format and lint scripts

`remake check-format` will specify files that will have formatting changes made.
`remake format` will fix the changes; most times you'll just want to run this command.

`remake lint` will specify files that have linting errors.
`remake lint-fix` will try to fix the linting errors.

Testing scripts

`remake test` will run the unit tests
