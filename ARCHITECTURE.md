# Smart City Architecture

## Data path

1. Node-RED simulates environmental, water, and traffic sensors.
2. Node-RED publishes JSON batches to Kafka raw topics.
3. Spark consumes raw topics using Structured Streaming.
4. Spark validates and enriches records, writes bronze/silver Parquet data, and publishes analytics and alerts.
5. The Node.js backend consumes both raw and Spark topics.
6. MongoDB stores Spark aggregations and alerts.
7. Socket.IO broadcasts live data to the Next.js dashboard.

## Design decisions

- Kafka uses KRaft rather than ZooKeeper.
- Kafka topic creation is centralized and idempotent.
- Application images use pinned versions; `latest` tags are avoided.
- Node-RED Kafka dependencies are project-scoped and persistent.
- Spark 4 uses Scala 2.13 artifacts.
- Runtime configuration is supplied through environment variables.
- Persistent Kafka and MongoDB data are isolated in named volumes.

## Migration boundary

The existing application behavior and topic names are preserved in this release. The main modernization changes are infrastructure versions, Kafka mode, Node-RED Kafka integration, runtime configuration, English standardization, and startup/shutdown robustness.
