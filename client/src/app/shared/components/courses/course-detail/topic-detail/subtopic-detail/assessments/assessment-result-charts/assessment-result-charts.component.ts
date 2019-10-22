import { Component, OnInit, Input, OnChanges} from '@angular/core';

@Component({
  selector: 'app-assessment-result-charts',
  templateUrl: './assessment-result-charts.component.html',
  styleUrls: ['./assessment-result-charts.component.css']
})
export class AssessmentResultChartsComponent implements OnInit, OnChanges {
  @Input() assessmentType;
  @Input() result;

  answerStaus:any=["Correct","Incorrect"];
  qusStatus:any= ['Attempted',"Skipped"];
  levels=['Basic','Intermediate','Expert'];
  
  assessmentResult: any={};

  daughnutCharts:any=[];
  barCharts:any=[];

  constructor() { }

  ngOnInit() {

  }

  ngOnChanges() {
    this.assessmentResult= this.result;
    if(this.assessmentResult && this.assessmentResult.questions) {
      let questions= this.assessmentResult.questions;
      this.generateDaughnutChartData(questions,this.assessmentResult);
      this.generateBarChartData(questions,this.assessmentResult);
    }
  }

  //calculate daugnut chart data
  generateDaughnutChartData(questions: any,assessmentResult: any) {
    this.overAllStatus(questions);
    this.accuracyLevel(questions);
    this.marksAccuracyLevel(assessmentResult);
  }

  //over all status of assessment result
  overAllStatus(questions:any) {
    let {correctAns,incAns,skippedQus}=this.calculateAssesmentStatus(questions);
    this.daughnutCharts.push({
      labels: [" Correct"," Incorrect"," Not Attempted"],
      data: [correctAns,incAns,skippedQus],
      text: questions.length,
      title: 'Question Wise Performance',
      toolTipTitle: 'Total Questions : '+questions.length,
    });
  }

  //calculate assessment over all status (correct, incorrect, skipped)
  calculateAssesmentStatus(questions) {
    let correctAns=0,incAns=0,skippedQus=0;
    questions.forEach(q=> {
      if(q.ansStatus== this.answerStaus[0]) ++correctAns;
      if(q.ansStatus== this.answerStaus[1]) (q.status==this.qusStatus[1])? ++skippedQus : ++incAns;
    });
    return {correctAns,incAns,skippedQus}
  }

  //accuracy level charts data
  accuracyLevel(questions:any) {
    let correctAns=0,incAns=0;
    let attemptedQuestions = questions.filter(q=> q.status==this.qusStatus[0]);
    attemptedQuestions.forEach(q=> {
      if(q.ansStatus== this.answerStaus[0]) ++correctAns;
      if(q.ansStatus== this.answerStaus[1]) ++incAns;
    });
    let accuracy=((correctAns*100)/+attemptedQuestions.length).toFixed(2);
    this.daughnutCharts.push({
      labels: [" Correct"," Incorrect"],
      data: [correctAns,attemptedQuestions.length-correctAns],
      text: accuracy+ ' %',
      type: '1_to_1',
      title: 'Accuracy',
      toolTipTitle: 'Total Attempted : '+attemptedQuestions.length,
    });
  }

  //marks accuracy level
  marksAccuracyLevel(assessmentResult:any) { 
    if(!assessmentResult.score || !assessmentResult.totalMarks) return;
    let score=assessmentResult.score,totalMarks=assessmentResult.totalMarks;
    this.daughnutCharts.push({
      labels: [" Marks Obtained"," Marks Not Obtained"],
      data: [score,totalMarks-score],
      text:  score+' / '+assessmentResult.totalMarks,
      type: '1_to_1',
      title: 'Score',
      toolTipTitle: 'Total Marks : '+totalMarks,
    });
  }

  //generate bar chart data
  generateBarChartData(questions: any, assessmentResult: any) {
    let datasets= [
    { label: "Correct", backgroundColor: "#28a745", data: [] },
    { label: "Incorrect", backgroundColor: "#dc3545", data: [] },
    { label: "Unattempted", backgroundColor: "#17a2b8", data: [] }
    ],basicQustions=[],itmQustions=[],expQustions=[];
    questions.forEach(q=> {
      if(q.level== this.levels[0]) basicQustions.push(q);
      else if(q.level== this.levels[1]) itmQustions.push(q);
      else if(q.level== this.levels[2]) expQustions.push(q);
    });
    [basicQustions,itmQustions,expQustions].forEach((qusArr,i)=> {
      let {correctAns,incAns,skippedQus}=this.calculateAssesmentStatus(qusArr);
      datasets[0].data[i]=correctAns;
      datasets[1].data[i]=incAns;
      datasets[2].data[i]=skippedQus;
    });
    this.barCharts.push({
      labels: this.levels,
      data: datasets,
      title: 'Difficulty Wise Performance',
    });
  }

}