// eslint-disable-next-line @typescript-eslint/no-var-requires
const testSum = require('./index');

test('adds 1 + 2 to equal 3', () => {
  expect(testSum(1, 2)).toBe(3);
});

