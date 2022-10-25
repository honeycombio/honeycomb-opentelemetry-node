import { addResource } from '../src/resource-builder';
import { Resource } from '@opentelemetry/resources';
import { HoneycombOptions } from '../src/honeycomb-options';

test('it should return a Resource', () => {
  const resource = addResource();
  expect(resource instanceof Resource);
  expect(resource.attributes["honeycomb.distro.version"]).toEqual("0.1.0");
  expect(resource.attributes["honeycomb.distro.runtime_version"]).toEqual("16.16.0");
  expect(resource.attributes["service.name"]).toEqual("unknown_service:nodejs");
});

test('it should use options service name when set', () => {
  const options: HoneycombOptions = {
    serviceName: "my-service"
  };
  const resource = addResource(options);
  expect(resource instanceof Resource);
  expect(resource.attributes["honeycomb.distro.version"]).toEqual("0.1.0");
  expect(resource.attributes["honeycomb.distro.runtime_version"]).toEqual("16.16.0");
  expect(resource.attributes["service.name"]).toEqual("my-service");
});

describe('when OTEL_SERVICE_NAME env var is set', () => {
  const env = process.env;

  beforeEach(() => {
      jest.resetModules()
      process.env = { ...env }
  })

  afterEach(() => {
      process.env = env
  })

  test('it should prefer service name in env var over options', () => {
    process.env.OTEL_SERVICE_NAME = "my-awesome-service";
    const options: HoneycombOptions = {
      serviceName: "my-service"
    };
    const resource = addResource(options);
    expect(resource instanceof Resource);
    expect(resource.attributes["honeycomb.distro.version"]).toEqual("0.1.0");
    expect(resource.attributes["honeycomb.distro.runtime_version"]).toEqual("16.16.0");
    expect(resource.attributes["service.name"]).toEqual("my-awesome-service");
  });
});
