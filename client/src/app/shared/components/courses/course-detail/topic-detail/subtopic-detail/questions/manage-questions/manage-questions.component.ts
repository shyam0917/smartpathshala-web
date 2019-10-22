import { Component, OnInit, ViewContainerRef} from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { CommonConfig } from './../../../../../../../config/common-config.constants';
import { AuthenticationService } from './../../../../../../../services/common/authentication.service';
import { CourseService } from './../../../../../../../services/courses/course.service';
import { MessageService } from './../../../../../../../services/common/message.service';


@Component({
  selector: 'app-manage-questions',
  templateUrl: './manage-questions.component.html',
  styleUrls: ['./manage-questions.component.css'],
  providers: [CourseService]
})
export class ManageQuestionsComponent implements OnInit {
  urlPrefix : String;
  questionTypes: any= CommonConfig.QUESTION_TYPE;
  questionType: any;
  subTopicId: string;
  question: any;
  errorMessage: string;
  formType:string='add';
  questionId:string;
  courseId: string;
  topicId: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private messageService: MessageService,
    private courseService: CourseService,
    private _vcr: ViewContainerRef
    ) {
  }

  ngOnInit() {
    this.urlPrefix = this.authenticationService.userRole.toLowerCase();
    this.courseId= this.route.snapshot.params['courseId'];
    this.topicId= this.route.snapshot.params['topicId'];
    this.subTopicId= this.route.snapshot.params['subtopicId'];
    if(this.subTopicId) {
      this.subTopicId=this.subTopicId.split('?')[0];
    }
    this.loadForms();
  }

//load question type based form
loadForms() {
  this.questionId= this.route.snapshot.params['qusId'];
  if(this.questionId) {
    this.questionId=this.questionId.split('?')[0];
    this.formType='edit';
    let qusTypeParam= '';
    if(this.questionId.indexOf('?')>=0) {
      qusTypeParam=this.questionId.split("=")[1];
    }else {
      qusTypeParam=this.route.snapshot.queryParams['qusType'];
    }
    switch (qusTypeParam) {
      case "single-choice":
      this.questionType=this.questionTypes[0];
      break;
      
      case "multiple-choice":
      this.questionType=this.questionTypes[1];
      break;

      case "true-false":
      this.questionType=this.questionTypes[2];
      break;
    }
    //this.subTopicId=sessionStorage.getItem('subTopicId');
  }
}

//set question type 
setQuestionType(questionType: string) {
  this.questionType= questionType;
}




/*editQuestion(id:string,questionType: string) {
  this.questionType= questionType;
  this.questionId= id;
 //this.router.navigate(['/', this.urlPrefix, 'courses', 'topics','subtopics','questions','edit',id]);//questions
}*/

}