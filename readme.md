# Norbit homework

### A basic application which streams boat position data to a node.js server which then sends it to the frontend "live". The react frontend shows the position of the boat real-time, with the possibility of recording the route and disabling the stream, and with the possibility of visualizing saved routes. The saved coordinates are stored in psql database. The original boat position data is stored in csv format.

### Technologies:
Backend: node.js, socket.io, express, psql

Frontend: react, socket.io, openLayers

### Setup:

- install dependencies for both the frontend and the backend using separate package.json files
- run "node express"  for the server
- run "node mock_app" for the mock application which streams boat position data
- run "npm start" inside the frontend_client folder for running the frontend