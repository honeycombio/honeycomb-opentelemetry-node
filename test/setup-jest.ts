afterEach(() => {
  // Prevents local envs from affecting tests
  // HoneycombEnvironmentOptions
  delete process.env.HONEYCOMB_API_KEY;
  delete process.env.HONEYCOMB_TRACES_APIKEY;
  delete process.env.HONEYCOMB_METRICS_APIKEY;
  delete process.env.HONEYCOMB_API_ENDPOINT;
  delete process.env.HONEYCOMB_TRACES_ENDPOINT;
  delete process.env.HONEYCOMB_METRICS_ENDPOINT;
  delete process.env.HONEYCOMB_DATASET;
  delete process.env.HONEYCOMB_METRICS_DATASET;
  delete process.env.SAMPLE_RATE;
  delete process.env.DEBUG;
  delete process.env.HONEYCOMB_ENABLE_LOCAL_VISUALIZATIONS;

  delete process.env.OTEL_SERVICE_NAME;
  delete process.env.OTEL_EXPORTER_OTLP_PROTOCOL;
});
