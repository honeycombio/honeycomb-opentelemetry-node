import { HoneycombOptions } from '../src/honeycomb-options';

test('it should have an apiKey property on the HoneycombOptions object', () => {
  function hasApiKey(object: any): object is HoneycombOptions {
    return 'apiKey' in object;
  }
  const testApiKey = hasApiKey({ apiKey: 'testkey' });
  expect(testApiKey).toEqual(true);
});
