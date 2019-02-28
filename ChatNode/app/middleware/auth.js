//Importing Auth Model
const mongoose = require('mongoose');
const authModel = mongoose.model('Auth');
//Importing Logger
const logger = require('../libraries/loogerLib');
// Importing Standard
const response = require('../libraries/standard');
// Importing Check 
const check = require('../libraries/CheckLib');
// Importing TokenLib
const token = require('../libraries/tokenVerify');


isAuthorized = (req, res, next) => {
    console.log(req.body.authToken);
    if (req.params.authToken || req.body.authToken || req.query.authToken || req.header('authToken')) {
        authModel.findOne({authToken : req.params.authToken || req.body.authToken || req.query.authToken || req.header('authToken')}, (err, authDetails) => {
            if (err) {
                console.log(err);
                logger.captureError(err.message, 'authMiddleWare', 10);
                let apiResponse = response.format(true, 'Failed to Authorize', 500 , null);
                res.send(apiResponse);
            } else if (check.isEmpty(authDetails)) {
                console.log('AuthToken Expired');
                logger.captureError('AuthToken Expired or Invalid', 'authMiddleWare', 10);
                let apiResponse = response.format(true, 'AuthToken Expired or Invalid', 500 , null);
                res.send(apiResponse);
            } else {
                token.verifyClaim(authDetails.authToken,authDetails.tokenSecret, (err, decoded) => {
                    if (err) {
                        console.log(err);
                        logger.captureError(err.message, 'authMiddleWare', 10);
                        let apiResponse = response.format(true, 'Failed to Authorize', 500 , null);
                        res.send(apiResponse);
                    } else {
                        req.user = {userId : decoded.data.userId}
                        next();
                    }
                });
            }
        });
    } else {
        logger.captureError('Authorization Token Missing', 'AuthMiddleWare', 10);
        let apiResponse = response.format(true, 'Authorization Missing In Request', 500 , null);
        res.send(apiResponse);
    }
}; // end of is Authorised

module.exports = {
    isAuthorized: isAuthorized
}