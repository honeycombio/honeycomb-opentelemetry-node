build:
	npm run build

test: build
	npm run test

clean-smoke-tests:
	rm -rf ./smoke-tests/collector/data.json
	rm -rf ./smoke-tests/collector/data-results/*.json
	rm -rf ./smoke-tests/report.*

clean: clean-smoke-tests
	rm -rf ./examples/dist
	rm -rf ./examples/node_modules
	rm -rf ./examples/hello-node/dist
	rm -rf ./examples/hello-node/node_modules
	npm run clean

example:
	npm run example-node

smoke-tests/collector/data.json:
	@echo ""
	@echo "+++ Zhuzhing smoke test's Collector data.json"
	@touch $@ && chmod o+w $@

smoke-sdk-grpc: smoke-tests/collector/data.json
	@echo ""
	@echo "+++ PLACEHOLDER: Running gRPC smoke tests."
	@echo ""

smoke-sdk-http: smoke-tests/collector/data.json
	@echo ""
	@echo "+++ PLACEHOLDER: Running HTTP smoke tests."
	@echo ""
	cd smoke-tests && bats ./smoke-sdk-http.bats --report-formatter junit --output ./

smoke-sdk: smoke-sdk-grpc smoke-sdk-http

smoke-later: smoke-sdk

smoke:
	cd smoke-tests && docker-compose up --build

unsmoke:
	@echo ""
	@echo "+++ Spinning down the smokers."
	@echo ""
	cd smoke-tests && docker-compose down --volumes

## use this for local testing
resmoke: unsmoke smoke

.PHONY: build test clean-smoke-tests clean example smoke unsmoke resmoke smoke-sdk-grpc smoke-sdk-http smoke-sdk
