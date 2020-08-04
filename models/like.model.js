const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let likeSchema = new Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel'
    },
    posts: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'postsModel'
    }
    // comments: [{
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'CommentModel'
    // }]
});

// Export the model
module.exports = mongoose.model('LikeModel', likeSchema);