#!/usr/bin/env bash
set -euo pipefail

export PORT="${PORT:-8080}"
BACKEND_PORT="${BACKEND_PORT:-4010}"
export BACKEND_ORIGIN="http://127.0.0.1:${BACKEND_PORT}"

envsubst '${PORT} ${BACKEND_ORIGIN}' \
  < /etc/nginx/templates/app.conf.template \
  > /etc/nginx/conf.d/default.conf

HOST=127.0.0.1 PORT="${BACKEND_PORT}" node apps/backend/dist/server.js &
BACKEND_PID=$!

terminate() {
  kill "${BACKEND_PID}" "${NGINX_PID}" 2>/dev/null || true
  wait "${BACKEND_PID}" "${NGINX_PID}" 2>/dev/null || true
}

trap 'terminate; exit 143' INT TERM

nginx -g 'daemon off;' &
NGINX_PID=$!

status=0
wait -n "${BACKEND_PID}" "${NGINX_PID}" || status=$?
terminate
exit "${status}"
