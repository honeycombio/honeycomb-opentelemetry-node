import { addResource } from '../src/resource-builder';
import { Resource } from '@opentelemetry/resources';

test('it should return a Resource', () => {
  const resource = addResource();
  expect(resource instanceof Resource);
});
