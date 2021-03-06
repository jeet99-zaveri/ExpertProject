const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let facultySchema = new Schema({
    firstName: {
        type: String,
        required: 'This field is required.'
    },
    middleName: {
        type: String,
        required: 'This field is required.'
    },
    lastName: {
        type: String,
        required: 'This field is required.'
    },
    dob: {
        type: String,
        required: 'This field is required.'
    },
    gender: {
        type: String,
        required: 'This field is required.'
    },
    address: {
        type: String,
        required: 'This field is required.'
    },
    designation: {
        type: String,
        required: 'This field is required.'
    },
    salary: {
        type: String,
        required: 'This field is required.'
    },
    joiningDate: {
        type: String,
        required: 'This field is required.'
    },
    email: {
        type: String,
        required: [true, "Email Field Is Required"],
        // validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please Enter a Valid Email']
    },
    contactNo: {
        type: String,
        required: 'This field is required'
    }
});

let validateEmail = (email) => {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

// Export the model
module.exports = mongoose.model('FacultyModel', facultySchema);