const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let userSchema = new Schema({
  username: {
    type: String,
    minlength: [2, 'Username Should Be At Least 2 Characters Long'],
    maxlength: [30, "Username Can't Be Longer Than 30 Characters"]
  },
  email: {
    type: String,
    required: [true, "Email Field Is Required"],
    // validate: [validateEmail, 'Please fill a valid email address'],
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please Enter a Valid Email'],
    unique: [true, 'Email must be unique.']
  },
  password: {
    type: String,
    required: [true, "Password Field Is Required"]
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  postss: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'postsModel'
  }],
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CommentModel'
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LikeModel'
  }],
  usertype: {
    type: String,
    required: [true, "UserType Field Is Required"]
  },
  facultyID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FacultyModel'
  },
  expertID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ExpertModel'    
  },
  studentID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StudentModel'
  }
});

let validateEmail = (email) => {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  return re.test(email)
};

// Export the model
module.exports = mongoose.model('UserModel', userSchema);