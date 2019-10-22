import { Component, OnInit, Inject, ViewContainerRef } from '@angular/core';
import { FormGroup,FormBuilder,Validators} from '@angular/forms';
import { Headers, RequestOptions } from '@angular/http';
import { ProfileService } from './../../../services/profiles/profiles.service';
import { AuthenticationService } from './../../../services/common/authentication.service';
import { ValidationConfig } from './../../../config/validation-config.constants';
import { CommonConfig } from './../../../config/common-config.constants';
import { MessageConfig } from './../../../config/message-config.constants';
import { AppConfig } from './../../../config/app-config.constants';
import { StudentService } from './../../../services/students/student.service';
import { InstructorService } from './../../../services/instructors/instructors.service';
import { AdminService } from './../../../services/admins/admins.service';
import { MessageService } from './../../../services/common/message.service';
import { ErrorService } from './../../../services/common/error.service';

@Component({
	selector: 'app-address',
	templateUrl: './address.component.html',
	styleUrls: ['./address.component.css'],
	providers : [StudentService, InstructorService,AdminService]
})
export class AddressComponent implements OnInit {
	profileAddressForm: FormGroup;
	public fb:FormBuilder;
	public options: RequestOptions;
	public errorMessage : any = '';
	public userData: any = {} ;
	public userId : any;
	public userRole : any;

	constructor(
		@Inject(FormBuilder)fb:FormBuilder,
		private profileService : ProfileService,
		private loginService: AuthenticationService,
		private studentService: StudentService,
    private adminService:AdminService,
		private instructorService : InstructorService,
		private messageService : MessageService,
		private errorService: ErrorService,
		private _vcr : ViewContainerRef
		) {
		this.fb=fb;
		this.intializeForm(fb);
	}

	intializeForm(fb:FormBuilder,data:any={}):void{
		this.profileAddressForm=fb.group({
			address1: [data.address1 || '',[Validators.required,Validators.minLength(5),Validators.maxLength(200)]],
			address2: [data.address2 || '',[]],
			city: [data.city || '',[Validators.required,Validators.minLength(2),Validators.maxLength(50)]],
			state: [data.state || '',[Validators.required,Validators.minLength(2),Validators.maxLength(50)]],
			pincode: [data.pincode || '',[Validators.required,Validators.maxLength(6)]],
			country: [data.country || '',[Validators.required,Validators.minLength(2)]],
		});
	}

	ngOnInit() {
		this.userRole= this.loginService.userRole;
		this.getUserDetail();
	}
	    
    // update profile address data into db 
    profileAddress(data:any)
    {
    	let addressData= {
    		address1:data.get('address1').value.trim(),
    		address2:data.get('address2').value.trim(),
    		city:data.get('city').value.trim(),
    		state:data.get('state').value.trim(),
    		pincode:data.get('pincode').value.trim(),
    		country:data.get('country').value.trim(),
    		role : this.userRole
    	}
    	this.messageService.showLoader.emit(true);
    	this.profileService.profileAddress(addressData).subscribe(response=>{
    		if(response['success']) {
    			this.messageService.showLoader.emit(false);
    			this.messageService.successMessage('Address', 'Successfully Changed');
    		}
    	}, error=>{
    		this.errorMessage=error.json().msg;
    		this.handleError(error);
    	});
    }
    
    // Get user details from db by role
    getUserDetail(){
      let $userService= this.getUserInfo(this.userRole);
      if($userService) {
        $userService.subscribe(response=>{
          if(response.data){
            this.profileService.updateProfile.emit(response.data);
            this.userData=response.data;
            this.intializeForm(this.fb,this.userData.address);
          }
          else {}
        }, (error:any)=> {
          this.errorMessage=error.json().msg; 
          this.handleError(error);
        });
      }
    }
    // switch to user service by role
     getUserInfo(role){
       let $userService;
       switch(role) {
         case CommonConfig.USER_INSTRUCTOR:
         $userService= this.instructorService.findInstructorInfo();
         break;
         case CommonConfig.USER_STUDENT:
         $userService= this.studentService.findStudentInfo();
         break;
         case CommonConfig.USER_ADMIN:
         $userService= this.adminService.findAdminInfo();
         break;
       }
       return $userService;
     }

    handleError(error) {
    	this.messageService.showLoader.emit(false);
    	this.errorService.handleError(error, this._vcr);
    }
  }
