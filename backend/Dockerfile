FROM node:18-alpine

# Install necessary tools
RUN apk add --no-cache postgresql-client wait4ports

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Create necessary directories
RUN mkdir -p /app/certificates /app/models/ml_models /app/logs

# Set permissions for the entrypoint script
RUN chmod +x /app/docker-entrypoint.sh

# Set environment variables
ENV NODE_ENV=development
ENV PATH /app/node_modules/.bin:$PATH

# Expose port
EXPOSE 4000

# Start the application using the entrypoint script
ENTRYPOINT ["/app/docker-entrypoint.sh"]
