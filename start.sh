#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🌊 Starting SafeHarbor..."
echo ""

# Start backend
echo "→ Starting backend on http://localhost:5001"
cd "$SCRIPT_DIR/server"
if [ ! -f .env ]; then
  cp .env.example .env
  # Generate a random JWT secret
  SECRET=$(node -e "console.log(require('crypto').randomBytes(48).toString('hex'))")
  sed -i '' "s/your_super_secret_jwt_key_change_this_in_production/$SECRET/" .env
  echo "  .env created with generated JWT secret"
fi
npm start &
SERVER_PID=$!

# Wait for server to be ready
sleep 2

# Start frontend
echo "→ Starting frontend on http://localhost:5173"
cd "$SCRIPT_DIR/client"
npm run dev &
CLIENT_PID=$!

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  SafeHarbor is running"
echo "  Open: http://localhost:5173"
echo "  API:  http://localhost:5001"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Press Ctrl+C to stop."

# Wait and clean up on exit
trap "kill $SERVER_PID $CLIENT_PID 2>/dev/null; echo 'SafeHarbor stopped.'" EXIT
wait
