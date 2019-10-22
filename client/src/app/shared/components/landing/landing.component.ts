import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';

import { StudentService } from '../../services/students/student.service';
import { CommonConfig } from './../../config/common-config.constants';
import { MessageService } from './../../services/common/message.service';
import { MessageConfig } from './../../config/message-config.constants';
import { AuthenticationService } from './../../services/common/authentication.service';
import { ErrorService } from './../../services/common/error.service';


@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
  providers: [StudentService]
})
export class LandingComponent implements OnInit {
	public errorMessage: any;
	public urlPrefix: any;

  constructor(
    private router: Router,
    private studentService: StudentService,
    private messageService: MessageService,
    private authenticationService: AuthenticationService,
    private errorService: ErrorService,
    private _vcr : ViewContainerRef,
    ) { 
    this.navigateUser();
  }

  ngOnInit() {
  }

  //fetch courses and navigate user 
  navigateUser(){
    this.urlPrefix = this.authenticationService.userRole.toLowerCase();
    this.errorMessage='';
    this.messageService.showLoader.emit(true);
    this.studentService.getCourses(CommonConfig.COURSESFLAG.THREE).subscribe((res: any) => {
      this.messageService.showLoader.emit(false);
      if (res.data && res.data >0) {
        this.router.navigate(['/', this.urlPrefix, 'mycourses']);
      } else {
        this.router.navigate(['/', this.urlPrefix, 'allcourses']);
      }
    },error => {
      this.handleError(error);
    });
  }
  
  // Handle error
  handleError(error) {
  	this.errorMessage = error.json().msg;
    this.errorService.handleError(error, this._vcr);
  }

}
