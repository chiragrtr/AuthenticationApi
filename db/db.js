const config = require('../configurations.json');
const mongoose = require('mongoose');
mongoose.connect(config.connectionString, {useNewUrlParser: true});

// Make mongoose use the global Promise as its own Promise is deprecated
mongoose.Promise = Promise;

module.exports = {
    User: require('../users/user.model')
};