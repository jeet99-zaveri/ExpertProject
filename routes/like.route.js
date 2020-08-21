const express = require('express');
const router = express.Router();
const likeController = require('../controllers/like.controller');

router.post('/posts/:id/likes/create', ensureAuthenticated, likeController.create);
router.post('/posts/:id/likes/delete/:likeid', ensureAuthenticated, likeController.delete);

function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }else{
    req.flash('notLoggedIn', "Please Login.");
    res.redirect('/login');
  }
}

module.exports = router;