var Sequelize = require('sequelize');
var db = new Sequelize('postgres://localhost:5432/wikistack', {logging: false});
var Promise = Sequelize.Promise;
var marked = require('marked');
var renderer = new marked.Renderer();



var Page = db.define('page', {
		title: {
			type: Sequelize.STRING,
			allowNull: false,
			unique: true
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
		},
		tags: {
			type: Sequelize.ARRAY(Sequelize.TEXT)
		}
	}, {
		getterMethods: {
			route: function() { return '/wiki/'+this.urlTitle },
			renderedContent: function() {
				var doubleBrackets = /\[\[(.*?)\]\]/g;
				var rendered = this.content.replace(doubleBrackets, replacer);
				function replacer(match, text) {
					return '<a href="/wiki/'+urlGenerator(text)+'">'+text+'</a>';
				}
				return marked(rendered, function (err, content) {
					return content;
				});
			}
		},
		classMethods: {
			findByTag: function(tag) {
				return Page.findAll({
					where: {
						tags: {
							$overlap: [tag]
						}
					}
				});
			}
		},
		instanceMethods: {
			findSimilar: function() {
				return Page.findAll({
					where: {
						tags: {
							$overlap: this.tags
						},
						title: {
							$ne: this.title 
						}
					}
				});	
			}
		}
	}
);

function urlGenerator(title) {
	var space = /\W/g;
	return title.replace(space, '_');
}

Page.hook('beforeValidate', function(page, options){
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
});


Page.belongsTo(User, {as: 'author'});


module.exports = {
	Page: Page,
	User: User
};