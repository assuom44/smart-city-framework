# Smart City Architecture

## Data path

1.  Node-RED simulates environmental, water, and traffic sensors.
2.  Node-RED publishes JSON batches to Kafka raw topics.
3.  Apache Kafka 4.3.1 runs as a single-node KRaft broker and controller and provides the event backbone.
4.  The `kafka-init` service creates the required topics at startup and then exits.
5.  Spark consumes raw topics using Structured Streaming.
6.  Spark validates and enriches records, writes Bronze/Silver Parquet data, and publishes analytics and alerts.
7.  The Node.js backend consumes raw and Spark topics.
8.  MongoDB stores raw readings, Spark aggregations, and alerts.
9.  Socket.IO broadcasts live data to the Next.js dashboard.

## Docker services

The Docker Compose deployment contains seven services: Kafka, `kafka-init`, MongoDB, Node-RED, Spark, the Node.js backend, and the Next.js frontend. Kafka provides both broker and controller roles in the single-node deployment. The `kafka-init` service is an ephemeral startup utility used to create the required Kafka topics.

## Design decisions

- Kafka 4.3.1 runs in single-node KRaft mode with broker and controller roles.
- Kafka topic creation is centralized and idempotent.
- Application images use pinned versions; `latest` tags are avoided.
- Node-RED Kafka dependencies are project-scoped and persistent.
- Spark 4 uses Scala 2.13 artifacts.
- Runtime configuration is supplied through environment variables.
- Persistent Kafka and MongoDB data are isolated in named volumes.
