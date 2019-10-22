import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentsListComponent } from './assessments-list.component';

describe('AssessmentsListComponent', () => {
  let component: AssessmentsListComponent;
  let fixture: ComponentFixture<AssessmentsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssessmentsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
