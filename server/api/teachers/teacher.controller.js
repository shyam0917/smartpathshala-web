const uniqid = require('uniqid');
const teacher = require('./teacher.entity');
const logger = require('./../../services/app.logger');
const validation=require('./../../common/validation');
const userModel = require('./../users/users.entity');
const mailer = require('./../../services/mailer');
const appConstant = require('../../constants').app;
const MAIL_CONFIG=appConstant.MAIL_CONFIG;
const uniqueId = require('uuid/v4');

//add teacher
function registerTeacherData(req, res) {
  let teacherData = req.body;

  return new Promise((resolve, reject) => {
    let ifError = validation.validationForm(teacherData);
    if(ifError) {
      resolve({ success: false, msg: 'field blank' });
    }else{
      userModel.findOne({"username":teacherData.email},function(err,user){
        if(user) {
          resolve({ success: false, msg: 'already exist' });
        }
        else {
          // User id is set to email. So disabling it.
           // let userId=uniqid.process(); //generate 12 byte unique id for instructor
           // teacherData.userId=userId; 
           let teacherObj = new teacher(teacherData);
           
           teacherObj.save(function(err, teacherPersistObj) {
            if (err) {
              logger.error('Failed to register teacher teacherData ' + err);
              reject(err);
            } else if(teacherPersistObj) {
              // resolve({ success: true, msg: 'Teacher registered successfully' });
              let teacherCredentials = {
                userId : teacherPersistObj._id,
                username : teacherData.email,
                name :  teacherData.firstName  + " " + teacherData.lastName,
                password : appConstant.USER_DETAILS.DEFAULT_PASSWORD,
                role : appConstant.USER_DETAILS.USER_ROLES[3],
                status : appConstant.USER_DETAILS.USER_STATUS[0],
                unqId : uniqueId(),
                 lastLoginOn : Date.now(),
                 createdOn : Date.now(),
                 updatedOn : Date.now()
               };
               let userData = new userModel(teacherCredentials);
               userData.save(function(err, data) {
                if (err) {
                  logger.error('userData not added sucessfully' + err);
                  reject(err);
                } else {
                  /*config for sending mail start here*/
                  MAIL_CONFIG.RECEIVERS=teacherPersistObj.email;
                  MAIL_CONFIG.TEXT= `<div>
                  Hello<strong>&nbsp;${teacherPersistObj.firstName}</strong>,<br/><br/>
                  Login id: ${teacherPersistObj.email}<br/>
                  Password: ${appConstant.USER_DETAILS.DEFAULT_PASSWORD} <br/><br/><br/>
                  <strong><a href="${appConstant.APIHOST}/api/users/confirmation?uId=${data.unqId}">"${appConstant.APIHOST}/api/users/confirmation?uId=${data.unqId}"</a></strong>
                  </div>`
                  mailer.sendMail(MAIL_CONFIG);
                  /*config for sending mail end  here*/
                  resolve({ success: true, msg: ' Successfully Registered' });
                }
              });
             }
           });
         }
       });
     }
  });
}

//get all teacher data
const allTeacherData=function(){
  return new Promise((resolve,reject)=>{
    teacher.find({},function(err,teacherData){
      if (err) {
        logger.error('No teacher data available !' + err);
        reject(err);
      } else {
        resolve(teacherData);
      }
    });
  });
};

function getTeacherDataById(objId){
 return new Promise((resolve,reject)=>{
  teacher.findOne({ '_id': objId })
  .exec(function(err,schoolteacherData){
    resolve(schoolteacherData);
  });
});
};

// update teacher data
const updateTeacherData=function(teacherObj,_id){
  return new Promise((resolve,reject)=>{
   let ifError = validation.validationForm(teacherObj);
   if(ifError) {
    resolve({ success: false, msg: 'field blank' });
  }  else {
    teacher.updateOne({_id:_id},
    {
      $set:{
        firstName:teacherObj.firstName,
        lastName:teacherObj.lastName,
        code:teacherObj.code,
        email:teacherObj.email,
        phoneNo:teacherObj.phoneNo,
        schoolName:teacherObj.schoolName,
        gender:teacherObj.gender,
        status:teacherObj.status,
        updatedOn:Date.now()
      }
    },function(err,teacherData) {
      if(err) {
        logger.error('Teacher data not updated !' + err);
        reject(err);
      } else {
        resolve({success : true, msg : 'Teacher data updated successfully !'});
      } 
    });
  }
});
};

// Delete  teacher data 
const deleteTeacherData=function(_id){
  return new Promise((resolve,reject)=>{
    teacher.deleteOne({_id:_id},function(err,teacherData){
      if (err) {
        logger.error('No teacher data available for this id ' + err);
        reject(err);
      } else {
        resolve({success : true, msg : 'Teacher data deleted successfully'});
      }
    });
  });
}

//find students by school id
function findBySchoolId(schoolId){
 return new Promise((resolve,reject)=>{
  teacher.find({ 'schoolName': schoolId })
  .exec(function(err,students){
    resolve(students);
  });
});
}

module.exports = {
  registerTeacherData : registerTeacherData,
  allTeacherData : allTeacherData,
  getTeacherDataById : getTeacherDataById,
  updateTeacherData : updateTeacherData,
  deleteTeacherData : deleteTeacherData,
  findBySchoolId : findBySchoolId
}
