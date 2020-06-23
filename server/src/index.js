/* eslint-disable no-param-reassign */

'use strict';

// #region require dependencies
const betterLogging = require('better-logging');
// enhances log messages with timestamps etc
betterLogging.default(console, {
  stampColor: (Color) => Color.Light_Green,
  typeColors: (Color) => ({
    log: Color.Light_Green,
  }),
});
const path = require('path'); // helper library for resolving relative paths
const expressSession = require('express-session');
const socketIOSession = require('express-socket.io-session');
const express = require('express');
const http = require('http');
// #endregion

// #region setup boilerplate
console.loglevel = 4; // Enables debug output
const publicPath = path.join(__dirname, '..', '..', 'client', 'dist');
const port = 8989; // The port that the server will listen to
const app = express(); // Creates express app

// Express usually does this for us, but socket.io needs the httpServer directly
const httpServer = http.Server(app);
const io = require('socket.io').listen(httpServer); // Creates socket.io app

// Setup middlewares
app.use(betterLogging.expressMiddleware(console, {
  ip: { show: true },
  path: { show: true },
  body: { show: true },
}));
app.use(express.json()); /*
This is a middleware that parses the body of the request into a javascript object.
It's basically just replacing the body property like this:
req.body = JSON.parse(req.body)
*/
app.use(express.urlencoded({ extended: true }));

// Setup session
const session = expressSession({
  secret: 'Super secret! Shh! Don\'t tell anyone...',
  resave: true,
  saveUninitialized: true,
});
app.use(session);
io.use(socketIOSession(session, {
  autoSave: true,
  saveUninitialized: true,
}));
// #endregion

// Serve client
app.use(express.static(publicPath));/*
express.static(absolutePathToPublicDirectory)
This will serve static files from the public directory, starting with index.html
*/

// Bind REST controllers to /api/*
const auth = require('./controllers/auth.controller.js');
const admin = require('./controllers/admin.controller.js');
const crowd = require('./controllers/crowd.controller.js');

app.use('/api', auth.router);
app.use('/api', auth.requireAuth, crowd.router);
app.use('/api', auth.requireAdmin, admin.router);

// Init model
const model = require('./model.js');

model.init({ io });

// Handle connected socket.io sockets
io.on('connection', (socket) => {
});

// Start server
httpServer.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
