const logger = require('pino')()
// const pino = require('pino')
// const logger = pino({
//     prettyPrint: { colorize: true }
//   })
const moment =require('moment');

captureError = (errorMessage, errorOrigin, errorLevel) => {
    let currentTime = moment();
    let errorResponse = {
        timestamp: currentTime,
        errorMessage: errorMessage,
        errorOrigin: errorOrigin,
        errorLevel: errorLevel
    }
    logger.error(errorResponse);
    return errorResponse;
}// end of Capture Error

captureInfo = (message, origin, importance) => {
    let currentTime = moment();
    let infoMessage ={
        timestamp: currentTime,
        message: message,
        origin: origin,
        level: importance
    }
    logger.info(infoMessage);
    return infoMessage;
}// enf of capture Info

module.exports= {
    captureError: captureError,
    captureInfo : captureInfo
}