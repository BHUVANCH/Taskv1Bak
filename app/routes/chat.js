const appConfig = require('../../config/config');
const chatController = require('../conntroller/chatController');
const Auth = require('../middleware/auth');

setRouter = (app) => {

    let baseUrl = `${appConfig.appConfig.apiversion}/chat`;

    app.get(`${baseUrl}/all`, Auth.isAuthorized, chatController.all);

    app.get(`${baseUrl}/get/for/user`, Auth.isAuthorized, chatController.getChat);

}

module.exports ={
    setRouter : setRouter
}