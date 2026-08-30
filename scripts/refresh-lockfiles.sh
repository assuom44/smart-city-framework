#!/bin/bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "Refreshing frontend npm lockfile..."
(cd "$ROOT/frontend" && npm install)

echo "Refreshing backend npm lockfile..."
(cd "$ROOT/backend" && npm install)

echo "Node-RED dependencies are installed at runtime because /data is a bind mount."
