// server.js

var config 		= require('./config')();

// BASE SETUP
// ===================================================================

// Packages
var express		= require('express'),
	app			= express(),
	bodyParser	= require('body-parser');

// app configuration
app.use(bodyParser({strict: false}));
app.set('view engine', 'ejs');
app.use(express.static(process.cwd() + '/public'));

var PORT 		= process.env.PORT || 3000;

// FACEBOOK AUTHENTICATION
// ===================================================================
var passport 	= require('passport');
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

// SERVER SETUP
// ===================================================================

// Packages
var mongoose 	= require('mongoose');

mongoose.connect(config.DB_PATH);
var db = mongoose.connection;

if (db)
	console.log('Connected to MongoDB at ' + config.DB_PATH);
else
	console.log('Error connecting to MongoDB at ' + config.DB_PATH + ". Is Mongod running?");

// ROUTES / CONTROLLERS
// ===================================================================
var base 		= require('./app/controllers'),
	api 		= require('./app/api'),
	auth 		= require('./app/controllers/auth'),
	quiz		= require('./app/controllers/quiz');
	profile		= require('./app/controllers/user');

// register routes
app.use('/', base);
app.use('/', auth);
app.use('/', profile);
app.use('/quiz', quiz);
app.use('/api', api);
app.all('/api', function(req, res, next){
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
});

// START THE SERVER
// ===================================================================

app.listen(PORT);
console.log('Listening on port ' + PORT);
