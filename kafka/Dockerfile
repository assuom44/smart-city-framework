# Smart City Kafka image
#
# The Apache Kafka image runs as the non-root `appuser`. When a fresh Docker
# named volume is mounted over /tmp/kraft-combined-logs, Docker can inherit
# the directory permissions from the image. Ensure that directory is owned
# by appuser so KRaft can format and persist its metadata safely.
FROM apache/kafka:4.3.1

USER root
RUN mkdir -p /tmp/kraft-combined-logs \
    && chown -R appuser:appuser /tmp/kraft-combined-logs

USER appuser
