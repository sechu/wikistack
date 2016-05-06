var express = require('express');
var router = express.Router();

var models = require('../models');
var Page = models.Page;
var User = models.User;
var chalk = require('chalk');


router.get('/', function(req, res, next) {
	res.render('tags');
})

router.get('/tag', function(req, res, next) {
	var tag = req.query.tag;
	Page.findByTag(tag)
	.then(function(pages) {
		if (pages===null) {
			res.status(404).send();
		} else {
			res.render('index', {
				pages: pages
			});
		}
	})
	.catch(next);
});


module.exports = router;