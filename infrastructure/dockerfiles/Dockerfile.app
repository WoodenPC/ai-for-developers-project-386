FROM node:24-bookworm-slim AS pruner

WORKDIR /app
RUN npm install --global turbo@2.9.14
COPY . .
RUN turbo prune @calls-calendar/frontend @calls-calendar/backend --docker

FROM node:24-bookworm-slim AS builder

WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10.0.0 --activate
COPY --from=pruner /app/out/json/ ./
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile
COPY --from=pruner /app/out/full/ ./
RUN pnpm --filter @calls-calendar/backend build
RUN pnpm --filter @calls-calendar/frontend build

FROM node:24-bookworm-slim AS production-deps

ENV NODE_ENV=production
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10.0.0 --activate
COPY --from=pruner /app/out/json/ ./
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile --prod

FROM node:24-bookworm-slim AS production

ENV NODE_ENV=production
WORKDIR /app

RUN apt-get update \
  && apt-get install --yes --no-install-recommends bash ca-certificates gettext-base nginx \
  && rm -rf /var/lib/apt/lists/* \
  && rm -f /etc/nginx/sites-enabled/default /etc/nginx/conf.d/default.conf

COPY --from=production-deps /app ./
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder /app/apps/frontend/dist /usr/share/nginx/html
COPY infrastructure/nginx/app.conf.template /etc/nginx/templates/app.conf.template
COPY infrastructure/scripts/start-app.sh /usr/local/bin/start-app
RUN chmod +x /usr/local/bin/start-app

CMD ["start-app"]
