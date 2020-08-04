/* ********** MODELS ********** */

const postsModel = require('../models/posts.model');
const UserModel = require('../models/user.model');
const CommentModel = require('../models/comment.model');
const LikeModel = require('../models/like.model');

/* ********** OPERATIONS ********** */

/* ********** GET ALL ********** */

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
    image: req.body.image,
    author: req.user._id
  });

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
    } else {
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

  // console.log("\n\n\n\n\n******************************")
  // console.log("USAO U READ")
  // console.log("******************************")

  let correctUser = false;
  let alreadyLiked = false;
  let likeID;

  // Find posts 

  postsModel.findById(req.params.id, (error, posts) => {

    // console.log("******************************")
    // console.log("posts FIND")
    // console.log(posts);
    // console.log("******************************")

    if (!posts)
      return next(); // Failed To Cast Ako Nema Slike

    if (error) {
      return next(error);
    }

    // Find User For That posts 

    UserModel.findById(posts.author, (error, user) => {

      // console.log("******************************")
      // console.log("USER FIND")
      // console.log(user);
      // console.log("******************************")

      if (error)
        return next(error);

      // console.log("REQ: " + req.user);
      // console.log("U: " + user);

      // Check If User Is Author So He Can Edit And Delete posts

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

    if (error) {
      return next(error);
    }

    UserModel.findById(posts.author, (error, user) => {
      if (error)
        return next(error);


      // console.log("REQ: " + req.user);
      // console.log("U: " + user);

      if (req.user && user && String(req.user._id) == String(user._id)) {
        correctUser = true
      }

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

    // console.log("\n\n\nposts: " + posts.author + ".");
    // console.log("AUTHOR: " + req.user._id + ".\n\n\n\n");

    let omg1 = String(posts.author);
    let omg2 = String(req.user._id);

    if (omg1 == omg2) {
      // console.log("DSADSADAS");
    }

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

// exports.update = (req, res) => {
//   postsModel.findOneAndUpdate({
//     _id: req.body._id,
//   }, req.body, {
//       new: true,
//       runValidators: true
//   }, (error, posts) => {

//     console.log(posts);
//     if(!error){
//       req.flash('updatedposts', 'posts "' + req.body.name + '" Successfully Updated.')
//       res.redirect('/posts/' + req.params.id);
//     }else{
//       if(error.name == "ValidationError"){
//         handleValidationErrors(error, req.body);
//         res.render("posts/createORupdate", {
//           title: 'Update posts "' + req.body.name + '".',
//           posts: posts,
//           updating: true
//         });
//       }else{
//         console.log("Error: " + error);
//       }
//     }
//   });
// };

/* ********** DELETE ********** */

exports.delete = (req, res, next) => {
  postsModel.findByIdAndRemove(req.params.id, (error, posts) => {
    if (error) {
      return next(error);
    }

    LikeModel.find((error, likes) => {
      likes.forEach((like) => {
        if (String(like.posts) == String(req.params.id)) {

          // Pre Brisanja Likea Moramo Iz User Likes Arraya Da Izbrisemo Like

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


    // Moram Izbrisati Iz User postss Ovaj posts I Sve Komentare Vezane Za Taj Film Kao i Kad Brisem Komentare Onda I Iz Usera Moram Komentare || Ovo mora da moze lakse

    UserModel.findById(posts.author, (error, user) => {
      if (error)
        return next(error);

      // const index = user.postss.indexOf(req.params.id);
      // if (index > -1) {
      //   user.postss.splice(index, 1);
      // }

      user.postss.pull({ _id: req.params.id });
      user.save();
    });

    CommentModel.find((error, comments) => {
      comments.forEach((comment) => {
        if (String(comment.posts) == String(req.params.id)) {

          // Pre Brisanja Komentara Moramo Iz User Comments Arraya Da Izbrisemo Comment

          UserModel.findById(comment.author, (error, user) => {
            if (error)
              return next(error);

            // const index = user.comments.indexOf(comment._id);
            // if (index > -1) {
            //   user.comments.splice(index, 1);
            // }


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