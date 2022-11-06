import { ExportResult, ExportResultCode } from '@opentelemetry/core';
import { ReadableSpan, SpanExporter } from '@opentelemetry/sdk-trace-base';
import { HoneycombOptions, isClassic } from './honeycomb-options';
import { TEAM_HEADER_KEY } from './http-proto-trace-exporter';
import axios from 'axios';

export function configureLocalExporter(
  options: HoneycombOptions,
): SpanExporter {
  return new LocalExporter(options.serviceName, options.tracesApiKey);
}

export class LocalExporter implements SpanExporter {
  private _traceUrl?: string;

  constructor(serviceName?: string, apikey?: string) {
    if (serviceName && apikey) {
      this.initalize(serviceName, apikey);
    } else {
      // TODO: log error
    }
  }

  initalize(serviceName?: string, apikey?: string) {
    let environment: string | undefined;
    let team: string | undefined;

    const options = {
      headers: {
        [TEAM_HEADER_KEY]: apikey,
      },
    };
    axios.get('https://api.honeycomb.io/1/auth', options).then((resp) => {
      if (resp.status == 200) {
        environment = resp.data.environment?.slug;
        team = resp.data.team?.slug;
      }
    });

    if (team) {
      this._traceUrl += `https://ui.honeycomb.io/${team}`;
      if (isClassic(apikey)) {
        this._traceUrl += `/environments/${environment}`;
      }
      this._traceUrl += `/datasets/${serviceName}/trace/trace_id`;
    }
  }

  export(
    spans: ReadableSpan[],
    resultCallback: (result: ExportResult) => void,
  ): void {
    if (this._traceUrl) {
      spans.forEach((span) => {
        // only log root spans (ones without a parent span)
        if (!span.parentSpanId) {
          console.debug(
            `Honeycomb link: ${this._traceUrl}=${span.spanContext().traceId}`,
          );
        }
      });
    }
    resultCallback({ code: ExportResultCode.SUCCESS });
  }

  shutdown(): Promise<void> {
    return Promise.resolve();
  }
}
