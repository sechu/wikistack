var express = require('express');
var router = express.Router();

var models = require('../models');
var Page = models.Page;
var User = models.User;


router.get('/', function(req, res, next) {
	res.redirect('/');
})

router.post('/', function(req, res, next) {
	var page = Page.build({
		title: req.body.title,
		content: req.body.content,
	})
	page.save().then(res.redirect('/'));
})

router.get('/add', function(req, res, next) {
	res.render('addpage')
})

module.exports = router;