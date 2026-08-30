#!/bin/bash
set -euo pipefail

echo "=== Preparing the PySpark environment ==="

command -v python3 >/dev/null || { echo "Python 3 is not installed."; exit 1; }
python3 -m pip --version >/dev/null || { echo "pip is not available."; exit 1; }

cd "$(dirname "$0")"
python3 -m pip install -r requirements.txt

command -v java >/dev/null || { echo "Java is not installed. Install OpenJDK 17."; exit 1; }
java -version

echo "=== Environment ready ==="
