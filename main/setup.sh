#!/bin/bash

# Start your project
echo "Starting server.js..."
node server.js &

sleep 2

# Start socket.js
echo "Starting socket.js..."
node socket.js &
 
# Start website
echo "Running npm start..."
npm start &

wait

echo "Project started successfully."
