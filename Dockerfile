# Build stage for React app
FROM node:18 AS client-build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM node:18-slim
WORKDIR /app
COPY --from=client-build /app/build ./client/build
COPY --from=client-build /app/server ./server
COPY docker-package.json ./package.json
COPY --from=client-build /app/.env ./

# Install production dependencies
RUN npm install --production

# Expose port for the server
EXPOSE 5000

# Start the server with our startup script that includes data seeding
CMD ["node", "server/startup.js"]
