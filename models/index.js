var Sequelize = require('sequelize');
var db = new Sequelize('postgres://localhost:5432/wikistack');


var Page = db.define('page', {
		title: {
			type: Sequelize.STRING,
			allowNull: false
		},
		urlTitle: {
			type: Sequelize.STRING,
			allowNull: false
		},
		content: {
			type: Sequelize.STRING,
			allowNull: false,
			defaultValue: 'No content'
		},
		date: {
			type: Sequelize.DATE,
			defaultValue: Sequelize.NOW
		},
		status: {
			type: Sequelize.ENUM('open', 'closed'),
			defaultValue: 'closed'
		}
	}, {
		getterMethods: {
			route: function() { return '/wiki/'+this.urlTitle}
		}
	}
	// {
	// 	hooks: {
	// 		beforeValidate: function(page, options){
	// 			console.log("beforeValidate");
	// 		var space = /\W/g;
	// 		page.urlTitle = page.title.replace(space, '_');
	// 		}
	// 	}
	//}
);


Page.hook('beforeValidate', function(page, options){
	console.log("beforeValidate");
	var space = /\W/g;
	page.urlTitle = page.title.replace(space, '_');
});

var User = db.define('user', {
	name: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	email: {
		type: Sequelize.STRING,
		unique: true,
		allowNull: false,
		isEmail: true
	}
})

module.exports = {
	Page: Page,
	User: User
};