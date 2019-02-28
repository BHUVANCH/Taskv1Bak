const appConfig = require('../../config/config');
const chatController = require('../conntroller/chatController');
const Auth = require('../middleware/auth');

setRouter = (app) => {

    let baseUrl = `${appConfig.appConfig.apiversion}/chat`;

    app.get(`${baseUrl}/all`, Auth.isAuthorized, chatController.all);

    app.get(`${baseUrl}/get/for/user`, Auth.isAuthorized, chatController.getChat);

    // return this.http.get(`${this.url}api/v1/chat/get/for/user?senderId=${senderId}&receiverId=${receiverId}
    // &skip=${skip}&authToken=${Cookie.get('authToken')}`) Auth.isAuthorized,


}

module.exports ={
    setRouter : setRouter
}