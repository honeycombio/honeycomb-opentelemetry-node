import { sayHello } from './index';
import { addHoneycomb } from './opentelemetry-node';
import { addResource } from './resource-builder';
import { Resource } from '@opentelemetry/resources';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { setDefaultOptions } from './honeycomb-options';

test('should say hello to the world', () => {
  expect(sayHello()).toBe('Hello world!');
});

test('it should return a NodeSDK', () => {
  const honeycomb = addHoneycomb();
  expect(honeycomb instanceof NodeSDK);
});

test('it should return a Resource', () => {
  const resource = addResource();
  expect(resource instanceof Resource);
});

test('it should set default honeycomb endpoint', () => {
  const options = setDefaultOptions();
  expect(options.endpoint).toEqual('https://api.honeycomb.io');
});
