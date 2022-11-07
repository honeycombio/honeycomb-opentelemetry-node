import { ExportResult, ExportResultCode } from '@opentelemetry/core';
import { ReadableSpan, SpanExporter } from '@opentelemetry/sdk-trace-base';
import { HoneycombOptions, isClassic } from './honeycomb-options';
import axios from 'axios';

/**
 * Builds and returns a {@link SpanExporter} that logs Honeycomb URLs for completed traces
 *
 * @remark This is not for production use.
 * @param options The {@link HoneycombOptions} used to configure the exporter
 * @returns the configured {@link LocalExporter} instance
 */
export function configureLocalExporter(
  options: HoneycombOptions,
): SpanExporter {
  return new LocalExporter(options.serviceName, options.tracesApiKey);
}

/**
 * A custom {@link SpanExporter} that logs Honeycomb URLs for completed traces.
 *
 * @remark This is not for production use.
 */
class LocalExporter implements SpanExporter {
  private _traceUrl = '';

  constructor(serviceName?: string, apikey?: string) {
    if (!serviceName || !apikey) {
      console.log(
        'WARN: disabling local visualisations - must have both service name and API key configured.',
      );
      return;
    }

    const options = {
      headers: {
        'x-honeycomb-team': apikey,
      },
    };
    axios.get('https://api.honeycomb.io/1/auth', options).then(
      (resp) => {
        if (resp.status === 200) {
          const respData: AuthResponse = resp.data;
          if (respData.team?.slug) {
            this._traceUrl = buildTraceUrl(
              apikey,
              serviceName,
              respData.team?.slug,
              respData.environment?.slug,
            );
          } else {
            console.log(
              'WARN: failed to extract team from Honeycom auth response',
            );
          }
        }
      },
      () => {
        console.log('WARN: failed to get auth data from Honeycomb API');
      },
    );
  }

  export(
    spans: ReadableSpan[],
    resultCallback: (result: ExportResult) => void,
  ): void {
    if (this._traceUrl) {
      spans.forEach((span) => {
        // only log root spans (ones without a parent span)
        if (!span.parentSpanId) {
          console.log(
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

/**
 * Builds and returns a URL that is used to log when a trace is completed in the {@link LocalExporter}.
 *
 * @param apikey the Honeycom API key used to retrieve the Honeycomb team and environment
 * @param serviceName the Honeycomb service name (or classic dataset) where data is stored
 * @param team the Honeycomb team
 * @param environment the Honeycomb environment
 * @returns
 */
export function buildTraceUrl(
  apikey: string,
  serviceName: string,
  team: string,
  environment?: string,
): string {
  let url = `https://ui.honeycomb.io/${team}`;
  if (!isClassic(apikey) && environment) {
    url += `/environments/${environment}`;
  }
  url += `/datasets/${serviceName}/trace?trace_id`;
  return url;
}

interface AuthResponse {
  environment?: EnvironmentResponse;
  team?: TeamResponse;
}

interface EnvironmentResponse {
  slug?: string;
}

interface TeamResponse {
  slug?: string;
}
