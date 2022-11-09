#!/usr/bin/env bats

load test_helpers/utilities

CONTAINER_NAME="app-sdk-http"
TRACER_NAME="hello-world-tracer"

setup_file() {
	echo "# 🚧" >&3
	docker-compose up --detach collector ${CONTAINER_NAME}
	wait_for_ready_app ${CONTAINER_NAME}
	curl --silent "http://localhost:3000"
	wait_for_traces
}

teardown_file() {
	cp collector/data.json collector/data-results/data-${CONTAINER_NAME}.json
	docker-compose stop ${CONTAINER_NAME}
	docker-compose restart collector
	wait_for_flush
}

# TESTS

@test "Manual instrumentation produces span with name of span" {
	result=$(span_names_for ${TRACER_NAME})
	assert_equal "$result" '"sleep"'
}

@test "Manual instrumentation adds custom attribute" {
	result=$(span_attributes_for ${TRACER_NAME} | jq "select(.key == \"delay_ms\").value.intValue")
	assert_equal "$result" '"100"'
}
