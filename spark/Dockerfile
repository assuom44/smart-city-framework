FROM python:3.11-slim-bookworm

RUN apt-get update \
    && apt-get install -y --no-install-recommends openjdk-17-jre-headless procps curl \
    && rm -rf /var/lib/apt/lists/*

ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

ARG SPARK_KAFKA_PACKAGE=org.apache.spark:spark-sql-kafka-0-10_2.13:4.2.0
RUN printf '%s\n' \
    'from pyspark.sql import SparkSession' \
    'spark = SparkSession.builder.appName("DependencyCache").getOrCreate()' \
    'spark.stop()' \
    > /tmp/cache_spark_dependencies.py \
    && spark-submit --packages "${SPARK_KAFKA_PACKAGE}" /tmp/cache_spark_dependencies.py \
    && rm /tmp/cache_spark_dependencies.py

COPY . .
RUN mkdir -p /app/checkpoints /app/data_lake

ENV KAFKA_BOOTSTRAP_SERVERS=kafka:29092
ENV DATA_LAKE_BASE_DIR=/app/data_lake
ENV SPARK_CHECKPOINT_BASE_DIR=/app/checkpoints
ENV SPARK_CHECKPOINT_VERSION=v4

CMD ["spark-submit", "--packages", "org.apache.spark:spark-sql-kafka-0-10_2.13:4.2.0", "main.py"]
