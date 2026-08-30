# Smart City IoT & Big Data Platform

A Dockerized Smart City platform for real-time IoT simulation, Kafka event streaming, Apache Spark Structured Streaming, MongoDB persistence, a Node.js/Express API, Socket.IO updates, and a Next.js dashboard for El Jadida.

## Architecture

```text
IoT simulators (Node-RED)
        │
        ▼
Apache Kafka 4.3.1 (KRaft)
        │
   ┌────┴───────────────┐
   ▼                    ▼
Spark 4.2.0          Node.js API
   │                    │
   ├── Data Lake        ├── MongoDB 8.0
   └── Kafka results    └── Socket.IO
                             │
                             ▼
                       Next.js dashboard
```

## Current stack

| Component | Version / policy | Role |
|---|---|---|
| Apache Kafka | 4.3.1 | Event backbone, KRaft mode |
| Node-RED | 5.0.4 | IoT simulation and ingestion |
| Node.js | 24.20.0 LTS for application services | Backend/frontend runtime |
| Apache Spark / PySpark | 4.2.0 | Structured Streaming and analytics |
| MongoDB | 8.0.29 | Operational and historical storage |
| Next.js | 16.3.3 | Web dashboard |
| React | 19.2.7 | UI runtime |

## Prerequisites

- Docker Engine 29+
- Docker Compose v2+
- Linux, macOS, or Windows with Docker Desktop
- At least 8 GB RAM recommended for the full stack

No local Node.js, Java, Spark, or Kafka installation is required for the Docker workflow.

## Quick start

1. Copy the environment template if you need local overrides:

```bash
cp .env.example .env
```

2. If you have an older installation, stop it before migrating to Kafka KRaft:

```bash
docker compose down
```

If the old ZooKeeper/Kafka volumes are still present and this is a development installation, reset them once:

```bash
docker compose down -v
```

3. Build and start the complete platform:

```bash
docker compose up -d --build
```

4. Check service health:

```bash
docker compose ps
```

5. Follow the main application logs:

```bash
docker compose logs -f node-red backend spark
```

## Service URLs

- Dashboard: http://localhost:3000
- Backend health: http://localhost:4000/api/health
- Node-RED: http://localhost:1880
- Kafka host listener: localhost:9092
- MongoDB: localhost:27017

## Kafka topics

The `kafka-init` service creates the following topics idempotently:

- `smartcity.environment.readings`
- `smartcity.water.readings`
- `smartcity.traffic.readings`
- `smartcity.spark.environment`
- `smartcity.spark.water`
- `smartcity.spark.traffic`
- `smartcity.spark.errors`
- `smartcity.spark.alerts`

## Node-RED Kafka migration

The original flows depended on the legacy `node-red-contrib-kafkajs` 0.0.7 package and therefore failed with missing `kafkajs-client` and `kafkajs-producer` nodes. The updated project migrates those flows to `@yroshcha/node-red-contrib-kafka` 6.2.5, whose node types are `yroshcha-kafka-broker` and `yroshcha-kafka-producer`. The project-scoped dependency is installed automatically into the persistent `./node-red` directory at container startup.

The original flow is preserved as `node-red/flows.legacy-kafkajs.json` for rollback/reference.

## Development

### Backend

```bash
cd backend
npm install
npm start
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Spark

```bash
cd spark
python3 -m pip install -r requirements.txt
./run_spark.sh
```

For normal development, Docker remains the recommended way to run Kafka, MongoDB, Node-RED, and Spark together.

## Configuration

Use `.env.example` as the canonical list of supported environment variables. Never commit a real `.env` file or credentials.

## Troubleshooting

### Node-RED reports missing Kafka nodes

Check the dependency inside the container:

```bash
docker exec nodered-smartcity npm list --depth=0
```

Then verify the flow types:

```bash
docker exec nodered-smartcity node -e "const f=require('/data/flows.json'); console.log(f.filter(x=>x.type.includes('kafka')).map(x=>x.type))"
```

You should see `yroshcha-kafka-broker` and `yroshcha-kafka-producer`.

### Kafka was migrated from ZooKeeper

This release uses KRaft. Do not reuse an old ZooKeeper-based Kafka data directory. For a development reset, use `docker compose down -v` and start again.

## Clean shutdown

```bash
docker compose down
```

To also delete persistent Kafka and MongoDB data:

```bash
docker compose down -v
```

## Documentation language

Project documentation, README files, source comments, and user-facing UI labels are standardized in English. Proper names and domain-specific identifiers are intentionally preserved.

## License

Apache License 2.0.
