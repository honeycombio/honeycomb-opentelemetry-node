# honeycomb-opentelemetry-node changelog

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
