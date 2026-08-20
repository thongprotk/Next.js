# syntax=docker/dockerfile:1

# --- deps: cài dependency riêng để tận dụng cache layer khi source code đổi nhưng package*.json không đổi
FROM node:24-alpine AS deps
WORKDIR usr/src/app
COPY package.json package-lock.json ./
RUN npm ci --silent

# --- builder: build Next.js với deps đã cài ở stage trên
FROM node:24-alpine AS builder
WORKDIR /usr/src/app
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .
# Các NEXT_PUBLIC_* cần có tại build-time (bundle vào client JS), truyền qua --build-arg
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=$NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# --- runner: image cuối chỉ chứa output standalone, không có source/dev deps
FROM node:24-alpine AS runner
WORKDIR /usr/src/app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

COPY --from=builder /usr/src/app/public ./public
COPY --from=builder --chown=nextjs:nodejs /usr/src/app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /usr/src/app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
