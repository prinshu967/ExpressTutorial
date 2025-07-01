const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/userDB')
.then(() => {
    console.log("Connected to MongoDB successfully!");
})
.catch((err) => {
    console.error("MongoDB connection error:", err);
});

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    age: Number
});

const User = mongoose.model('User', userSchema);
module.exports = User;
