const mongoose= require('mongoose');



const postSchema = new mongoose.Schema({
    content: String,
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    likes:{
        type:Number,
        default:0

    }
    ,
    likedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ]
    


});
const Post = mongoose.model('Post', postSchema);
module.exports = Post;