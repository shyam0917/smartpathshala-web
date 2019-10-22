import { Component, OnInit, ViewContainerRef, Inject, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { OnClickEvent, OnRatingChangeEven, OnHoverRatingChangeEvent} from "angular-star-rating/star-rating-struct"
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CourseService } from './../../shared/services/courses/course.service';
import { StudentService } from './../../shared/services/students/student.service';
import { AuthenticationService } from './../../shared/services/common/authentication.service';
import { AssignCourseService } from './../../shared/services/assign-courses/assign-course.service';
import { MessageConfig } from './../../shared/config/message-config.constants';
import { ErrorService } from './../../shared/services/common/error.service';
import { CommonConfig } from './../../shared/config/common-config.constants';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { MessageService } from './../../shared/services/common/message.service';

@Component({
	selector: 'app-stu-course-detail',
	templateUrl: './stu-course-detail.component.html',
	styleUrls: ['./stu-course-detail.component.css'],
	providers : [ CourseService, StudentService, AssignCourseService ]
})

export class StuCourseDetailComponent implements OnInit {
	@ViewChild('rateModal') rateModal: ElementRef;
  public courseId: any;
  public courseData: any;
  public errorMessage: any;
  public topicData : any;
  public subTopicData: any;
  public urlPrefix: any;
  public flow= 'assign';
  public feedbackLength= 1;
  public colors = ['#ba68c8','#7986cb','#81c784','#ffb74d','#e57373'];
  public rating: number =0;
  public title: String;
  public description: String;
  public ratingForm: FormGroup;
  private fb: FormBuilder;
  public learningProgressStatus= CommonConfig.LEARNING_PROCESS_STATUS;
  role:string;
  coursAction:string='Start Course';
  courseStatus:string;
  CONFIG:any=CommonConfig;
  showValidationError:boolean=false;
  isHistoryAvailable:boolean=false;
  isUpdateAvailable:boolean=false;
  constructor(
    @Inject(FormBuilder) fb : FormBuilder,
    private route : ActivatedRoute,
    private courseService: CourseService,
    private studentService: StudentService,
    private authenticationService: AuthenticationService,
    private assignCourseService: AssignCourseService,
    private messageService : MessageService,
    private errorService: ErrorService,
    private toastr: ToastsManager,
    private _vcr: ViewContainerRef,
    private router: Router,
    ) { 
    this.toastr.setRootViewContainerRef(_vcr);
    this.fb = fb;
    this.ratingForm = this.fb.group({
      title: ['', [Validators.required,  Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(300)]],
    });
  }

  ngOnInit() {
    this.role=this.authenticationService.userRole;
    this.urlPrefix = this.authenticationService.userRole.toLowerCase();
    if(this.role!==CommonConfig.USER_STUDENT) {
      this.courseId=this.route.snapshot.params.courseId;
    }else {
      this.courseId=this.route.snapshot.params.id;
      sessionStorage.setItem("courseId",this.courseId);
    }
    this.getCourseDetails(this.courseId);
  }

  // Rotate the arrow icon
  rotate(id) {
    document.getElementById(id).classList.toggle('rotate-up');
    document.getElementById(id).classList.toggle('rotate-down');
  }

  /*get course detail on courseid basis*/
  getCourseDetails(courseId: any) {
    if(courseId) {
      this.messageService.showLoader.emit(true);
      let getCourse$;
      if(this.role === CommonConfig.USER_STUDENT) {
        getCourse$=this.studentService.getCourse(this.courseId,'course_details_q1');
      }
      if(this.role!==CommonConfig.USER_STUDENT) {
        getCourse$=this.courseService.getCourseForPerview(this.courseId);
      }
      getCourse$.subscribe(response=> {
        this.messageService.showLoader.emit(false);
        if(this.router.url.includes('validate-course') && this.role!==CommonConfig.USER_STUDENT) {
          this.getCourseValidationTracking(this.courseId);
        }
        if(response['data']) {
          if(this.role!==CommonConfig.USER_STUDENT) {
            this.courseData=response['data'];
          }else {
            this.isHistoryAvailable=false;
            this.isUpdateAvailable=false;
            this.coursAction='Start Course';
            if(response['data'].courseDetails) {
              this.courseData=response['data'].courseDetails;
              if(this.courseData.status) {
                this.courseStatus=this.courseData.status;
                if(this.courseStatus === this.learningProgressStatus[1]) {
                  this.coursAction='Resume Course';
                }
                else if(this.courseStatus === this.learningProgressStatus[2]) {
                  this.coursAction='Revise Course';
                }
              }
            }
            if(response['data'].isHistoryAvailable) {
              this.isHistoryAvailable=response['data'].isHistoryAvailable;
            }
            if(response['data'].isUpdateAvailable) {
              this.isUpdateAvailable=response['data'].isUpdateAvailable;
            } 
          //this.setFeedback(this.courseData.userRating);
        }
        this.topicData=this.courseData.topics;
      }
    },error=> {
      this.handleError(error);
      if (error.status === 401) {
        this.messageService.errorMessage(MessageConfig.TOKEN_CONFIG.SESSION_TIMEOUT, error.json().msg);
        this.authenticationService.logout();
      } else{
        this.errorMessage = error.json().msg;
      }
    });
    }
  }

	// Set user feedback data
	setFeedback(userRating){
    if(userRating) {
      this.ratingForm = this.fb.group({
        title: [ userRating.title || '', [Validators.required,  Validators.maxLength(100)]],
        description: [ userRating.description || '', [Validators.required, Validators.maxLength(300)]],
      });
      this.rating = userRating.rating || 0;
    }
  }

  // Back button Method 
  back(){
    this.router.navigate(['/', this.urlPrefix, 'mycourses']);
  }

  /*show more feedback*/
  showMoreFeedback(){
  	// this.feedbackLength=this.feedback.length;
  }

  /*show less feedback*/
  showLessFeedback(){
  	this.feedbackLength=1;
  }

	// click event on rating component
  onClick = (event) => {
  	this.rating = event.rating;
  };

  // Rate the selected assigned course
  rateCourse(formData : any) {
  	let ratingData= {
  		"title": formData.get('title').value,
  		"description": formData.get('description').value,
  		"rating": this.rating
  	}
    this.messageService.showLoader.emit(true);
    this.assignCourseService.rateAssignCourse(this.courseId,ratingData)
    .subscribe(response=> {
      this.messageService.showLoader.emit(false);
      if(response['data'] && response['data'].courseRating) {
        // this.courseRating=response['data'].courseRating;
        this.toastr.success("Success", MessageConfig.STUDENT_CONFIG.COURSE_RATING_SUBMIT_SUCCESSFULLY);
        this.rateModal.nativeElement.click();
        this.getCourseDetails(this.courseId);
      }
    },error=> {
      if (error.status === 401) {
        this.messageService.errorMessage(MessageConfig.TOKEN_CONFIG.SESSION_TIMEOUT, error.json().msg);
        this.authenticationService.logout();
        this.handleError(error);
      } else{
        this.errorMessage = error.json().msg;
        this.handleError(error);
      }
    });
  }

//on click start course
startCourse() {
  if(this.role!==CommonConfig.USER_STUDENT) {
    this.router.navigate(['/',this.urlPrefix,'courses',this.courseId,'play-contents']);
  }else {
    this.router.navigate(['/',this.urlPrefix,'course-details',this.courseId,'play-contents']);
  }
}
// Handle error
handleError(error) {
  this.messageService.showLoader.emit(false);
  this.errorService.handleError(error, this._vcr);
}

//get course validation tracking
getCourseValidationTracking(courseId:string) {
  this.messageService.showLoader.emit(true);
  this.courseService.getCourseValidationTracking(courseId).subscribe(response=> {
    this.messageService.showLoader.emit(false);
    if(response['data'] && response['data'].validationTracking) {
      this.showValidationError=true;
      this.courseData=response['data'].validationTracking;
      if(!this.courseData.status || this.courseData.status!= CommonConfig.CONTENT_STATUS[3] ) {
        this.router.navigate(['/',this.urlPrefix,'courses',this.courseId,'course-preview']);
      }
    }
  },error=> {
    this.errorMessage = error.json().msg;
    this.handleError(error);
  })
}

// confirmation for course version update
confirmUpdateCourseVerion(upgrade:boolean = false) {
  if(upgrade) {
    let text= 'Once you upgrade course, you will lost your course status tracking for this course !';
    this.messageService.confirmation(text,"Upgrade",()=> {
      this.messageService.showLoader.emit(true);
      this.updateCourseVersion(upgrade);
    },'Upgrade');
  }else {
    let text= 'Are you sure to get your last taken course version from history?';
    this.messageService.confirmation(text,"Confirm",()=> {
      this.messageService.showLoader.emit(true);
      this.updateCourseVersion(upgrade);
    },'Upgrade');
  }
}

// update course version -upgrade or downgrade
updateCourseVersion(upgrade: boolean) {
  this.messageService.showLoader.emit(true);
  this.studentService.updateCourseVersion({courseId:this.courseId,upgrade})
  .subscribe(response=> {
    this.messageService.showLoader.emit(false);
    if(response['msg']) {
      this.messageService.showInfoToast(this._vcr,response['msg']);
      setTimeout(()=> {
        this.getCourseDetails(this.courseId);
      },200);
    }
    if(response['success']) {
    }
  },error=> {
    this.errorMessage = error.json().msg;
    this.handleError(error);
  })
}

}
