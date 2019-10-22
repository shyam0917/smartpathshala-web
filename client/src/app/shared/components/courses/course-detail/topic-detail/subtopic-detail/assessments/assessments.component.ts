import { Component, OnInit,Input,ViewContainerRef} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CourseService } from './../../../../../../services/courses/course.service';
import { AssessmentService } from './../../../../../../services/assessments/assessment.service';
import { CommonConfig } from './../../../../../../config/common-config.constants';
import { MessageService } from './../../../../../../services/common/message.service';
import { ErrorService } from './../../../../../../services/common/error.service';
import { AuthenticationService } from './../../../../../../services/common/authentication.service';
import * as $ from 'jquery';

@Component({
	selector: 'app-assessments',
	templateUrl: './assessments.component.html',
	styleUrls: ['./assessments.component.css'],
	providers: [ CourseService,AssessmentService ]
})
export class AssessmentsComponent implements OnInit {
  @Input() courseOwnerUserId;
  
  assessmentOwnerUserId:string;
  courseId:string;
  assessments:any=[];
  urlPrefix:string;
  CONFIG:any=CommonConfig;
  role:string;
  userId:string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private courseService: CourseService,
    private assessmentService: AssessmentService,
    private authenticationService: AuthenticationService,
    private messageService: MessageService,
    private errorService: ErrorService,
    private _vcr: ViewContainerRef,
    ) { }

  ngOnInit() {
    this.userId= localStorage.getItem("userId");
    if(!this.userId) {
      this.router.navigate(['/']);
    }
    this.urlPrefix = this.authenticationService.userRole.toLowerCase();
    this.role=this.authenticationService.userRole;
    this.courseId=this.route.snapshot.params['courseId'];
    if(this.courseId) {
      this.courseId=this.courseId.split('?')[0];
    }
    this.role = this.authenticationService.userRole;
    this.getAssessments();
  }

//get assessments based on topic id
getAssessments(){
  this.messageService.showLoader.emit(true);
  this.assessmentService.getAssessmentsByCourseId(this.courseId)
  .subscribe(response=> {
    this.messageService.showLoader.emit(false);
    if(response['data']) {
      this.assessments=response['data'];
    }
  },error=>{
    this.handleError(error);
  })
}

ngOnChanges() {
  this.assessmentOwnerUserId=this.courseOwnerUserId;
}

//redirect to assemesnts details
getAssessmentDetails(id: string) {
	this.router.navigate(['/',this.urlPrefix,'courses','topics','assessments',id],{queryParams:{tab:'questions'}})
}

  // Handle error
  handleError(error) {
    this.errorService.handleError(error, this._vcr);
    this.messageService.showErrorToast(this._vcr,error.json().msg);
  }

  //delete assessment by assessment id
  deleteAssessment(id:string) {
    this.messageService.deleteConfirmation(()=> {
      this.messageService.showLoader.emit(true);
      this.assessmentService.deleteAssessment(id)
      .subscribe(response=> {
        this.messageService.showLoader.emit(false);
        if(response) {
          this.getAssessments();
          this.messageService.successMessage('Course', 'Successfully Deleted');
        }
      },error=>{
        this.handleError(error);
      })
    });
  }
}
