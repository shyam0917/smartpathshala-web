import { Component, OnInit,Inject ,Input, ViewContainerRef} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import {InstructorService} from './../../../services/instructors/instructors.service';
import { AuthenticationService } from './../../../services/common/authentication.service';
import { CommonConfig } from './../../../config/common-config.constants';
import { ValidationConfig } from './../../../config/validation-config.constants';
import { MessageService } from './../../../services/common/message.service';
import { ErrorService } from './../../../services/common/error.service';
import { SkillService } from './../../../services/skills/skill.service';



@Component({
  selector: 'app-add-instructor',
  templateUrl: './add-instructor.component.html',
  styleUrls: ['./add-instructor.component.css'],
  providers:[InstructorService, SkillService]
})
export class AddInstructorComponent implements OnInit {
  public role: string="";
  public urlPrefix: string="";
  public permissions = [];
  public errorMessage : any;
  public skills : any;
  public skillsConfig : any;
  public selectedSkills : any = [];
  public skillList : any;
  public backendErrorMsg : any = [];

  instructorFormData:FormGroup;
  genders=['Male','Female'];
  constructor(
    @Inject(FormBuilder) fb:FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private instructorService : InstructorService,
    private errorService : ErrorService,
    private messageService : MessageService,
    private skillService : SkillService,
    private _vcr : ViewContainerRef,){

    this.instructorFormData=fb.group({
      name:['',[Validators.required]],
      email: ['',[Validators.required,Validators.pattern(ValidationConfig.EMAIL_PATTERN)]],
      mobile: ['',[Validators.required,Validators.maxLength(10),Validators.pattern(ValidationConfig.MOB_NO_PATTERN)]],
      gender:['',[Validators.required]],
      address:['',[Validators.required]],
      codestripperId:['',[Validators.required]],
      codestripperEmail:['',[Validators.required,Validators.pattern(ValidationConfig.EMAIL_PATTERN)]],
      // technicalSkills:['',[Validators.required]],
    });
  }

  ngOnInit() {
    this.role=this.authenticationService.userRole;
    this.permissions = this.authenticationService.setPermission(CommonConfig.PAGES.STUDENTS);
    this.urlPrefix = this.authenticationService.userRole.toLowerCase();
    this.getAllSkills();
  }



// Multiselect configuraton
configDropDown() {
  this.skillsConfig = {
    singleSelection: false,
    text:"Select Catogiries",
    selectAllText:'Select All',
    unSelectAllText:'UnSelect All',
    enableSearchFilter: true,
  };
}
/* to get all skill request */
getAllSkills(){
  this.skillService.listAll().subscribe((response)=>{
    if(response.data){
      this.skills = response.data;
      this.skillList= this.skills.map((skill, index)=>{
        let data = {
          "id":index,
          "itemName":skill.title
        }
        return data;
      })
    }
  },error=>{
    this.errorMessage=error.json().msg;
    this.handleError(error);
  })
}

/* save instructor data */
save(instructorData:any) {
  let skills=[];
  if(this.selectedSkills.length>0) {
    skills=this.selectedSkills.map((skill)=>{
      return skill.itemName;
    })
  } else {
    return this.messageService.showErrorToast(this._vcr,"Please select skills");
  }

  let data = {
    name:instructorData.get('name').value,
    email:instructorData.get('email').value,
    mobile:instructorData.get('mobile').value,
    gender:instructorData.get('gender').value,
    address:instructorData.get('address').value,
    codestripperId:instructorData.get('codestripperId').value,
    codestripperEmail:instructorData.get('codestripperEmail').value,
    technicalSkills:skills,
  }
  this.messageService.showLoader.emit(true);
  this.instructorService.save(data).subscribe((response)=>{
    if(response.success) {
      this.messageService.successMessage('Course', response.msg);
      this.router.navigate(['/', this.urlPrefix, 'instructors']);
      this.messageService.showLoader.emit(false);
    } else {
      this.errorMessage=response.msg;
    }
  },(error: any)=> {
    this.errorMessage=error.json().msg;
    this.handleError(error);
  })
}

  // Handle error
  handleError(error) {
    this.messageService.showLoader.emit(false);
    if(error.status===500) {
      this.backendErrorMsg= this.errorService.iterateError(error);
    } else {
      this.errorService.handleError(error, this._vcr);
    }
  }

  // Initialize form data
  initializeForm() {
    this.instructorFormData.reset();
  }
}
