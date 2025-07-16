# Stage 1: Build
# This stage installs all dependencies, copies the source code,
# and builds the application for production.
FROM node:22-slim AS builder

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

WORKDIR /app

# First, copy only the files needed for dependency installation.
# This leverages Docker's layer caching, so 'pnpm install' only re-runs
# when dependencies change, not on every code change.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/config-eslint/package.json ./packages/config-eslint/
COPY packages/config-typescript/package.json ./packages/config-typescript/
COPY apps/backend/package.json ./apps/backend/

# Install all dependencies (including devDependencies needed for the build process)
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Copy the rest of the monorepo source code
COPY . .

# Build the specific 'backend' application
RUN pnpm --filter backend build

# Use pnpm deploy to create a production-ready deployment folder.
# This command packages the 'backend' app with its production dependencies
# into the /deploy directory.
RUN pnpm --filter backend deploy --prod /deploy --legacy

# Stage 2: Final Production Image
# This is the final, lean image that will be deployed. It starts from a fresh
# base and copies only the necessary artifacts from the builder stage.
FROM node:22-slim AS final

ENV NODE_ENV=production

# Create a non-root user and group for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 hono

WORKDIR /app

# Copy the deployed application from the builder stage.
# This includes the compiled code, package.json, and production node_modules.
COPY --from=builder --chown=hono:nodejs /deploy .

USER hono

EXPOSE 3000

CMD [ "node", "dist/index.js" ]