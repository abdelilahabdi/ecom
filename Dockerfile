# Node.js
FROM node:24-bookworm-slim

# Project folder
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --omit=dev

# Copy project files
COPY . .

# Production mode
ENV NODE_ENV=production

# API port
EXPOSE 3001

# Run as non-root user
USER node

# Start server
CMD ["node", "server.js"]