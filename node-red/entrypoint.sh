#!/bin/sh
set -eu

cd /data

PACKAGE_NAME='@yroshcha/node-red-contrib-kafka'
REQUIRED_VERSION="$(node -p "require('./package.json').dependencies['$PACKAGE_NAME'] || ''")"
INSTALLED_VERSION=''
if [ -f "node_modules/$PACKAGE_NAME/package.json" ]; then
  INSTALLED_VERSION="$(node -p "require('./node_modules/$PACKAGE_NAME/package.json').version")"
fi

if [ -n "$REQUIRED_VERSION" ] && [ "$INSTALLED_VERSION" != "$REQUIRED_VERSION" ]; then
  echo "[Node-RED] Installing $PACKAGE_NAME@$REQUIRED_VERSION..."
  npm install --omit=dev --no-audit --no-fund
fi

exec node-red --userDir /data
