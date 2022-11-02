import {
  Context,
  propagation,
  BaggageEntry,
  Attributes,
} from '@opentelemetry/api';
import {
  BatchSpanProcessor,
  NoopSpanProcessor,
  Span,
  SpanExporter,
} from '@opentelemetry/sdk-trace-base';

export class BatchWithBaggageProcessor extends BatchSpanProcessor {
  private bsp: BaggageSpanProcessor;

  constructor(exporter: SpanExporter) {
    super(exporter);
    this.bsp = new BaggageSpanProcessor();
  }
  onStart(span: Span, parentContext: Context): void {
    this.bsp.onStart(span, parentContext);
  }
}

export class BaggageSpanProcessor extends NoopSpanProcessor {
  onStart(span: Span, parentContext: Context): void {
    const entries =
      propagation.getBaggage(parentContext)?.getAllEntries() ?? [];

    span.setAttributes(this.transformBaggageEntries(entries));
  }

  transformBaggageEntries(entries: [string, BaggageEntry][]): Attributes {
    return entries.reduce(
      function (attrs, entry) {
        return { ...attrs, [entry[0]]: entry[1].value };
      },
      {}, // initial value for attrs before accumulating
    );
  }
}
