const postsModel = require('../models/posts.model');
const UserModel = require('../models/user.model');
const CommentModel = require('../models/comment.model');
const LikeModel = require('../models/like.model');

var sorts = { created_at: -1 };
exports.getAll = function (req, res) {
  postsModel.find((error, postss) => {
    if (error) {
      console.log('Error | getAllpostss.' + error);
    } else {

      let dates = new Array();
      let options = { year: 'numeric', month: 'long', day: 'numeric' };

      postss.forEach((posts) => {
        let date = posts.created_at;
        date = date.toLocaleDateString("en-US", options);
        dates.push(date);
      });

      res.render('index', {
        layout: 'main',
        createdposts: req.flash('createdposts'),
        deletedposts: req.flash('deletedposts'),
        userRegistered: req.flash('userRegistered'),
        userLoggedOut: req.flash('userLoggedOut'),
        alreadyLoggedIn: req.flash('alreadyLoggedIn'),
        message: req.flash('error'),
        success: req.flash('success'),
        postss: postss,
        dates: dates
      });
    }
  }).sort(sorts).populate('author');
};


/* ********** CREATE ********** */
exports.createView = (req, res) => {
  res.render('posts/createORupdate', {
    title: 'Suggest New posts',
    layout: 'main'
  });
};

exports.create = (req, res, next) => {
  // Create posts Object
  let posts = new postsModel({
    name: req.body.name,
    description: req.body.description,
    image: req.file.path,
    author: req.user._id
  });

  //console.log(req.file.path);


  // Save posts
  posts.save((error) => {
    if (!error) {
      // Push posts User postss Array | Relationships
      UserModel.findById(posts.author, (error, user) => {
        if (error)
          return next(error);

        user.postss.push(posts._id);
        user.save();
      });

      req.flash('createdposts', 'posts "' + req.body.name + '" Successfully Suggested.')
      res.redirect('/');
    } 
    else 
    {
      if (error.name == 'ValidationError') {
        handleValidationErrors(error, req.body);
        res.render("posts/createORupdate", {
          title: "Suggest New posts",
          posts: req.body,
          userLel: req.user
        });
      }
      else
        console.log("Error: " + error);
    }
  });
};

/* ********** READ ********** */
exports.read = (req, res, next) => {
  let correctUser = false;
  let alreadyLiked = false;
  let likeID;

  // Find posts 
  postsModel.findById(req.params.id, (error, posts) => {
    if (!posts)
      return next();

    if (error) 
      return next(error);

    // Find User For That posts 
    UserModel.findById(posts.author, (error, user) => 
    {
      if (error)
        return next(error);

      if (req.user && user) {
        if (req.user.usertype == "admin") {
          correctUser = true;
          adminUser = true;
        }
        else if(String(req.user._id) == String(user._id)){
          correctUser = true;
        }
        else{
          correctUser = false;
        }
      }

      // Check To See If User Already Liked The posts 
      if (req.user) {
        posts.likes.forEach((like) => {
          req.user.likes.forEach((userLike) => {
            if (String(like) == String(userLike)) {
              alreadyLiked = true;
              likeID = like;
            }
          });
        });
      }

      let options = { year: 'numeric', month: 'long', day: 'numeric' };
      let date = posts.created_at;
      date = date.toLocaleDateString("en-US", options);

      var path = posts.image;
      let cutted = path.slice(7);
      console.log("New Path :: " + cutted);

      res.render('posts/read', 
      {
        layout: 'main',
        posts: posts,
        date: date,
        imageCutted: cutted,
        updatedposts: req.flash('updatedposts'),
        notAuthorized: req.flash('notAuthorized'),
        createdComment: req.flash('createdComment'),
        updatedComment: req.flash('updatedComment'),
        deletedComment: req.flash('deletedComment'),
        createdLike: req.flash('createdLike'),
        deletedLike: req.flash('deletedLike'),
        user: user,
        correctUser: correctUser,
        alreadyLiked: alreadyLiked,
        likeID: likeID,
      });
    });
  }).populate({
    path: 'comments',
    populate: {
      path: 'author',
      model: 'UserModel',
      populate: {
        path: 'likes',
        model: 'LikeModel'
      }
    }
  });
};

// SAME AS ABOVE, ONLY ONE DIFFERENCE, OPTIMIZE THIS !!!!!!!!!!!! TODO 
exports.readComment = (req, res, next) => {
  let correctUser = false;
  let alreadyLiked = false;
  let likeID;
  let commentID = req.params.commentID;

  postsModel.findById(req.params.id, (error, posts) => {
    if (error) 
      return next(error);

    UserModel.findById(posts.author, (error, user) => {
      if (error)
        return next(error);
      if (req.user && user && String(req.user._id) == String(user._id)) {
        correctUser = true
      }

      if (req.user) 
      {
        posts.likes.forEach((like) => {

          req.user.likes.forEach((userLike) => {
            if (String(like) == String(userLike)) {
              alreadyLiked = true;
              likeID = like;
            }
          });

        });
      }

      let options = { year: 'numeric', month: 'long', day: 'numeric' };
      let date = posts.created_at;
      date = date.toLocaleDateString("en-US", options)

      res.render('posts/read', {
        layout: 'main',
        posts: posts,
        date: date,
        updatedposts: req.flash('updatedposts'),
        notAuthorized: req.flash('notAuthorized'),
        createdComment: req.flash('createdComment'),
        updatedComment: req.flash('updatedComment'),
        deletedComment: req.flash('deletedComment'),
        createdLike: req.flash('createdLike'),
        deletedLike: req.flash('deletedLike'),
        user: user,
        correctUser: correctUser,
        alreadyLiked: alreadyLiked,
        likeID: likeID,
        commentID: commentID,
      });
    });
  }).populate({
    path: 'comments',
    populate: {
      path: 'author',
      model: 'UserModel',
      populate: {
        path: 'likes',
        model: 'LikeModel'
      }
    }
  });
};

/* ********** UPDATE ********** */
exports.updateView = (req, res, next) => {
  postsModel.findById(req.params.id, (error, posts) => {
    if (error) {
      return next(error);
    }

    let omg1 = String(posts.author);
    let omg2 = String(req.user._id);

    if (omg1 != omg2) {
      req.flash('notAuthorized', 'Not Authorized.');
      res.redirect('/posts/' + posts._id);
    } else {
      res.render('posts/createORupdate', {
        title: 'Update posts "' + posts.name + '".',
        layout: 'main',
        posts: posts,
        updating: true,
      });
    }
  });
};

exports.update = (req, res, next) => {
  postsModel.findByIdAndUpdate(req.params.id, {
    $set: req.body
  }, (error, posts) => {
    if (error)
      return next(error);

    req.flash('updatedposts', 'posts "' + req.body.name + '" Successfully Updated.')
    res.redirect('/posts/' + req.params.id);
  });
};

/* ********** DELETE ********** */
exports.delete = (req, res, next) => {
  postsModel.findByIdAndRemove(req.params.id, (error, posts) => {
    if (error) {
      return next(error);
    }

    LikeModel.find((error, likes) => {
      likes.forEach((like) => {
        if (String(like.posts) == String(req.params.id)) {
          UserModel.findById(like.author, (error, user) => {
            if (error)
              return next(error);
            user.likes.pull({ _id: like._id });
            user.save();
          });
          like.remove();
        }
      })
    });

    UserModel.findById(posts.author, (error, user) => {
      if (error)
        return next(error);
      user.postss.pull({ _id: req.params.id });
      user.save();
    });

    CommentModel.find((error, comments) => {
      comments.forEach((comment) => {
        if (String(comment.posts) == String(req.params.id)) {
          UserModel.findById(comment.author, (error, user) => {
            if (error)
              return next(error);
            user.comments.pull({ _id: comment._id });
            user.save();
          });
          comment.remove();
        }
      });
    });

    req.flash('deletedposts', 'posts "' + posts.name + '" Successfully Deleted.')
    res.redirect('/');
  });
};

/* ********** METHODS ********** */
function handleValidationErrors(error, body) {
  for (field in error.errors) {
    switch (error.errors[field].path) {
      case 'name':
        body['nameError'] = error.errors[field].message;
        break;
      case 'description':
        body['descriptionError'] = error.errors[field].message;
        break;
    }
  }
}