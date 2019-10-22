import { Component, OnInit, OnDestroy,ViewChild,ElementRef, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { SchoolService } from './../../services/schools/school.service';
import { AuthenticationService } from './../../services/common/authentication.service';
import { MessageService } from './../../services/common/message.service';
import { ErrorService } from './../../services/common/error.service';

@Component({
  selector: 'app-schools',
  templateUrl: './schools.component.html',
  styleUrls: ['./schools.component.css'],
  providers: [SchoolService]
})

export class SchoolsComponent implements OnInit,OnDestroy {
  @ViewChild('close')close: ElementRef;
  public errorMessage: string="";
  public urlPrefix: string="";
  public schools:any=[];
  public dataArr: any=[];
  public schDetails: any={};
  public totalItems: number = 0;
  public currentPage: number = 1;
  public itemsPerPage: number = 8;

  constructor(
    private schoolService: SchoolService,
    private messageService: MessageService,
    private errorService: ErrorService,
    private _vcr : ViewContainerRef,
    private authenticationService: AuthenticationService,
    private router: Router
    ) { }

  ngOnInit() {
    this.urlPrefix = this.authenticationService.userRole.toLowerCase();
    this.getSchools();
  }

  /*pagination logic start here*/
  public setPage(pageNo: number): void {
    this.currentPage = pageNo;
  }

  public pageChanged(event: any): void {
    this.currentPage = event.page;
    this.paginationData();
  }

  paginationData() {
    const indexOfLastItem = this.currentPage * this.itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - this.itemsPerPage;
    this.schools = this.dataArr.slice(indexOfFirstItem, indexOfLastItem);
  }
  /*pagination logic end here*/

  //delete school based on id
  delete(_id:string):void {
    this.messageService.deleteConfirmation(()=>{
      this.schoolService.deleteSchool(_id).subscribe(data=>{
        this.messageService.successMessage('School', 'Successfully Deleted');
        this.getSchools();
      },(error:any)=>{
        this.errorMessage=error.json().msg;
        this.handleError(error);
      });
    })
  }

 //get school data based on id
 getSchoolDetails(id:string,i:number) {
   this.schDetails=this.schools.find(ele=>ele._id === id);
   this.schDetails['index']=i;
 }

//get all schools
getSchools() {
  this.schoolService.getSchools().subscribe(
    response=>{ 
      if(response['success'] && response['data']) {
        this.schools=response['data'];
        this.dataArr=response['data'];;
        this.totalItems=response['data'].length;
        this.paginationData();
      }
    },error=>{
      this.errorMessage=error.json().msg;
      this.handleError(error);
    });
}

//redirect to school website
redirectToWebsite(url: string){
  if(!url.startsWith('http')) {
    url='https://'+url;
  }
  window.open(url, "_blank");
}

//called on component destroy 
ngOnDestroy(){
  this.close.nativeElement.click();
}

 // Handle error
 handleError(error) {
   this.errorService.handleError(error, this._vcr);
 }
}
