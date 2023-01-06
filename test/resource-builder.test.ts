import { configureHoneycombResource } from '../src/resource-builder';
import { Resource } from '@opentelemetry/resources';
import { VERSION } from '../src/version';

test('it should return a Resource', () => {
  const resource = configureHoneycombResource();
  expect(resource).toBeInstanceOf(Resource);
  expect(resource.attributes['honeycomb.distro.version']).toEqual(VERSION);
  expect(resource.attributes['honeycomb.distro.runtime_version']).toEqual(
    process.versions.node,
  );
});

test('it should merge resource attributes provided from another resource', () => {
  const resource = configureHoneycombResource({
    resource: new Resource({
      myTestAttr: 'my-test-attr',
    }),
  });
  expect(resource).toBeInstanceOf(Resource);
  expect(resource.attributes['honeycomb.distro.version']).toEqual(VERSION);
  expect(resource.attributes['honeycomb.distro.runtime_version']).toEqual(
    process.versions.node,
  );
  expect(resource.attributes.myTestAttr).toEqual('my-test-attr');
});
