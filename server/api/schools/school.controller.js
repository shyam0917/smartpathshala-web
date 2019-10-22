const uniqid = require('uniqid');
const schoolModel = require('./school.entity');
const logger = require('./../../services/app.logger');
const validation=require('./../../common/validation');
const userModel = require('./../users/users.entity');
const userController = require('./../users/users.controller');
const courseController = require('./../courses/course.controller');
const subCategoryCtrl = require('./../subcategories/subcategory.controller');
const appConstant = require('../../constants').app;
const mailer = require('./../../services/mailer');
const MAIL_CONFIG=appConstant.MAIL_CONFIG;
const uniqueId = require('uuid/v4');

const register=(req,res)=> {
  return new Promise((resolve,reject)=> {
    let schoolObj = req.body;
    isValid(schoolObj).then(valid=>{
      userModel.findOne({"username":schoolObj.email},(err,data)=> {
        if(err) {
          logger.error(err.message)
          reject({ msg:'Internal error occoured'});
        } else if(data) {
          reject({ success: false, msg: `${schoolObj.email} already registered` });
        }else {
          let school= new schoolModel(schoolObj);
          school.save((err, school)=> {
            if(err) {
              logger.error(err.message)
              reject({ msg:'Internal error occoured'});
            }else if(school) {
              let schoolCredentials = {
                userId: school._id,
                username: school.email,
                password: appConstant.USER_DETAILS.DEFAULT_PASSWORD,
                role: appConstant.USER_DETAILS.USER_ROLES[2],
                status: appConstant.USER_DETAILS.USER_STATUS[0], //Ststus=Active
                unqId: uniqueId(),
                lastLoginOn: Date.now(),
                createdOn: Date.now(),
                updatedOn: Date.now()
              };
              let userData = new userModel(schoolCredentials);
              userData.save((err, data)=> {
                if(err) {
                  logger.error(err.message)
                  reject({ msg:'Internal error occoured'});
                }else {
                 let mailConfig=mailer.getMailConfig();
                 let mailOptions = {
                  from: mailConfig.from,
                  to: data.username,
                  subject: `Email verification`,
                  html: `Hello<strong>&nbsp;${school.schoolName}</strong>,<br/><br/>
                  Login id: ${school.email}<br/>
                  Password: ${appConstant.USER_DETAILS.DEFAULT_PASSWORD} <br/><br/><br/>
                  <strong><a href="${appConstant.APIHOST}/api/users/confirmation?uId=${data.unqId}">"${appConstant.APIHOST}/api/users/confirmation?uId=${data.unqId}"</a></strong>
                  `
                }
                mailConfig.transporter.sendMail(mailOptions, function(error, info){
                  if(error){
                    reject({ msg: `Sending mail failed`})
                  }else if(info){
                   logger.info('School registration successfully');
                   resolve({success:true, msg: `We just emailed on register link, Please check and click the secure link`})
                 }
               });
              }
            });
            }
          });
        }
      });
    },invalid=>{
      reject({msg:invalid.msg});
    });
  });
}

//get all schools data
const getSchools=() => {
  return new Promise((resolve,reject)=> {
    schoolModel.find({},function(err,schools){
      if(err) {
        logger.error(err.message)
        reject({ msg:'Internal error occoured'});
      } else if(schools) {
       resolve({success: true, msg: "Data get successfully",data: schools})
     }else {
      resolve({success: true, msg: 'No data available'});
    }
  });
  });
}
//get school by id
const getSchoolById = (schId)=> {
  return new Promise((resolve,reject)=> {
    schoolModel.findOne({ '_id': schId })
    .exec((err,school)=> {
      if(err) {
        logger.error(err.message)
        reject({ msg:'Internal error occoured'});
      } else if(school) {
       resolve({success: true, msg: "Data get successfully",data: school})
     }else {
      resolve({success: true, msg: 'No data available'});
    }
  });
  });
};

//get assigned categories 
function getAssignCategories(id) {
 return new Promise((resolve,reject)=> {
  schoolModel.findOne({ '_id': id })
  .populate('categories',['_id','name'])
  .exec((err,school)=> {
    if(err) {
      logger.error(err)
      reject({ msg:'Internal error occoured'});
    }else if(school) {
      let schCourseDetails={};
      if(school.categories) {
        let categories=[],categoryPromises= [],subCategories=[],coursePromises=[],courses= [];
        
        school.categories.map(category=> {
          categories.push({id: category._id,itemName: category.name })
          categoryPromises.push(subCategoryCtrl.getSubCategories(category.id,{status: appConstant.STATUS.ACTIVE}))
          coursePromises.push(courseController.getCourseByCategoryId(category.id,{status: appConstant.STATUS.ACTIVE}))
        })
        schCourseDetails.categories= categories;
        Promise.all(categoryPromises).then(responses => {
          if(responses.length>0) {
            for(let i=0;i<responses.length;i++) {
              responses[i].map(subCat=>{
                subCategories.push({
                  id: subCat._id,
                  itemName: subCat.name,
                  category: subCat.categoryId,
                })
              })
            }
            schCourseDetails.subcategories= subCategories;
          }
          Promise.all(coursePromises).then(responses => {
            if(responses.length>0) {
              for(let i=0;i<responses.length;i++) {
                responses[i].map(course=> {
                  courses.push({
                    id: course._id,
                    itemName: course.title,
                    category: course.category,
                    subcategory: course.subcategory
                  })
                });
              }
            }
            schCourseDetails.courses= courses;
            resolve({success: true, msg: "Data get successfully",data: schCourseDetails})
          }).catch((err)=>{
           logger.error(error);
           reject({ msg:'Internal error occoured'});
           return;
         });
        }).catch((err)=>{
         logger.error(error);
         reject({ msg:'Internal error occoured'});
         return;
       });
      }else{
        resolve({success: true, msg: "Data get successfully",data: []})
      }
    }
  });
});
}

// update school school
const update=function(schoolObj,schoolId){
  return new Promise((resolve,reject)=>{
   isValid(schoolObj).then(valid=>{
    schoolModel.findOneAndUpdate({_id:schoolId},
    {
      $set:{
        schoolName:schoolObj.schoolName,
        code:schoolObj.code,
        email:schoolObj.email,
        address:schoolObj.address,
        phoneNo:schoolObj.phoneNo,
        website:schoolObj.website,
        city:schoolObj.city,
        state:schoolObj.state,
        zipCode:schoolObj.zipCode,
        status:schoolObj.status,
        updatedOn:Date.now()
      }
    },{new: false},function(err,school) {
      if(err) {
        logger.error(err.message)
        reject({ msg:'Internal error occoured'});
      } else if(school) {
        if(school.status!==schoolObj.status){
          userController.updateStatus(schoolObj.email,schoolObj.status).then(success=> {
           logger.info(success.msg);
           resolve({success : true, msg : 'Data updated successfully'});
         },error=> {
          reject(error);
        }).catch((err)=>{
         logger.error(error);
         reject({ msg:'Internal error occoured'});
       });
      }else{
        resolve({success : true, msg : 'Data updated successfully'});
      }
    } 
  });
  },invalid=>{
    reject({msg:invalid.msg});
  });
 });
};

// Delete category school 
const deleteSchool=function(schoolId){
  return new Promise((resolve,reject)=>{
    schoolModel.deleteOne({_id:schoolId},function(err,school){
      if (err) {
        logger.error(err.message)
        reject({ msg:'Internal error occoured'});
      } else {
        resolve({success : true, msg : 'School data deleted successfully'});
      }
    });
  });
}

//update category
function updateCategories(data,_id) {
  return new Promise((resolve,reject)=> {
    let categories=data.categories;
    if(!_id) {
      reject({msg: 'School is required'});
    }else if(categories.length<=0) {
      reject({msg: 'Categories required'});
    }else{
      schoolModel.updateOne({_id:_id},{
        $set:{
          categories: categories,
          updatedOn: Date.now()
        }
      },(err,school)=> {
        if(err) {
          logger.error(err)
          reject({ msg:'Internal error occoured'});
        } else {
          resolve({success : true, msg : 'School data updated successfully !'});
        } 
      });
    }
  })
}

//check validation
function isValid(school) {
  return new Promise((resolve,reject)=>{
    if(!school.schoolName) {
      reject({msg: 'School name is required'});
    }else if(!validation.isOnlyAlpahabetic(school.schoolName)){
      reject({msg: 'Please enter valid school name'});
    }else if(!school.email) {
      reject({msg: 'Email is required'})
    }else if(!validation.isValidEmail(school.email)){
      reject({msg: 'Please enter valid email'});
    }else if(!school.phoneNo) {
      reject({msg: 'Mobile number is required'})
    }else if(!validation.isValidMobNo(school.phoneNo)|| school.phoneNo.length>10){
      reject({msg: 'Please enter valid mobile number'});
    }else if(!school.address) {
      reject({msg: 'Address is required'});
    }else if(!school.city) {
      reject({msg: 'City name is required'})
    }else if(!validation.isOnlyAlpahabetic(school.city)){
      reject({msg: 'Please enter valid city name'});
    }else if(!school.state) {
      reject({msg: 'State is required'});
    }else if(!validation.isOnlyAlpahabetic(school.state)){
      reject({msg: 'Please enter valid state name'});
    }else if(!school.zipCode) {
      reject({msg: 'Zip code is required'});
    }else if(! /^\d{6}$/.test(school.zipCode)){
      reject({msg: 'Please enter valid zip code'});
    }else if(school.website && !/^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/.test(school.website)){
      reject({msg: 'Please enter valid web site'});
    }else {
      resolve();
    }
  });
}

module.exports = {
  register: register,
  getSchools: getSchools,
  getSchoolById: getSchoolById,
  update: update,
  deleteSchool: deleteSchool,
  updateCategories: updateCategories,
  getAssignCategories: getAssignCategories,
}
