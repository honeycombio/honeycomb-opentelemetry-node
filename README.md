# Honeycomb OpenTelemetry Distro for Node.js

[![OSS Lifecycle](https://img.shields.io/osslifecycle/honeycombio/honeycomb-opentelemetry-node)](https://github.com/honeycombio/home/blob/main/honeycomb-oss-lifecycle-and-practices.md)
[![CircleCI](https://circleci.com/gh/honeycombio/honeycomb-opentelemetry-node.svg?style=shield)](https://circleci.com/gh/honeycombio/honeycomb-opentelemetry-node)
[![npm](https://img.shields.io/npm/v/@honeycombio/opentelemetry-node)](https://www.npmjs.com/package/@honeycombio/opentelemetry-node)

**STATUS: this library is BETA.**
You're welcome to try it, and let us know your feedback in the issues!

This is Honeycomb's Distribution of OpenTelemetry for Node.js.
It makes getting started with OpenTelemetry and Honeycomb easier!

Latest release:

- built with OpenTelemetry JS [Stable v1.17.1](https://github.com/open-telemetry/opentelemetry-js/releases/tag/v1.17.1), [Experimental v0.44.0](https://github.com/open-telemetry/opentelemetry-js/releases/tag/experimental%2Fv0.44.0), [API v1.6.0](https://github.com/open-telemetry/opentelemetry-js/releases/tag/api%2Fv1.6.0)
- compatible with OpenTelemetry Auto-Instrumentations for Node [^0.39.3](https://github.com/open-telemetry/opentelemetry-js-contrib/releases/tag/auto-instrumentations-node-v0.39.3)

## Requirements

- Node 14 or higher

## Getting Started

Honeycomb's Distribution of OpenTelemetry for Node.js allows you to streamline configuration and to instrument as quickly and easily as possible.

- [Documentation](https://docs.honeycomb.io/getting-data-in/opentelemetry/node-distro/)
- [Examples](/examples/)

## Why would I want to use this?

- Streamlined configuration for sending data to Honeycomb!
- Easy interop with existing instrumentation with OpenTelemetry!
- Deterministic sampling!
- Multi-span attributes!
- Local visualizations!

## License

[Apache 2.0 License](./LICENSE).
