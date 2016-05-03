var express = require('express');
var router = express.Router();
var chalk = require('chalk');
var models = require('../models');
var Page = models.Page;
var User = models.User;


router.get('/', function(req, res, next) {
	User.findAll().then(function(users) {
		res.render('user', {
			title: 'Wiki Authors',
			users: users
		});
	});
})

router.get('/:id', function(req, res, next) {
	Page.findAll({
		where: {
			authorId: req.params.id
		}
	})
	.then(function(pages) {
		console.log(chalk.blue(pages[1]));
		return User.findOne({
			where: {
				id: req.params.id
			}
		}).then(function(user) {
			res.render('user', {
				title: user.name,
				users: pages
			});
		});
	})
	.catch(next);
});

module.exports = router;