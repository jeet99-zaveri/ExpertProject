const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let commentSchema = new Schema({
    body: {
      type: String,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel'
    },
    posts: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'postsModel'
    },
    created_at: {
      type: Date,
      default: Date.now
    },
});

// Export the model
module.exports = mongoose.model('CommentModel', commentSchema);