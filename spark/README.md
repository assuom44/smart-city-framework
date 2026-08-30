# Smart City Spark Streaming

PySpark Structured Streaming jobs that consume Kafka sensor events, validate JSON payloads, write bronze/silver Parquet data to the local data lake, compute windowed metrics, and publish aggregations, errors, and alerts back to Kafka.

## Runtime

- Apache Spark / PySpark 4.2.0
- Scala 2.13 Spark distribution
- OpenJDK 17
- Kafka connector: `org.apache.spark:spark-sql-kafka-0-10_2.13:4.2.0`

## Docker

From the project root:

```bash
docker compose up -d --build spark
docker compose logs -f spark
```

## Local execution

```bash
python3 -m pip install -r requirements.txt
./run_spark.sh
```

The local script defaults to `localhost:9092`; Docker uses `kafka:29092`.

## Data lake

The streaming jobs use:

- Bronze: raw Kafka records
- Silver: validated and enriched records

Checkpoints are versioned through `SPARK_CHECKPOINT_VERSION`. After a schema or query-state change, create a new checkpoint version rather than reusing incompatible state.
