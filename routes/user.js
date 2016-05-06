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
		})
		.catch(next);
	});
})

router.get('/:id', function(req, res, next) {
	Page.findAll({
		where: {
			authorId: req.params.id
		}
	})
	.then(function(pages) {
		return User.findOne({
			where: {
				id: req.params.id
			}
		}).then(function(user) {
			res.render('index', {
				title: user.name,
				pages: pages
			});
		});
	})
	.catch(next);
});

module.exports = router;