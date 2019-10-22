import { Component, OnInit,Inject ,Input, ViewContainerRef} from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { StudentService } from './../../../services/students/student.service';
import { SchoolService } from './../../../services/schools/school.service';
import { ValidationConfig } from './../../../config/validation-config.constants';
import { AuthenticationService } from './../../../services/common/authentication.service';
import { MessageService } from './../../../services/common/message.service';
import { ErrorService } from './../../../services/common/error.service';
import { CommonConfig } from './../../../config/common-config.constants';

@Component({
  selector: 'manage-add-student',
  templateUrl: './manage-student.component.html',
  styleUrls: ['./manage-student.component.css'],
  providers:[StudentService, SchoolService]
})
export class ManageStudentComponent implements OnInit {

  public stuForm: FormGroup;
  public fb:FormBuilder;
  public genders=['Male','Female'];
  public schools:any;
  public role :string="";
  public schoolId :string="";
  public urlPrefix : String;
  errorMessage: string;
  successMessage: string;
  formType:string="add";
  _id: string;
  status : any =CommonConfig.STATUS;

  constructor(
    @Inject(FormBuilder)
    fb:FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private studentService: StudentService,
    private schoolService: SchoolService,
    private errorService: ErrorService,
    private _vcr : ViewContainerRef,
    private authenticationService: AuthenticationService,
    private messageService: MessageService,
    ){
    this.fb=fb;
    this.intializeForm(fb);
  }

  //intialize form 
  intializeForm(fb:FormBuilder,data:any={}):void{
    this.stuForm=fb.group({
      name: [data.name || '',[Validators.required,Validators.pattern(ValidationConfig.LETTERS_PATTERN)]],
      // lastName: [data.lastName || '',[Validators.required,Validators.pattern(ValidationConfig.NAME_PATTERN)]],
      email: [data.email || '',[Validators.required,Validators.pattern(ValidationConfig.EMAIL_PATTERN)]],
      mobile: [data.mobile || '',[Validators.required,Validators.maxLength(10),Validators.pattern(ValidationConfig.MOB_NO_PATTERN)]],
      gender: [data.gender || '',[Validators.required]],
      schoolId: [data.schoolId || '',[Validators.required]],
      class: [data.class || '',[Validators.required]],
      status: [data.status || CommonConfig.STATUS.ACTIVE]   
    });
  }

  ngOnInit() {
    this.urlPrefix = this.authenticationService.userRole.toLowerCase();
    this.role = this.authenticationService.userRole;
    let studentId = this.route.snapshot.params['id'];
    // let userId = this.authenticationService.getUserId();
    this.getRoleBaseData(()=>{
      if(studentId) {
        this.formType='edit';
        this.getStudent(studentId);
      }
    });
  }
  
  //get school data based on user
  getRoleBaseData(callback:()=>void):void{
    if(this.role) {
      if(this.role!=="School") {
        this.messageService.showLoader.emit(true);
        this.schoolService.getSchools().subscribe(
          response=>{ 
            this.messageService.showLoader.emit(false);
            if(response['success'] && response['data']){
              this.schools=response['data'];
              callback();
            }
          },error=>{
            this.errorMessage=error.json().msg;
            this.handleError(error);
          });
      }else {
        this.messageService.showLoader.emit(true);
        this.schoolService.getSchoolData().subscribe(
          response=> {
            this.messageService.showLoader.emit(false);
            if(response['success'] && response['data']){
              let data=response['data'];
              this.schoolId=data.schoolId;
              callback();
            }
          },error=>{
            this.errorMessage=error.json().msg;
            this.handleError(error);
          });
      }
    }
  }

  //on registration form submit 
  register():void{
    this.errorMessage="";
    this.successMessage="";
    let student= this.getFormValue();
    if(this.role==="School") {
      student.schoolId=this.schoolId;
    }
    this.messageService.showLoader.emit(true);
    this.studentService.save(student).subscribe(data=>{
      this.messageService.showLoader.emit(false);
      if(data['success']){
        // this.successMessage=data.msg;
        this.messageService.successMessage("Student","Added successfully",()=>{
          this.router.navigate(['/', this.urlPrefix, 'students']);
        });
      }
    },error=>{
      this.errorMessage=error.json().msg;
      this.handleError(error);
    })
  }
  
  //get form value
  getFormValue():any{
    return {
      name: this.stuForm.get('name').value,
      email: this.stuForm.get('email').value,
      mobile: this.stuForm.get('mobile').value,
      gender: this.stuForm.get('gender').value,
      class: this.stuForm.get('class').value,
      schoolId: this.stuForm.get('schoolId').value,
      status: this.stuForm.get('status').value,
    }
  }

  //get student data based on id 
  getStudent(studentId):void {
    this.messageService.showLoader.emit(true);
    this.studentService.findById(studentId).subscribe(
      response=> {
        this.messageService.showLoader.emit(false);
        if(response['success'] && response['data']){
          this.displayData(response.data)
        }
      },error=>{
        this.errorMessage=error.json().msg;
        this.handleError(error);
      });
  }

  //display data on form 
  displayData(data:any):void{
    this._id=data._id;
    this.intializeForm(this.fb,data);
  };

  //on update 
  update():void {
    this.errorMessage="";
    this.successMessage="";
    let student = this.getFormValue();
    this.messageService.showLoader.emit(true);
    this.studentService.update(student,this._id).subscribe(data=>{
      this.messageService.showLoader.emit(false);
      if(data['success']) {
        this.successMessage=data.msg;
        this.messageService.successMessage("Student","Updated successfully ",()=>{
          this.router.navigate(['/', this.urlPrefix, 'students']);
        });
      }
    }, error=>{
       this.handleError(error);
      this.errorMessage=error.json().msg;
    });
  }
  // Handle error
 handleError(error) {
   this.messageService.showLoader.emit(false);
   this.errorService.handleError(error, this._vcr);
 }

}


