var express = require('express');
var router = express.Router();
const logger = require('./../../services/app.logger');
var controller = require('./teacher.controller');

router.post('/persistTeacherRegData', (req, res, next) => {
	
	controller.registerTeacherData(req, res).then((successResult)=> {
    logger.info('Get successesult successfully and return back');
    return res.status(201).send(successResult);
  },(error)=>{
   logger.error('Internal error occurred '+error.msg);
   return res.status(500).send({ error: 'Internal error occurred, please try later..!' });
 });
});

//get all teacher
router.get('/getAllTeacher',function(req,res){
	try
	{
		controller.allTeacherData().then((successResult)=>{
			return res.status(203).send(successResult);
		}, (errResult) => {
			logger.error('Internal error occurred');
			return res.status(204).send({ error: 'Internal error occurred, please try later..!' });
		});
	}
	catch(err) {
		logger.fatal('Exception occurred' + err);
		res.send({ error: 'Failed to complete, please check the request and try again..!' });
		return;
	}
});

//get all teacher by school id
router.get('/schoolId/:schoolId',function(req,res){
 let schoolId=req.params.schoolId;
 try
 {
  controller.findBySchoolId(schoolId).then((successResult)=>{
    return res.status(203).send(successResult);
  }, (errResult) => {
    logger.error('Internal error occurred');
    return res.status(204).send({ error: 'Internal error occurred, please try later..!' });
  });
}
catch(err) {
  logger.fatal('Exception occurred' + err);
  res.send({ error: 'Failed to complete, please check the request and try again..!' });
  return;
}
});

//get teacher by id
router.get('/id/:id',function(req,res){
	let _id=req.params.id;

	try
	{
		controller.getTeacherDataById(_id).then((successResult)=>{
			return res.status(203).send(successResult);
		}, (errResult) => {
			logger.error('Internal error occurred');
			return res.status(204).send({ error: 'Internal error occurred, please try later..!' });
		});
	}
	catch(err) {
        // Log the Error for internal use
        logger.fatal('Exception occurred' + err);
        res.send({ error: 'Failed to complete, please check the request and try again..!' });
        return;
      }
    });

/*
* To update data 
*/
router.put('/id/:id',function(req, res){
	let teacherData=req.body;
	let _id=req.params.id;
	try {
		if(!teacherData){
			logger.error('teacher data not found');
			throw new Error('Invalid inputs passed...!');
		}
		controller.updateTeacherData(teacherData,_id).then((successResult) => {
			logger.info('Update successfully and return back');
			return res.status(201).send(successResult);
		}, (errResult)=>{
			logger.error('Internal error occurred');
			return res.status(304).send({error : 'Internal error occurred, please try later..!' });
		});
	} catch(err) {
		logger.fatal('Exception occurred' + err);
		res.send({ error: 'Failed to complete successfully, please check the request and try again..!' });
		return;
	}
});

router.delete('/delete/:id',function(req,res){
	let _id=req.params.id;
	try
	{
		controller.deleteTeacherData(_id).then((successResult)=>{
			logger.info('Delete request for teacher data');
			return res.status(203).send(successResult);
		}, (errResult) => {
            //log the error for internal use
            logger.error('Internal error occurred');
            return res.status(204).send({ error: 'Internal error occurred, please try later..!' });
          });
	}
	catch(err) {
        // Log the Error for internal use
        logger.fatal('Exception occurred' + err);
        res.send({ error: 'Failed to complete, please check the request and try again..!' });
        return;
      }
    });

module.exports = router;
