#!/bin/sh
set -eu

export PORT="${PORT:-8080}"
: "${BACKEND_ORIGIN:?BACKEND_ORIGIN is required}"

envsubst '${PORT} ${BACKEND_ORIGIN}' \
  < /etc/nginx/templates/app.conf.template \
  > /etc/nginx/conf.d/default.conf

exec nginx -g 'daemon off;'
