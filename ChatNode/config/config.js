let appConfig = {};

appConfig.port= 3000;
appConfig.environment= "dev";
appConfig.apiversion= "/api/v1";
appConfig.allowedCorsOrigin= "*";
appConfig.database = {
    uri: "mongodb://127.0.0.1:27017/blogApp"
} 

module.exports = {
    appConfig : appConfig
}// end of Module Exports

//returns the object of current module when it is required by another Module
