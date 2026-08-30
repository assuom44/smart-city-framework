#!/bin/bash
set -euo pipefail

KAFKA_PACKAGE="org.apache.spark:spark-sql-kafka-0-10_2.13:4.2.0"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

export KAFKA_BOOTSTRAP_SERVERS="${KAFKA_BOOTSTRAP_SERVERS:-localhost:9092}"
echo "Starting PySpark Structured Streaming..."
echo "Kafka: $KAFKA_BOOTSTRAP_SERVERS"
spark-submit --packages "$KAFKA_PACKAGE" main.py
