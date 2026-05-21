#!/bin/bash
# Stop the detached preview server.
set -e
REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_DIR"

if [ -f .run/server.pid ]; then
  pid=$(cat .run/server.pid)
  if kill "$pid" 2>/dev/null; then
    echo "Stopped PID $pid"
  else
    echo "PID $pid was not running"
  fi
  rm -f .run/server.pid
fi

# Safety net: kill any stray process on the port
stray=$(lsof -ti :"${PORT:-3000}" 2>/dev/null || true)
if [ -n "$stray" ]; then
  kill $stray 2>/dev/null || true
  echo "Cleaned stray process on port ${PORT:-3000}: $stray"
fi
