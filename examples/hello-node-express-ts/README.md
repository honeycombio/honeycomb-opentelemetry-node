# Hello World Express Example using TypeScript

## Overview

This example illustrates a simple hello world using a local dependency and express.

## Usage

### Install and setup

```bash
npm run setup
```

### Running the main application

```bash
HONEYCOMB_API_KEY={apikey} OTEL_SERVICE_NAME="hello-node-express" npm start
```

Alternatively, to export telemetry using `gRPC` instead of `http/protobuf`:

```bash
HONEYCOMB_API_KEY={apikey} OTEL_SERVICE_NAME="hello-node-express" OTEL_EXPORTER_OTLP_PROTOCOL=grpc npm start
```

To just get the JavaScript files, run `npm install` then `npm run build` and see the JS files in the `dist` directory.

To run the built JavaScript files, run `npm run start-js`.
