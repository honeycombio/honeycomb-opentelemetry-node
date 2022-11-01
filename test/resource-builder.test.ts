import { honeycombResource } from '../src/resource-builder';
import { Resource } from '@opentelemetry/resources';
import { VERSION } from '../src/version';

test('it should return a Resource', () => {
  const resource = honeycombResource();
  expect(resource instanceof Resource);
  expect(resource.attributes['honeycomb.distro.version']).toEqual(VERSION);
  expect(resource.attributes['honeycomb.distro.runtime_version']).toEqual(
    process.versions.node,
  );
});
