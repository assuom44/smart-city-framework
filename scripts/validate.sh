#!/bin/bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "Validating Docker Compose configuration..."
docker compose config >/dev/null

echo "Validating Node-RED flow JSON..."
python3 - <<'PY'
import json
from pathlib import Path
flow=json.loads(Path('node-red/flows.json').read_text())
types={n.get('type') for n in flow}
assert 'yroshcha-kafka-broker' in types
assert 'yroshcha-kafka-producer' in types
assert 'kafkajs-client' not in types
assert 'kafkajs-producer' not in types
print('Node-RED flow validation: OK')
PY

echo "Validating Python syntax..."
python3 -m compileall -q spark

echo "Validation completed."
