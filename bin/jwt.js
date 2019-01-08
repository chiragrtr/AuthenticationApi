const expressJwt = require('express-jwt');
const config = require('../configurations.json');
const userService = require('../users/user.service');

module.exports = jwt;

function jwt(){
    const secret = config.secret;
    return expressJwt({secret, isRevoked}).unless({
        path: [
            '/login',
            '/create',
            '/forgot',
            '/reset'
        ]
    })
}

async function isRevoked(req, payload, done){
    const user = await userService.getById(payload.sub);
    if(!user){
        return done(null, true);
    }
    done();
}