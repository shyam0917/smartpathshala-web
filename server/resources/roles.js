const roles= {
	Admin: {
		resources : ['put_users','post_users',
    'get_role', 
    'get_menus', 	
		'get_categories','put_categories','post_categories','delete_categories',
		'get_subcategories','put_subcategories','post_subcategories','delete_subcategories',
		'get_instructors','put_instructors','post_instructors','delete_instructors',
		'post_courses', 'get_courses', 'put_courses','delete_courses',
		'post_topics', 'get_topics', 'put_topics', 'delete_topics',
		'post_students', 'get_students', 'put_students', 'delete_students',
		'post_schools', 'get_schools', 'put_schools', 'delete_schools',
		'post_subtopics', 'get_subtopics', 'put_subtopics', 'delete_subtopics', 
		'post_playlists', 'get_playlists', 'put_playlists', 'delete_playlists',
		'post_notes', 'get_notes', 'put_notes', 'delete_notes',
		'post_keypoints', 'get_keypoints', 'put_keypoints', 'delete_keypoints',
		'post_media', 'delete_media',
		'post_videos', 'get_videos', 'put_videos', 'delete_videos',
		'post_references', 'get_references', 'put_references', 'delete_references',
		'post_questions', 'get_questions', 'put_questions','delete_questions',
		'post_assessments', 'get_assessments', 'put_assessments','delete_assessments',
    'post_assessmentresults','put_assessmentresults','get_assessmentresults','delete_assessmentresults',
		'post_skills', 'get_skills', 'put_skills','delete_skills',
		'post_projects', 'get_projects', 'put_projects','delete_projects',
		'get_helps', 'post_helps', 'put_helps','delete_helps',
		'put_admins','get_admins',
		'get_profiles', 'put_profiles','delete_profiles'
		] 
	},
	Instructor: {
		resources : [	'put_users',
    'post_auth',
		'get_instructors','post_instructors',
		'get_role', 
    'get_menus', 
    'post_categories', 'get_categories', 'put_categories','delete_categories',
		'get_subcategories','put_subcategories','post_subcategories','delete_subcategories',
		'post_courses', 'get_courses', 'put_courses','delete_courses',
		'post_topics', 'get_topics', 'put_topics', 'delete_topics',
		'post_students', 'get_students', 'put_students', 'delete_students',
		'post_schools', 'get_schools', 'put_schools', 'delete_schools',
		'post_subtopics', 'get_subtopics', 'put_subtopics', 'delete_subtopics', 
		'post_playlists', 'get_playlists', 'put_playlists', 'delete_playlists',
		'post_notes', 'get_notes', 'put_notes', 'delete_notes',
		'post_keypoints', 'get_keypoints', 'put_keypoints', 'delete_keypoints',
		'post_media', 'delete_media',
		'post_videos', 'get_videos', 'put_videos', 'delete_videos',
		'post_search', 'get_search', 'put_search', 'delete_search',
		'post_references', 'get_references', 'put_references', 'delete_references',
		'post_questions', 'get_questions', 'put_questions','delete_questions',
		'post_assessments', 'get_assessments', 'put_assessments','delete_assessments',
		'post_assessmentresults', 'get_assessmentresults', 'put_assessmentresults','delete_assessmentresults',
		'get_profiles', 'put_profiles','delete_profiles',
		'post_projects', 'get_projects', 'put_projects','delete_projects',
		'get_helps', 'post_helps', 'put_helps','delete_helps',
		] 

	},
	Student: {
		resources : [	'put_users',
    'post_auth',
		'get_role', 
    'get_menus',
    'get_courses',
    'get_topics',
    'get_subtopics',
		'get_playlists',
    'get_notes',
    'get_students',
    'get_references',
    'get_schools',
		'get_assessments',
		'get_profiles', 'put_profiles','delete_profiles',
    'post_students','put_students',
    'put_assign','get_assign',
    'put_questions',
		'get_categories',
    'post_assessmentresults','put_assessmentresults','get_assessmentresults',
		'get_videos',
		'get_helps', 'post_helps', 'put_helps','delete_helps',
		'get_orders', 'post_orders',
		'get_carts', 'post_carts',
		] 
	}, 

	School: {
		resources : ['get_role', 
    'get_menus',
    'post_auth',
		'get_categories', 
    'get_subcategories',
    'get_courses',
    'get_topics',
    'get_subtopics',
		'post_playlists', 'get_playlists', 'put_playlists', 'delete_playlists',
		'post_notes', 'get_notes', 'put_notes', 'delete_notes',
		'post_keypoints', 'get_keypoints', 'put_keypoints', 'delete_keypoints',
		'post_media', 'delete_media',
		'post_videos', 'get_videos', 'put_videos', 'delete_videos',
		'post_references', 'get_references', 'put_references', 'delete_references',
		'post_questions', 'get_questions', 'put_questions','delete_questions',
		'post_assessments', 'get_assessments', 'put_assessments','delete_assessments',] 
	},

	Teacher: {
		resources : ['get_role', 'get_menus',
		'get_categories',
    'get_subcategories',
    'get_courses',
    'get_topics',
    'get_subtopics',
		'post_playlists', 'get_playlists', 'put_playlists', 'delete_playlists',
		'post_notes', 'get_notes', 'put_notes', 'delete_notes',
		'post_keypoints', 'get_keypoints', 'put_keypoints', 'delete_keypoints',
		'post_media', 'delete_media',
		'post_videos', 'get_videos', 'put_videos', 'delete_videos',
		'post_references', 'get_references', 'put_references', 'delete_references',
		'post_questions', 'get_questions', 'put_questions','delete_questions',
		'post_assessments', 'get_assessments', 'put_assessments','delete_assessments',]  
	}
}

module.exports = {
	roles : roles
}