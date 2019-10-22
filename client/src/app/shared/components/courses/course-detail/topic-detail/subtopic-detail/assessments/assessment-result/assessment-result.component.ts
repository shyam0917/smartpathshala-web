import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import * as moment from 'moment/moment';
import { AssessmentService } from './../../../../../../../services/assessments/assessment.service';
import { AuthenticationService } from './../../../../../../../services/common/authentication.service';
import { MessageService } from './../../../../../../../services/common/message.service';
import { ErrorService } from './../../../../../../../services/common/error.service';
import { CommonConfig } from './../../../../../../../config/common-config.constants';

@Component({
  selector: 'app-assessment-result',
  templateUrl: './assessment-result.component.html',
  styleUrls: ['./assessment-result.component.css'],
  providers: [ AssessmentService ]
})
export class AssessmentResultComponent implements OnInit {
  assessmentResults:any=[];
  appendInfo:boolean=false;
  urlPrefix: string;
  assessmentInfo:any={};
  config:any=CommonConfig;
  role:string;
  courseId:string;
  assessmentId:string;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private assessmentService: AssessmentService,
    private _vcr: ViewContainerRef,
    private authenticationService: AuthenticationService,
    private messageService: MessageService,
    private errorService: ErrorService
    ) { }

  ngOnInit() {
    this.role=this.authenticationService.userRole;
    this.courseId=this.route.snapshot.params['courseId'];
    this.assessmentId=this.route.snapshot.params['assessmentId'];
    this.urlPrefix = this.role.toLowerCase();
    this.getAssessmentResult();
    if(window.screen.width >1200){
      this.appendInfo=true;
    }
  }

//on resize screen event
onResize(event){
  this.appendInfo=(event.target.innerWidth>1200) ? true: false;
}
/*
* get assessment result details
*/
getAssessmentResult(){
  this.assessmentService.getStudentAssessmentResult(this.assessmentId)
  .subscribe(response=> {
    if(response['data']) {
      this.assessmentResults=response['data'];
      if(this.assessmentResults[0]) {
        this.assessmentInfo=this.assessmentResults[0]
      }
    }
  },error=> {
    this.handleError(error);
  });

}

  //to get just date text from ISO date format
  formatDate(dataTimeStr){
    if(!dataTimeStr || dataTimeStr==="") {
      return '';
    }
    let date = new Date(dataTimeStr);
    return moment(date).format('DD/MM/YYYY');
  }

  // Handle error
  handleError(error) {
    this.errorService.handleError(error, this._vcr);
    this.messageService.showErrorToast(this._vcr,error.json().msg);
  }
}
