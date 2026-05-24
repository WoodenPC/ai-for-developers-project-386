#!/bin/sh
set -eu

export PORT="${PORT:-8080}"
: "${BACKEND_HOSTPORT:?BACKEND_HOSTPORT is required}"
export BACKEND_ORIGIN="http://${BACKEND_HOSTPORT}"

envsubst '${PORT} ${BACKEND_ORIGIN}' \
  < /etc/nginx/templates/app.conf.template \
  > /etc/nginx/conf.d/default.conf

exec nginx -g 'daemon off;'
