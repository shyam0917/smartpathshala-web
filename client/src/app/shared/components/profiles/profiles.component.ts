import { Component, OnInit, Inject } from '@angular/core';


@Component({
  selector: 'app-profiles',
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.css'],
})
export class ProfilesComponent implements OnInit {
public sidebar =['Profile', 'Change password','Address','academic details','social profile'];
public icons =['fa fa-lock', 'fa fa-key'];
public profileSection='Profile';

  constructor() {
  
  }
  ngOnInit() {}
		changeProfileSection() {
		 this.profileSection='Profile';
	}
	// click on tab password
	changeProfilepassword() {
		this.profileSection='Change password';
	}
	// click on tab profile address
	profileAddress()
	{
		this.profileSection='Address';
	}
	// click on tab acadmicdetails
	academicDetails()
	{
       this.profileSection='academic details';
	}
	// click on tab social profile
	socialProfileDetails()
	{
		this.profileSection='social profile';
	}
}
