var express = require('express');
var router = express.Router();
const logger = require('./../../services/app.logger');
var controller = require('./school.controller');

//register school
router.post('/',(req,res)=>{
  try {
    let email=req.body.email;
    logger.info("Request for school registration "+email);
    controller.register(req,res).then(successResult=>{
      logger.info(successResult.msg +" for: "+email);
      return res.status(200).send(successResult);
    },error=> {
      logger.error(error.msg +" for: "+ email);
      return res.status(417).json(error);
    }).catch(error=> {
      logger.error("Internal Error: "+error);
      return res.status(500).json({success:false, msg: "Internal error occurred"});
    });
  }catch (err) {
    logger.error('Error occurred in school registration for: '+email +err.stack || err);
    return res.status(500).send({ msg: "Internal error occurred" });
  }
});

//get all schools
router.get('/',(req,res)=> {
	try	{
		controller.getSchools().then((successResult)=> {
      logger.info(successResult.msg);
      return res.status(201).send(successResult);
    }, (rejection) => {
     logger.error(rejection.msg);
     return res.status(417).send(rejection);
   }).catch(error=> {
    logger.error("Internal Error: "+error);
    return res.status(500).json({success:false, msg: "Internal error occurred"});
  });
 }catch(err) {
  logger.error('Error occurred in fetching schools: '+err.stack || err);
  return res.status(500).send({ msg: "Internal error occured while fetching schools" });
}
});

//get school by id 
router.get('/schoolId',function(req,res){
  try {
    let schoolId=req.decoded.id;
    controller.getSchoolById(schoolId).then((successResult)=>{
      logger.info(successResult.msg);
      return res.status(201).send(successResult);
    }, (rejection) => {
     logger.error(rejection.msg);
     return res.status(417).send(rejection);
   }).catch(error=> {
    logger.error("Internal Error: "+error);
    return res.status(500).json({success:false, msg: "Internal error occurred"});
  });
 }catch(err) {
   logger.error('Error occurred in fetching school: '+err.stack || err);
   return res.status(500).send({ msg: "Internal error occured while fetching school" });
 }
});

//get school by id 
router.get('/:id',function(req,res){
  try {
    let schoolId=req.params.id;
    controller.getSchoolById(schoolId).then((successResult)=>{
      logger.info(successResult.msg);
      return res.status(201).send(successResult);
    }, (rejection) => {
     logger.error(rejection.msg);
     return res.status(417).send(rejection);
   }).catch(error=> {
    logger.error("Internal Error: "+error);
    return res.status(500).json({success:false, msg: "Internal error occurred"});
  });
 }catch(err) {
   logger.error('Error occurred in fetching school: '+err.stack || err);
   return res.status(500).send({ msg: "Internal error occured while fetching school" });
 }
});

//update school 
router.put('/:id',function(req, res){
  try {
    let school=req.body;
    let _id=req.params.id;
    if(!school){
     logger.error('No data found for school' +_id);
     return res.status(417).send({success: false,msg: `Expecting school data to be updated`});
   }
   controller.update(school,_id).then((successResult) => {
    logger.info(successResult.msg +" for "+_id);
    return res.status(200).send(successResult);
  }, (errResult)=>{
    logger.error(errResult.msg+ 'for'+ _id);
    return res.status(500).send(errResult);
  }).catch(error=> {
    logger.error("Internal Error: "+error);
    return res.status(500).json({success:false, msg: "Internal error occurred"});
  });
} catch(err) {
 logger.error('Error occurred in update school info for :  '+_id +err.stack || err);
 return res.status(500).send({ msg: "Internal error occurred" });
}
});

//delete school
router.delete('/:id',(req,res)=> {
  try {
    let _id=req.params.id;
    controller.deleteSchool(_id).then((successResult)=>{
      return res.status(203).send(successResult);
    }, (rejection) => {
      logger.error(rejection.msg +" for: "+ _id);
      return res.status(417).json(rejection);
    }).catch(error=> {
      logger.error("Internal Error: "+error);
      return res.status(500).json({success:false, msg: "Internal error occurred"});
    });
  }catch(err) {
    logger.error('Error occurred in delete school info for :  '+_id +err.stack || err);
    return res.status(500).send({ msg: "Internal error occurred" });
  }
});
//get assign categories by id 
router.get('/assign/categories/:id',function(req,res){
  try {
   let schoolId=req.params.id;
   controller.getAssignCategories(schoolId).then((successResult)=>{
    return res.status(203).send(successResult);
  }, (rejection) => {
    logger.error(rejection.msg +" for: "+ _id);
    return res.status(417).json(rejection);
  }).catch(error=> {
    logger.error("Internal Error: "+error);
    return res.status(500).json({success:false, msg: "Internal error occurred"});
  });
} catch(err) {
 logger.error('Error occurred in assign-categories for :  '+_id +err.stack || err);
 return res.status(500).send({ msg: "Internal error occurred" });
}
});

//update categories data 
router.put('/assign/categories/:id',function(req, res){
  try {
    let categories=req.body;
    let _id=req.params.id;
    if(!categories){
     logger.error('No data found for assign-categories' +_id);
     return res.status(417).send({success: false,msg: `Expecting assign-categories data to be updated`});
   }
   controller.updateCategories(categories,_id).then(successResult=> {
     logger.info(successResult.msg +" for "+_id);
     return res.status(200).send(successResult);
   },errResult=> {
    logger.error(errResult.msg+ 'for'+ _id);
    return res.status(500).send(errResult);
  }).catch(error=> {
    logger.error("Internal Error: "+error);
    return res.status(500).json({success:false, msg: "Internal error occurred"});
  });
} catch(err) {
 logger.error('Error occurred in assign-categories for :  '+_id +err.stack || err);
 return res.status(500).send({ msg: "Internal error occurred" });
}
});

module.exports = router;