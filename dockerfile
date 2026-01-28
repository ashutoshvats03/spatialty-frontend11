# ---------- Build Stage ----------
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies (cached if package.json hasn't changed)
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the Next.js app
RUN npm run build

# ---------- Runtime Stage ----------
FROM node:20-alpine AS runner

WORKDIR /app

# Only copy required files from builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# Expose Next.js default port
EXPOSE 3000

# Start Next.js in production mode
CMD ["npm", "start"]
