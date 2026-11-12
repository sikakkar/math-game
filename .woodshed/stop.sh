#!/usr/bin/env bash
# Stops the Expo web dev server. Leaves the local Supabase stack running: it lives on the machine's
# Docker, other sessions may share it, and it keeps the profiles and progress. Stop it with `npx supabase stop`.
LOGS="$HOME/logs"
if [ -f "$LOGS/frontend.pid" ]; then
  kill -- -"$(cat "$LOGS/frontend.pid")" 2>/dev/null || kill "$(cat "$LOGS/frontend.pid")" 2>/dev/null || true
  rm -f "$LOGS/frontend.pid"
fi
pkill -f "expo start --web --port 8081" 2>/dev/null || true
exit 0
