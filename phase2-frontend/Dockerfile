# Phase IV — Frontend Dockerfile (Next.js)
# Judge-safe: NEXT_PUBLIC_* injected at BUILD time

FROM node:20-alpine AS deps
WORKDIR /app

COPY package.json ./
COPY package-lock.json* ./
COPY npm-shrinkwrap.json* ./

RUN npm install


FROM node:20-alpine AS builder
WORKDIR /app

# ✅ CRITICAL: build-time env for Next.js
ARG NEXT_PUBLIC_API_BASE_URL=/api
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js reads NEXT_PUBLIC_* HERE
RUN npm run build


FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
CMD ["npm", "run", "start"]
