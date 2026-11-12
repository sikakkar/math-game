#!/usr/bin/env bash
# Starts the app for development: local Supabase (backend, :54321) and Expo web (frontend, :8081).
# Returns once both answer. Logs: ~/logs/backend.log, ~/logs/frontend.log.
set -euo pipefail
cd "$(dirname "$0")/.."
LOGS="$HOME/logs"; mkdir -p "$LOGS"
FRONTEND_PORT=8081
BACKEND_URL=http://127.0.0.1:54321

[ -d node_modules ] || npm ci >> "$LOGS/frontend.log" 2>&1

# Backend: reuse the local Supabase stack if it already answers (it is shared on the machine's Docker), else start it.
if ! curl -s -o /dev/null "$BACKEND_URL/rest/v1/"; then
  npx supabase start >> "$LOGS/backend.log" 2>&1
fi
for _ in $(seq 1 120); do curl -s -o /dev/null "$BACKEND_URL/rest/v1/" && break; sleep 1; done
curl -s -o /dev/null "$BACKEND_URL/rest/v1/" || { echo "Supabase did not answer on $BACKEND_URL; see $LOGS/backend.log" >&2; exit 1; }
npx supabase status >> "$LOGS/backend.log" 2>&1 || true

ANON_KEY=$(npx supabase status -o env 2>/dev/null | sed -n 's/^ANON_KEY="\(.*\)"$/\1/p')
[ -n "$ANON_KEY" ] || { echo "Could not read the anon key from 'supabase status'" >&2; exit 1; }

# Frontend: Expo web dev server, detached so it outlives this script.
if ! curl -s -o /dev/null "http://localhost:$FRONTEND_PORT"; then
  SUPABASE_URL="$BACKEND_URL" SUPABASE_ANON_KEY="$ANON_KEY" EXPO_NO_TELEMETRY=1 \
    setsid nohup npx expo start --web --port "$FRONTEND_PORT" >> "$LOGS/frontend.log" 2>&1 < /dev/null &
  echo $! > "$LOGS/frontend.pid"
fi
for _ in $(seq 1 180); do curl -s -o /dev/null "http://localhost:$FRONTEND_PORT" && break; sleep 1; done
curl -s -o /dev/null "http://localhost:$FRONTEND_PORT" || { echo "Expo did not answer on :$FRONTEND_PORT; see $LOGS/frontend.log" >&2; exit 1; }
echo "App running: frontend http://localhost:$FRONTEND_PORT, backend $BACKEND_URL"
