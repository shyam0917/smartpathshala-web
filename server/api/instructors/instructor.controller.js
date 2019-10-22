const uniqid = require('uniqid');
const instructor = require('./instructor.entity');
const logger = require('./../../services/app.logger');
const validation=require('./../../common/validation');
const userModel = require('./../users/users.entity');
const mailer = require('./../../services/mailer');
const appConstant = require('../../constants').app;
const MAIL_CONFIG=appConstant.MAIL_CONFIG;
const uniqueId = require('uuid/v4');
const loggerConstants= require('./../../constants/logger').INSTRUCTOR;
const userController = require('./../users/users.controller');


const registerInstructor = function(instructorData, currentUser,platform) {
  instructorData['createdBy']= {
    id: currentUser['userId'],
    role: currentUser['role'],
    name: currentUser['name']
  }
 // instructorData.platform=platform;
  let instructorDetails = new instructor(instructorData);
  return new Promise((resolve, reject) => {
   let error= instructorDetails.validateSync();
   if(error){
    let msg= validation.formValidation(error);
    reject(msg)
  } else  {
    userModel.findOne({"username":instructorDetails.email},function(err,user){
      if(user){
        resolve({ success: false, msg: loggerConstants.USER_ALREADY_REGISTERED });
      } else{
        let instructorObj = new instructor(instructorDetails);
        instructorObj.save(function(err, instructor) {
          if (err) {
            logger.error(loggerConstants.FAILED_TO_SAVE + err);
            reject(err);
          } else if(instructor){
            userController.saveUserDetails(instructor,appConstant.USER_DETAILS.USER_ROLES[1],platform)
            .then(success=> {
              resolve(success);
            }).catch(err=> {
              reject(err);
            });
          }
        });
      }
    });
  }
});
}

//add instructor
function register(req, res) {
  let instructors = req.body;
  instructors['email']=instructors.email.toLowerCase();
  return new Promise((resolve, reject) => {
    let ifError = validation.validationForm(instructors);
    if(ifError) {
      resolve({ success: false, msg: 'field blank' });
    }else{

      userModel.findOne({"username":instructors.email},function(err,user){
        if(user)
        {
          resolve({ success: false, msg: 'already exist' });
        }else{
          // User id is set to email. So disabling it.
          // let userId=uniqid.process(); //generate 12 byte unique id for instructor
          // instructors.userId=userId; 
          let instructorObj = new instructor(instructors);
          instructorObj.save(function(err, instructor) {
            if (err) {
              logger.error('Failed to register instructor' + err);
              reject(err);
            } else if(instructor){
              // resolve({ success: true, msg: 'instructor registered successfully' });
              //  let instructorCredentials = {
              //   userId: instructor._id,
              //   email: instructors.email,
              //   name :  instructor.name,
              //   isPasswordReset : false,
              //   password: appConstant.USER_DETAILS.DEFAULT_PASSWORD,
              //   role: appConstant.USER_DETAILS.USER_ROLES[1],
              //   status: appConstant.USER_DETAILS.USER_STATUS[0], //Ststus=Active
              //   unqId: uniqueId(),
              //   lastLoginOn: Date.now(),
              //   createdOn: Date.now(),
              //   updatedOn: Date.now()
              // };
              userController.saveUserDetails(instructor,appConstant.USER_DETAILS.USER_ROLES[1])
              .then(success=> {
                resolve(success);
              }).catch(err=> {
                reject(err);
              });
            //  
            //   let userData = new userModel(instructorCredentials);
            //   userData.save(function(err, data) {
            //     if (err) {
            //       logger.error('userData not added sucessfully' + err);
            //       reject(err);
            //     } else {
            //       /*config for sending mail start here*/
            //       MAIL_CONFIG.RECEIVERS=instructor.email;
            //       MAIL_CONFIG.TEXT= `<div>
            //       Hello<strong>&nbsp;${instructor.name}</strong>,<br/><br/>
            //       Login id: ${instructor.email}<br/>
            //       Password: ${appConstant.USER_DETAILS.DEFAULT_PASSWORD} <br/><br/><br/>
            //       <strong><a href="${appConstant.APIHOST}/api/users/confirmation?uId=${data.unqId}">"${appConstant.APIHOST}/api/users/confirmation?uId=${data.unqId}"</a></strong>
            //       </div>`
            //       mailer.sendMail(MAIL_CONFIG);
            //       /*config for sending mail end  here*/
            //       resolve({ success: true, msg: ' Successfully Registered' });
            //     }
            // });
          }
        });
        }
      });
    }
  });
}

//get all instructor data
const findAll=function(){
  return new Promise((resolve,reject)=>{
    instructor.find({},function(err,instructorData){
      if (err) {
        logger.error('No instructor data available !' + err);
        reject(err);
      } else {
        resolve(instructorData);
      }
    });
  });

};

//List all active instructors 
const listAll=function(){
  return new Promise((resolve,reject)=>{
    instructor.find({status: appConstant.STATUS.ACTIVE},function(err,instructorData){
      if (err) {
        logger.error('No instructor data available !' + err);
        reject({ msg:err});
      } else {
        resolve({success:true, msg: loggerConstants.DATA_GET_SUCCESSFULLY, data: instructorData});
      }
    });
  });

};

//get instructor data based on mongo id
function findById(_id){
  return new Promise((resolve,reject)=>{
    instructor.findOne({'_id': _id },'name email mobile profilePic gender address profileUrls academicDetails',(err,data)=>{
      if(err){
       logger.error(err.message)
       reject({ msg:loggerConstants.INTERNAL_ERROR_OCCURED});
     }else if(!data){
      logger.error({ success:false, msg: loggerConstants.WE_COULD_NOT_FOUND_AN_ACCOUNT_ASSOCIATED_WITH + _id})
      reject({ success:false, msg: loggerConstants.WE_COULD_NOT_FOUND_AN_ACCOUNT_ASSOCIATED_WITH + _id})
    }else{
      logger.info({success:true, msg: loggerConstants.DATA_GET_SUCCESSFULLY})
      resolve({success:true, msg: loggerConstants.DATA_GET_SUCCESSFULLY, data: data})
    }
  });
  });
}


// update instructor data
const update=function(instructorObj,_id){
  return new Promise((resolve,reject)=>{
    let updatedInstructor = {
     name:instructorObj.name,
     email:instructorObj.email,
     phoneNo:instructorObj.phoneNo,
     gender:instructorObj.gender,
     updatedOn:Date.now()
   };
   let insObj = new instructor(updatedInstructor);  
   let error= insObj.validateSync();
   if(error){
    let msg= validation.formValidation(error);
    reject(msg)
  } else {
    instructor.updateOne({_id:_id},
    {
      $set:updatedInstructor
    },function(err,instructorData) {
      if(err) {
        logger.error('instructor data not updated !' + err);
        reject(err);
      } else {
        resolve({success : true, msg : 'instructor data updated successfully !'});
      } 
    });
  }
});
};

// Delete  instructor data 
const deleteRecord =function(_id){
  return new Promise((resolve,reject)=>{
    instructor.deleteOne({_id:_id},function(err,instructorData){
      if (err) {
        logger.error('No instructor data available for this id ' + err);
        reject(err);
      } else {
        resolve({success : true, msg : 'instructor data deleted successfully'});
      }
    });
  });
}
module.exports = {
  registerInstructor: registerInstructor,
  register: register,
  findAll:findAll,
  findById:findById,
  update:update,
  deleteRecord:deleteRecord,
  listAll : listAll,
}
