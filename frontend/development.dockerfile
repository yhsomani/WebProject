FROM node:18-alpine

WORKDIR /app

# Add dependencies for node-gyp
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./

# Install dependencies with legacy peer deps and clear npm cache
RUN npm cache clean --force && \
    npm install --legacy-peer-deps && \
    npm install -g serve

# Set environment variables
ENV NODE_ENV=development
ENV PATH /app/node_modules/.bin:$PATH
ENV CHOKIDAR_USEPOLLING=true
ENV WATCHPACK_POLLING=true
ENV FAST_REFRESH=false
ENV CI=false

# Create necessary directories and set permissions
RUN mkdir -p node_modules/.cache && \
    chown -R node:node /app

# Switch to non-root user
USER node

# Copy source code with correct ownership
COPY --chown=node:node . .

# Expose port
EXPOSE 3000

# Start the application in development mode with polling
CMD ["npm", "start"]
