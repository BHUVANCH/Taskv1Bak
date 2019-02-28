const jwt = require('jsonwebtoken');
// Creating shortid, secretKey for payload Object
const secretKey = 'SomeRandomTextKey';
const shortid = require('shortid');

generateToken = (data, cb) => {
    payload = {
        jwtid: shortid.generate(),
        iat: Date.now(),
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24),
        data: data,
        iss: 'NodeChat',
        sub: 'authToken',
    }
    jwt.sign(payload, secretKey, (err, token) => {
        if (err) {
            console.log('Token Generation Error' + err);
            cb(err, null);
        } else {
            let tokenDetails ={
                token: token,
                tokenSecret: secretKey
            }
            cb(null, tokenDetails);
        }
    }); // end of Generate Token
}

verifyClaim = (authToken, secretKey, cb) => {
jwt.verify(authToken, secretKey, (err, decoded) => {
    // var decoded = jwt.decode(token, {complete: true});
    if (err) {
        console.log('Token Verification Error');
        console.log(err);
        cb(err, null)
    } else {
        console.log('userVerified');
        console.log(decoded);
        cb(null, decoded);
    }
});
}// end of verifyClaim

verifyClaimWithOutSecret = (authToken, cb) => {
    jwt.verify(authToken, secretKey, (err, decoded) => {
        // var decoded = jwt.decode(token, {complete: true});
        if (err) {
            console.log('Token Verification Error');
            console.log(err);
            cb(err, null)
        } else {
            console.log('userVerified');
            console.log(decoded);
            cb(null, decoded);
        }
    });// end of verifyClaimWithOutSecret


}


module.exports = {
    generateToken: generateToken,
    verifyClaim: verifyClaim,
    verifyClaimWithOutSecret: verifyClaimWithOutSecret
}