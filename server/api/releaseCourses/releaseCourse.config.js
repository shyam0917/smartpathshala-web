
//log message config constants add here
const LOGGER_CONFIG = {
  COURSE_RELEASE_SUCCESSFULLY: 'Course release successfully !',
  INTERNAL_ERROR: 'Internal error occured',
  NO_QUERY_FOUND: 'No query found associate with this name ',
  GET_COURSES_SUCCESSFULLY: 'Get courses successfully ',
  NO_DATA_FOUND: 'No data found',
  BAD_REQUEST: 'Bad request !',
}

//query config add here
const QUERY_CONFIG = {

  "courseInfo" : {
    'sort' : {'version': -1},
    'group' : {_id: "$courseId"},
    'entry': true,
    "project" : ['title','courseId','type','tags','subcategory._id','shortDescription','activationMethod','category._id','createdBy.name',
    'icon','isPaid','price','rating','totalStudents','totalUserRatings','releasedBy.date'],
  },

  "courseInfo_q2" : {
    'sort' : {'version': -1},
    'group' : {_id: "$courseId"},
    'entry': true,
    "project" : ['title','courseId','topics','subtopics','type','tags','longDescription','shortDescription','activationMethod','createdBy','icon',
    'isPaid','price','rating','totalStudents','totalUserRatings'],
    "fields" : {
      "course": ['createdBy.id','createdBy.date','createdBy.role'],// To be removed
      'topics': ['topicId','title','subtopics'],
      'subtopics': ['subtopicId','title'],
    }
  }

}


module.exports = {
  LOGGER_CONFIG: LOGGER_CONFIG,
  QUERY_CONFIG: QUERY_CONFIG,
}


