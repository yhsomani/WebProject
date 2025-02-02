#!/bin/sh

# Wait for PostgreSQL
echo "Waiting for PostgreSQL to start..."
wait4ports tcp://${POSTGRES_HOST}:${POSTGRES_PORT}

# Wait for MongoDB
echo "Waiting for MongoDB to start..."
wait4ports tcp://mongodb:27017

# Run database migrations
echo "Running database migrations..."
npx sequelize-cli db:migrate

# Start the application
echo "Starting the application..."
if [ "$NODE_ENV" = "production" ]; then
    npm start
else
    npm run dev
fi
