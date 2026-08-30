# Migration Guide: Smart City 2.0

## Before upgrading

Back up any MongoDB data and Node-RED flows you need to keep. The supplied project already preserves the previous Node-RED flow as `node-red/flows.legacy-kafkajs.json`.

## Kafka migration

The previous deployment used Confluent Platform 7.5 with ZooKeeper. The new deployment uses Apache Kafka 4.3.1 in single-node KRaft mode.

For a development installation, reset the old Kafka/ZooKeeper volumes:

```bash
docker compose down -v
```

Then rebuild:

```bash
docker compose up -d --build
```

Do not copy the old ZooKeeper/Kafka log directory into the new KRaft volume.

## Node-RED migration

The old flow used `node-red-contrib-kafkajs` 0.0.7 and node types `kafkajs-client` / `kafkajs-producer`. These have been migrated to `@yroshcha/node-red-contrib-kafka` 6.2.5 and node types `yroshcha-kafka-broker` / `yroshcha-kafka-producer`.

The custom Node-RED image installs the project dependency into `/data/node_modules` at startup, which persists through the bind mount.

## Spark migration

Spark was upgraded from 3.5.1 to 4.2.0. Spark 4 uses Scala 2.13, so the Kafka connector coordinate changed from `_2.12:3.5.1` to `_2.13:4.2.0`. Existing streaming checkpoint state is versioned to `v4`; do not reuse incompatible old checkpoints.

## Frontend migration

The frontend is upgraded to the patched Next.js 16.3.3 release and React 19.2.7. The UI language is standardized to English.

## v2.0.1 Kafka KRaft permission fix

The Kafka service now uses a small derived `apache/kafka:4.3.1` image that
ensures `/tmp/kraft-combined-logs` is writable by Kafka's non-root `appuser`.
This prevents KRaft bootstrap failures on fresh Docker named volumes.
