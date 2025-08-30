FROM node:20-slim AS build
WORKDIR /app

COPY ai-yapper-agent ai-yapper-agent
COPY aiya-web-app aiya-web-app

# Build the bundle
RUN cd ai-yapper-agent && \
    npm install && \
    npm run build

# Production stage
FROM node:20-slim AS production
WORKDIR /app

# Copy server file and package.json for dependencies
COPY server.js ./
COPY package.json ./

# Install production dependencies
RUN npm install --only=production express

# Copy built bundle
COPY --from=build /app/ai-yapper-agent/dist/main.lynx.bundle ./dist/

EXPOSE 3000

ENTRYPOINT ["node", "server.js"]
