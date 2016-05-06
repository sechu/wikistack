var express = require('express');
var app = express();
var logger = require('morgan');
var favicon = require('favicon');
var swig = require('swig');
var parser = require('body-parser');
var path = require('path');
var models = require('./models');
var chalk = require('chalk');
var wikiRouter = require('./routes/wiki.js');
var userRouter = require('./routes/user.js');
var tagRouter = require('./routes/tags.js');


app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname+'/views'));
swig.setDefaults({cache: false});

app.use(parser.urlencoded());
app.use(parser.json());

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, '/public')));
app.use('/wiki', wikiRouter);
app.use('/users', userRouter);
app.use('/search', tagRouter);

app.get('/', function(req, res, next) {
	res.redirect('/wiki');
})

var server = app.listen(3001, function() {
	console.log(chalk.blue.bold('server started'));
})

models.User.sync()
.then(function() {
	return models.Page.sync();
})
.then(function() {
	server.listen(3001, function() {
		console.log(chalk.blue.bold('server is listening on port 3001'));
	});
})
.catch(console.error);


