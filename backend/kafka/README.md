# Kafka integration

The backend uses KafkaJS to consume Smart City sensor and Spark result topics. Kafka itself is managed by Docker Compose in KRaft mode.

## Topics

Raw sensor topics:

- `smartcity.environment.readings`
- `smartcity.water.readings`
- `smartcity.traffic.readings`

Spark result topics:

- `smartcity.spark.environment`
- `smartcity.spark.water`
- `smartcity.spark.traffic`
- `smartcity.spark.errors`
- `smartcity.spark.alerts`

Topic creation is centralized in the Compose `kafka-init` service. The legacy Docker-exec topic script is retained only as a local administration helper.
