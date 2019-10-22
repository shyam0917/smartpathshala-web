import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { AssessmentService } from './../../../../../../../services/assessments/assessment.service';
import { AuthenticationService } from './../../../../../../../services/common/authentication.service';
import { MessageService } from './../../../../../../../services/common/message.service';
import { ErrorService } from './../../../../../../../services/common/error.service';

@Component({
  selector: 'app-assessment-result-detail',
  templateUrl: './assessment-result-detail.component.html',
  styleUrls: ['./assessment-result-detail.component.css'],
  providers: [ AssessmentService ]
})
export class AssessmentResultDetailComponent implements OnInit {

  assessmentResultDetails:any=[];
  appendInfo:boolean=false;
  urlPrefix:string
  assessmentResultId:string;
  courseId:string;
  assessmentId:string;

  constructor(
    private route: ActivatedRoute,
    private router: Router, 
    private errorService: ErrorService,
    private assessmentService: AssessmentService,
    private messageService: MessageService,
    private authenticationService: AuthenticationService,
    private _vcr: ViewContainerRef,
    ) { }

  ngOnInit() {
    this.urlPrefix = this.authenticationService.userRole.toLowerCase();
    this.courseId=this.route.snapshot.params['courseId'];
    this.assessmentId=this.route.snapshot.params['assessmentId'];
    this.assessmentResultId= this.route.snapshot.params['id'];
    this.getStudentQuizResult();
    if(window.screen.width >1200){
      this.appendInfo=true;
    }
  }
  
/*
* get student assessments result 
*/
getStudentQuizResult() {
  this.assessmentService.getAssessmentResultById(this.assessmentResultId)
  .subscribe(response=> {
    if(response['data'])
      this.assessmentResultDetails=response['data'].questions;
  },error=>{
    this.handleError(error);
  });
}

  // Handle error
  handleError(error) {
    this.messageService.showErrorToast(this._vcr,error.json().msg);
    this.errorService.handleError(error, this._vcr);
  }
}
