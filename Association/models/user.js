const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/testingDB')
.then(() => {
    console.log("Connected to MongoDB successfully!");
})
.catch((err) => {
    console.error("MongoDB connection error:", err);
});

const userSchema = new mongoose.Schema({
   name: String,
    email:  { type: String, unique: true },
    password: String,

    age: Number,
    post: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
}]


});

const User = mongoose.model('User', userSchema);
module.exports = User;
