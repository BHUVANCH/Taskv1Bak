const response = require('../libraries/standard');
errorHandler = (err, req, res, next) => {
    console.log('application Error Handler Function Called');
    console.log(err);
    let apiResponse = response.format(true,'Some error occured at Global Level', 500, null);
    res.send(apiResponse);
} // en dof Ip Logger Function

notFoundHandler = (req, res, next) => {

    console.log('Global Not Found Handler Called');
    let apiResponse = response.format(true,'Route Not Found in the Application', 404, null);
    res.send(apiResponse);

}// end Of not Found Handler

module.exports = {
    globalErrorHandler: errorHandler,
    globalNotFoundHandler: notFoundHandler
}
