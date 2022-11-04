import { ExportResult } from '@opentelemetry/core';
import { ReadableSpan, SpanExporter } from '@opentelemetry/sdk-trace-base';

export class LocalExporter implements SpanExporter {
  export(
    spans: ReadableSpan[],
    resultCallback: (result: ExportResult) => void,
  ): void {
    spans.forEach((span) => {
      if (!span.parentSpanId) {
        console.debug(`Completed trace: ${span.spanContext().spanId}`);
      }
    });
  }
  shutdown(): Promise<void> {
    return Promise.resolve();
  }
}
