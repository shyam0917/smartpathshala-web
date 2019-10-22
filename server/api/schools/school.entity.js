const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const autoIncrement = require('mongoose-auto-increment');
const config = require('./../../config');
const db = config.db;
let connection=mongoose.connect(db.MONGO.URL);
autoIncrement.initialize(connection);

const SchoolSchema = new Schema({
  schoolName: String,
  schoolId:Number,
  // loginId:{type: String, required: true, unique: true},
  email: {type: String, required: true, unique: true},
  address: String,
  phoneNo: String,
  website: String,
  city: String,
  state: String,
  zipCode: Number,
  createdOn: { type: Date, default: Date.now },
  status: { type: String, default: 'Active'},
  categories: [{
   type: Schema.Types.ObjectId,
   ref:'categories' //for assign course to school
 }],
 updatedOn:  { type: Date },
});

SchoolSchema.plugin(autoIncrement.plugin, {
  model: 'school',
  field: 'schoolId',
  startAt: 101,
  incrementBy: 1
});


const School = mongoose.model('school', SchoolSchema);

module.exports = School;
