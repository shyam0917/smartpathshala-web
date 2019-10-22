import { Component, OnInit,Input, OnChanges, ViewContainerRef} from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { CourseService } from './../../../../../../services/courses/course.service';
import { CommonConfig } from './../../../../../../config/common-config.constants';
import * as $ from 'jquery';
import { MessageService } from './../../../../../../services/common/message.service';
import { ErrorService } from './../../../../../../services/common/error.service';
import { AuthenticationService } from './../../../../../../services/common/authentication.service';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css'],
  providers: [ CourseService ]
})

export class QuestionsComponent implements OnInit, OnChanges {
  @Input() subTopicOwnerUserId;
  errorMessage:string
  urlPrefix:string
  questions:any=[];
  subTopicId:string;
  questionTypes: any= CommonConfig.QUESTION_TYPE;
  courseId: string;
  topicId: string;
  
  role:string;
  public questionOwnerUserId: string;
  CONFIG=CommonConfig;
  public userId : String;
  public basePath = new CommonConfig().BASE_URL+CommonConfig.FOLDERS[6];

  constructor(
    private route: ActivatedRoute,
    private router:Router,
    private authenticationService:AuthenticationService,
    private errorService: ErrorService,
    private messageService: MessageService,
    private courseService: CourseService,
    private _vcr: ViewContainerRef
    ){
  }

  ngOnChanges() {
    this.questionOwnerUserId=this.subTopicOwnerUserId;
  }

  ngOnInit() {
    this.userId= localStorage.getItem("userId");
    if(!this.userId) {
      this.router.navigate(['/']);
    }
    this.courseId= this.route.snapshot.params['courseId'];
    this.topicId= this.route.snapshot.params['topicId'];
    this.subTopicId= this.route.snapshot.params['subtopicId'];
    if(this.subTopicId) {
      this.subTopicId=this.subTopicId.split('?')[0];
    }
    this.role = this.authenticationService.userRole;
    this.urlPrefix = this.authenticationService.userRole.toLowerCase();
    this.getQuestions();
  }

  // get question based on topic id
  getQuestions() {
    let filter={
      level: ['Basic','Intermediate','Expert'],
     // limit: 10
     subTopicId: this.subTopicId
   };
   this.messageService.showLoader.emit(true);
   this.courseService.getQuestions(filter)
   .subscribe(response=> {
     this.messageService.showLoader.emit(false);
     if(response['data']) {
       this.questions= response['data'];
     }
   },error=>{
     this.handleError(error);
     this.errorMessage = error.json().msg;
   })
 }


//toggle icon on div collapse
toggleCard(id:any) {
  $('#'+id).toggleClass('fa-chevron-circle-down  fa-chevron-circle-up')
}

//delete question by id
deleteQuestion(_id:string) {
  this.messageService.deleteConfirmation(()=> {
    this.courseService.deleteQuestion(_id)
    .subscribe(response=> {
      if(response['success']) {
        this.getQuestions();
      }
    },error=> { 
      this.errorMessage = error.json().msg;
      this.handleError(error);
    });
  })
}

//edit question
editQuestion(id:string,type:string) {
  //sessionStorage.setItem('subTopicId',this.subTopicId);
  let qusTypeRoute='';

  switch (type) {

    case this.questionTypes[1]:
    qusTypeRoute='multiple-choice'
    break;
    
    case this.questionTypes[2]:
    qusTypeRoute='true-false'
    break;

    default:
    qusTypeRoute='single-choice'
    break;
  }
  this.router.navigate(['/', this.urlPrefix, 'courses', this.courseId , 'topics', this.topicId,'subtopics',this.subTopicId,'questions','edit',id],{queryParams: { qusType: qusTypeRoute}});
}

 // Handle error
  handleError(error) {
    this.messageService.showLoader.emit(false);
    this.errorService.handleError(error, this._vcr);
  }

}
