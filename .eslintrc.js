module.exports = {
  root: true,
  env: {
    node: true,
    commonjs: true,
    es6: true,
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  overrides: [
    // turn off noisy rules for eslintrcjs and test for now
    {
      files: ['*.js, *.ts, *.test.ts, /packages/opentelemetry-node/src/*.test.ts'],
      rules: {
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-var-requires': 'off'
      },
    },
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.eslint.json', './packages/*/tsconfig.json'],
  },
};
