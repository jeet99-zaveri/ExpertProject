const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let postsSchema = new Schema({
    name: {
      type: String,
      minlength: [2, 'Name Should Be At Least 2 Characters Long'],
      maxlength: [30, "Name Can't Be Longer Than 30 Characters"],
      required: [true, "Name Field Is Required"]
    },
    description: {
      type: String,
      minlength: [10, 'Description Should Be At Least 10 Characters Long'],
      maxlength: [50, "Description Can't Be Longer Than 50 Characters"],
      required: [true, "Description Field Is Required"]
    },
    image: { // TODO
      type: String
    },
    created_at: {
      type: Date,
      default: Date.now
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserModel'
    },
    comments: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CommentModel'
    }],
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LikeModel'
    }]
});

// Export the model
module.exports = mongoose.model('postsModel', postsSchema);