let express = require('express');
let app = express()

myLogger = (req, res, next) => {
    console.log('Time:', Date.now())
    // setting variable in req object using MiddleWare
    req.user = { 'firstName': 'AWS', 'lastName': 'Amazon' };
    next();
}

// AppErrorHandler - to Handle Errors
// route Logger - to log route access information

module.exports = {
    myLogger: myLogger
}