var mongoose = require('mongoose');

var loginSchema = new mongoose.Schema({
    name: {
        type: String
    },
    contact: {
        type: String
    },
    username: {
        type: String
    },
    password: {
        type: String
    },
});

module.exports = mongoose.model('login', loginSchema);