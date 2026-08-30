FROM node:24.20.0-bookworm-slim

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --chown=node:node . .
USER node

ENV NODE_ENV=production
ENV PORT=4000
ENV MONGODB_URI=mongodb://mongodb:27017/smartcity
ENV KAFKA_BOOTSTRAP_SERVERS=kafka:29092

EXPOSE 4000
CMD ["node", "server.js"]
