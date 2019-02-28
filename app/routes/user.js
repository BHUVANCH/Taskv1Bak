const appConfig = require('../../config/config');
const userController = require('../conntroller/userController');
const auth = require('../middleware/auth');

let setRouter =(app) => {
    let baseUrl = `${appConfig.appConfig.apiversion}/users`;

        app.post(`${baseUrl}/signup`, userController.signUp);
        app.post(`${baseUrl}/login`, userController.login);
        app.get(`${baseUrl}/all`, auth.isAuthorized, userController.allUsers);
        app.post(`${baseUrl}/logout`, userController.logout);

}

module.exports = {
    setRouter : setRouter
}