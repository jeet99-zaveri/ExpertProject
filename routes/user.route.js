const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

router.get('/login', ifLoggedIn, userController.loginView);
router.post('/login', ifLoggedIn, userController.login);
router.post('/', ifLoggedIn);
router.get('/logout', userController.logout);
router.get('/users/:id', userController.profileView);


/******** FACULTY MANAGE *************/
router.get('/mngFaculty', ensureAuthenticated, userController.mngFacultyView);
router.post('/mngFaculty', ensureAuthenticated, userController.mngFaculty);
router.get('/mngFaculty/:id', ensureAuthenticated, userController.updateFaculty);
router.get('/viewFaculty', ensureAuthenticated, userController.viewFaculty);
router.post('/viewFaculty', ensureAuthenticated, userController.viewFacultyPost);


/******************* EXPERT MANAGE ******************/
router.get('/mngExpert', ensureAuthenticated, userController.mngExpertView);
router.post('/mngExpert', ensureAuthenticated, userController.mngExpert);
router.get('/mngExpert/:id', ensureAuthenticated, userController.updateExpert);
router.get('/viewExpert', ensureAuthenticated, userController.viewExpert);
router.post('/viewExpert', ensureAuthenticated, userController.viewExpertPost);
router.get('/mngExpert/delete/:id', ensureAuthenticated, userController.deleteExpert);


/**************** STUDENT MANAGE  *****************/
router.get('/mngStudent', ensureAuthenticated, userController.mngStudentView);
router.post('/mngStudent', ensureAuthenticated, userController.mngStudent);
router.get('/mngStudent/:id', ensureAuthenticated, userController.updateStudent);
router.get('/viewStudent', ensureAuthenticated, userController.viewStudent);
router.post('/viewStudent', ensureAuthenticated, userController.viewStudentPost);


/********* MANAGE SUBJECT *********/

router.get('/mngSubject', ensureAuthenticated, userController.mngSubjectView);
router.post('/mngSubject', ensureAuthenticated, userController.mngSubject);
router.get('/mngSubject/delete/:id', ensureAuthenticated, userController.deleteSubject);


function ifLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    req.flash('alreadyLoggedIn', "Please Logout Before Doing That.");
    res.redirect('/');
  } else {
    return next();
  }
}

function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }else{
    req.flash('notLoggedIn', "Please Login.");
    res.redirect('/login');
  }
}

module.exports = router;