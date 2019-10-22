const appConstants = require('../../constants/app');
//const appConstant = require('../../constants').app;

let constants = {
	address1 : {
		minlength:[5, 'Minimum length should be 2'],
		maxlength:[200, 'Maximum length should be 200'],
	},
	city : {
		minlength:[2, 'Minimum length should be 2'],
		maxlength:[20, 'Maximum length should be 20'],
	},
	state : {
		minlength:[2, 'Minimum length should be 2'],
		maxlength:[20, 'Maximum length should be 20'],
	},
	pincode : {
		maxlength:[6, 'Maximum length should be 6'],
	},
	country : {
		minlength:[2, 'Minimum length should be 2'],
		maxlength:[20, 'Maximum length should be 20'],
	}
	
}

let academicinfo = {
	instituteName : {
		minlength:[2, 'Minimum length should be 2'],
		maxlength:[10, 'Maximum length should be 10'],
	},
	instituteAddress : {
		minlength:[5, 'Minimum length should be 5'],
		maxlength:[50, 'Maximum length should be 50'],
	},
	fieldStudy : {
		minlength:[2, 'Minimum length should be 2'],
		maxlength:[50, 'Maximum length should be 50'],
	},
	description : {
		minlength:[3, 'Minimum length should be 3'],
		maxlength:[10, 'Check it working or not'],
	}
}
module.exports = { 
	constants: constants,
    academicinfo: academicinfo,
  }
//module.exports = constants
