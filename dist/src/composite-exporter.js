"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureCompositeExporter = void 0;
const core_1 = require("@opentelemetry/core");
/**
 * Builds and returns a new {@link SpanExporter} that wraps the provided array
 * of {@link SpanExporter}s
 *
 * @remark This is not for production use.
 * @param exporters the exporters to wrap with the composite exporter
 * @returns the configured {@link SpanExporter} instance
 */
function configureCompositeExporter(exporters) {
    return new CompositeSpanExporter(exporters);
}
exports.configureCompositeExporter = configureCompositeExporter;
/**
 * A custom SpanExporter that wraps a number of other exporters and calls export and shutdown
 * for each when.
 *
 * @remarks Not for production use.
 */
class CompositeSpanExporter {
    constructor(exporters) {
        this._exporters = exporters;
    }
    export(spans, resultCallback) {
        this._exporters.forEach((exporter) => exporter.export(spans, resultCallback));
        resultCallback({ code: core_1.ExportResultCode.SUCCESS });
    }
    shutdown() {
        return __awaiter(this, void 0, void 0, function* () {
            const results = [];
            this._exporters.forEach((exporter) => results.push(exporter.shutdown()));
            yield Promise.all(results);
        });
    }
}
