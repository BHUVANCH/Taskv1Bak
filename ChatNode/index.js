// importing Express Js Into Our Application
const express = require('express');
const config = require('./config/config');
const fs = require('fs');
// Making An Instance or Creating an APplication Instance 
const app = express();
// Importing Mongoose Module
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
// Importing Body Parser to Handle Body Params
const bodyParser = require('body-parser');
// Including Global Error Handling MiddleWare
const globalErrorHandlingMiddleware = require('./app/middleware/appErrorHandler');
// Including Route Logger Middleware
const globalRouteLogger = require('./app/middleware/routeLogger');
// const routerPath = require('./app/routes/');
// Importing http Module
const http = require('http');
const https = require('https');
// Including path Module
const path = require('path');
// including logger
const logger = require('./app/libraries/loogerLib');

// MiddleWares
// support parsing of application/json type post data
app.use(bodyParser.json());
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: false }));
// cookie parsing Middle Ware
app.use(cookieParser());
// Application Level MiddleWare
// Handle errors which comes in the APP and sends the Response
app.use(globalErrorHandlingMiddleware.globalErrorHandler)
// Including Route Logger Middleware- to log the routes
app.use(globalRouteLogger.routeLogger);
// Including middleWare 
app.use(express.static(path.join(__dirname,'client')));

// BootStraping Models
let modelPath = './app/models';
fs.readdirSync(modelPath).forEach((file) => {
    if(file.search('.js')) {
        // console.log(modelPath + '/' + file);
        require(modelPath + '/' + file);
    }
});
// End o BootStrap Model

// BootStrap Route for different domains
let routePath = './app/routes';
fs.readdirSync(routePath).forEach((file) => {
    if (file.search('.js')) {
        // console.log(routePath + '/' + file);
        let router = require(routePath + '/' + file);
        // console.log(router.setRouter);
        router.setRouter(app);
    }
});
// End of Boot Strap Route
 
app.use(globalErrorHandlingMiddleware.globalNotFoundHandler);

// listening the Server - Creating a Local Server
// app.listen(config.appConfig.port, () => {
//     console.log('Listening to port 3000');
//     // Creating Mongo DB Connection
//     mongoose.connect(config.appConfig.database.uri, { useNewUrlParser: true });
//     console.log('Connected to DataBase');
// })


// Createing http Server
const server = http.createServer(app);
// Creating https Server
// let httpsServer = https.createServer(credentials,app);
// console.log(config.appConfig);
server.listen(config.appConfig.port);
server.on('error', onError);
server.on('listening', onListening);

// end of listening code

// Including SocketLib in index.js
const socketLib = require('./app/libraries/socketLib');
let socketServer = socketLib.setServer(server);

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
    if (error.syscall !== 'listen') {
      logger.captureError(error.code + ' not equal listen', 'serverOnErrorHandler', 10)
      throw error;
    }
  
  
    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        logger.captureError(error.code + ':elavated privileges required', 'serverOnErrorHandler', 10);
        process.exit(1);
        break;
      case 'EADDRINUSE':
        logger.captureError(error.code + ':port is already in use.', 'serverOnErrorHandler', 10);
        process.exit(1);
        break;
      default:
        logger.captureError(error.code + ':some unknown error occured', 'serverOnErrorHandler', 10);
        throw error;
    }
  }
  
  /**
   * Event listener for HTTP server "listening" event.
   */
  
  function onListening() {
  
    var addr = server.address();
    var bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
    ('Listening on ' + bind);
    logger.captureInfo('server listening on port' + addr.port, 'serverOnListeningHandler', 10);
    mongoose.connect(config.appConfig.database.uri, {
        useCreateIndex: true,
        useNewUrlParser: true
      });
  }
  
  process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
    // application specific logging, throwing an error, or other logic here
  });



// handling Mongoose Connection Error
mongoose.connection.on('error', (err) => {
    console.log('DataBase Connection Error');
    console.log(err); 
})
 
// HAndling Mongoose on Open
// Handles the State where Connection is Opened Sucessufully
mongoose.connection.on('open', (err) => {
    if(err) {
        console.log('DataBase Error')
        console.log(err);
    } else {
        console.log('DataBase Connection Opened Sucessufully Opened');
    }
});

module.exports = app;