"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureHoneycombResource = void 0;
const resources_1 = require("@opentelemetry/resources");
const version_1 = require("./version");
/**
 * Builds and returns an Opentelemetry Resource with
 * added resource attributes specific to the Honeycomb Distro
 * @returns a Resource instance
 */
function configureHoneycombResource() {
    return new resources_1.Resource({
        'honeycomb.distro.version': version_1.VERSION,
        'honeycomb.distro.runtime_version': process.versions.node,
    });
}
exports.configureHoneycombResource = configureHoneycombResource;
