# Smart City Node-RED

Node-RED provides the IoT simulation and ingestion layer for environmental, water, and traffic sensors. The flows publish JSON sensor batches to Apache Kafka.

## Runtime

- Node-RED 5.0.4
- Node.js 24 LTS runtime provided by the official Node-RED image
- Kafka integration: `@yroshcha/node-red-contrib-kafka` 6.2.5

## Docker usage

The recommended setup is the project Docker Compose stack:

```bash
docker compose up -d --build node-red
```

Open http://localhost:1880.

The project mounts `./node-red` to `/data`. The custom entrypoint installs the declared Kafka node package into the persistent project directory when it is missing.

## Kafka connection

Inside Docker, Kafka is available at:

```text
kafka:29092
```

The supplied flows already use this broker address. When running Node-RED outside Docker, change the broker configuration to `localhost:9092`.

## Kafka nodes

The current flows use:

- `yroshcha-kafka-broker`
- `yroshcha-kafka-producer`

The previous `kafkajs-client` and `kafkajs-producer` nodes came from the obsolete `node-red-contrib-kafkajs` 0.0.7 package and are no longer used.

## Flow backup

`flows.legacy-kafkajs.json` is retained as a rollback/reference copy of the original flow. Do not import it into the new runtime unless you intentionally reinstall the legacy package.
