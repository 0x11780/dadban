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

COPY .npmrc package.json pnpm-lock.yaml ./
COPY ./prisma /app/prisma
RUN pnpm install --frozen-lockfile

COPY . .

ENV NODE_OPTIONS=$NODE_OPTIONS

RUN pnpm run build

# --- Release Image ---
FROM base AS release

RUN apt update && apt install -y dumb-init --no-install-recommends && rm -rf /var/lib/apt/lists/*

COPY --chown=node:node --from=build /app/.npmrc /app/package.json /app/pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

COPY --chown=node:node --from=build /app/dist ./dist
COPY --chown=node:node --from=build /app/prisma ./prisma
RUN pnpm run prisma:generate

ENV TZ=UTC
ENV PORT=3000
ENV NODE_ENV=production

EXPOSE 3000

CMD [ "dumb-init", "pnpm", "run", "start" ]