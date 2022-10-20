import { setDefaultOptions } from '../src/honeycomb-options';

test('it should set default honeycomb endpoint', () => {
  const options = setDefaultOptions();
  expect(options.endpoint).toEqual('https://api.honeycomb.io');
});
