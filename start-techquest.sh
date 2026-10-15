#!/usr/bin/env bash
set -e

# Navigate to project root directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "=============================================================="
echo "      TECHQUEST: Web-based EOP Learning Module"
echo "      Master's Thesis Research Project"
echo "=============================================================="
echo ""

# 1. Install dependencies if not already installed
if [ ! -d "server/node_modules" ]; then
  echo "[Setup] Installing server dependencies..."
  npm --prefix server install
fi

if [ ! -d "client/node_modules" ]; then
  echo "[Setup] Installing client dependencies..."
  npm --prefix client install
fi

# 2. Build client production bundle if dist doesn't exist
if [ ! -d "client/dist" ]; then
  echo "[Setup] Building client production bundle..."
  npm --prefix client run build
fi

# 3. Determine available port (Mac default port 5000 is often reserved by AirPlay / ControlCenter)
DEFAULT_PORT=5000
PORT=${PORT:-$DEFAULT_PORT}

if lsof -i :"$PORT" >/dev/null 2>&1; then
  OCCUPIER=$(lsof -i :"$PORT" | awk 'NR==2 {print $1}')
  if [ "$PORT" = "5000" ]; then
    echo "Notice: Port 5000 is currently in use by '$OCCUPIER' (macOS AirPlay Receiver)."
    echo "Switching to port 5001..."
    PORT=5001
  else
    echo "Warning: Port $PORT is already in use by $OCCUPIER."
  fi
fi

export PORT

echo ""
echo "[1/2] Starting TECHQUEST Server on Port $PORT..."

# 4. Open browser in background after short delay
(
  sleep 1.5
  echo "[2/2] Opening TECHQUEST in default browser..."
  open "http://localhost:$PORT"
) &

echo ""
echo "=============================================================="
echo " TECHQUEST is running at: http://localhost:$PORT"
echo ""
echo " - Student Main Study: Strict sequential unit/task locking"
echo " - Evaluator/Pilot: Instant bypass to inspect all units"
echo " - Rater A / Rater B: Blind marking & 4-criteria rubric"
echo " - SPSS Export: Instant RFC-4180 CSV generation"
echo "=============================================================="
echo "Press Ctrl+C to stop the server."
echo ""

# 5. Start the server
node server/index.js
