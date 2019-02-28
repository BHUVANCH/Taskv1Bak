routeLogger = (req, res, next) => {
    let remoteIp = req.connection.remoteAddress + '://' + req.connection.remotePort;
    let realIp = req.headers['X-Real-IP'];

    console.log(remoteIp, realIp);
    console.log(`${req.method} request from ${remoteIp} for route ${req.originalUrl}`);

    if (req.method === 'OPTIONS') {
        console.log('!OPTIONS');
        var headers = {};
        // IEB does not Allow domains to be specified , just *
        // headers['Access-Control-Allow-Origin'] = req.headers.origin;
        headers['Access-Control-Allow-Origin'] = '*';
        headers['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE';
        headers['Access-Control-Allow-Credentials'] = false;
        headers['Access-Control-Max-Age'] = '86400'; /// 24 hours
        headers['Access-Control-Allow-Headers'] = "Origin, X-Requested-With, Content-Type, Accept";
        res.writeHead(200, headers);
        res.end();
    } else {

        // enable or disable Cors Here 
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        // res.header('Access-Control-Max-Age', 60 * 60 * 24 * 365);
        // console.log(res.header);
        // end of CORS Config
        next();
    }

}

module.exports = {
    routeLogger: routeLogger
}