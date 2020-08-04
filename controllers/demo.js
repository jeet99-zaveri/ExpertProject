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


exports.StudentFaculty = (req, res, next) => {
  StudentModel.findById(req.params.id, (err, doc) => {
    if (!err) {
      res.render("admin/mngStudent", {
        viewTitle: "Update Student",
        student: doc
      });
    }
  });
};
