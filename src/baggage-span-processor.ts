import { Context, propagation } from '@opentelemetry/api';
import {
  BatchSpanProcessor,
  NoopSpanProcessor,
  Span,
  SpanExporter,
} from '@opentelemetry/sdk-trace-base';
import { HoneycombOptions } from './honeycomb-options';
import { configureHoneycombHttpProtoTraceExporter } from './http-proto-trace-exporter';
import { LocalExporter } from './local-exporter';
import { CompositeSpanExporter } from './compositie-exporter';

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
export function configureBatchWithBaggageSpanProcessor(
  opts?: HoneycombOptions,
): BatchWithBaggageSpanProcessor {
  const exporter = configureHoneycombHttpProtoTraceExporter(opts);

  // if local visualisations enabled, create composite exporter configured
  // to send to both local exporter and main exporter
  // TODO: use local visualiations option instead
  if (opts?.debug) {
    return new BatchWithBaggageSpanProcessor(
      new CompositeSpanExporter([exporter, new LocalExporter()]),
    );
  }
  return new BatchWithBaggageSpanProcessor(exporter);
}

/**
 * A span processor that behaves like a {@link BatchSpanProcessor} with the
 * addition of {@link BaggageSpanProcessor} behavior during onStart.
 */
export class BatchWithBaggageSpanProcessor extends BatchSpanProcessor {
  private bsp: BaggageSpanProcessor;

  constructor(exporter: SpanExporter) {
    super(exporter);
    this.bsp = new BaggageSpanProcessor();
  }

  /**
   * Delegates to {@link BaggageSpanProcessor.onStart()}
   *
   * @param span a {@link Span} being started
   * @param parentContext the {@link Context} in which `span` was started
   */
  onStart(span: Span, parentContext: Context): void {
    this.bsp.onStart(span, parentContext);
  }
}

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
export class BaggageSpanProcessor extends NoopSpanProcessor {
  /**
   * Adds an attribute to the `span` for each {@link Baggage} key and {@link BaggageEntry | entry value}
   * present in the `parentContext`.
   *
   * @param span a {@link Span} being started
   * @param parentContext the {@link Context} in which `span` was started
   */
  onStart(span: Span, parentContext: Context): void {
    (propagation.getBaggage(parentContext)?.getAllEntries() ?? []).forEach(
      (entry) => {
        span.setAttribute(entry[0], entry[1].value);
      },
    );
  }
}
