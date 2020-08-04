/* ********** MODELS ********** */

const postsModel = require('../models/posts.model');
const UserModel = require('../models/user.model');
const CommentModel = require('../models/comment.model');
const LikeModel = require('../models/like.model');

/* ********** OPERATIONS ********** */

    /* ********** CREATE ********** */

        exports.create = (req, res, next) => {
            let postsName; // We Need This Name When We Redirect

            // Create Like Object

            let like = new LikeModel({
                author: req.user._id,
                posts: req.params.id
              });

              // Save Like
            
              like.save(async (error) => {
                if(!error){

                // Push Like To posts / User Likes Array | Relationships
            
                await UserModel.findById(like.author, (error, user) => {
                    if(error)
                      return next(error);
                
                    user.likes.push(like._id);
                    user.save();    
                  });
            
                  await postsModel.findById(like.posts, (error, posts) => {
                    if(error)
                      return next(error);
                
                    postsName = posts.name;
                    posts.likes.push(like._id);
                    posts.save();    
                  });
            
                  req.flash('createdLike', 'posts "' + postsName + '" Liked.');
                  res.redirect('/posts/' + req.params.id);
                }else{
                    return next(error);
                }
              });
        };

    /* ********** DELETE ********** */

        exports.delete = (req, res, next) => {
          let postsName; // For Redirect

          LikeModel.findByIdAndRemove(req.params.likeid, async (error, like) => {
            if(error){
              return next(error);
            }

            // Remove Like From posts / User Likes Array | Relationships

            await UserModel.findById(like.author, (error, user) => {
              if(error)
                return next(error);
          
                // const index = user.postss.indexOf(req.params.id);
                // if (index > -1) {
                //   user.postss.splice(index, 1);
                // }

              user.likes.pull({_id: req.params.likeid});
              user.save(); 
            });

            await postsModel.findById(like.posts, (error, posts) => {
              if(error)
                return next(error);
          
                // const index = user.postss.indexOf(req.params.id);
                // if (index > -1) {
                //   user.postss.splice(index, 1);
                // }

              postsName = posts.name;
              posts.likes.pull({_id: req.params.likeid});
              posts.save(); 
            });

            req.flash('deletedLike', 'posts "' + postsName + '" Unliked.');
            res.redirect('/posts/' + req.params.id);
          });
        };