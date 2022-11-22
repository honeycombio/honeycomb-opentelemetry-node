#!/usr/bin/env bats

load test_helpers/utilities

CONTAINER_NAME="app-sdk-http-ts"
TRACER_NAME="hello-world-tracer"

setup_file() {
	echo "# 🚧" >&3
	docker-compose up --build --detach collector ${CONTAINER_NAME}
	# wait_for_ready_app ${CONTAINER_NAME}
	# curl --silent "http://localhost:3000"
	# wait_for_traces
}

teardown_file() {
	# cp collector/data.json collector/data-results/data-${CONTAINER_NAME}.json
	docker-compose stop ${CONTAINER_NAME}
	docker-compose restart collector
	wait_for_flush
}

# TESTS

@test "just a placeholder test for now" {
  result="placeholder"
  assert_equal "$result" "placeholder"
}
