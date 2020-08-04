const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var subjectSchema = new Schema({
    subjectName: {
        type: String,
        unique: true,
        required: 'This field is required.'
    }
});

module.exports = mongoose.model('SubjectModel', subjectSchema);