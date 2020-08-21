const CommentModel = require('../models/comment.model');
const UserModel = require('../models/user.model');
const postsModel = require('../models/posts.model');


/* ********** CREATE ********** */
exports.create = (req, res, next) => {
  // Create Comment Object
    let comment = new CommentModel({
      body: req.body.commentBody,
      author: req.user._id,
      posts: req.body.postsID
    });

  // Save Comment
  comment.save(async (error) => {
    if(!error){
      // Push Comment To posts / User Comments Array | Relationships
      await UserModel.findById(comment.author, (error, user) => {
        if(error)
          return next(error);
        user.comments.push(comment._id);
        user.save();    
      });

      await postsModel.findById(comment.posts, (error, posts) => {
        if(error)
          return next(error);      
        posts.comments.push(comment._id);
        posts.save();    
      });

      req.flash('createdComment', 'Comment Successfully Sent.')
      res.redirect('/posts/' + req.body.postsID);
    }
    else{
      return next(error);
    }
  });
};


/* ********** UPDATE ********** */
exports.update = (req, res, next) => {
  CommentModel.findByIdAndUpdate(req.params.id, {
    body: req.body.commentBodyEdit
  },(error, comment) => {
    if(error)
        return next(error);
    req.flash('updatedComment', 'Comment Successfully Updated.')
    res.redirect('/posts/' + req.body.postsID);
  });
};


/* ********** DELETE ********** */
exports.delete = (req, res, next) => {
  CommentModel.findByIdAndRemove(req.params.id, (error, comment) => {
    if(error){
      return next(error);
    }

    // Remove Comment From posts / User Comments Array
    UserModel.findById(comment.author, (error, user) => {
      if(error)
        return next(error);
      user.comments.pull({_id: req.params.id});
      user.save();
    });

    postsModel.findById(comment.posts, (error, posts) => {
      if(error)
        return next(error);
      posts.comments.pull({_id: req.params.id});
      posts.save();  
    });

    req.flash('deletedComment', 'Comment Successfully Deleted.')
    res.redirect('/posts/' + req.body.postsID);
  });
};