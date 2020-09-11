const express = require('express');
const router = express.Router();
const postsController = require('../controllers/posts.controller');
const path = require('path');
const multer = require('multer');

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/upload')
    },
    filename: (req, file, cb) => {
        let ext = path.extname(file.originalname)
        cb(null, Date.now() + ext)
    }
})


var upload = multer({
    storage: storage,
    fileFilter: (req, file, callback) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            callback(null, true)
        }
        else {
            console.log("Only image files are supported..")
            callback(null, false)
        }
    },
    limits: {
        fileSize: 1024 * 1024 * 10
    }
})


router.get('/', postsController.getAll);
router.get('/posts/create', ensureAuthenticated, postsController.createView);
router.post('/posts/create',upload.single('image') , postsController.create);
router.get('/posts/:id', postsController.read);
router.get('/posts/:id/comment/:commentID', postsController.readComment);
router.get('/posts/update/:id', ensureAuthenticated, postsController.updateView);
router.post('/posts/update/:id', ensureAuthenticated, postsController.update);
router.post('/posts/delete/:id', ensureAuthenticated, postsController.delete);

function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }else{
    req.flash('notLoggedIn', "Please Login.");
    res.redirect('/login');
  }
}

// function ensureAuthenticatedCreate(req, res, next) {
//   if(req.isAuthenticated()){
//     return next();
//   }else{
//     req.flash('notLoggedIn', "Please Login.");
//     res.redirect('/login');
//   }
// }
 


/*
var Storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'public/upload');
    },
    filename:function(req,file,cb){
        cb(null,file.fieldname + '_' + Date.now() + path.extname(file.originalname));
    }
})
var upload = multer({
        storage:Storage
    })
router.post('/siteDetails',upload.single('image'),(req,res)=>{
    insertsite(req,res);

     site.imgpath = req.file.filename;
});


*/ 

module.exports = router;