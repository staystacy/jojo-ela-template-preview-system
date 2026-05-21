#!/bin/bash
# Start the preview server detached from this terminal.
# Survives terminal close + Claude session exit (but not system reboot).
# For auto-start on login, use launchd (see scripts/com.jojo.preview.plist).

set -e
REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_DIR"

mkdir -p .run

if [ -f .run/server.pid ]; then
  pid=$(cat .run/server.pid)
  if kill -0 "$pid" 2>/dev/null; then
    echo "Already running (PID $pid) → http://localhost:${PORT:-3000}"
    exit 0
  fi
fi

# nohup + & + disown → process keeps running after this shell exits
nohup node server.js > .run/server.log 2>&1 &
new_pid=$!
echo "$new_pid" > .run/server.pid
disown "$new_pid" 2>/dev/null || true

sleep 1
if kill -0 "$new_pid" 2>/dev/null; then
  echo "Started PID $new_pid → http://localhost:${PORT:-3000}"
  echo "Log: $REPO_DIR/.run/server.log"
  echo "Stop with: $REPO_DIR/scripts/preview-stop.sh"
else
  echo "Server failed to start. Last log lines:" >&2
  tail -20 .run/server.log >&2
  rm -f .run/server.pid
  exit 1
fi
