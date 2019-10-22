const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TeacherSchema = new Schema({
      firstName:String,
      lastName:String,
      code:String,
      email:{type : String, unique : true, required : true},
      phoneNo:String,
      schoolName:String,
      gender:String,
      status:String,
      regDate: { type: Date, default: Date.now },
      // userId : {type : String, unique : true, required : true},
      updatedOn:  { type: Date, default: Date.now },
},{collection:"teacher"});


const Teacher = mongoose.model('teacher', TeacherSchema);

module.exports = Teacher;
