import { honeycombResource } from '../src/resource-builder';
import { Resource } from '@opentelemetry/resources';
import { HoneycombOptions } from '../src/honeycomb-options';
import { VERSION } from '../src/version';

test('it should return a Resource', () => {
  const resource = honeycombResource();
  expect(resource instanceof Resource);
  expect(resource.attributes['honeycomb.distro.version']).toEqual(VERSION);
  expect(resource.attributes['honeycomb.distro.runtime_version']).toEqual(
    process.versions.node,
  );
  expect(resource.attributes['service.name']).toEqual(undefined);
});

test('it should use options service name when set', () => {
  const options: HoneycombOptions = {
    apiKey: 'dummy-key',
    serviceName: 'my-service',
  };
  const resource = honeycombResource(options);
  expect(resource instanceof Resource);
  expect(resource.attributes['honeycomb.distro.version']).toEqual(VERSION);
  expect(resource.attributes['honeycomb.distro.runtime_version']).toEqual(
    process.versions.node,
  );
  expect(resource.attributes['service.name']).toEqual('my-service');
});

describe('when OTEL_SERVICE_NAME env var is set', () => {
  beforeEach(() => {
    process.env.OTEL_SERVICE_NAME = 'my-awesome-service';
  });

  afterEach(() => {
    delete process.env.OTEL_SERVICE_NAME;
  });

  test('it should prefer service name in env var over options', () => {
    const options: HoneycombOptions = {
      apiKey: 'dummy-key',
      serviceName: 'my-service',
    };
    const resource = honeycombResource(options);
    expect(resource instanceof Resource);
    expect(resource.attributes['honeycomb.distro.version']).toEqual(VERSION);
    expect(resource.attributes['honeycomb.distro.runtime_version']).toEqual(
      process.versions.node,
    );
    expect(resource.attributes['service.name']).toEqual('my-awesome-service');
  });
});
