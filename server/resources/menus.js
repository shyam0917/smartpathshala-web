const navMenus = {
        Admin: [{
                label: 'Categories',
                url: 'categories',
            },
            {
                label: 'Courses',
                url: 'courses',
                subMenus: [
                    { label: 'Courses', url: 'courses' },
                    // {label:'My Courses',url:'courses'}
                ]
            },
            // {
            //   label:'Schools',url:'schools'
            // },
            {
                label: 'Instructors',
                url: 'instructors'
            },
            {
                label: 'Students',
                url: 'students'
            },
            {
                label: 'Skills',
                url: 'skills'
            },
            {
                label: 'Projects',
                url: 'projects'
            },
            {
                label: 'Help',
                url: 'helps',
            },
        ],
        Instructor: [{
                label: 'Categories',
                url: 'categories',
            },
            {
                label: 'Courses',
                url: 'courses',
                /* subMenus : [
                   { label:'Courses',url:'courses'},
                   { label:'My Courses',url:'courses'}
                 ]*/
            },
            {
                label: 'Projects',
                url: 'projects'
            },
            // {
            //   label:'Helps', url:'help',
            // },
            // {
            //   label:'Schools',url:'schools'
            // },
            // {
            //   label:'Students',url:'students'
            // }
        ],
        Student: [{
                    label: 'Courses',
                    url: 'courses',
                    subMenus: [
                        { label: 'My Courses', url: 'mycourses' },
                        { label: 'All Courses', url: 'allcourses' },
                    ]
                },
                {
                    label: 'Help',
                    url: 'helps',
                },
                // {    //   label:'Cart', url:'cart',
        // },
        // {
        //   label:'Assessments',url:'assessments',
        // },
        // {
        //   label:'My Performances',url:'performances',
        // },
        // {
        //   label:'Forums',url:'forums',
        // },
        // {
        //   label:'Messages',url:'messages',
        // },
        // {
        //   label:'Notifications',url:'notifications',
        // },
    ],
    School: [{
        label: 'Courses',
        url: 'courses'
    }]
}

module.exports = {
    navMenus: navMenus
}