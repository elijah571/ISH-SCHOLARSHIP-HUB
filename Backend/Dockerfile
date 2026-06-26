# ── deps stage: install production dependencies only ──────────────────────────
FROM node:24-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# ── production stage ──────────────────────────────────────────────────────────
FROM node:24-alpine AS production

# dumb-init: proper PID-1 signal forwarding so SIGTERM reaches node
RUN apk add --no-cache dumb-init

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --chown=appuser:appgroup . .

USER appuser
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "src/server.js"]
