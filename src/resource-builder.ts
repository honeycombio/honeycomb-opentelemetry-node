import { Resource, ResourceAttributes } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { getEnv } from '@opentelemetry/core';
import { HoneycombOptions } from './honeycomb-options';
import { VERSION } from './version';

export function addResource(options?: HoneycombOptions): Resource {
  // get OTel environemt which includes common properties like service name
  const env = getEnv();

  const resourceAttrs: ResourceAttributes = {
    'honeycomb.distro.version': VERSION,
    'honeycomb.distro.runtime_version': process.versions.node,
  };

  // set service name attribute, prefer env var over options
  const serviceName: string | undefined =
    env?.OTEL_SERVICE_NAME || options?.serviceName;
  if (serviceName) {
    resourceAttrs[SemanticResourceAttributes.SERVICE_NAME] = serviceName;
  }

  // combine default resource with honeycomb resource
  return new Resource(resourceAttrs);
}