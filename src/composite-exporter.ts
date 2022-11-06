import { ExportResult, ExportResultCode } from '@opentelemetry/core';
import { ReadableSpan, SpanExporter } from '@opentelemetry/sdk-trace-base';

export function configureCompositeExporter(
  exporters: SpanExporter[],
): SpanExporter {
  return new CompositeSpanExporter(exporters);
}

class CompositeSpanExporter implements SpanExporter {
  private _exporters: SpanExporter[];

  constructor(exporters: SpanExporter[]) {
    this._exporters = exporters;
  }

  export(
    spans: ReadableSpan[],
    resultCallback: (result: ExportResult) => void,
  ): void {
    this._exporters.forEach((exporter) =>
      exporter.export(spans, resultCallback),
    );
    resultCallback({ code: ExportResultCode.SUCCESS });
  }
  shutdown(): Promise<void> {
    this._exporters.forEach(async (exporter) => await exporter.shutdown());
    return Promise.resolve();
  }
}
