# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY scale-media-worker/package*.json ./
COPY scale-media-worker/tsconfig.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY scale-media-worker/src ./src

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install only production dependencies
COPY scale-media-worker/package*.json ./
RUN npm ci --only=production

# Copy built application from builder
COPY --from=builder /app/dist ./dist

# Set environment variables
ENV NODE_ENV=production

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

USER nodejs

# Start the worker
CMD ["node", "dist/main.js"]
