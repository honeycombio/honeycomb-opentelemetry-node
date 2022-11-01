import {
  Attributes,
  BaggageEntry,
  Context,
  propagation,
} from '@opentelemetry/api';
import { NoopSpanProcessor, Span } from '@opentelemetry/sdk-trace-base';

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
