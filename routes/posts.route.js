const express = require('express');
const router = express.Router();

// Require The Controllers

const postsController = require('../controllers/posts.controller');

// Routes

router.get('/', postsController.getAll);
router.get('/posts/create', ensureAuthenticated, postsController.createView);
router.post('/posts/create', ensureAuthenticated, postsController.create);
router.get('/posts/:id', postsController.read);
router.get('/posts/:id/comment/:commentID', postsController.readComment);
router.get('/posts/update/:id', ensureAuthenticated, postsController.updateView);
router.post('/posts/update/:id', ensureAuthenticated, postsController.update);
router.post('/posts/delete/:id', ensureAuthenticated, postsController.delete);

// Access Control

function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }else{
    req.flash('notLoggedIn', "Please Login.");
    res.redirect('/login');
  }
}

// Export Router

module.exports = router;