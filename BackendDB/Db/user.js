const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/Users');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('User', userSchema);
