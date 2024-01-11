# honeycomb-opentelemetry-node changelog

## v0.6.1-beta - 2024-01-11

### Fixes

- fix: avoid dependency conflicts by using tilde for otel packages (#268) | @JamieDanielson
- fix: composite exporter is for production use (#256) | @cartermp

### Maintenance

- maint(deps): bump @grpc/grpc-js from 1.9.5 to 1.9.13 (#262) | dependabot[bot]
- maint(deps): bump axios from 1.4.0 to 1.6.5 (#269) | dependabot[bot]
- maint(deps): update otel and example dependencies (#274) | @JamieDanielson
- maint(deps-dev): bump the dev-dependencies group with 4 updates (#272) | dependabot[bot]
- maint(deps-dev): bump the dev-dependencies group with 9 updates (#260) | dependabot[bot]
- maint: more batching of dependabot groups (#257) | @JamieDanielson
- maint: update codeowners to pipeline-team (#255) | @JamieDanielson
- maint: add deps and docs to maintenance in release (#254) | @JamieDanielson

## v0.6.0-beta - 2023-10-17

### Maintenance

- maint: Bump OTel libraries (#241) | Mike Goldsmith
- maint(deps-dev): bump eslint from 8.44.0 to 8.50.0 (#235) | dependabot[bot]
- maint(deps): bump @grpc/grpc-js from 1.8.17 to 1.9.5 (#238) | dependabot[bot]
- maint(deps-dev): bump typescript from 4.9.4 to 5.2.2 (#231) | dependabot[bot]
- maint: add dependabot groups and example deps (#237) | Jamie Danielson
- maint(deps-dev): bump prettier from 3.0.0 to 3.0.3 (#233) | dependabot[bot]
- maint(deps): bump @opentelemetry/exporter-metrics-otlp-grpc from 0.41.0 to 0.41.1 (#227) | dependabot[bot]
- maint(deps): bump @opentelemetry/core from 1.15.0 to 1.15.1 (#225) | dependabot[bot]
- maint(deps-dev): bump @typescript-eslint/eslint-plugin from 6.1.0 to 6.2.1 (#228) | dependabot[bot]
- maint(deps-dev): bump eslint-config-prettier from 8.8.0 to 8.9.0 (#224) | dependabot[bot]
- maint(deps): bump @opentelemetry/exporter-trace-otlp-grpc from 0.41.0 to 0.41.1 (#226) | dependabot[bot]
- maint(deps-dev): bump @typescript-eslint/eslint-plugin from 5.57.1 to 6.1.0 (#223) | dependabot[bot]

## v0.5.0-beta - 2023-07-17

### Enhancements

- feat: Add option to skip options validation (#202) | [@MikeGoldsmith](https://github.com/MikeGoldsmith)
- fix: allow overriding node sdk properties (#204) | [@JGAntunes](https://github.com/JGAntunes)

### Fixed

- fix: add @opentelemetry/core as a dependency (#207) | [@pkanal](https://github.com/pkanal)

### Maintenance

- maint: add custom sampler warning (#213) | [@pkanal](https://github.com/pkanal)
- maint(deps-dev): bump @typescript-eslint/parser from 5.46.1 to 5.62.0 (#220) | [dependabot[bot]](https://github.com/dependabot)
- maint(deps-dev): bump prettier from 2.8.8 to 3.0.0 (#216) | [dependabot[bot]](https://github.com/dependabot)
- maint(deps): bump @opentelemetry/core from 1.13.0 to 1.15.0 (#217) | [dependabot[bot]](https://github.com/dependabot)
- maint(deps): bump @opentelemetry/exporter-metrics-otlp-grpc from 0.39.1 to 0.41.0 (#214) | [dependabot[bot]](https://github.com/dependabot)
- maint(deps-dev): bump jest and @types/jest (#208) | [dependabot[bot]](https://github.com/dependabot)
- maint(deps-dev): bump ts-jest from 29.1.0 to 29.1.1 (#209) | [dependabot[bot]](https://github.com/dependabot)
- maint(deps): bump @opentelemetry/exporter-trace-otlp-proto from 0.39.1 to 0.41.0 (#211) | [dependabot[bot]](https://github.com/dependabot)
- maint(deps): bump @opentelemetry/exporter-trace-otlp-grpc from 0.39.1 to 0.41.0 (#210) | [dependabot[bot]](https://github.com/dependabot)
- maint(deps-dev): bump prettier from 2.8.4 to 2.8.8 (#194) | [dependabot[bot]](https://github.com/dependabot)
- maint(deps-dev): bump jest from 29.3.1 to 29.5.0 (#196) | [dependabot[bot]](https://github.com/dependabot)
- maint(deps-dev): bump eslint-config-prettier from 8.7.0 to 8.8.0 (#197) | [dependabot[bot]](https://github.com/dependabot)
- maint(deps-dev): bump eslint from 8.31.0 to 8.44.0 (#199) | [dependabot[bot]](https://github.com/dependabot)
- maint(deps): bump @grpc/grpc-js from 1.8.0 to 1.8.17 (#200) | [dependabot[bot]](https://github.com/dependabot)
- maint: ignore smoke test output (#193) | @(vreynolds@users.noreply.github.com)
- maint(deps): bump axios from 1.2.2 to 1.4.0 (#191) | [dependabot[bot]](https://github.com/dependabot)
- maint(deps): bump @opentelemetry from 1.11.0/0.37.0 to 1.13.0/0.39.1 (#192) | [dependabot[bot]](https://github.com/dependabot)
- maint(deps-dev): bump ts-jest from 29.0.5 to 29.1.0 (#189) | [dependabot[bot]](https://github.com/dependabot)
- maint(deps-dev): bump eslint-plugin-import from 2.26.0 to 2.27.5 (#190) | [dependabot[bot]](https://github.com/dependabot)
- maint(deps-dev): bump jest-junit from 15.0.0 to 16.0.0 (#187) | [dependabot[bot]](https://github.com/dependabot)
- maint(deps-dev): bump @typescript-eslint/eslint-plugin from 5.56.0 to 5.57.1 (#185) | [dependabot[bot]](https://github.com/dependabot)
- maint(deps): bump @opentelemetry from 1.10.1/0.36.1 to 1.11.0/0.37.0 (#181) | [dependabot[bot]](https://github.com/dependabot)

## v0.4.0-beta - 2023-03-23

### Breaking Changes

- fix: update dependencies to latest upstream releases (#172) | [Phillip Carter](https://github.com/cartermp)
  - This change is breaking because starting the SDK is now synchronous. See this [upstream PR](https://github.com/open-telemetry/opentelemetry-js/pull/3460) for more details.


### Maintenance

- maint(deps-dev): bump ts-jest from 29.0.3 to 29.0.5 (#158) | [dependabot[bot]](https://github.com/dependabot)
- maint(deps-dev): bump @typescript-eslint/eslint-plugin from 5.48.0 to 5.56.0 (#173) | [dependabot[bot]](https://github.com/dependabot)
- maint: bump prettier from 2.8.1 to 2.8.4 (#170) | [Jamie Danielson](https://github.com/JamieDanielson)
- maint: add observable gauge example (#167) | [Jamie Danielson](https://github.com/JamieDanielson)
- chore(deps): bump @sideway/formula from 3.0.0 to 3.0.1 in /examples/hello-node-express (#164) | [dependabot[bot]](https://github.com/dependabot)
- chore(deps): bump @sideway/formula from 3.0.0 to 3.0.1 in /examples/hello-node-express-ts (#163) | [dependabot[bot]](https://github.com/dependabot)

## v0.3.2-beta - 2023-01-19

### Enhancements

- Add gRPC metrics export support (#150) | [@cartermp](https://github.com/cartermp)

## v0.3.1-beta - 2023-01-09

### Fixed

- fix: Allow user specified resource attributes (#152) |[@pkanal](https://github.com/pkanal)

### Maintenance

- maint(deps-dev): bump @typescript-eslint/eslint-plugin from 5.43.0 to 5.48.0 (#153) | [@dependabot](https://github.com/dependabot)
- maint(deps-dev): bump @types/jest from 29.2.4 to 29.2.5 (#147) | [@dependabot](https://github.com/dependabot)
- maint(deps): bump axios from 1.2.1 to 1.2.2 (#148) | [@dependabot](https://github.com/dependabot)
- maint(deps-dev): bump jest-junit from 14.0.1 to 15.0.0 (#146) | [@dependabot](https://github.com/dependabot)
- maint(deps): bump json5 from 1.0.1 to 1.0.2 (#154) | [@dependabot](https://github.com/dependabot)
- maint(deps-dev): bump eslint from 8.29.0 to 8.31.0 (#145) | [@dependabot](https://github.com/dependabot)

## v0.3.0-beta - 2022-12-19

### Enhancements

- feat: make metrics export configurable (#141) | [@JamieDanielson](https://github.com/JamieDanielson)
- refactor: update MetricExporter to be singular to match TraceExporter (#133) | [@JamieDanielson](https://github.com/JamieDanielson)
- chore: add metrics tests to smoke tests (#132) | [@JamieDanielson](https://github.com/JamieDanielson)
- feat: Add metrics supprt for http/proto (#127) | [@pkanal](https://github.com/pkanal)

### Maintenance

- maint(deps): bump @grpc/grpc-js from 1.7.3 to 1.8.0 (#136) | [@dependabot](https://github.com/dependabot)
- maint(deps-dev): bump typescript from 4.8.4 to 4.9.4 (#134) | [@dependabot](https://github.com/dependabot)
- maint(deps-dev): bump eslint from 8.26.0 to 8.29.0 (#137) | [@dependabot](https://github.com/dependabot)
- maint(deps-dev): bump @typescript-eslint/parser from 5.42.0 to 5.46.1 (#139) | [@dependabot](https://github.com/dependabot)
- maint(deps-dev): bump prettier from 2.7.1 to 2.8.1 (#140) | [@dependabot](https://github.com/dependabot)
- maint(deps-dev): bump jest from 29.2.2 to 29.3.1 (#122) | [@dependabot](https://github.com/dependabot)
- maint(deps): bump axios from 1.1.3 to 1.2.1 (#125) | [@dependabot](https://github.com/dependabot)
- maint: update readme for public beta (#117) | [@JamieDanielson](https://github.com/JamieDanielson)
- maint: update release checklist (#116) | [@cartermp](https://github.com/cartermp)

## v0.2.0-beta - 2022-11-23

### Enhancements

- feat: Export `HoneycombOptions` type (#114) | [@pkanal](https://github.com/pkanal)
- feat: add typescript example and smoky boi (#112) | [@cartermp](https://github.com/cartermp)
- feat: support enum-style protocol specification (#111) | [@cartermp](https://github.com/cartermp)

## v0.1.2-beta - 2022-11-18

### Maintenance

- maint: update opentelemetry dependencies (#109) | [@JamieDanielson](https://github.com/JamieDanielson)

## v0.1.1-beta - 2022-11-18

### Fixed

- fix: provide access to /dist built files for the package in NPM (#107) | [@emilyashley](https://github.com/emilyashley)
- ci: update publish setup command (#104) | [@pkanal](https://github.com/pkanal)

## v0.1.0-beta - 2022-11-16

### Added

- Initial beta release of Honeycomb's OpenTelemetry distribution for Node!
