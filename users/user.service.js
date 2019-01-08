const config = require('../configurations.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const db = require('../db/db');

const User = db.User;

module.exports = {
    create,
    login,
    forgot,
    reset,
    getById,
    deleteUser
};

async function create(userParam){
    const email = userParam.email;
    const password = userParam.password;
    const name = userParam.name;

    if(!email || !name || !password){
        throw 'All 3 fields: name, email and password are required';
    }
    // Check whether the username already exists
    if(await User.findOne({email})){
        throw 'Email with id ' + email + ' already has an account with us. Please try forgot password';
    }

    const user = new User(userParam);

    // Store the hash and not the password for security
    user.hash = bcrypt.hashSync(password, 10);

    await user.save();
    return email;
}

async function login({email, password}){
    if(!email || !password){
        throw 'All 2 fields: email and password are required';
    }
    const user = await User.findOne({email});
    if(user && bcrypt.compareSync(password, user.hash)){
        const {hash, ...userWithoutHash} = user.toObject();
        const token  = jwt.sign({sub: user.id}, config.secret);
        return {
            ...userWithoutHash,
            token
        };
    }
}

async function forgot({email}) {
    let user = await User.findOne({email});
    if (!user) {
        throw `No user with email ${email} exists`;
    }

    const token = await new Promise((resolve, reject) => {
        crypto.randomBytes(20, (err, buf) => {
            if (err) {
                reject(err);
            }
            resolve(buf.toString('hex'));
        });
    });

    user.resetToken = token;
    return await user.save();
}

async function reset({token, password}){
    const resetToken = token;
    if(!resetToken || !password){
        throw 'All 2 fields: token and password fields are compulsory';
    }

    const user = await User.findOne({resetToken});
    if(!user){
        throw 'Invalid reset token';
    }

    // Save the hash of new password
    user.hash = bcrypt.hashSync(password, 10);
    user.resetToken = undefined;
    // Earlier versions of mongoose required:
    // user.set('resetToken', undefined, {strict: false});
    return await user.save();
}

async function getById(id){
    return await User.findById(id).select('-hash');
}

async function deleteUser(id){
    await User.findByIdAndRemove(id);
}