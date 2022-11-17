"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaggageSpanProcessor = exports.BatchWithBaggageSpanProcessor = exports.configureBatchWithBaggageSpanProcessor = void 0;
const api_1 = require("@opentelemetry/api");
const sdk_trace_base_1 = require("@opentelemetry/sdk-trace-base");
const local_exporter_1 = require("./local-exporter");
const composite_exporter_1 = require("./composite-exporter");
const exporter_utils_1 = require("./exporter-utils");
/**
 * Builds and returns a span processor with an exporter configured
 * for sending telemetry to Honeycomb. The processor will duplicate
 * baggage entries on span start and queue spans for batch send.
 *
 * ⚠ Caution ⚠️
 *
 * Do not put sensitive information in Baggage. See {@link BaggageSpanProcessor}
 * for more details.
 *
 * @param opts {@link HoneycombOptions} used to configure export to Honeycomb
 * @returns a configured {@link BatchWithBaggageSpanProcessor} for baggage attribute duping,
 *   span batching, and export to Honeycomb
 */
function configureBatchWithBaggageSpanProcessor(opts) {
    const hnyExporter = (0, exporter_utils_1.getHoneycombSpanExporter)(opts);
    // if local visualisations enabled, create composite exporter configured
    // to send to both local exporter and main exporter
    if (opts === null || opts === void 0 ? void 0 : opts.localVisualizations) {
        return new BatchWithBaggageSpanProcessor((0, composite_exporter_1.configureCompositeExporter)([
            hnyExporter,
            (0, local_exporter_1.configureConsoleTraceLinkExporter)(opts),
        ]));
    }
    return new BatchWithBaggageSpanProcessor(hnyExporter);
}
exports.configureBatchWithBaggageSpanProcessor = configureBatchWithBaggageSpanProcessor;
/**
 * A span processor that behaves like a {@link BatchSpanProcessor} with the
 * addition of {@link BaggageSpanProcessor} behavior during onStart.
 */
class BatchWithBaggageSpanProcessor extends sdk_trace_base_1.BatchSpanProcessor {
    constructor(exporter) {
        super(exporter);
        this.bsp = new BaggageSpanProcessor();
    }
    /**
     * Delegates to {@link BaggageSpanProcessor.onStart()}
     *
     * @param span a {@link Span} being started
     * @param parentContext the {@link Context} in which `span` was started
     */
    onStart(span, parentContext) {
        this.bsp.onStart(span, parentContext);
    }
}
exports.BatchWithBaggageSpanProcessor = BatchWithBaggageSpanProcessor;
/**
 * The BaggageSpanProcessor reads entries stored in {@link Baggage}
 * from the parent context and adds the baggage entries' keys and
 * values to the span as attributes on span start.
 *
 * Add this span processor to a tracer provider.
 *
 * Keys and values added to Baggage will appear on subsequent child
 * spans for a trace within this service *and* be propagated to external
 * services in accordance with any configured propagation formats
 * configured. If the external services also have a Baggage span
 * processor, the keys and values will appear in those child spans as
 * well.
 *
 * ⚠ Warning ⚠️
 *
 * Do not put sensitive information in Baggage.
 *
 * To repeat: a consequence of adding data to Baggage is that the keys and
 * values will appear in all outgoing HTTP headers from the application.
 */
class BaggageSpanProcessor extends sdk_trace_base_1.NoopSpanProcessor {
    /**
     * Adds an attribute to the `span` for each {@link Baggage} key and {@link BaggageEntry | entry value}
     * present in the `parentContext`.
     *
     * @param span a {@link Span} being started
     * @param parentContext the {@link Context} in which `span` was started
     */
    onStart(span, parentContext) {
        var _a, _b;
        ((_b = (_a = api_1.propagation.getBaggage(parentContext)) === null || _a === void 0 ? void 0 : _a.getAllEntries()) !== null && _b !== void 0 ? _b : []).forEach((entry) => {
            span.setAttribute(entry[0], entry[1].value);
        });
    }
}
exports.BaggageSpanProcessor = BaggageSpanProcessor;
