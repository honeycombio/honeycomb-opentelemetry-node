"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildTraceUrl = exports.configureConsoleTraceLinkExporter = void 0;
const core_1 = require("@opentelemetry/core");
const honeycomb_options_1 = require("./honeycomb-options");
const axios_1 = __importDefault(require("axios"));
/**
 * Builds and returns a {@link SpanExporter} that logs Honeycomb URLs for completed traces
 *
 * @remark This is not for production use.
 * @param options The {@link HoneycombOptions} used to configure the exporter
 * @returns the configured {@link ConsoleTraceLinkExporter} instance
 */
function configureConsoleTraceLinkExporter(options) {
    return new ConsoleTraceLinkExporter(options.serviceName, options.tracesApiKey);
}
exports.configureConsoleTraceLinkExporter = configureConsoleTraceLinkExporter;
/**
 * A custom {@link SpanExporter} that logs Honeycomb URLs for completed traces.
 *
 * @remark This is not for production use.
 */
class ConsoleTraceLinkExporter {
    constructor(serviceName, apikey) {
        this._traceUrl = '';
        if (!serviceName || !apikey) {
            console.log('WARN: disabling local visualisations - must have both service name and API key configured.');
            return;
        }
        const options = {
            headers: {
                'x-honeycomb-team': apikey,
            },
        };
        axios_1.default.get('https://api.honeycomb.io/1/auth', options).then((resp) => {
            var _a, _b, _c;
            if (resp.status === 200) {
                const respData = resp.data;
                if ((_a = respData.team) === null || _a === void 0 ? void 0 : _a.slug) {
                    this._traceUrl = buildTraceUrl(apikey, serviceName, (_b = respData.team) === null || _b === void 0 ? void 0 : _b.slug, (_c = respData.environment) === null || _c === void 0 ? void 0 : _c.slug);
                }
                else {
                    console.log('WARN: failed to extract team from Honeycom auth response');
                }
            }
        }, () => {
            console.log('WARN: failed to get auth data from Honeycomb API');
        });
    }
    export(spans, resultCallback) {
        if (this._traceUrl) {
            spans.forEach((span) => {
                // only log root spans (ones without a parent span)
                if (!span.parentSpanId) {
                    console.log(`Honeycomb link: ${this._traceUrl}=${span.spanContext().traceId}`);
                }
            });
        }
        resultCallback({ code: core_1.ExportResultCode.SUCCESS });
    }
    shutdown() {
        return Promise.resolve();
    }
}
/**
 * Builds and returns a URL that is used to log when a trace is completed in the {@link ConsoleTraceLinkExporter}.
 *
 * @param apikey the Honeycom API key used to retrieve the Honeycomb team and environment
 * @param serviceName the Honeycomb service name (or classic dataset) where data is stored
 * @param team the Honeycomb team
 * @param environment the Honeycomb environment
 * @returns
 */
function buildTraceUrl(apikey, serviceName, team, environment) {
    let url = `https://ui.honeycomb.io/${team}`;
    if (!(0, honeycomb_options_1.isClassic)(apikey) && environment) {
        url += `/environments/${environment}`;
    }
    url += `/datasets/${serviceName}/trace?trace_id`;
    return url;
}
exports.buildTraceUrl = buildTraceUrl;
