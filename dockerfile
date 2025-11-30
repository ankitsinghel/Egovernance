# -----------------------------
# 1. Dependencies + Prisma
# -----------------------------
FROM node:20-bullseye-slim AS deps
WORKDIR /app

# Copy package files first (cache friendly)
COPY package*.json ./
COPY prisma ./prisma

# Install ALL dependencies (with dev deps, needed for build)
RUN npm ci

# Generate Prisma Client
RUN npx prisma generate

# -----------------------------
# 2. Build Next.js
# -----------------------------
FROM node:20-bullseye-slim AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# -----------------------------
# 3. Production Image
# -----------------------------
FROM node:20-bullseye-slim AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy only production assets
COPY --from=builder /app/.next ./.next
# COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./

# Install ONLY production deps
RUN npm ci --omit=dev

COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Prisma client must be regenerated inside production container
RUN npx prisma generate


CMD ["npm", "start"]
