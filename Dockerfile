FROM node:24-bookworm-slim AS build
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@11.18.0 --activate
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json tsconfig.base.json ./
COPY apps ./apps
COPY packages ./packages
ENV API_ORIGIN=http://api:3003
RUN pnpm install --frozen-lockfile
RUN pnpm build

FROM node:24-bookworm-slim AS runtime-base
WORKDIR /app
ENV NODE_ENV=production
RUN corepack enable && corepack prepare pnpm@11.18.0 --activate
COPY --from=build --chown=node:node /app /app
USER node

FROM runtime-base AS api
EXPOSE 3003
CMD ["node", "apps/api/dist/main.js"]

FROM runtime-base AS game
EXPOSE 3002
CMD ["pnpm", "--filter", "jogo", "start", "--", "--hostname", "0.0.0.0", "--port", "3002"]

FROM runtime-base AS site
EXPOSE 3001
CMD ["pnpm", "--filter", "site", "start", "--", "--hostname", "0.0.0.0", "--port", "3001"]
