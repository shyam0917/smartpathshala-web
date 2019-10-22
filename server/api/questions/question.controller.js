const Question = require('./question.entity');
const subTopics = require('../subtopics/subtopic.entity');
const topic = require("./../topics/topic.entity.js");
const logger = require('../../services/app.logger');
const loggerConstants= require('./../../constants/logger').QUESTION;
const CustomError = require('./../../services/custom-error');
const Config= require('./../../config/commonConfig');
const constants = require('./../../constants/app');
const SubTopicsCtrl = require('./../subtopics/subtopic.controller');
const subTopicsModel = require('./../subtopics/subtopic.entity');

/*
* persist question
*/
const saveQuestion = (questionDetails,userInfo)=> {
  return new Promise((resolve,reject)=> {
    let subTopicId=questionDetails.subTopicId;
    subTopics.findOne({_id: subTopicId},(err,subTopic)=> {
      if(err) {
        reject(err);
      }else if(subTopic) {
        if(userInfo['userId'] == subTopic.createdBy.id || userInfo['role'] === constants.USER_DETAILS.USER_ROLES[0]) {
          questionDetails['createdBy']= {
           id: userInfo['userId'],
           role: userInfo['role']
         }
         if(userInfo['role'] && userInfo['role'] === constants.USER_DETAILS.USER_ROLES[1]) {
          questionDetails['createdBy']['name']=constants.DEFAULT_NAME_FOR_BACKEND_USER;
        }else {
          questionDetails['createdBy']['name']=userInfo['name'];
        }
         // questionDetails['status']=constants.CONTENT_STATUS[2];
         questionDetails['courseId']=subTopic['courseId'] || '';
         questionDetails['topicId']=subTopic['topicId'] || '';
         const question = new Question(questionDetails);
         question.save((err, question)=> {
          if(err) return reject(err);
          let actionData= SubTopicsCtrl.actionData(userInfo,constants.CONTENTS[6],constants.METHODS[0]);
          actionData.contentId=question._id;
          subTopicsModel.findOneAndUpdate({ '_id': subTopicId }, {
            $push: {
              questions: question._id,
              action: actionData
            }
          },(err, subtopic)=> {
           if(err) return reject(err)
            resolve({success:true, msg: loggerConstants.SAVE_SUCCESSFULLY});
        });
        });
       }else {
        reject(new CustomError(loggerConstants.NO_RIGHTS));
      }
    }else {
      reject(new CustomError(loggerConstants.INTERNAL_ERROR));
    }
  });
  });
}

/*
* find questions
*/
const findQuestions = (query,limit,sort)=> {
  return new Promise((resolve, reject)=> {
    query['status'] = { $ne: constants.CONTENT_STATUS[5]}
  //  console.log(JSON.stringify(query, null, 1));
  Question.find(query)
  .limit(limit)
  .sort(sort)
  .exec((err,questions)=> {
    if(err) {
     return reject(err);
   }
   resolve({success: true, msg: loggerConstants.DATA_GET_SUCCESSFULLY,data: questions || []})
 });
});
}

/*
* fetch questions based on filter query
*/
const getQuestions= (queryParams)=> {
  return new Promise((resolve,reject)=> {
    let levels=Config.QUESTION_LEVELS;
    let filterParams=getFilterQuery(queryParams);
    let query= filterParams['$where'] || {};
    let limit= +filterParams['$limit'] || 0;
    let sort= filterParams['$orderby'] || { 'createdBy.date': -1 };
    if(filterParams['$counter'] && filterParams['$counter'].level) {
      let promises= [],questions=[];
      filterParams['$counter'].level.forEach((val,i)=> { 
        query['level']=levels[i]
        limit= +val;
        promises.push(findQuestions(query,limit,sort));
      });
      Promise.all(promises).then(results=> {
        results.forEach(result=> {
          if(result.data) {
            questions= questions.concat(result.data);
          }
        });
        resolve({success: true, msg: loggerConstants.DATA_GET_SUCCESSFULLY, data: questions});
      },error=>{
        reject(err);
      })
    }else{
      findQuestions(query,limit,sort).then(success=> {
       resolve({success: true, msg: loggerConstants.DATA_GET_SUCCESSFULLY, data: success.data || []});
     },error=>{
       reject(err);
     })
    }
  });
}

/*
* get filter query from query params
*/
const getFilterQuery=(queryParams)=> {
  let $where={},filters={};
  for(let key in queryParams) {
    if(queryParams.hasOwnProperty(key)) {
      let value= queryParams[key];
      if(Array.isArray(value)) {
       if(key.startsWith('counter_')) {
        let prop=key.substring(8,key.length);
        if(!filters['$counter']) {
          filters['$counter']={};
        }
        filters['$counter'][prop]=value;
       // filters['$counter'][prop].push(value);
     }else {
       let $orArr=[];
       value.forEach(val=> {
        let obj={};
        obj[key]=val;
        $orArr.push(obj)
      })
       $where['$or']=$orArr;
     }
   }else if(key==="startDate" || key==="endDate") {
    if(!$where['createdBy.date']) {
      $where['createdBy.date']={};
    }
    if(key==="startDate"){
      $where['createdBy.date']['$gte']=value;
    }else if(key==="endDate") {
      $where['createdBy.date']['$lte']=value;
    }
  }else if(key==="date") {
    $where['createdBy']={};
    $where['createdBy.date']={};
    $where['createdBy.date']['$lte']=value;
  }else if(key==="limit") {
    filters['$limit']=value;
  }else if(key.startsWith('orderby_')) {
    let prop=key.substring(8,key.length);
    if(!filters['$orderby']) {
      filters['$orderby']={};
    }
    filters['$orderby'][prop]= value;
  }else {
    $where[key]=value;
  }
}
}
if(Object.getOwnPropertyNames($where).length>0) {
  filters['$where']=$where;
};
return filters;
}

/*
* get question by question id
*/
const getQuestionById= (questionId)=> {
  return new Promise((resolve,reject)=> {
    Question.findOne({_id: questionId, status: { $ne: constants.CONTENT_STATUS[5]}},(err,question)=> {
      if(err) {
       return reject(err);
     }
     resolve({success: true, msg: loggerConstants.DATA_GET_SUCCESSFULLY, data: question})
   });
  });
}

//get active or inactive question details based on question id 
const getQuestion = qusId => Question.findOne({_id: qusId, status: {$ne: constants.CONTENT_STATUS[5]}});

/*
* upadte question by question id
*/
const updateQuestion=(qusId,questionData,userInfo)=> {
  return new Promise(async(resolve, reject) => {
    try {
      let questionDetails = await getQuestion(qusId);
      if(!questionDetails) {
        return reject(new CustomError(loggerConstants.NO_DATA_FOUND));
      }
      if(userInfo['userId'] == questionDetails.createdBy.id || userInfo['role'] === constants.USER_DETAILS.USER_ROLES[0]) {
       Question.findOneAndUpdate({'_id': qusId},{
        $set: {
          question: questionData.question,
          options: questionData.options,
          answers: questionData.answers,
          level: questionData.level,
          solution: questionData.solution,
          status:questionData.status,
          updatedBy:{
           id: userInfo.userId,
           role: userInfo.role,
           name: userInfo.name,
           date: Date.now()
         },
       }
     },(err, data) => {
       if(err) return reject(err);
       resolve({success: true, msg: loggerConstants.UPDATE_SUCCESSSFULLY})
     });
     }else {
      reject(new CustomError(loggerConstants.NO_RIGHTS));
    }
  }catch(err) {
    reject(err);
  }
});
}

// function fetchQuestionBySubTopicId(req, res) {
//   const subtopicId = req.body.subTopicId;
//   question.find({ subTopicId: subtopicId })
//     .then((result) => {
//       res.json({
//         success: 'ok',
//         questions: result,
//       });
//     });
// }

// function fetchQuestionByTopicId(req, res) {
//   const topicId = req.body.topicID;
//   topic.find({_id: topicId})
//     .then((result) => {
//       let subTopics=result[0].subtopics;
//       subTopics.map((elem,i)=>{
//         question.findOne({subTopicId:elem}).then((data)=>{
//       	res.json({
//         success: 'ok',
//         questions: result,
//       });
//      });
//     })
//       ;
//    });
// }


// const fetchQuestionByTopicId = function(topicId) {
//     return new Promise((resolve, reject) => {
//         topic.findOne({ _id: topicId }, function(err, data) {
//             if (err) {
//                 logger.error('TopicID Not Get any data' + err);
//                 reject(err);
//             } else {
//                 let question = [];
//                 let subTopics = data.subtopics;
//                 subTopics.map((elem, i) => {
//                     question.find({ subTopicId: elem }, function(err, data1) {
//                         if (err) {
//                             logger.error('Not Get any question' + err);
//                             reject(err);
//                         } else {
//                         		let data=data1;
//                         		question.push(data);
//                         		resolve(question);
//                         }
//                     });
//                 });    
//             }
//         });
//     });
// };

const fetchQuestionBySubTopicId=function(subTopicId) {
  return new Promise((resolve,reject)=>{
    Question.find({subTopicId:subTopicId,status: { $ne: constants.CONTENT_STATUS[5]}},function(err,data){
      resolve(data);
    });
  })
}

// update question status deleted by question id
const deleteById=(questionId,userInfo)=> {
  return new Promise(async(resolve,reject)=> {
   try {
    let questionDetails = await getQuestion(questionId);
    if(!questionDetails) {
      return reject(new CustomError(loggerConstants.NO_DATA_FOUND));
    }
    if(userInfo['userId'] == questionDetails.createdBy.id || userInfo['role'] === constants.USER_DETAILS.USER_ROLES[0]) {
      Question.updateOne({_id:questionId },{
        $set : {
          status: constants.CONTENT_STATUS[5],
          deletedBy:{
            id: userInfo.userId,
            role: userInfo.role,
            name: userInfo.name,
            date: Date.now()
          }
        }
      },(err,data) => {
        if(err) return reject(err);
        resolve({success:true, msg:"Successfully deleted"});
      });
    }else {
      reject(new CustomError(loggerConstants.NO_RIGHTS));
    }
  }catch(err) {
    reject(err);
  }
})
}

/*
* question report an issue
*/
const submitQuestionIssue=(qusId,issueDetails,userInfo)=> {
  return new Promise((resolve,reject)=> {
    let userIssueDetails={
      'description': issueDetails['description'],
      'userId': userInfo.userId,
    }
    Question.update({'_id': qusId},{
      $push: {
        issues: userIssueDetails
      }
    },(err, data)=> {
      if(err) {
       return reject(err);
     }
     resolve({success: true, msg: loggerConstants.UPDATE_SUCCESSSFULLY})
   });
  });
}   

module.exports = {
  saveQuestion: saveQuestion,
  getQuestions: getQuestions,
  getQuestionById: getQuestionById,
  updateQuestion: updateQuestion,
  fetchQuestionBySubTopicId: fetchQuestionBySubTopicId,
  deleteById: deleteById,
  submitQuestionIssue: submitQuestionIssue,
}