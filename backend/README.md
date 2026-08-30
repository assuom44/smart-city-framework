# Smart City Backend

Node.js/Express service exposing REST APIs and Socket.IO real-time events. It consumes Kafka topics, persists Spark aggregations and alerts in MongoDB, and broadcasts live sensor and analytics updates to the dashboard.

## Runtime

- Node.js 24 LTS
- Express 5.2
- KafkaJS 2.2
- Mongoose 9
- Socket.IO 4.8

## Run locally

```bash
npm install
npm start
```

Required environment variables:

```text
PORT=4000
MONGODB_URI=mongodb://localhost:27017/smartcity
KAFKA_BOOTSTRAP_SERVERS=localhost:9092
CORS_ORIGIN=http://localhost:3000
```

## Health

`GET /api/health` is used by Docker Compose as the service health check.

## Kafka consumer

The consumer listens to raw sensor topics and Spark result topics. Raw readings are emitted through Socket.IO for live dashboards; Spark aggregations and alerts are persisted for historical queries.
