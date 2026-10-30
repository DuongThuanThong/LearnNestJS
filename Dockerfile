FROM node:24-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate && npm run build

# runtime deps only: no nest cli, vitest, vite...
FROM node:24-alpine AS deps
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
COPY prisma ./prisma
RUN npm ci --omit=dev --ignore-scripts \
 && npx prisma generate \
 && npm cache clean --force

# migrations need the prisma CLI (a dev dependency)
FROM node:24-alpine AS migrate
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
COPY prisma ./prisma
COPY prisma7.config.ts ./
RUN npm ci --ignore-scripts \
 && npx prisma generate

FROM node:24-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY package*.json ./
USER node
EXPOSE 3000
CMD ["node", "dist/main"]
