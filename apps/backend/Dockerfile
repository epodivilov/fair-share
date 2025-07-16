FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

FROM base
WORKDIR /app/apps/backend

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 hono

COPY --from=prod-deps --chown=hono:nodejs /app/node_modules /app/node_modules
COPY --from=build --chown=hono:nodejs /app/apps/backend/dist ./dist
COPY --from=build --chown=hono:nodejs /app/package.json /app/package.json

USER hono
EXPOSE 3000

CMD [ "node", "dist/index.js" ]