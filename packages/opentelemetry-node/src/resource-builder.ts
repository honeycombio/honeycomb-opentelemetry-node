import { Resource, ResourceAttributes } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { getEnv } from '@opentelemetry/core';
import { HoneycombOptions } from './honeycomb-options';

// TODO: generate as part of the build process from package.json
const version = '0.1.0';

export function addResource(options?: HoneycombOptions): Resource {
  // get OTel environemt which includes common properties like service name
  const env = getEnv();

  // determine service name in (precedence order): env var -> option -> default
  // TODO: try to detect process name and use in place of default nodejs
  const serviceName: string =
    env?.OTEL_SERVICE_NAME || options?.serviceName || 'unknown_service:nodejs';

  const resourceAttrs: ResourceAttributes = {
    'honeycomb.distro.version': version,
    'honeycomb.distro.runtime_version': process.versions.node,
    [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
  };

  // combine default resource with honeycomb resource
  return new Resource(resourceAttrs);
}
