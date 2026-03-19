ARG NODE_OPTIONS="--max-old-space-size=8192"

# --- Base Image ---
FROM node:lts-bullseye-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

WORKDIR /app

# --- Build Image ---
FROM base AS build
ARG NODE_OPTIONS

COPY package.json pnpm-lock.yaml ./
COPY ./prisma /app/prisma
RUN pnpm install --frozen-lockfile

COPY . .

ENV NODE_OPTIONS=$NODE_OPTIONS


# prisma.config.ts loads env("DATABASE_URL") at config load — use placeholder for generate (no DB connection)
ARG DATABASE_URL=mysql://localhost:3306/dummy
RUN DATABASE_URL=${DATABASE_URL} pnpm run prisma:generate
RUN pnpm run build

# --- Release Image ---
FROM base AS release

RUN apt update && apt install -y dumb-init --no-install-recommends && rm -rf /var/lib/apt/lists/*

COPY --chown=node:node --from=build /app/package.json /app/pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile --ignore-scripts

COPY --chown=node:node --from=build /app/.next ./.next
COPY --chown=node:node --from=build /app/public ./public
COPY --chown=node:node --from=build /app/prisma ./prisma
COPY --chown=node:node --from=build /app/prisma.config.ts ./prisma.config.ts

# Copy generated Prisma client for runtime
COPY --from=build /app/generated/prisma ./generated/prisma


ENV TZ=UTC
ENV PORT=3000
ENV NODE_ENV=production

EXPOSE 3000

CMD [ "dumb-init", "pnpm", "run", "start" ]