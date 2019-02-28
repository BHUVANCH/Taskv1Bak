const express = require('express');
const logger = require('../libraries/loogerLib');
const Check = require('../libraries/CheckLib');
const validateInput = require('../libraries/paramsValidationLib');
const response = require('../libraries/standard');
// Importing Model
const mongoose = require('mongoose');
const UserModel = mongoose.model('User');
// importing TimeLib
const time = require('../libraries/timelib');
// Importing Password Lib
const passwordLib = require('../libraries/generatePasswordLib');
// Importing TokenLib
const tokenLib = require('../libraries/tokenVerify');
//Importing shortID
const shortid = require('shortid');
// Importing AuthModel
const authModel = mongoose.model('Auth');


signUp = (req, res) => {
    validateUserInput = () => {
        return new Promise((resolve, reject) => {
            if (req.body.email) {
                if (!validateInput.Email(req.body.email)) {
                    let apiResponse = response.format(true, 'Email is Not Valid', 400, null);
                    reject(apiResponse);
                } else if (Check.isEmpty(req.body.password)) {
                    let apiResponse = response.format(true, 'Password is Invalid', 400, null);
                    reject(apiResponse);
                } else {
                    resolve(req);
                }
            } else {
                logger.captureError('Field is Missing', 'UserController: SignUp: ValidateUserInput', 10);
                let apiResponse = response.format(true, 'Parameters are Missing', 400, null);
                reject(apiResponse);
            }
        });
    }// end of ValidateUserInput

    createUser = () => {
        return new Promise((resolve, reject) => {
            UserModel.findOne({ email: req.body.email }, (err, result) => {
                if (err) {
                    logger.captureError(err.message, 'UserController: SignUp: createUser', 10);
                    let apiResponse = response.format(true, 'Failed To Create user', 500, null);
                    reject(apiResponse);
                } else if (Check.isEmpty(result)) {
                    console.log(req.body);
                    let newUser = new UserModel({
                        userId: shortid.generate(),
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        mobileNumber: req.body.mobile,
                        email: req.body.email.toLowerCase(),
                        password: passwordLib.hashpassword(req.body.password),
                        cereatedOn: time.now()
                    })
                    newUser.save((err, newUser) => {
                        if (err) {
                            console.log(err);
                            logger.captureError(err.message, 'UserController:CreateUser:save', 10);
                            let apiResponse = response.format(true, 'Failed to Create User', 500, null);
                            reject(apiResponse);
                        } else {
                            console.log('user Created Successufully');
                            console.log(newUser);
                            let newUserObj = newUser.toObject();
                            resolve(newUserObj);
                        }
                    });
                } else {
                    logger.captureError('User Already Exists', 'UserController:CreateUser', 10);
                    let apiResponse = response.format(true, 'UserAlready Exists', 500, null);
                    reject(apiResponse);
                }
            });
        });
    }//end of create User Function

    validateUserInput(req, res)
        .then(createUser)
        .then((resolve) => {
            delete resolve.password;
            let apiResponse = response.format(false, 'User Created', 200, resolve);
            res.send(apiResponse);
        })
        .catch((err) => {
            console.log(err);
            res.send(err);
        })
} // end of SignUp

login = (req, res) => {
    findUser = () => {
        return new Promise((resolve, reject) => {
            if (req.body.email) {
                console.log(req.body);
                UserModel.findOne({ email: req.body.email.toLowerCase() }, (err, result) => {
                    if (err) {
                        logger.captureError(err, 'UserController:login:findUser', 10);
                        let apiResponse = response.format(true, 'Failed to Find User', 500, null);
                        reject(apiResponse);
                    } else if (Check.isEmpty(result)) {
                        logger.captureError(err, 'UserController:login:findUser', 10);
                        let apiResponse = response.format(true, 'User not Found', 500, null);
                        reject(apiResponse);
                    } else {
                        logger.captureInfo('User found', 'UserController:FindUser', 10);
                        resolve(result);
                    }
                });
            } else {
                logger.captureError(err, 'UserController:login:findUser', 10);
                let apiResponse = response.format(true, 'email not Found', 500, null);
                reject(apiResponse);
            }
        });
    } // end of Find User
    validatePassword = (result) => {
        return new Promise((resolve, reject) => {
            passwordLib.comparePassword(req.body.password, result.password, (err, isMatch) => {
                if (err) {
                    console.log(err);
                    logger.captureError(err.message, 'UserCOntroller: validatePassword', 10);
                    let apiResponse = response.format(true, 'Login Failed', 500, null);
                    reject(apiResponse);
                } else if (isMatch) {
                    // COnverting Mongoose Object to JS Object
                    let resultObj = result.toObject()
                    delete resultObj.password;
                    delete resultObj._id;
                    delete resultObj.__v;
                    delete resultObj.cereatedOn;
                    delete resultObj.modifiedOn;
                    console.log('validatePassword');
                    resolve(resultObj);
                } else {
                    logger.captureInfo('Login Failed due to Invalid Password', 'UserController:validatePassword', 10);
                    let apiResponse = response.format(true, 'Login Failed', 500, null);
                    reject(apiResponse);
                }
            });
        });
    }
    generateToken = (resultObj) => {
        return new Promise((resolve, reject) => {

            //console.log(tokenLib.generateToken(resultObj););
            tokenLib.generateToken(resultObj, (err, result) => {
                if (err) {
                    console.log(err);
                    logger.captureError(err.message, 'UserCOntroller: generateToken', 10);
                    let apiResponse = response.format(true, 'Login Failed', 500, null);
                    reject(apiResponse);
                } else {
                    result.userId = resultObj.userId;
                    result.userDetails = resultObj;
                    resolve(result);
                }
            });
        });
    }// end of generate Token

    saveToken = (result) => {
        console.log('saveToken');
        return new Promise((resolve, reject) => {
            authModel.findOne({userId: result.userId}, (err, tokenDetails) => {
                if (err) {
                    console.log(err.message);
                    logger.captureError(err.message, 'UserController:SaveToken', 10);
                    let apiResponse = response.format(true, 'Failed to retrive Token', 500, null);
                    reject(apiResponse);
                } else if (Check.isEmpty(tokenDetails)) {
                    console.log('First time Logged');
                    let newToken = new authModel({
                        userId: result.userId,      
                        authToken: result.token,
                        tokenSecret: result.tokenSecret,
                        tokenGenerationTime: time.now()
                    });
                    newToken.save((err, newTokenDetails) => {
                            if (err) {
                                console.log(err);
                                logger.captureError(err.message, 'UserController:SaveToken', 10);
                                let apiResponse = response.format(true, 'Failed to save Token', 500, null);
                                reject(apiResponse);
                            } else {
                                let responseBody = {
                                    authToken : newTokenDetails.authToken,
                                    userDetails: result.userDetails
                                }
                                console.log('token Saved' + newTokenDetails);
                                resolve(responseBody);
                            }
                    });
                } else { // update userAuth and Saving
                    tokenDetails.authToken = result.token,
                    tokenDetails.tokenSecret = result.tokenSecret,
                    tokenDetails.tokenGenerationTime = result.tokenGenerationTime,
                    tokenDetails.save((err, updatedToken) => {
                        if (err) {
                            console.log(err);
                            logger.captureError(err.message, 'UserController:SaveToken', 10);
                            let apiResponse = response.format(true, 'Failed to update Token', 500, null);
                            reject(apiResponse);
                        } else {
                            let responseBody = {
                                authToken : updatedToken.authToken,
                                userDetails:  result.userDetails
                            };
                            console.log('token Updated' + updatedToken);
                            resolve(responseBody);
                        }
                    });
                }
            });// end of find One Cllback
        });// end of promise
    }// end of Save Token

    findUser(req, res)
        .then(validatePassword)
        .then(generateToken)
        .then(saveToken)
        .then((resolve) => {
            let apiResponse = response.format(false, 'Login Successuful', 200, resolve);
            res.status(200);
            res.send(apiResponse);
        })
        .catch((err) => {
            console.log(err);
            res.status(err.status);
            res.send(err);
        })
}// end of Login Function


allUsers = (req,res) => {
    UserModel.find({},(err, result) => {
        if (err) {
            logger.captureError(err.message, 'UserController:login:allUsers', 10);
            let apiResponse = response.format(true, 'Failed to Find all Users', 500, null);
            res.send(apiResponse);
        } else if (Check.isEmpty(result)) {
            logger.captureError(err.message, 'UserController:login:findUser', 10);
            let apiResponse = response.format(true, 'Users not Found', 500, null);
            res.send(apiResponse);
        } else {
            logger.captureInfo('User found', 'UserController:FindUser', 10);
            console.log(result);
            res.send(result);
        }
    })

}// end of allUsers

logout = (req, res) => {
    authModel.findOneAndRemove({userId : req.body.userId},(err, result) => {
        if (err) {
            logger.captureError(err, 'UserController:login:logout', 10);
            let apiResponse = response.format(true, 'Failed to logout', 500, null);
            res.send(apiResponse);
        } else if (Check.isEmpty(result)) {
            logger.captureError(err, 'UserController:logout:findUser', 10);
            let apiResponse = response.format(true, 'AlreadyLoggedOut or Invalid', 500, null);
            res.send(apiResponse);
        } else {
            logger.captureInfo('User found', 'UserController:FindUser', 10);
            console.log(result);
            console.log('Logout Called');
            let apiResponse = response.format(true, 'LoggedOut Successufully', 200, result);
            res.send(apiResponse);
        }
    });
}


module.exports = {
    signUp: signUp,
    login: login,
    allUsers: allUsers,
    logout: logout
}