import { Component, OnInit,Inject ,Input, ViewContainerRef} from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SchoolService } from './../../../services/schools/school.service';
import { ValidationConfig } from './../../../config/validation-config.constants';
import { AuthenticationService } from './../../../services/common/authentication.service';
import { MessageService } from './../../../services/common/message.service';
import { ErrorService } from './../../../services/common/error.service';
import { CommonConfig } from './../../../config/common-config.constants';

@Component({
  selector: 'app-manage-school',
  templateUrl: './manage-school.component.html',
  styleUrls: ['./manage-school.component.css'],
  providers:[SchoolService]

})
export class ManageSchoolComponent implements OnInit {

  public schForm: FormGroup;
  public fb:FormBuilder;
  public schools:any;
  public schoolId :string="";
  public urlPrefix :string="";
  errorMessage: string;
  successMessage: string;
  formType:string = "add";
  _id: string;
  status : any = CommonConfig.STATUS.ACTIVE;

  constructor(
    @Inject(FormBuilder)
    fb:FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
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
  intializeForm(fb:FormBuilder,data:any={}):void {
    this.schForm=fb.group({
      schoolName: [data.schoolName || '',[Validators.required,Validators.pattern(ValidationConfig.LETTERS_PATTERN)]],
      email: [data.email || '',[Validators.required,Validators.pattern(ValidationConfig.EMAIL_PATTERN)]],
      phoneNo: [data.phoneNo || '',[Validators.required,Validators.maxLength(10),Validators.pattern(ValidationConfig.MOB_NO_PATTERN)]],
      address: [data.address || '',[Validators.required]],
      city: [data.city || '',[Validators.required,Validators.pattern(ValidationConfig.LETTERS_PATTERN)]],
      state: [data.state || '',[Validators.required,Validators.pattern(ValidationConfig.LETTERS_PATTERN)]],
      zipCode: [data.zipCode || '',[Validators.required,Validators.pattern(/^\d{6}$/)]],
      website: [data.website || '',[Validators.pattern(/^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/)]],
      status: [data.status || CommonConfig.STATUS.ACTIVE]    
    });
  }

  ngOnInit() {
    this.urlPrefix = this.authenticationService.userRole.toLowerCase();
    let schoolId = this.route.snapshot.params['id'];
    if(schoolId){
      this.formType='edit';
      this.fetchSchool(schoolId);
    }
  }

  //get form value
  getFormValue():any {
    return {
      schoolName: this.schForm.get('schoolName').value,
      email: this.schForm.get('email').value,
      phoneNo: this.schForm.get('phoneNo').value,
      address: this.schForm.get('address').value,
      city: this.schForm.get('city').value,
      state: this.schForm.get('state').value,
      zipCode: this.schForm.get('zipCode').value,
      website: this.schForm.get('website').value,
      status: this.schForm.get('status').value,
    }
  }

    //on registration form submit 
    register():void {
      this.errorMessage="";
      this.successMessage="";
      let school= this.getFormValue();
      this.schoolService.save(school).subscribe(data=>{
        if(data['success']){
          this.successMessage=data.msg;
          this.messageService.successMessage("School","Added successfully",()=>{
            this.router.navigate(['/', this.urlPrefix, 'schools']);
          });
        }
      },error=>{
        this.errorMessage=error.json().msg;
        this.handleError(error);
      })
    }

  //on update 
  update():void {
    this.errorMessage="";
    this.successMessage="";
    let school = this.getFormValue();
    this.schoolService.update(school,this._id).subscribe(data=>{
      if(data['success']) {
        this.successMessage=data.msg;
        this.messageService.successMessage("School","Updated successfully ",()=>{
          this.router.navigate(['/', this.urlPrefix, 'schools']);
        });
      }
    }, error=>{
      this.errorMessage=error.json().msg;
      this.handleError(error);
    });
  }

  //get school data based on id 
  fetchSchool(schoolId):void {
    this.schoolService.getSchool(schoolId).subscribe(
      response=>{
        if(response['success'] && response['data']){
          this.displayData(response.data)
        }
      },error=>{
        this.errorMessage=error.json().msg;
        this.handleError(error);
      });
  }

  //display data on form 
  displayData(data:any):void {
    this._id=data._id;
    this.intializeForm(this.fb,data);
  }

 // Handle error
 handleError(error) {
   this.errorService.handleError(error, this._vcr);
 }
}