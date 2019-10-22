const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AssessmentSchema = new Schema({
  assessment : { type : String, required : true },
  type : { type : String, required : true },
  level: { type :  String},
  totalMarks: { type : Number, required : true },
  passPercentage: { type : Number, required : true },
  tags: { type : Array },
  courseId: { type :  String},
  topics: [{ type : String }],
  subTopics: [ {type : String }],
  maxTime: { type : Number },
  insAtStart: { type : String },
  insAtTheEnd: { type : String },
  showFeedbackAt: { type : String },
  showScoreAt: { type : String },
  shuffleAns: { type : String },
  maxAttempts: { type : String },
  totalQuestion: { type : Number, required : true },
  status: { type : String, required : true },
  questions: [{ 
    qusId: { type: Schema.Types.ObjectId, ref: 'questions' },
    question: String,
    qusType: String,
    hint: String,
    level: String,
    //options: Array,
    //answers: Array,
    //topicId: Schema.Types.ObjectId,
    //subTopicId: Schema.Types.ObjectId,
    solution: String,
    maxTime: { type : Number },
    marks: { type : Number, required : true },
    qusCategories: Array,
    courseId: Array,
    topicId: Array,
    subTopicId: Array,
    options: [{
      id: String,
      text: String,
      icon: String
    }],
    answers: [{
      id: String,
    }],
    qusIcon: String,
    solutionIcon: String,
  }],
  createdBy:{
   id: { type: Schema.Types.ObjectId, ref: 'users'},
   role: { type : String },
   date:{ type: Date, default: Date.now }
 }, 
 updatedBy:{
   id: { type: Schema.Types.ObjectId, ref: 'users'},
   role: { type : String },
   date:{ type: Date }
 },
 deletedBy:{
   id: { type: Schema.Types.ObjectId, ref: 'users'},
   role: { type : String },
   date:{ type: Date }
 },
 ratings: [{
   ratedBy: { type: Schema.Types.ObjectId, ref: 'users'},
   role: { type : String },
   rating: { type : Number },
   date:{ type: Date }
 }],
 feedback: [{
   givenBy: { type: Schema.Types.ObjectId, ref: 'users'},
   role: { type : String},
   description: { type : Number},
   date:{ type: Date }
 }],
});

const Assessment = mongoose.model('assessments', AssessmentSchema);

module.exports = Assessment;