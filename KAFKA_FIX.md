# Kafka KRaft permission fix

## Why Kafka was restarting

Kafka 4.3.1 runs as the non-root `appuser`. The KRaft log directory is mounted
from the Docker named volume `kafka_data` at `/tmp/kraft-combined-logs`.
The previous image/volume combination left that directory unwritable by
`appuser`, causing:

`java.nio.file.AccessDeniedException: /tmp/kraft-combined-logs/bootstrap.checkpoint.tmp`

## Apply the fix

Because the failed deployment created a fresh Kafka volume, remove the old
volume before rebuilding. This is safe only if there is no Kafka data that
needs to be preserved.

```bash
docker compose down -v

docker compose build --no-cache kafka
docker compose up -d
```

Then verify:

```bash
docker compose ps
```

Kafka should become `healthy` and remain `Up` rather than restarting.

Check Kafka directly:

```bash
docker logs kafka-smartcity --tail 100
```

List topics:

```bash
docker exec kafka-smartcity /opt/kafka/bin/kafka-topics.sh \\
  --bootstrap-server localhost:9092 --list
```

The `kafka-init-smartcity` service should then create the Smart City topics.
