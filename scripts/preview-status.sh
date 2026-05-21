#!/bin/bash
# Check if the preview server is alive.
REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"

if [ -f "$REPO_DIR/.run/server.pid" ]; then
  pid=$(cat "$REPO_DIR/.run/server.pid")
  if kill -0 "$pid" 2>/dev/null; then
    echo "Running · PID $pid · http://localhost:${PORT:-3000}"
    exit 0
  fi
fi

stray=$(lsof -ti :"${PORT:-3000}" 2>/dev/null || true)
if [ -n "$stray" ]; then
  echo "Running (untracked) · PID $stray · http://localhost:${PORT:-3000}"
  exit 0
fi
echo "Stopped"
exit 1
