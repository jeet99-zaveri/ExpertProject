/* ********** MODELS ********** */

const UserModel = require('../models/user.model');
const FacultyModel = require('../models/faculty.model');
const ExpertModel = require('../models/expert.model');
const StudentModel = require('../models/student.model');
const SubjectModel = require('../models/subject.model');
const bcrypt = require('bcryptjs');
const passport = require('passport');

/* ********** OPERATIONS ********** */


/* ********** LOGIN ********** */

exports.loginView = (req, res) => {
  res.render('user/login', {
    title: 'Login Here',
    layout: 'main',
    registering: false,
    message: req.flash('error'),
    notLoggedIn: req.flash('notLoggedIn')
  });
};

exports.login = (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
    successFlash: true,
  })(req, res, next);

  req.flash('success', 'Welcome Back "' + req.body.username + '".');
};

/* ********** LOGOUT ********** */

exports.logout = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash('notLoggedIn', "Please Login.");
    res.redirect('/login');

    return (next);
  }

  req.flash('userLoggedOut', 'See Ya Later "' + req.user.email + '".');
  req.logout();
  res.redirect('/');
};

/* ********** PROFILE ********** */

exports.profileView = (req, res, next) => {
  UserModel.findById(req.params.id, (error, user) => {
    if (error) {
      return next(error);
    }

    res.render('user/profile', {
      // title: 'Update posts "' + posts.name + '".',
      layout: 'main',
      user: user,
    });
  }).populate('postss').populate('comments').populate({
    path: 'likes',
    populate: {
      path: 'posts',
      model: 'postsModel',
    }
  });
};


/*********** MANAGE FACULTY *********/

exports.mngFacultyView = (req, res) => {
  res.render('admin/mngFaculty', {
    title: 'Manage Faculty here...',
    layout: 'main'
  });
};

exports.mngFaculty = (req, res, next) => {
  if (req.body._id == '') {
    console.log('DEMO');
    var faculty = new FacultyModel();
    faculty.firstName = req.body.firstName;
    faculty.middleName = req.body.middleName;
    faculty.lastName = req.body.lastName;
    faculty.dob = req.body.dob;
    faculty.gender = req.body.gender;
    faculty.address = req.body.address;
    faculty.designation = req.body.designation;
    faculty.salary = req.body.salary;
    faculty.joiningDate = req.body.joiningDate;
    faculty.email = req.body.email;
    faculty.contactNo = req.body.contactNo;
    console.log(req.body.firstName + " " + req.body.middleName + " " + req.body.lastName);
    console.log(req.body.dob + " " + req.body.address + " " + req.body.designation);
    console.log(req.body.gender + " " + req.body.email + " " + req.body.contactNo);
    console.log(req.body.salary + " " + req.body.joiningDate);
    var temp = 0;
    faculty.save((err) => {
      if (!err) {
        // res.redirect('viewFaculty');

        console.log("Error to nthi aavti...");
        var users = new UserModel();
        users.email = req.body.email;
        users.password = 'password';
        users.usertype = 'Faculty';
        users.facultyID = faculty._id;

        console.log(users.email);
        // for access data on view side we have to use find().populate('Schema').exec((err, result)=>{})
        bcrypt.genSalt(10, (error, salt) => {
          bcrypt.hash(users.password, salt, (error, hash) => {
            if (error) {
              console.log("Error: " + error);

              return next(error);
            }

            users.password = hash;

            users.save((err1) => {
              console.log(users.facultyID);
              if (!err1) {
                res.redirect('/viewFaculty');
                req.flash('success', 'Insert Successfully...');
              }
              else {
                req.flash('error', err1);
              }
            });

          });
        });
      }
      else {
        if (err.name == 'ValidationError') {
          facultyValidation(err, req.body);
          res.render("admin/mngFaculty", {
            viewTitle: "Insert Faculty",
            faculty: req.body
          });
        }
        else
          console.log('Error during record insertion : ' + err);
      }
    });
    // req.flash('success', 'Welcome Back "' + req.body.username + '".');
  }
  else {
    FacultyModel.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
      if (!err) { res.redirect('/viewFaculty'); }
      else {
        if (err.name == 'ValidationError') {
          facultyValidation(err, req.body);
          res.redirect("admin/mngFaculty", {
            viewTitle: 'Update Faculty',
            faculty: req.body
          });
          req.flash('success', 'Record Updated Successfully...');
        }
        else
          console.log('Error during record update : ' + err);
      }
    });
  }



};

exports.viewFaculty = (req, res, next) => {
  FacultyModel.find((err, docs) => {
    if (!err) {
      res.render("admin/viewFaculty", {
        list: docs
      });
    }
    else {
      console.log('Error in retrieving employee list :' + err);
    }
  });
};

exports.viewFacultyPost = (req, res, next) => {
  console.log('AAVYU....');
};


exports.updateFaculty = (req, res, next) => {
  FacultyModel.findById(req.params.id, (err, doc) => {
    if (!err) {
      res.render("admin/mngFaculty", {
        viewTitle: "Update Faculty",
        faculty: doc
      });
    }
  });
};




/***************** MANAGE EXPERTS *********************/

exports.mngExpertView = (req, res) => {
  res.render('admin/mngExpert', {
    title: 'Manage Expert here...',
    layout: 'main'
  });
};

exports.mngExpert = (req, res, next) => {
  if (req.body._id == '') {
    console.log('DEMO');
    var experts = new ExpertModel();
    experts.firstName = req.body.firstName;
    experts.middleName = req.body.middleName;
    experts.lastName = req.body.lastName;
    experts.dob = req.body.dob;
    experts.gender = req.body.gender;
    experts.designation = req.body.designation;
    experts.companyName = req.body.companyName;
    experts.email = req.body.email;
    experts.contactNo = req.body.contactNo;
    console.log(req.body.firstName + " " + req.body.middleName + " " + req.body.lastName);
    console.log(req.body.dob + " " + req.body.companyName + " " + req.body.designation);
    console.log(req.body.gender + " " + req.body.email + " " + req.body.contactNo);
    var temp = 0;
    experts.save((err) => {
      if (!err) {
        // res.redirect('viewFaculty');

        console.log("Error to nthi aavti...");
        var users = new UserModel();
        users.email = req.body.email;
        users.password = 'password';
        users.usertype = 'Expert';
        users.expertID = experts._id;

        console.log(users.email);
        // for access data on view side we have to use find().populate('Schema').exec((err, result)=>{})
        bcrypt.genSalt(10, (error, salt) => {
          bcrypt.hash(users.password, salt, (error, hash) => {
            if (error) {
              console.log("Error: " + error);

              return next(error);
            }

            users.password = hash;

            users.save((err1) => {
              console.log(users.expertID);
              if (!err1) {
                res.redirect('/viewExpert');
                req.flash('success', 'Insert Successfully...');
              }
              else {
                req.flash('error', err1);
              }
            });

          });
        });
      }
      else {
        if (err.name == 'ValidationError') {
          expertValidation(err, req.body);
          res.render("admin/mngExpert", {
            viewTitle: "Insert Expert",
            experts: req.body
          });
        }
        else
          console.log('Error during record insertion : ' + err);
      }
    });
    // req.flash('success', 'Welcome Back "' + req.body.username + '".');
  }
  else {
    ExpertModel.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
      if (!err) { res.redirect('/viewExpert'); }
      else {
        if (err.name == 'ValidationError') {
          expertValidation(err, req.body);
          res.redirect("admin/mngExpert", {
            viewTitle: 'Update Expert',
            experts: req.body
          });
          req.flash('success', 'Record Updated Successfully...');
        }
        else
          console.log('Error during record update : ' + err);
      }
    });
  }
};

exports.deleteExpert = (req, res, next) => {
  ExpertModel.findByIdAndRemove(req.params.id).exec();
  UserModel.findByIdAndRemove(req.params.email).exec();
  res.redirect('/viewExpert');
};


exports.viewExpert = (req, res, next) => {
  ExpertModel.find((err, docs) => {
    if (!err) {
      res.render("admin/viewExpert", {
        list: docs
      });
    }
    else {
      console.log('Error in retrieving employee list :' + err);
    }
  });
};

exports.viewExpertPost = (req, res, next) => {
  console.log('AAVYU....');
};


exports.updateExpert = (req, res, next) => {
  ExpertModel.findById(req.params.id, (err, doc) => {
    if (!err) {
      res.render("admin/mngExpert", {
        viewTitle: "Update Expert",
        experts: doc
      });
    }
  });
};


/*********** MANAGE STUDENT ************/

exports.mngStudentView = (req, res) => {
  res.render('admin/mngStudent', {
    title: 'Manage Student here...',
    layout: 'main'
  });
};

exports.mngStudent = (req, res, next) => {
  if (req.body._id == '') {
    console.log('DEMO');
    var student = new StudentModel();
    student.enrollmentNo = req.body.enrollmentNo;
    student.firstName = req.body.firstName;
    student.middleName = req.body.middleName;
    student.lastName = req.body.lastName;
    student.dob = req.body.dob;
    student.gender = req.body.gender;
    student.address = req.body.address;
    student.motherName = req.body.motherName;
    student.email = req.body.email;
    student.contactNo = req.body.contactNo;
    console.log(req.body.enrollmentNo + " " + req.body.firstName + " " + req.body.middleName + " " + req.body.lastName);
    console.log(req.body.dob + " " + req.body.address + " " + req.body.motherName);
    console.log(req.body.gender + " " + req.body.email + " " + req.body.contactNo);
    var temp = 0;
    student.save((err) => {
      if (!err) {
        // res.redirect('viewFaculty');

        console.log("Error to nthi aavti...");
        var users = new UserModel();
        users.email = req.body.email;
        users.password = 'password';
        users.usertype = 'Student';
        users.studentID = student._id;

        console.log(users.email);
        // for access data on view side we have to use find().populate('Schema').exec((err, result)=>{})
        bcrypt.genSalt(10, (error, salt) => {
          bcrypt.hash(users.password, salt, (error, hash) => {
            if (error) {
              console.log("Error: " + error);

              return next(error);
            }

            users.password = hash;

            users.save((err1) => {
              console.log(users.studentID);
              if (!err1) {
                res.redirect('/viewStudent');
                req.flash('success', 'Insert Successfully...');
              }
              else {
                req.flash('error', err1);
              }
            });

          });
        });
      }
      else {
        if (err.name == 'ValidationError') {
          studentValidation(err, req.body);
          res.render("admin/mngStudent", {
            viewTitle: "Insert Student",
            student: req.body
          });
        }
        else
          console.log('Error during record insertion : ' + err);
      }
    });
    // req.flash('success', 'Welcome Back "' + req.body.username + '".');
  }
  else {
    StudentModel.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
      if (!err) { res.redirect('/viewStudent'); }
      else {
        if (err.name == 'ValidationError') {
          studentValidation(err, req.body);
          res.redirect("admin/mngStudent", {
            viewTitle: 'Update Student',
            student: req.body
          });
          req.flash('success', 'Record Updated Successfully...');
        }
        else
          console.log('Error during record update : ' + err);
      }
    });
  }



};

exports.viewStudent = (req, res, next) => {
  StudentModel.find((err, docs) => {
    if (!err) {
      res.render("admin/viewStudent", {
        list: docs
      });
    }
    else {
      console.log('Error in retrieving employee list :' + err);
    }
  });
};

exports.viewStudentPost = (req, res, next) => {
  console.log('AAVYU....');
};


exports.updateStudent = (req, res, next) => {
  StudentModel.findById(req.params.id, (err, doc) => {
    if (!err) {
      console.log("Ahia Locha chhe..");
      res.render("admin/mngStudent", {
        viewTitle: "Update Student",
        student: doc
      });
    }
  });
};

/********* MANAGE SUBJECT ********/

exports.mngSubjectView = (req, res, next) => {
  SubjectModel.find((err, docs) => {
    if (!err) {
      res.render("admin/mngSubject", {
        list: docs
      });
    }
    else {
      console.log('Error in retrieving employee list :' + err);
    }
  });
};


exports.mngSubject = (req, res, next) => {
  var subject = new SubjectModel();
  subject.subjectName = req.body.subjectName;
  console.log(req.body.subjectName);
  subject.save((err, doc) => {
    if (!err) {
      res.redirect('/mngSubject');
      console.log("Error to nthi aavti...");
    }
    else {
      if (err.name == 'ValidationError') {
        subjectValidation(err, req.body);
        res.render("admin/mngSubject", {
          viewTitle: "Insert Subject",
          subject: req.body
        });
      }
      else
        console.log('Error during record insertion : ' + err);
    }
  });
};

exports.deleteSubject = (req, res, next) => {
  SubjectModel.findByIdAndRemove(req.params.id).exec();
  res.redirect('/mngSubject');
};

/* ********** HOME ********** */

exports.home = (req, res, next) => {
  res.render('/');
  console.log("AAVYU KHARI AHIA FINALLY...");
};

/* ********** METHODS ********** */

function handleValidationErrors(error, body, confirmPasswordError) {
  if (error) {
    for (field in error.errors) {
      switch (error.errors[field].path) {
        case 'username':
          body['usernameError'] = error.errors[field].message;
          break;
        case 'email':
          body['emailError'] = error.errors[field].message;
          break;
        case 'password':
          body['passwordError'] = error.errors[field].message;
          break;
        case 'usertype':
          body['usertypeError'] = error.errors[field].message;
          break;
      }
    }
  }
  if (confirmPasswordError) {
    body['confirmPasswordError'] = 'Passwords Do Not Match.';
  }
}
function facultyValidation(err, body) {
  for (field in err.errors) {
    switch (err.errors[field].path) {
      case 'firstName':
        body['firstNameError'] = err.errors[field].message;
        break;
      case 'middleName':
        body['middleNameError'] = err.errors[field].message;
        break;
      case 'lastName':
        body['lastNameError'] = err.errors[field].message;
        break;
      case 'dob':
        body['dobError'] = err.errors[field].message;
        break;
      case 'gender':
        body['genderError'] = err.errors[field].message;
        break;
      case 'address':
        body['addressError'] = err.errors[field].message;
        break;
      case 'designation':
        body['designationError'] = err.errors[field].message;
        break;
      case 'salary':
        body['salaryError'] = err.errors[field].message;
        break;
      case 'joiningDate':
        body['joiningDateError'] = err.errors[field].message;
        break;
      case 'email':
        body['emailError'] = err.errors[field].message;
        break;
      case 'contactNo':
        body['contactNoError'] = err.errors[field].message;
        break;
      default:
        break;
    }
  }
}
function expertValidation(err, body) {
  for (field in err.errors) {
    switch (err.errors[field].path) {
      case 'firstName':
        body['firstNameError'] = err.errors[field].message;
        break;
      case 'middleName':
        body['middleNameError'] = err.errors[field].message;
        break;
      case 'lastName':
        body['lastNameError'] = err.errors[field].message;
        break;
      case 'dob':
        body['dobError'] = err.errors[field].message;
        break;
      case 'gender':
        body['genderError'] = err.errors[field].message;
        break;
      case 'companyName':
        body['companyNameError'] = err.errors[field].message;
        break;
      case 'designation':
        body['designationError'] = err.errors[field].message;
        break;
      case 'email':
        body['emailError'] = err.errors[field].message;
        break;
      case 'contactNo':
        body['contactNoError'] = err.errors[field].message;
        break;
      default:
        break;
    }
  }
}

function studentValidation(err, body) {
  for (field in err.errors) {
    switch (err.errors[field].path) {
      case 'enrollmentNo':
        body['enrollmentNoError'] = err.errors[field].message;
        break;
      case 'firstName':
        body['firstNameError'] = err.errors[field].message;
        break;
      case 'middleName':
        body['middleNameError'] = err.errors[field].message;
        break;
      case 'lastName':
        body['lastNameError'] = err.errors[field].message;
        break;
      case 'dob':
        body['dobError'] = err.errors[field].message;
        break;
      case 'gender':
        body['genderError'] = err.errors[field].message;
        break;
      case 'address':
        body['addressError'] = err.errors[field].message;
        break;
      case 'motherName':
        body['motherNameError'] = err.errors[field].message;
        break;
      case 'email':
        body['emailError'] = err.errors[field].message;
        break;
      case 'contactNo':
        body['contactNoError'] = err.errors[field].message;
        break;
      default:
        break;
    }
  }
}

function subjectValidation(err, body) {
  for (field in err.errors) {
    switch (err.errors[field].path) {
      case 'subjectName':
        body['subjectNameError'] = err.errors[field].message;
        break;
      default:
        break;
    }
  }
}

