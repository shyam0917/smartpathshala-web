import { NgxPermissionsGuard } from 'ngx-permissions';
import { CoursesComponent } from '../shared/components/courses/courses.component';
import { AddCourseComponent } from '../shared/components/courses/add-course/add-course.component';
import { AuthorizationService } from '../shared/services/common/authorization.service';
import { CourseDetailComponent } from '../shared/components/courses/course-detail/course-detail.component';
import { TopicDetailComponent } from '../shared/components/courses/course-detail/topic-detail/topic-detail.component';
import { SearchVideoComponent } from '../shared/components/courses/course-detail/topic-detail/subtopic-detail/videos/search-video/search-video.component';
import { NotesComponent } from '../shared/components/courses/course-detail/topic-detail/subtopic-detail/notes/notes.component';
import { KeypointsComponent } from '../shared/components/courses/course-detail/topic-detail/subtopic-detail/keypoints/keypoints.component';
import { PlayVideoListComponent } from '../shared/components/courses/course-detail/topic-detail/subtopic-detail/videos/play-video-list/play-video-list.component';
import { ManageQuestionsComponent } from '../shared/components/courses/course-detail/topic-detail/subtopic-detail/questions/manage-questions/manage-questions.component';
import { ManageAssessmentsComponent } from '../shared/components/courses/course-detail/topic-detail/subtopic-detail/assessments/manage-assessments/manage-assessments.component';
import { AssessmentDetailComponent } from '../shared/components/courses/course-detail/topic-detail/subtopic-detail/assessments/assessment-detail/assessment-detail.component';
import { PlayAssessmentComponent } from '../shared/components/courses/course-detail/topic-detail/subtopic-detail/assessments/play-assessment/play-assessment.component';
import { SubtopicDetailComponent } from '../shared/components/courses/course-detail/topic-detail/subtopic-detail/subtopic-detail.component';
import { SchoolsDashboardComponent } from '../schools/schools-dashboard.component';

export class SchoolRoutes {

	public static routes = { 
		path: 'school',
		canActivate: [AuthorizationService],
		canActivateChild: [NgxPermissionsGuard],
		data: {
		  permissions: {
		    only: ['School'],
		    redirectTo: '/'
		  }
		},
		children: [
		{
		  path: '',
		  component:  SchoolsDashboardComponent
		},
		{ 
		  path: 'courses',
		  children: [
		  {
		    path: '',
		    component: CoursesComponent,
		  },
		  {
		    path: 'add',
		    component:  AddCourseComponent
		  },
		  {
		    path: 'edit/:id',
		    component:  AddCourseComponent
		  },
		  {
		    path: ':id',
		    component:  CourseDetailComponent
		  },
		  {
		    path :'assessments',
		    children : [
		    {
		      path : 'add/:id',
		      component : ManageAssessmentsComponent
		    },
		    {
		      path : 'edit/:asmId',
		      component : AssessmentDetailComponent
		    },
		    {
		      path : 'play-assessment/:id',
		      component : PlayAssessmentComponent
		    }
		    ]
		  },
		  {
		    path: 'topics',
		    children : [
		    {
		      path :':id',
		      component:  TopicDetailComponent
		    },
		    {
		      path :'subtopics',
		      children : [
		      {
		        path :':id',
		        component:  SubtopicDetailComponent
		      }, 
		      {
		        path : 'videos',
		        children : [
		        {
		          path : 'search-video',
		          component : SearchVideoComponent
		        },
		        {
		          path : 'play-video',
		          component : PlayVideoListComponent
		        }
		        ]
		      },
		      {
		        path :'questions',
		        children : [
		        {
		          path : 'add/:id',
		          component : ManageQuestionsComponent
		        },
		        {
		          path : 'edit/:qusId',
		          component : ManageQuestionsComponent
		        }
		        ]
		      },
		      {
		        path :'notes',
		        component:  NotesComponent
		      },
		      {
		        path :'key-points',
		        component:  KeypointsComponent
		      },
		      ]
		    },
		    ]
		  },

		  ]
		},],
	}; 	

	constructor(argument) {
	}
}