const blogController = require('../conntroller/blogController');
const appConfig = require('./../../config/config');
const logger = require('../middleware/middle');

let setRouter = (app) => {
    // app.get('/hello-World',blogController.bC.helloWorld);
    // app.get('/next',blogController.bC.next);
    // app.get('/example', blogController.bC.example);
    // app.get('/test/route/:firstName/:lastName', blogController.bC.testRoute);
    // app.get('/test/query', blogController.bC.testQuery);
    // app.post('/test/body', blogController.bC.testBody);

    let baseUrl = appConfig.appConfig.apiversion+'/blogs';
    app.get(baseUrl + '/all',blogController.bC.getAllBlogs);
    app.get(baseUrl + '/view/:blogId',logger.myLogger,blogController.bC.viewBlogId);
    app.get(baseUrl + '/view/by/author/:author',blogController.bC.viewByAuthor);
    app.get(baseUrl + '/view/by/category/:category',blogController.bC.viewByCategory);
    app.post(baseUrl + '/:blogId/delete',blogController.bC.deleteBlog);
    app.put(baseUrl + '/:blogId/edit',blogController.bC.editBlog);
    app.post(baseUrl + '/create',blogController.bC.createBlog);
    app.get(baseUrl + '/:blogId/count/view',blogController.bC.increaseBlogView);

}


// the Function is exported
module.exports = {
    setRouter : setRouter
}